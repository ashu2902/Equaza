import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🌿 Environment Variables:');
console.log('- NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '[SET]' : '[MISSING]');
console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '[SET]' : '[MISSING]');
console.log('- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '[SET]' : '[MISSING]');
console.log('- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '[SET]' : '[MISSING]');