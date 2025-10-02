#!/usr/bin/env node

/**
 * Script to add space collections data to Firestore
 * Run with: node add-space-collections.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
try {
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

const db = getFirestore();

async function addSpaceCollections() {
  try {
    // Load the space collections data
    const dataPath = path.join(__dirname, 'space-collections-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log(`📥 Loading ${data.collections.length} space collections...`);

    // Add each collection to Firestore
    const batch = db.batch();
    let addedCount = 0;

    for (const collection of data.collections) {
      const docRef = db.collection('collections').doc();
      batch.set(docRef, {
        ...collection,
        createdAt: new Date(collection.createdAt),
        updatedAt: new Date(collection.updatedAt),
      });
      addedCount++;
      console.log(`📄 Prepared: ${collection.name} (${collection.type})`);
    }

    // Commit the batch
    await batch.commit();
    console.log(`🎉 Successfully added ${addedCount} space collections to Firestore!`);

    // List all collections to verify
    console.log('\n📋 Verifying collections in database:');
    const collectionsRef = db.collection('collections');
    const snapshot = await collectionsRef.where('type', '==', 'space').get();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`  ✓ ${data.name} (${data.slug}) - Active: ${data.isActive}`);
    });

    console.log(`\n✅ Total space collections in database: ${snapshot.size}`);

  } catch (error) {
    console.error('❌ Error adding space collections:', error);
    process.exit(1);
  }
}

// Run the script
addSpaceCollections()
  .then(() => {
    console.log('\n🎊 Space collections setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });