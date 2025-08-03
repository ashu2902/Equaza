#!/usr/bin/env node

/**
 * Simple script to verify collections in Firestore
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verifyCollections() {
  try {
    console.log('🔥 Connecting to Firebase...');
    console.log(`📡 Project: ${firebaseConfig.projectId}\n`);

    // Get all collections (simple query)
    const snapshot = await getDocs(collection(db, 'collections'));

    console.log(`📦 Total Collections Found: ${snapshot.size}\n`);

    // Group by type
    const styleCollections = [];
    const spaceCollections = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const collectionInfo = {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        type: data.type,
        isActive: data.isActive,
        description: data.description
      };
      
      if (data.type === 'style') {
        styleCollections.push(collectionInfo);
      } else if (data.type === 'space') {
        spaceCollections.push(collectionInfo);
      }
    });

    // Display results
    console.log(`🎨 STYLE COLLECTIONS (${styleCollections.length}):`);
    console.log('─'.repeat(50));
    styleCollections.forEach(col => {
      console.log(`  ✅ ${col.name} (${col.slug})`);
      console.log(`     📝 ${col.description.substring(0, 60)}...`);
      console.log(`     🔗 Active: ${col.isActive}\n`);
    });

    console.log(`🏠 SPACE COLLECTIONS (${spaceCollections.length}):`);
    console.log('─'.repeat(50));
    spaceCollections.forEach(col => {
      console.log(`  ✅ ${col.name} (${col.slug})`);
      console.log(`     📝 ${col.description.substring(0, 60)}...`);
      console.log(`     🔗 Active: ${col.isActive}\n`);
    });

    console.log('🎊 Collections verified successfully!');
    console.log('🌐 Your website should now display these collections.');
    console.log('🔄 Refresh your browser to see the updated data.');

  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  }
}

// Run the script
verifyCollections()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });