/**
 * Seed hero content in pages/home from featured products currently used on the frontend
 * - Copies the main image URLs from featured products into pages/home.hero.image.src
 * - Also creates pages/home.heroSlides[] for future use (title/subtext optional)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

// Reuse the minimal config style used by other scripts
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

async function getFeaturedProductImageUrls(limit = 5) {
  const q = query(collection(db, 'products'), where('isFeatured', '==', true));
  const snap = await getDocs(q);
  const urls = [];
  snap.forEach((docSnap) => {
    const p = docSnap.data();
    const images = Array.isArray(p.images) ? p.images : [];
    const main = images.find((im) => im && (im.isMain === true));
    const url = (main && main.url) || (images[0] && images[0].url);
    if (url) urls.push(url);
  });
  return urls.slice(0, limit);
}

async function seedHeroFromFeatured() {
  try {
    console.log('🔗 Fetching featured product image URLs...');
    const urls = await getFeaturedProductImageUrls(6);
    if (urls.length === 0) {
      console.log('No featured products found; aborting.');
      return;
    }

    const hero = urls.map((u, i) => ({
      title: i === 0 ? 'Crafted Calm for Modern Spaces' : '',
      subtitle: '',
      cta: { label: 'Explore Now', href: '/collections' },
      image: { src: u, alt: 'Hero background' }
    }));

    console.log('📝 Writing pages/home with hero slides array...');
    await setDoc(doc(db, 'pages', 'home'), { hero }, { merge: true });
    console.log(`✅ Seeded hero with ${hero.length} slides from featured products.`);
  } catch (e) {
    console.error('❌ Failed to seed hero from products:', e);
  }
}

seedHeroFromFeatured();


