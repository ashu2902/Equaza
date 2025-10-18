/**
 * Firebase Authentication Utilities
 * Client-side authentication functions
 */

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from 'firebase/auth';

import { auth } from './config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAdmin?: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Convert Firebase User to AuthUser interface
 */
export function mapFirebaseUser(user: User | null): AuthUser | null {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    // Admin status will be determined by custom claims
    isAdmin: false, // This will be set separately after checking custom claims
  };
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    if (!auth) {
      resolve(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(mapFirebaseUser(user));
    });
  });
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  credentials: SignInCredentials
): Promise<AuthUser> {
  try {
    if (!auth) {
      throw new Error('Firebase authentication not configured');
    }

    const { email, password } = credentials;
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const authUser = mapFirebaseUser(userCredential.user);

    if (!authUser) {
      throw new Error('Failed to sign in user');
    }

    return authUser;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  signUpData: SignUpData
): Promise<AuthUser> {
  try {
    const { email, password, displayName } = signUpData;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    // Send email verification
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
    }

    const authUser = mapFirebaseUser(userCredential.user);

    if (!authUser) {
      throw new Error('Failed to create user');
    }

    return authUser;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    const userCredential = await signInWithPopup(auth, provider);
    const authUser = mapFirebaseUser(userCredential.user);

    if (!authUser) {
      throw new Error('Failed to sign in with Google');
    }

    return authUser;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Send email verification to current user
 */
export async function sendVerificationEmail(): Promise<void> {
  try {
    if (!auth || !auth.currentUser) {
      throw new Error(
        'No user is currently signed in or authentication not configured'
      );
    }

    await sendEmailVerification(auth.currentUser);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> {
  try {
    if (!auth || !auth.currentUser) {
      throw new Error(
        'No user is currently signed in or authentication not configured'
      );
    }

    await updateProfile(auth.currentUser, updates);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * Listen to authentication state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  if (!auth) {
    // Firebase not configured, call callback with null and return a no-op unsubscribe
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    callback(mapFirebaseUser(user));
  });
}

/**
 * Get user ID token (for server-side verification)
 */
export async function getUserIdToken(): Promise<string | null> {
  try {
    if (!auth || !auth.currentUser) {
      return null;
    }

    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error('Failed to get user ID token:', error);
    return null;
  }
}

/**
 * Check if user has admin privileges
 */
export async function checkAdminStatus(): Promise<boolean> {
  try {
    console.log('🔍 Checking client-side admin status...');
    console.log('👤 Auth object:', !!auth);
    console.log('👤 Current user:', !!auth?.currentUser);

    if (!auth || !auth.currentUser) {
      console.log('❌ No auth or current user');
      return false;
    }

    console.log('🆔 User UID:', auth.currentUser.uid);
    console.log('📧 User email:', auth.currentUser.email);

    const idTokenResult = await auth.currentUser.getIdTokenResult();
    console.log('🎫 Token claims:', idTokenResult.claims);
    console.log('👑 Admin claim:', idTokenResult.claims.admin);

    const isAdmin = !!idTokenResult.claims.admin;
    console.log('✅ Admin status result:', isAdmin);
    return isAdmin;
  } catch (error) {
    console.error('❌ Failed to check admin status:', error);
    return false;
  }
}

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by the browser. Please allow pop-ups and try again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}

// Export types
export type { User, UserCredential, AuthError };
