/**
 * Seed Collections from JSON Data Files
 * Adds style and space collections from the JSON data files
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYLWXAJG4A4H4P72m2DHAa6n6iCm9xx40",
  authDomain: "equza-6b3c0.firebaseapp.com",
  projectId: "equza-6b3c0",
  storageBucket: "equza-6b3c0.firebasestorage.app",
  messagingSenderId: "610076693354",
  appId: "1:610076693354:web:3f715ac73e07e553d20b13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedCollections() {
  console.log('🌱 Seeding collections from JSON files...\n');

  try {
    // Load style collections
    const styleCollectionsPath = join(__dirname, '..', 'style-collections-data.json');
    const styleCollectionsData = JSON.parse(readFileSync(styleCollectionsPath, 'utf8'));
    
    // Load space collections
    const spaceCollectionsPath = join(__dirname, '..', 'space-collections-data.json');
    const spaceCollectionsData = JSON.parse(readFileSync(spaceCollectionsPath, 'utf8'));

    // Seed style collections
    console.log('🎨 Seeding Style Collections...');
    for (const collectionData of styleCollectionsData.collections) {
      const docId = collectionData.slug;
      await setDoc(doc(db, 'collections', docId), {
        ...collectionData,
        id: docId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   ✅ Added style collection: ${collectionData.name}`);
    }

    // Seed space collections
    console.log('\n🏠 Seeding Space Collections...');
    for (const collectionData of spaceCollectionsData.collections) {
      const docId = collectionData.slug;
      await setDoc(doc(db, 'collections', docId), {
        ...collectionData,
        id: docId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   ✅ Added space collection: ${collectionData.name}`);
    }

    console.log('\n🎉 Collections seeding completed successfully!');
    console.log(`📊 Total collections added: ${styleCollectionsData.collections.length + spaceCollectionsData.collections.length}`);

  } catch (error) {
    console.error('\n❌ Error seeding collections:', error.message);
  }
}

// Run the seeding
seedCollections();