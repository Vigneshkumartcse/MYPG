// Firebase Admin SDK for token verification
const admin = require('firebase-admin');

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
    // Option 1: Use service account key file (recommended for production)
    // Download from Firebase Console > Project Settings > Service Accounts
    // admin.initializeApp({
    //     credential: admin.credential.cert(require('../path/to/serviceAccountKey.json'))
    // });
    
    // Option 2: Use default credentials (works on Google Cloud)
    // admin.initializeApp({
    //     credential: admin.credential.applicationDefault()
    // });
    
    // Option 3: For development - use environment variables
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
    });
}

/**
 * Middleware to verify Firebase ID token
 * Add this to any route that requires authentication
 * 
 * Usage:
 * router.get('/protected-route', verifyFirebaseToken, controller);
 */
exports.verifyFirebaseToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Unauthorized: No token provided',
                code: 'NO_TOKEN'
            });
        }
        
        // Extract token
        const token = authHeader.split('Bearer ')[1];
        
        // Verify token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Attach user info to request object
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
            name: decodedToken.name,
            picture: decodedToken.picture
        };
        
        // Token is valid, proceed to next middleware/controller
        next();
    } catch (error) {
        console.error('[verifyFirebaseToken] Error:', error.message);
        
        // Handle specific Firebase errors
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ 
                message: 'Token expired. Please login again.',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        if (error.code === 'auth/argument-error') {
            return res.status(401).json({ 
                message: 'Invalid token format',
                code: 'INVALID_TOKEN'
            });
        }
        
        return res.status(401).json({ 
            message: 'Unauthorized: Invalid token',
            code: 'INVALID_TOKEN',
            error: error.message
        });
    }
};

/**
 * Optional: Middleware to check if user has specific role
 * Use AFTER verifyFirebaseToken
 * 
 * Usage:
 * router.post('/owner-only', verifyFirebaseToken, requireRole('owner'), controller);
 */
exports.requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const User = require('../Models/Loginmodel');
            
            // Get user from MongoDB using Firebase UID
            const user = await User.findOne({ firebaseUid: req.user.uid });
            
            if (!user) {
                return res.status(404).json({ 
                    message: 'User not found in database',
                    code: 'USER_NOT_FOUND'
                });
            }
            
            // Check if user has required role
            const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
            
            if (!roles.includes(user.role)) {
                return res.status(403).json({ 
                    message: `Access denied. Required role: ${roles.join(' or ')}`,
                    code: 'INSUFFICIENT_PERMISSIONS'
                });
            }
            
            // Attach MongoDB user to request
            req.dbUser = user;
            
            next();
        } catch (error) {
            console.error('[requireRole] Error:', error);
            return res.status(500).json({ 
                message: 'Error checking user permissions',
                error: error.message
            });
        }
    };
};
