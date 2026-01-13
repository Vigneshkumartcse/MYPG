# Frontend Update Required: Send Role During Login

## What Changed:
Backend now validates that users login with the correct role they signed up with.

## Frontend Changes Needed:

### In your MyProfile.jsx (or auth.js), update the `handleLogin` function:

**Before:**
```javascript
const handleLogin = async () => {
  const user = await signInWithEmail({ email, password });
  // Missing role check!
}
```

**After:**
```javascript
const handleLogin = async () => {
  try {
    const user = await signInWithEmail({ email, password });
    
    // Call backend to verify role
    const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebaseUid: user.uid,
        email: user.email,
        role: userType, // 'tenant' or 'owner' from UI selection
        name: user.displayName || name,
      }),
    });
    
    if (response.status === 403) {
      const data = await response.json();
      // User trying to login with wrong role
      throw new Error(data.message);
    }
    
    if (!response.ok) {
      throw new Error('Login verification failed');
    }
    
    Toast.show({
      type: 'success',
      text1: 'Welcome back!',
      text2: 'You have logged in successfully',
    });
    setIsLoggedIn(true);
  } catch (e) {
    const errorMsg = e?.message || 'Login failed';
    setError(errorMsg);
    Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: errorMsg,
      visibilityTime: 4000,
    });
  } finally {
    setLoading(false);
  }
};
```

## Error Messages Users Will See:

If a **student** tries to login as **owner**:
> "This account is registered as Tenant. Please select the correct account type."

If an **owner** tries to login as **student**:
> "This account is registered as Owner. Please select the correct account type."

## Flow:

```
User selects "Owner" → Enters email/password → Clicks Login
    ↓
Firebase authenticates (✅ email/password correct)
    ↓
Backend checks MongoDB:
    ├─ User registered as "student" → ❌ Reject: "Account is registered as Tenant"
    └─ User registered as "owner" → ✅ Allow login
```

This ensures users can't switch between Tenant and Owner accounts!
