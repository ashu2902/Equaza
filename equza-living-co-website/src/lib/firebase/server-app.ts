/**
 * Firebase Admin SDK Configuration
 * Server-side Firebase app for administrative operations
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

import { env } from '@/lib/utils/env';

interface AdminSDKConfig {
  projectId: string;
  clientEmail?: string;
  privateKey?: string;
}

let adminApp: App | null = null;

/**
 * Get or initialize Firebase Admin SDK app
 */
export function getAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  // Check if admin app already exists
  const apps = getApps();
  const existingApp = apps.find((app: App) => app.name === '[DEFAULT]');
  if (existingApp) {
    adminApp = existingApp;
    return adminApp;
  }

  const config: AdminSDKConfig = {
    projectId: env.firebase.projectId,
  };

  // Add service account credentials if available
  if (env.firebase.clientEmail && env.firebase.privateKey) {
    console.log('--- Debug: Raw env.firebase.privateKey ---');
    console.log(env.firebase.privateKey);
    console.log('-----------------------------------------');

    config.clientEmail = env.firebase.clientEmail;
    // Process the private key to convert literal \\n to actual newlines and clean up formatting
    config.privateKey = env.firebase.privateKey
      .replace(/\\n/g, '\n')
      .replace(/\\$/gm, '')  // Remove trailing backslashes
      .trim();  // Remove leading/trailing whitespace

    console.log('--- Debug: Processed config.privateKey ---');
    console.log(config.privateKey);
    console.log('------------------------------------------');
  }

  try {
    // Initialize with service account credentials if available
    if (config.clientEmail && config.privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey,
        }),
        projectId: config.projectId,
        storageBucket: env.firebase.storageBucket,
      });
    } else {
      // Fallback to default credentials (useful in emulator or when using default service account)
      adminApp = initializeApp({
        projectId: config.projectId,
        storageBucket: env.firebase.storageBucket,
      });
    }

    return adminApp;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    throw new Error('Firebase Admin SDK initialization failed');
  }
}

/**
 * Get Admin Auth instance
 */
export function getAdminAuth(): Auth {
  const app = getAdminApp();
  return getAuth(app);
}

/**
 * Get Admin Firestore instance
 */
export function getAdminFirestore(): Firestore {
  const app = getAdminApp();
  return getFirestore(app);
}

/**
 * Get Admin Storage instance
 */
export function getAdminStorage(): Storage {
  const app = getAdminApp();
  return getStorage(app);
}

/**
 * Verify admin credentials and permissions
 */
export async function verifyAdminCredentials(): Promise<boolean> {
  try {
    const auth = getAdminAuth();
    const db = getAdminFirestore();
    
    // Test auth by trying to list users (admin-only operation)
    await auth.listUsers(1);
    
    // Test Firestore by trying to read admin collection
    await db.collection('adminUsers').limit(1).get();
    
    return true;
  } catch (error) {
    console.error('Admin credentials verification failed:', error);
    return false;
  }
}

/**
 * Check if Firebase Admin SDK is properly configured
 */
export function isAdminConfigured(): boolean {
  return !!(env.firebase.projectId && (
    // Either have service account credentials
    (env.firebase.clientEmail && env.firebase.privateKey) ||
    // Or running in an environment with default credentials
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.GCLOUD_PROJECT
  ));
}

/**
 * Create a custom token for a user (admin operation)
 */
export async function createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
  const auth = getAdminAuth();
  return auth.createCustomToken(uid, additionalClaims);
}

/**
 * Verify an ID token (server-side verification)
 */
export async function verifyIdToken(idToken: string) {
  const auth = getAdminAuth();
  return auth.verifyIdToken(idToken);
}

/**
 * Get user by UID (admin operation)
 */
export async function getUserByUid(uid: string) {
  const auth = getAdminAuth();
  return auth.getUser(uid);
}

/**
 * Set custom user claims (admin operation)
 */
export async function setCustomUserClaims(uid: string, customClaims: object) {
  const auth = getAdminAuth();
  return auth.setCustomUserClaims(uid, customClaims);
}

// Export the admin app and services
export { adminApp };
export default getAdminApp; 