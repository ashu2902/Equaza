/**
 * Simple Firebase Data Seeding
 * Using regular Firebase SDK after temporarily allowing writes
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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

// Sample data
const testData = {
  collections: [
    {
      id: 'modern-minimalist',
      name: 'Modern Minimalist',
      slug: 'modern-minimalist',
      description: 'Clean lines and contemporary design meet traditional craftsmanship.',
      type: 'style',
      heroImage: {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        alt: 'Modern Minimalist Collection - Contemporary geometric rug',
        storageRef: '',
        isMain: true,
        sortOrder: 0
      },
      seoTitle: 'Modern Minimalist Rugs | Equza Living Co.',
      seoDescription: 'Clean lines and contemporary design meet traditional craftsmanship.',
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      productIds: ['geometric-waves-rug'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'traditional-heritage',
      name: 'Traditional Heritage',
      slug: 'traditional-heritage',
      description: 'Timeless patterns inspired by centuries-old weaving traditions.',
      type: 'style',
      heroImage: {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        alt: 'Traditional Heritage Collection - Classic ornate rug',
        storageRef: '',
        isMain: true,
        sortOrder: 0
      },
      seoTitle: 'Traditional Heritage Rugs | Equza Living Co.',
      seoDescription: 'Timeless patterns inspired by centuries-old weaving traditions.',
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
      productIds: ['heritage-medallion-rug'],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  products: [
    {
      id: 'geometric-waves-rug',
      name: 'Geometric Waves',
      slug: 'geometric-waves-rug',
      description: 'A stunning contemporary rug featuring flowing geometric patterns.',
      story: 'Inspired by the gentle flow of ocean waves, this contemporary masterpiece combines modern aesthetics with traditional craftsmanship.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop',
          alt: 'Geometric Waves rug - main view',
          storageRef: '',
          isMain: true,
          sortOrder: 0
        },
        {
          url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
          alt: 'Geometric Waves rug - detail view',
          storageRef: '',
          isMain: false,
          sortOrder: 1
        }
      ],
      specifications: {
        materials: ['Wool', 'Silk'],
        weaveType: 'Hand-Knotted',
        availableSizes: [
          { dimensions: '6x9 ft', isCustom: false },
          { dimensions: '8x10 ft', isCustom: false },
          { dimensions: 'Custom Size', isCustom: true }
        ],
        origin: 'Bhadohi',
        craftTime: '6-8 months'
      },
      collections: ['modern-minimalist'],
      roomTypes: ['living-room', 'bedroom'],
      price: {
        isVisible: true,
        startingFrom: 45000,
        currency: 'INR',
      },
      seoTitle: 'Geometric Waves Handcrafted Rug | Equza Living Co.',
      seoDescription: 'A stunning contemporary rug featuring flowing geometric patterns.',
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'heritage-medallion-rug',
      name: 'Heritage Medallion',
      slug: 'heritage-medallion-rug',
      description: 'A classic traditional rug featuring an intricate central medallion pattern.',
      story: 'Rooted in centuries-old tradition, this Heritage Medallion showcases the timeless artistry of master weavers.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop',
          alt: 'Heritage Medallion rug - main view',
          storageRef: '',
          isMain: true,
          sortOrder: 0
        },
        {
          url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
          alt: 'Heritage Medallion rug - detail view',
          storageRef: '',
          isMain: false,
          sortOrder: 1
        }
      ],
      specifications: {
        materials: ['Wool', 'Cotton'],
        weaveType: 'Hand-Knotted',
        availableSizes: [
          { dimensions: '5x8 ft', isCustom: false },
          { dimensions: '8x10 ft', isCustom: false },
          { dimensions: '9x12 ft', isCustom: false }
        ],
        origin: 'Kashmir',
        craftTime: '8-12 months'
      },
      collections: ['traditional-heritage'],
      roomTypes: ['living-room'],
      price: {
        isVisible: true,
        startingFrom: 85000,
        currency: 'INR',
      },
      seoTitle: 'Heritage Medallion Traditional Rug | Equza Living Co.',
      seoDescription: 'A classic traditional rug featuring an intricate central medallion pattern.',
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  settings: {
    contact: {
      email: 'info@equzalivingco.com',
      phone: '+91 98765 43210',
    },
    business: {
      tagline: 'Crafted Calm for Modern Spaces',
      description: 'Premium handcrafted rugs that bring crafted calm to modern spaces',
    }
  }
};

async function seedData() {
  console.log('🌱 Starting simple data seeding...\n');

  try {
    // Seed Collections
    console.log('📚 Seeding Collections...');
    for (const collectionData of testData.collections) {
      await setDoc(doc(db, 'collections', collectionData.id), {
        ...collectionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   ✅ Added collection: ${collectionData.name}`);
    }

    // Seed Products
    console.log('\n🏺 Seeding Products...');
    for (const productData of testData.products) {
      await setDoc(doc(db, 'products', productData.id), {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   ✅ Added product: ${productData.name}`);
    }

    // Seed Settings
    console.log('\n⚙️ Seeding Settings...');
    await setDoc(doc(db, 'settings', 'global'), {
      ...testData.settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('   ✅ Added global settings');

    console.log('\n🎉 Data seeding completed successfully!');

  } catch (error) {
    console.error('\n❌ Error seeding data:', error.code, error.message);
  }
}

// Run the seeding
seedData(); 