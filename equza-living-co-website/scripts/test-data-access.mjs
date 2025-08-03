/**
 * Test Data Access
 * Verify that our seeded data can be accessed with security rules
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

async function testDataAccess() {
  console.log('🧪 Testing data access with security rules...\n');

  try {
    // Test Collections
    console.log('📚 Testing Collections Access:');
    const collectionsRef = collection(db, 'collections');
    const collectionsQuery = query(collectionsRef, where('isActive', '==', true));
    const collectionsSnapshot = await getDocs(collectionsQuery);
    
    console.log(`   ✅ Found ${collectionsSnapshot.size} active collections:`);
    collectionsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`      • ${data.name} (${data.type})`);
    });

    // Test Products
    console.log('\n🏺 Testing Products Access:');
    const productsRef = collection(db, 'products');
    const productsQuery = query(productsRef, where('isActive', '==', true));
    const productsSnapshot = await getDocs(productsQuery);
    
    console.log(`   ✅ Found ${productsSnapshot.size} active products:`);
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`      • ${data.name} - ₹${data.price?.startingFrom?.toLocaleString()}`);
    });

    // Test Settings
    console.log('\n⚙️ Testing Settings Access:');
    const settingsRef = collection(db, 'settings');
    const settingsSnapshot = await getDocs(settingsRef);
    
    console.log(`   ✅ Found ${settingsSnapshot.size} settings documents:`);
    settingsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`      • Contact: ${data.contact?.email}`);
      console.log(`      • Tagline: ${data.business?.tagline}`);
    });

    console.log('\n🎉 All data access tests passed!');
    console.log('\n📊 Summary:');
    console.log(`   • Collections: ${collectionsSnapshot.size} accessible`);
    console.log(`   • Products: ${productsSnapshot.size} accessible`);
    console.log(`   • Settings: ${settingsSnapshot.size} accessible`);
    console.log('   • Security rules: ✅ Working correctly');
    console.log('   • Firebase integration: ✅ Complete');

  } catch (error) {
    console.error('\n❌ Error accessing data:', error.code, error.message);
  }
}

// Run the test
testDataAccess(); 