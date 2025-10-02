#!/usr/bin/env node

/**
 * Script to add style collections data to Firestore
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';
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

async function addStyleCollections() {
  try {
    console.log('🔥 Initializing Firebase...');
    console.log(`📡 Connected to project: ${firebaseConfig.projectId}`);

    // Load the style collections data
    const rawData = fs.readFileSync('style-collections-data.json', 'utf8');
    const data = JSON.parse(rawData);

    console.log(`📥 Loading ${data.collections.length} style collections...`);

    // Check if collections already exist
    const existingQuery = query(collection(db, 'collections'), where('type', '==', 'style'));
    const existingSnapshot = await getDocs(existingQuery);
    
    if (existingSnapshot.size > 0) {
      console.log(`⚠️  Found ${existingSnapshot.size} existing style collections.`);
      console.log('🔄 Adding new collections alongside existing ones...');
    }

    // Add each collection to Firestore
    let addedCount = 0;

    for (const collectionData of data.collections) {
      try {
        const docRef = await addDoc(collection(db, 'collections'), {
          ...collectionData,
          createdAt: new Date(collectionData.createdAt),
          updatedAt: new Date(collectionData.updatedAt),
        });
        
        addedCount++;
        console.log(`✅ Added: ${collectionData.name} (ID: ${docRef.id})`);
      } catch (error) {
        console.error(`❌ Error adding ${collectionData.name}:`, error.message);
      }
    }

    console.log(`🎉 Successfully added ${addedCount}/${data.collections.length} style collections!`);

    // Verify the data
    console.log('\n📋 Verifying all style collections in database:');
    const allStyleCollections = await getDocs(existingQuery);
    
    allStyleCollections.forEach(doc => {
      const data = doc.data();
      console.log(`  ✓ ${data.name} (${data.slug}) - Active: ${data.isActive}`);
    });

    console.log(`\n✅ Total style collections in database: ${allStyleCollections.size}`);

  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  }
}

// Run the script
addStyleCollections()
  .then(() => {
    console.log('\n🎊 Style collections setup complete!');
    console.log('🔄 Refresh your website to see the new data.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });