import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Get Firebase configuration from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

// Use direct references instead of dynamic property access for Webpack/Turbopack compatibility
const envValues = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingEnvVars = requiredEnvVars.filter((envVar) => {
  const value = envValues[envVar as keyof typeof envValues];
  return !value || value.trim() === '';
});

// Check if we have valid Firebase configuration
const hasValidConfig =
  missingEnvVars.length === 0 &&
  firebaseConfig.apiKey !== '' &&
  firebaseConfig.projectId !== '';

// Debug: Log environment variables in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Config Status:', {
    hasAllVars: missingEnvVars.length === 0,
    missingCount: missingEnvVars.length,
    missing: missingEnvVars,
    hasValidConfig,
  });
}

if (!hasValidConfig) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn(
      '🔥 Firebase configuration missing or incomplete. Running in development mode without Firebase.',
      missingEnvVars.length > 0 ? `Missing: ${missingEnvVars.join(', ')}` : '',
      '\nActual values:',
      {
        apiKey: firebaseConfig.apiKey ? '[SET]' : '[MISSING]',
        authDomain: firebaseConfig.authDomain ? '[SET]' : '[MISSING]',
        projectId: firebaseConfig.projectId ? '[SET]' : '[MISSING]',
        storageBucket: firebaseConfig.storageBucket ? '[SET]' : '[MISSING]',
        messagingSenderId: firebaseConfig.messagingSenderId
          ? '[SET]'
          : '[MISSING]',
        appId: firebaseConfig.appId ? '[SET]' : '[MISSING]',
      }
    );
  } else {
    // eslint-disable-next-line no-console
    console.error(
      `❌ Missing Firebase environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}

// Initialize Firebase app only if we have valid configuration
let app: FirebaseApp | null = null;

if (hasValidConfig) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]!;
  }
}

// Initialize Firebase services - throw error if not configured properly
if (!app) {
  throw new Error(
    'Firebase app not initialized. Check your environment variables.'
  );
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app);

// Export the Firebase app instance
export { app };

// Export Firebase configuration for debugging
export { firebaseConfig };

// Helper function to check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return hasValidConfig && app !== null;
};

// Helper function to get project ID
export const getProjectId = (): string => {
  return firebaseConfig.projectId;
};

export default app;
