/**
 * Seed pages/home document for homepage CMS content
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Minimal envless config used in existing seed scripts
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

const homeDoc = {
  hero: {
    title: 'Crafted Calm for Modern Spaces',
    cta: { label: 'Explore Now', href: '/collections' },
    image: { src: '', alt: 'Hero background' }
  },
  features: [
    { icon: '⭐', label: 'Signature Styles' },
    { icon: '🌱', label: 'Ethical Craftsmanship' },
    { icon: '🌍', label: 'Global Standards' }
  ],
  roomHighlight: {
    title: 'Living Room',
    description: 'Threads that tie your living space together in form of rugs',
    cta: { label: 'Check out designs', href: '/collections/living-room' },
    image: { src: '', alt: 'Living Room' }
  },
  techniques: [
    { title: 'Hand-knotted', image: { src: '', alt: 'Hand-knotted' }, href: '/collections/hand-knotted' },
    { title: 'Hand tufted', image: { src: '', alt: 'Hand tufted' }, href: '/collections/hand-tufted' }
  ],
  primaryCta: { headline: 'You Imagine It, We Weave It.', label: 'Customize Now »', href: '/customize' },
  story: { title: 'EQUZA LIVING CO.', body: 'We carefully curate and craft expressions with master weavers. Each piece carries a legacy of traditional craftsmanship blended with modern sensibilities.', ctaLabel: 'Know More', href: '/our-story' },
  craftsmanship: { title: 'Hands of Heritage', image: { src: '', alt: 'Craft' }, cta: { label: 'Explore the Craft', href: '/craftsmanship' } },
  lookbook: { thumbnail: { src: '', alt: 'Lookbook' }, pdfStorageRef: '', caption: 'A curated visual tour into our world — textures, palettes, and spaces that breathe.' },
  contact: { heading: 'Let\u2019s Begin a Conversation' },
  isActive: true,
  updatedAt: new Date().toISOString()
};

async function seedHome() {
  try {
    console.log('🌱 Seeding pages/home...');
    await setDoc(doc(db, 'pages', 'home'), homeDoc, { merge: true });
    console.log('✅ pages/home seeded. Update image URLs with Firebase Storage links.');
  } catch (e) {
    console.error('❌ Failed to seed pages/home:', e);
  }
}

seedHome();


