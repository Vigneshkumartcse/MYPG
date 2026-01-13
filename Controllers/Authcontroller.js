const mongoose = require('mongoose');
const User = require('../Models/Loginmodel');
const PGModel = require('../Models/PGmodel');

// STEP 1: Validate user data BEFORE Firebase signup (prevents orphaned Firebase accounts)
exports.ValidateUser = async (req, res) => {
    try {
        const { email, phone } = req.body;
        
        // Check if email already exists
        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ 
                    valid: false, 
                    message: 'This email is already registered. Please login instead.' 
                });
            }
        }
        
        // Check if phone already exists (only if phone is provided and not empty)
        if (phone && phone.trim() !== '') {
            const phoneExists = await User.findOne({ phone: phone.trim() });
            if (phoneExists) {
                return res.status(400).json({ 
                    valid: false, 
                    message: 'This phone number is already registered. Try a different number or leave it empty.' 
                });
            }
        }
        
        // All validations passed
        res.status(200).json({ 
            valid: true, 
            message: 'Validation successful' 
        });
    } catch (error) {
        console.error('[ValidateUser] Error:', error);
        res.status(500).json({ 
            valid: false, 
            message: 'Validation failed', 
            error: error.message 
        });
    }
};

// STEP 2: Register user in MongoDB (called AFTER Firebase account is created)
exports.RegisterUser = async (req, res) => {
    try {
        const { firebaseUid, email, phone, role, name } = req.body;
        
        // Validate required fields
        if (!firebaseUid || !email) {
            return res.status(400).json({ 
                message: 'Firebase UID and email are required' 
            });
        }
        
        // Check if user already exists (409 means user exists, frontend will handle gracefully)
        const existingUser = await User.findOne({ firebaseUid });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'User already registered',
                user: existingUser 
            });
        }
        
        // Create new user
        // IMPORTANT: Use undefined (not null) for phone to work with sparse index
        const newUser = new User({ 
            firebaseUid, 
            email, 
            phone: phone && phone.trim() !== '' ? phone : undefined, 
            role: role || 'student', 
            name 
        });
        
        await newUser.save();
        
        res.status(201).json({ 
            message: 'User registered successfully', 
            user: newUser 
        });
    } catch (error) {
        console.error('[RegisterUser] Error:', error);
        
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            let message = '';
            
            if (field === 'email') {
                message = 'This email is already registered. Please login instead.';
            } else if (field === 'phone') {
                message = 'This phone number is already registered. Try a different number or leave it empty.';
            } else if (field === 'firebaseUid') {
                message = 'User already exists';
                return res.status(409).json({ message });
            } else {
                message = `Duplicate ${field} detected`;
            }
            
            return res.status(400).json({ 
                message, 
                error: `E11000 duplicate key error on ${field}` 
            });
        }
        
        res.status(500).json({ 
            message: 'Failed to register user', 
            error: error.message 
        });
    }
};

// Login: Find or create user in MongoDB when Firebase auth succeeds
exports.LoginUser = async (req, res) => {   
    try {
        const { firebaseUid, email, phone, role, name } = req.body;
        
        if (!firebaseUid) {
            return res.status(400).json({ message: 'Firebase UID is required' });
        }
        
        // Find user in MongoDB
        let user = await User.findOne({ firebaseUid });
        
        // If user doesn't exist in MongoDB, create them (sync with Firebase)
        if (!user) {
            user = new User({ 
                firebaseUid, 
                email: email || '', 
                phone: phone && phone.trim() !== '' ? phone : undefined, 
                role: role || 'student', 
                name: name || '' 
            });
            await user.save();
        } else {
            // User exists - verify they're logging in with the correct role
            if (role && user.role !== role) {
                return res.status(403).json({ 
                    message: `This account is registered as ${user.role === 'student' ? 'Tenant' : 'Owner'}. Please select the correct account type.`,
                    registeredRole: user.role,
                    attemptedRole: role
                });
            }
        }
        
        res.status(200).json({ 
            message: 'User logged in successfully', 
            user 
        });
    } catch (error) {
        console.error('[LoginUser] Error:', error);
        res.status(500).json({ 
            message: 'Failed to login user', 
            error: error.message 
        });
    }
};

// Verify a user