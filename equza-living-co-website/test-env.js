#!/usr/bin/env node

// Test script to check environment variables
console.log('🔍 Environment Variables Test:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('');

const envVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

envVars.forEach(envVar => {
  const value = process.env[envVar];
  console.log(`${envVar}:`, value ? '[SET]' : '[MISSING]');
  if (value) {
    console.log(`  - Length: ${value.length}`);
    console.log(`  - First 10 chars: ${value.substring(0, 10)}...`);
    console.log(`  - Has spaces: ${value.includes(' ')}`);
  }
  console.log('');
});

console.log('All environment variables loaded successfully!' + new Date().toISOString());