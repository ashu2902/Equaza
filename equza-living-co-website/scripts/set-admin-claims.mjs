#!/usr/bin/env node

/**
 * Set Admin Claims Script
 * 
 * This script sets admin claims on a Firebase user account.
 * You'll need Firebase Admin SDK credentials in your .env.local file.
 * 
 * Usage:
 *   node scripts/set-admin-claims.mjs test@email.com
 *   node scripts/set-admin-claims.mjs user-uid-here
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL', 
  'FIREBASE_PRIVATE_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease add these to your .env.local file.');
  console.error('See ENVIRONMENT_SETUP.md for Firebase Admin SDK setup instructions.');
  process.exit(1);
}

// Initialize Firebase Admin SDK
let adminApp;
try {
  // Check if app already exists
  const apps = getApps();
  if (apps.length === 0) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } else {
    adminApp = apps[0];
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  console.error('\nPlease check your Firebase Admin credentials in .env.local');
  process.exit(1);
}

const auth = getAuth(adminApp);

/**
 * Set admin claims for a user
 */
async function setAdminClaims(userIdentifier) {
  try {
    let userRecord;
    
    // Check if input is email or UID
    if (userIdentifier.includes('@')) {
      console.log(`🔍 Looking up user by email: ${userIdentifier}`);
      userRecord = await auth.getUserByEmail(userIdentifier);
    } else {
      console.log(`🔍 Looking up user by UID: ${userIdentifier}`);
      userRecord = await auth.getUser(userIdentifier);
    }
    
    console.log(`✅ Found user: ${userRecord.email} (UID: ${userRecord.uid})`);
    
    // Check current claims
    const existingClaims = userRecord.customClaims || {};
    console.log('📋 Current custom claims:', existingClaims);
    
    if (existingClaims.admin === true) {
      console.log('ℹ️  User already has admin privileges');
      return;
    }
    
    // Set admin claims
    console.log('🔧 Setting admin claims...');
    await auth.setCustomUserClaims(userRecord.uid, {
      ...existingClaims,
      admin: true,
      adminRole: 'super-admin',
      assignedAt: new Date().toISOString()
    });
    
    console.log('🎉 SUCCESS! Admin claims set successfully');
    console.log(`📧 User ${userRecord.email} now has admin privileges`);
    console.log('💡 The user will need to sign out and sign in again for changes to take effect');
    
  } catch (error) {
    console.error('❌ Error setting admin claims:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.error('   User not found. Please check the email/UID and try again.');
    } else if (error.code === 'auth/invalid-email') {
      console.error('   Invalid email format provided.');
    }
    
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  const userIdentifier = process.argv[2];
  
  if (!userIdentifier) {
    console.error('❌ Please provide a user email or UID');
    console.error('Usage: node scripts/set-admin-claims.mjs test@email.com');
    console.error('   or: node scripts/set-admin-claims.mjs user-uid-here');
    process.exit(1);
  }
  
  console.log('🚀 Firebase Admin Claims Script');
  console.log('================================');
  console.log(`📊 Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
  console.log(`👤 Target User: ${userIdentifier}`);
  console.log('');
  
  await setAdminClaims(userIdentifier);
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});