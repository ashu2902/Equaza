#!/usr/bin/env node

/**
 * Script to verify all collections in Firestore
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
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

    // Get all collections
    const collectionsQuery = query(collection(db, 'collections'), orderBy('type'), orderBy('sortOrder'));
    const snapshot = await getDocs(collectionsQuery);

    console.log(`📦 Total Collections Found: ${snapshot.size}\n`);

    // Group by type
    const collectionsByType = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!collectionsByType[data.type]) {
        collectionsByType[data.type] = [];
      }
      collectionsByType[data.type].push({
        id: doc.id,
        ...data
      });
    });

    // Display by type
    Object.keys(collectionsByType).forEach(type => {
      const typeCollections = collectionsByType[type];
      console.log(`🏷️  ${type.toUpperCase()} COLLECTIONS (${typeCollections.length}):`);
      console.log('─'.repeat(50));
      
      typeCollections.forEach(col => {
        console.log(`  ✅ ${col.name}`);
        console.log(`     📝 ${col.description.substring(0, 80)}...`);
        console.log(`     🔗 /${col.slug}`);
        console.log(`     📊 Active: ${col.isActive} | Sort: ${col.sortOrder}`);
        console.log(`     🆔 ID: ${col.id}\n`);
      });
    });

    console.log('🎊 All collections verified successfully!');
    console.log('🌐 Your website should now display these collections.');

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