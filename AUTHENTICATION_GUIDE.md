# Authentication Flow Documentation

## Overview
This implementation provides a robust authentication system with:
- ✅ MongoDB validation BEFORE Firebase signup (prevents orphaned accounts)
- ✅ Proper error handling with user-friendly messages
- ✅ Firebase token-based session management
- ✅ Secure protected routes with middleware

---

## Authentication Flow

### 1. **Signup Flow** (New User Registration)

```
User fills signup form
    ↓
Frontend validates input (client-side)
    ↓
[STEP 1] Call /auth/validate → Check MongoDB for duplicate email/phone
    ↓
    ├─ If duplicate found → Show error, STOP (no Firebase account created)
    ↓
    └─ If valid → Continue
        ↓
[STEP 2] Create Firebase account (signUpWithEmail)
    ↓
    ├─ If Firebase error → Show error (weak password, etc.)
    ↓
    └─ If success → Continue
        ↓
[STEP 3] Call /auth/register → Save user to MongoDB
    ↓
    └─ User logged in ✅
```

### 2. **Login Flow** (Existing User)

```
User fills login form
    ↓
Frontend calls signInWithEmail (Firebase)
    ↓
    ├─ If Firebase error → Show error (wrong password, etc.)
    ↓
    └─ If success → Continue
        ↓
[Optional] Call /auth/login → Sync with MongoDB (ensure user exists in DB)
    ↓
    └─ User logged in ✅
```

### 3. **Session Management** (Automatic)

```
Firebase SDK automatically handles:
- Token refresh (every hour)
- Token storage (AsyncStorage on mobile, localStorage on web)
- Session persistence across app restarts

listenAuth() monitors Firebase auth state:
- Triggers when user logs in
- Triggers when user logs out
- Triggers when token refreshes
```

---

## Backend API Endpoints

### Public Endpoints (No Auth Required)

#### 1. POST `/auth/validate`
Validates email/phone BEFORE creating Firebase account

**Request:**
```json
{
  "email": "user@example.com",
  "phone": "1234567890"  // optional
}
```

**Responses:**
- **200 OK** - Validation passed
  ```json
  { "valid": true, "message": "Validation successful" }
  ```
- **400 Bad Request** - Duplicate found
  ```json
  { 
    "valid": false, 
    "message": "This email is already registered. Please login instead." 
  }
  ```

---

#### 2. POST `/auth/register`
Registers user in MongoDB AFTER Firebase account created

**Request:**
```json
{
  "firebaseUid": "firebase_uid_here",
  "email": "user@example.com",
  "phone": "1234567890",  // optional
  "role": "student",      // or "owner"
  "name": "John Doe"
}
```

**Responses:**
- **201 Created** - User registered
  ```json
  { 
    "message": "User registered successfully", 
    "user": { ... } 
  }
  ```
- **409 Conflict** - User already exists (not an error, frontend continues)
  ```json
  { 
    "message": "User already registered", 
    "user": { ... } 
  }
  ```
- **400 Bad Request** - Duplicate email/phone
  ```json
  { 
    "message": "This email is already registered. Please login instead.",
    "error": "E11000 duplicate key error on email"
  }
  ```

---

#### 3. POST `/auth/login`
Finds or creates user in MongoDB (sync with Firebase)

**Request:**
```json
{
  "firebaseUid": "firebase_uid_here",
  "email": "user@example.com",
  "phone": "1234567890",
  "role": "student",
  "name": "John Doe"
}
```

**Responses:**
- **200 OK** - User logged in
  ```json
  { 
    "message": "User logged in successfully", 
    "user": { ... } 
  }
  ```

---

### Protected Endpoints (Require Firebase Token)

#### 4. GET `/auth/me`
Get current user profile

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response:**
- **200 OK**
  ```json
  { "user": { ... } }
  ```
- **401 Unauthorized** - Invalid/expired token
  ```json
  { 
    "message": "Token expired. Please login again.",
    "code": "TOKEN_EXPIRED"
  }
  ```

---

## Frontend Implementation

### Getting Firebase ID Token

```javascript
import { auth } from './firebase';

// Get current user's token
const user = auth.currentUser;
if (user) {
  const token = await user.getIdToken();
  
  // Use token in API calls
  const response = await fetch('http://localhost:3000/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}
```

### Auto Token Refresh

Firebase SDK automatically refreshes tokens every hour. Just call `getIdToken()` before each API request.

---

## Middleware Usage

### Protect Routes with Firebase Token

```javascript
const { verifyFirebaseToken, requireRole } = require('../Middleware/authMiddleware');

// Any authenticated user
router.get('/protected', verifyFirebaseToken, (req, res) => {
  // req.user contains: { uid, email, name, picture }
  res.json({ message: `Hello ${req.user.email}` });
});

// Only owners
router.post('/create-pg', verifyFirebaseToken, requireRole('owner'), (req, res) => {
  // req.user = Firebase user
  // req.dbUser = MongoDB user (with role)
  res.json({ message: 'PG created' });
});

// Multiple roles
router.get('/admin', verifyFirebaseToken, requireRole(['admin', 'owner']), (req, res) => {
  res.json({ message: 'Admin access' });
});
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install firebase-admin dotenv
```

### 2. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`mypg-d6dfb`)
3. Settings (⚙️) > Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file

### 3. Configure Environment Variables

Create `.env` file in project root:

```env
FIREBASE_PROJECT_ID=mypg-d6dfb
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@mypg-d6dfb.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

MONGODB_URI=mongodb://localhost:27017/mypg
PORT=3000
```

**Important:** Extract these values from the downloaded JSON:
- `project_id` → `FIREBASE_PROJECT_ID`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY` (keep the \n characters!)

### 4. Load Environment Variables

In `Index.js` (or your main server file), add at the very top:

```javascript
require('dotenv').config();

const express = require('express');
// ... rest of your code
```

### 5. Update package.json

Add to scripts:
```json
{
  "scripts": {
    "start": "node Index.js",
    "dev": "nodemon Index.js"
  }
}
```

---

## Error Handling

### Frontend Error Handling

The frontend already has proper error handling with Toast messages:

```javascript
try {
  await validateUserData({ email, phone });
  await signUpWithEmail({ email, password, name, phone, role: userType });
  
  Toast.show({
    type: 'success',
    text1: 'Account Created!',
    text2: `Welcome ${name}!`
  });
} catch (e) {
  // e.message contains user-friendly error
  Toast.show({
    type: 'error',
    text1: 'Signup Failed',
    text2: e.message,
    visibilityTime: 4000,
  });
}
```

### Backend Error Messages

All errors return user-friendly messages:

| Error Code | Message |
|------------|---------|
| Duplicate email | "This email is already registered. Please login instead." |
| Duplicate phone | "This phone number is already registered. Try a different number or leave it empty." |
| Weak password | "Password should be at least 6 characters." |
| Invalid email | "Please enter a valid email address." |
| Wrong password | "Incorrect password. Please try again." |
| Token expired | "Token expired. Please login again." |

---

## Security Best Practices

✅ **Never store Firebase tokens in MongoDB** - Tokens auto-refresh, storing them causes security issues

✅ **Always verify tokens on backend** - Use `verifyFirebaseToken` middleware for protected routes

✅ **Validate input on both frontend and backend** - Client-side validation is for UX, server-side is for security

✅ **Use HTTPS in production** - Never send tokens over HTTP

✅ **Keep private keys secret** - Add `.env` to `.gitignore`

---

## Testing

### Test Signup Flow

```bash
# 1. Validate email
curl -X POST http://localhost:3000/auth/validate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"1234567890"}'

# 2. (Frontend creates Firebase account)

# 3. Register in MongoDB
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firebaseUid":"firebase_uid_here",
    "email":"test@example.com",
    "phone":"1234567890",
    "role":"student",
    "name":"Test User"
  }'
```

### Test Protected Route

```bash
# Get token from Firebase (in frontend)
const token = await auth.currentUser.getIdToken();

# Use token
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### Issue: "Unauthorized: Invalid token"

**Solution:** 
- Check if token is being sent in `Authorization: Bearer <token>` format
- Verify Firebase Admin SDK is initialized correctly
- Check if `.env` file has correct Firebase credentials

### Issue: "E11000 duplicate key error"

**Solution:**
- This means email/phone already exists in MongoDB
- Frontend should call `/auth/validate` BEFORE creating Firebase account
- If you see this during signup, validation step was skipped

### Issue: "Token expired. Please login again."

**Solution:**
- Firebase tokens expire after 1 hour
- Call `await user.getIdToken(true)` to force refresh
- Or user needs to login again

---

## Summary

🎯 **Authentication Flow:**
1. Validate → MongoDB check
2. Create → Firebase account
3. Register → MongoDB save
4. Login → Firebase + MongoDB sync

🔒 **Security:**
- Firebase manages tokens & sessions
- Backend verifies tokens for protected routes
- MongoDB stores user data only (no tokens)

📱 **Session Management:**
- Automatic token refresh
- Persistent sessions across app restarts
- `listenAuth()` monitors auth state changes
