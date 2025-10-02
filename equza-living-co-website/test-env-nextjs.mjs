// Test environment variables with Next.js env loading
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

console.log('🔍 Next.js Environment Variables Test:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Project Directory:', projectDir);
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
    console.log(`  - Preview: ${value.substring(0, 20)}...`);
  }
  console.log('');
});

console.log('Test completed at:', new Date().toISOString());