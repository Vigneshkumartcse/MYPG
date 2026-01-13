const mongoose = require('mongoose');
const express = require('express');
const AuthRouter = express.Router();
const { RegisterUser, LoginUser, ValidateUser } = require('../Controllers/Authcontroller');
const { verifyFirebaseToken } = require('../Middleware/authMiddleware');

// PUBLIC ROUTES (no authentication required)

// STEP 1: Validate user data BEFORE Firebase signup
AuthRouter.post('/validate', ValidateUser);

// STEP 2: Register user in MongoDB AFTER Firebase account created
AuthRouter.post('/register', RegisterUser);

// Login: Sync Firebase user with MongoDB
AuthRouter.post('/login', LoginUser);

// PROTECTED ROUTES (require Firebase token)

// Example: Get current user profile
AuthRouter.get('/me', verifyFirebaseToken, async (req, res) => {
    try {
        const User = require('../Models/Loginmodel');
        const user = await User.findOne({ firebaseUid: req.user.uid });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

module.exports = AuthRouter;