// UPDATE THIS IN YOUR FRONTEND (MyProfile.jsx or wherever handleLogin is)

const handleLogin = async () => {
  setError("");
  setLoading(true);
  try {
    // STEP 1: Firebase authentication
    const user = await signInWithEmail({ email, password });
    
    // STEP 2: Verify role with backend (CRITICAL - THIS IS MISSING!)
    const mappedRole = userType === 'tenant' ? 'student' : userType;
    
    const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebaseUid: user.uid,
        email: user.email || email,
        phone: phone || null,
        role: mappedRole, // Send the role to check
        name: name || user.displayName || '',
      }),
    });
    
    const data = await response.json();
    
    // STEP 3: Handle role mismatch
    if (response.status === 403) {
      // User trying to login with wrong role - DELETE Firebase session
      await doSignOut(); // Logout from Firebase
      throw new Error(data.message);
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'Login verification failed');
    }
    
    // Success!
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
