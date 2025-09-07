/**
 * Add missing weave-type collections used by the homepage techniques cards
 * Creates style collections: hand-knotted, hand-tufted
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Use same envless config as other seed scripts
const firebaseConfig = {
  apiKey: "AIzaSyBYLWXAJG4A4H4P72m2DHAa6n6iCm9xx40",
  authDomain: "equza-6b3c0.firebaseapp.com",
  projectId: "equza-6b3c0",
  storageBucket: "equza-6b3c0.firebasestorage.app",
  messagingSenderId: "610076693354",
  appId: "1:610076693354:web:3f715ac73e07e553d20b13"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collections = [
  {
    slug: 'hand-knotted',
    name: 'Hand-knotted',
    description: 'Rugs woven knot-by-knot for heirloom quality.',
    type: 'style',
    sortOrder: 90,
  },
  {
    slug: 'hand-tufted',
    name: 'Hand tufted',
    description: 'Tufted by hand for plush feel and quicker craft time.',
    type: 'style',
    sortOrder: 91,
  }
];

async function addCollections() {
  try {
    console.log('🧶 Adding weave-type collections...');
    for (const c of collections) {
      const ref = doc(db, 'collections', c.slug);
      await setDoc(ref, {
        id: c.slug,
        name: c.name,
        slug: c.slug,
        description: c.description,
        type: c.type,
        // heroImage omitted → UI uses safe fallback
        isActive: true,
        sortOrder: c.sortOrder,
        productIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true });
      console.log(`   ✅ Upserted collection: ${c.name} (${c.slug})`);
    }
    console.log('🎉 Done.');
  } catch (e) {
    console.error('❌ Failed to add weave collections:', e?.message || e);
    process.exitCode = 1;
  }
}

addCollections();


