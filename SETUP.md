# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `firebase-admin` - Firebase token verification
- `dotenv` - Environment variables
- Other existing dependencies

---

## Step 2: Get Firebase Service Account Key

1. Go to https://console.firebase.google.com/
2. Select project: **mypg-d6dfb**
3. Click ⚙️ (Settings) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file

---

## Step 3: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Open the downloaded JSON file** from Step 2

3. **Extract values and update `.env`:**

   From JSON:
   ```json
   {
     "project_id": "mypg-d6dfb",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@mypg-d6dfb.iam.gserviceaccount.com"
   }
   ```

   To `.env`:
   ```env
   FIREBASE_PROJECT_ID=mypg-d6dfb
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@mypg-d6dfb.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
   
   MONGODB_URI=mongodb://localhost:27017/mypg
   PORT=3333
   ```

   ⚠️ **Important:** 
   - Keep the `\n` characters in the private key
   - Wrap the entire key in double quotes
   - Don't commit `.env` to Git (already in `.gitignore`)

---

## Step 4: Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

You should see:
```
Server is running on http://localhost:3333
Accessible from emulator at http://10.0.2.2:3333
```

---

## Step 5: Test the API

### Test Validation Endpoint

```bash
curl -X POST http://localhost:3333/auth/validate \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"phone\":\"1234567890\"}"
```

Expected response:
```json
{"valid":true,"message":"Validation successful"}
```

---

## ✅ Setup Complete!

Your authentication system is now ready with:
- ✅ MongoDB validation before Firebase signup
- ✅ Proper error handling
- ✅ Token-based session management
- ✅ Protected routes with middleware

---

## Next Steps

1. **Update your React Native app** - The frontend code is already prepared!
2. **Test signup flow** - Try creating a new account
3. **Test login flow** - Try logging in
4. **Protect routes** - Add `verifyFirebaseToken` middleware to routes that need authentication

---

## 📚 Documentation

- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Complete authentication documentation
- Authentication flow diagrams
- API endpoint reference
- Error handling guide
- Security best practices

---

## 🆘 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
npm install
```

### "Unauthorized: Invalid token"
- Check if `.env` file exists and has correct values
- Verify Firebase Admin SDK credentials
- Make sure `Authorization: Bearer <token>` header is sent

### "E11000 duplicate key error"
- Email or phone already exists in database
- Frontend should call `/auth/validate` first
- This prevents orphaned Firebase accounts

---

## 📞 Need Help?

Check [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for:
- Detailed authentication flow
- API endpoint documentation
- Frontend implementation guide
- Middleware usage examples
- Common issues and solutions
