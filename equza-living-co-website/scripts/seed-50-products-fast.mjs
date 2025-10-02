/**
 * Fast Firebase Data Seeding with 50 Products
 * Uses Unsplash URLs directly without uploading to Firebase Storage for speed
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { writeFileSync } from 'fs';

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

// Existing collections for relationships
const styleCollections = ['modern-minimalist', 'traditional-heritage', 'modern-rugs', 'asymmetrical-rugs', 'wool-rugs'];
const spaceCollections = ['living-room', 'bedroom', 'dining-room'];

// High-quality Unsplash rug images (we'll use these directly)
const rugImageUrls = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1631679706909-fae5c4064ae2?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521998238608-a6db0bbd16a8?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542082297-83ea019b07c2?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574882481084-46b7c0b71d76?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1549497538-303791108f95?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=900&fit=crop&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=900&fit=crop&q=80'
];

// Expanded product templates for 50 products
const productTemplates = [
  {
    nameBase: 'Nordic Serenity', description: 'Clean geometric lines in soft neutrals create calm and spaciousness',
    styleCollection: 'modern-minimalist', materials: ['Wool', 'Cotton'], weaveType: 'Hand-tufted',
    origin: 'Bhadohi', priceRange: [2800, 3800], colors: ['Ivory', 'Light Gray', 'Charcoal']
  },
  {
    nameBase: 'Urban Lines', description: 'Contemporary linear patterns perfect for modern city living',
    styleCollection: 'modern-minimalist', materials: ['Wool', 'Silk'], weaveType: 'Hand-knotted',
    origin: 'Kashmir', priceRange: [4500, 6500], colors: ['Charcoal', 'Cream', 'Steel Blue']
  },
  {
    nameBase: 'Zen Garden', description: 'Minimalist textures inspired by Japanese design principles',
    styleCollection: 'modern-minimalist', materials: ['Bamboo Silk', 'Wool'], weaveType: 'Hand-knotted',
    origin: 'Jaipur', priceRange: [3500, 4500], colors: ['Natural', 'Stone Gray', 'Soft White']
  },
  {
    nameBase: 'Royal Medallion', description: 'Classic Persian medallion design with intricate floral borders',
    styleCollection: 'traditional-heritage', materials: ['Pure Silk'], weaveType: 'Hand-knotted',
    origin: 'Kashmir', priceRange: [8500, 12000], colors: ['Burgundy', 'Gold', 'Navy', 'Ivory']
  },
  {
    nameBase: 'Ancient Heritage', description: 'Traditional motifs passed down through generations',
    styleCollection: 'traditional-heritage', materials: ['Wool', 'Silk'], weaveType: 'Hand-knotted',
    origin: 'Bhadohi', priceRange: [5500, 7500], colors: ['Deep Blue', 'Ivory', 'Terracotta']
  },
  {
    nameBase: 'Imperial Garden', description: 'Botanical patterns inspired by Mughal palace gardens',
    styleCollection: 'traditional-heritage', materials: ['Silk', 'Cotton'], weaveType: 'Hand-knotted',
    origin: 'Kashmir', priceRange: [9500, 13500], colors: ['Emerald', 'Gold', 'Ivory', 'Burgundy']
  },
  {
    nameBase: 'Digital Wave', description: 'Contemporary patterns that blur digital and traditional art',
    styleCollection: 'modern-rugs', materials: ['Wool', 'Viscose'], weaveType: 'Hand-tufted',
    origin: 'Bhadohi', priceRange: [3200, 4200], colors: ['Electric Blue', 'Silver', 'Black']
  },
  {
    nameBase: 'Neon Nights', description: 'Bold contemporary design with vibrant color combinations',
    styleCollection: 'modern-rugs', materials: ['Acrylic', 'Wool'], weaveType: 'Hand-tufted',
    origin: 'Jaipur', priceRange: [2800, 3800], colors: ['Neon Pink', 'Electric Yellow', 'Deep Purple']
  },
  {
    nameBase: 'Cosmic Flow', description: 'Abstract celestial patterns for modern spaces',
    styleCollection: 'modern-rugs', materials: ['Silk', 'Metallic Thread'], weaveType: 'Hand-knotted',
    origin: 'Kashmir', priceRange: [7500, 9500], colors: ['Deep Purple', 'Silver', 'Midnight Blue']
  },
  {
    nameBase: 'Broken Symmetry', description: 'Intentionally unbalanced patterns creating dynamic visual interest',
    styleCollection: 'asymmetrical-rugs', materials: ['Wool', 'Silk'], weaveType: 'Hand-knotted',
    origin: 'Kashmir', priceRange: [5500, 7500], colors: ['Abstract Multi', 'Gold Accent']
  },
  {
    nameBase: 'Chaos Theory', description: 'Mathematical patterns rendered in beautiful abstract forms',
    styleCollection: 'asymmetrical-rugs', materials: ['Wool', 'Metallic Thread'], weaveType: 'Hand-tufted',
    origin: 'Jaipur', priceRange: [4200, 5800], colors: ['Multi-color', 'Gold', 'Silver']
  },
  {
    nameBase: 'Highland Comfort', description: 'Premium Highland wool in natural earth tones',
    styleCollection: 'wool-rugs', materials: ['Highland Wool'], weaveType: 'Hand-woven',
    origin: 'Bhadohi', priceRange: [3800, 4800], colors: ['Natural Brown', 'Cream', 'Charcoal']
  },
  {
    nameBase: 'Merino Luxury', description: 'Ultra-soft Merino wool in rich color combinations',
    styleCollection: 'wool-rugs', materials: ['Merino Wool'], weaveType: 'Hand-knotted',
    origin: 'Kashmir', priceRange: [5500, 7000], colors: ['Rich Chocolate', 'Cream', 'Taupe']
  }
];

// Room sizes and space mapping
const roomSizes = [
  { dimensions: '5x8 ft', space: 'bedroom', popular: true },
  { dimensions: '6x9 ft', space: 'bedroom', popular: true },
  { dimensions: '8x10 ft', space: 'living-room', popular: true },
  { dimensions: '9x12 ft', space: 'living-room', popular: true },
  { dimensions: '7x10 ft', space: 'dining-room', popular: true },
  { dimensions: '10x14 ft', space: 'living-room', popular: false },
  { dimensions: '8x11 ft', space: 'dining-room', popular: false },
  { dimensions: '4x6 ft', space: 'bedroom', popular: false }
];

// Helper functions
function getCraftTime(weaveType, materials) {
  const baseTime = {
    'Hand-knotted': ['4-6 months', '6-8 months', '8-12 months'],
    'Hand-tufted': ['2-3 months', '3-4 months', '4-5 months'],
    'Hand-woven': ['1-2 months', '2-3 months', '3-4 months']
  };
  const hasComplexMaterials = materials.some(m => m.includes('Silk') || m.includes('Metallic'));
  const timeIndex = hasComplexMaterials ? 2 : Math.floor(Math.random() * 3);
  return baseTime[weaveType][timeIndex];
}

function generateSlug(name, index) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${String(index).padStart(2, '0')}`;
}

function getSpaceCollections(sizeInfo) {
  const collections = [sizeInfo.space];
  if (sizeInfo.popular && Math.random() > 0.3) {
    const otherSpaces = spaceCollections.filter(s => s !== sizeInfo.space);
    if (otherSpaces.length > 0) {
      collections.push(otherSpaces[Math.floor(Math.random() * otherSpaces.length)]);
    }
  }
  return collections;
}

function generateProduct(template, index, totalProducts) {
  const sizeInfo = roomSizes[index % roomSizes.length];
  const spaceCollectionIds = getSpaceCollections(sizeInfo);
  const price = template.priceRange[0] + Math.floor(Math.random() * (template.priceRange[1] - template.priceRange[0]));
  
  const variations = ['', 'Classic', 'Deluxe', 'Premium', 'Elite', 'Royal', 'Signature', 'Heritage', 'Luxe', 'Grand'];
  const variationIndex = Math.floor(index / 4) % variations.length;
  const name = variationIndex === 0 ? template.nameBase : `${template.nameBase} ${variations[variationIndex]}`;
  const slug = generateSlug(name, index + 1);
  
  const mainImageIndex = index % rugImageUrls.length;
  const detailImageIndex = (index + Math.floor(rugImageUrls.length / 2)) % rugImageUrls.length;
  
  return {
    id: slug,
    name: name,
    slug: slug,
    description: template.description,
    story: `Handcrafted in ${template.origin} using traditional ${template.weaveType.toLowerCase()} techniques. ${template.description} Each piece brings ${template.styleCollection.replace('-', ' ')} sophistication to any space.`,
    images: [
      {
        url: rugImageUrls[mainImageIndex],
        alt: `${name} - Handcrafted ${template.weaveType} Rug`,
        storageRef: `/products/${slug}/main.jpg`,
        isMain: true,
        sortOrder: 0
      },
      {
        url: rugImageUrls[detailImageIndex],
        alt: `${name} - Detail View`,
        storageRef: `/products/${slug}/detail.jpg`,
        isMain: false,
        sortOrder: 1
      }
    ],
    specifications: {
      materials: template.materials,
      weaveType: template.weaveType,
      availableSizes: [
        { dimensions: sizeInfo.dimensions, isCustom: false },
        { dimensions: 'Custom Size', isCustom: true }
      ],
      origin: template.origin,
      craftTime: getCraftTime(template.weaveType, template.materials),
      colors: template.colors
    },
    collections: [template.styleCollection, ...spaceCollectionIds],
    roomTypes: spaceCollectionIds,
    price: {
      isVisible: true,
      startingFrom: price,
              currency: 'INR'
    },
    seoTitle: `${name} - Handcrafted ${template.weaveType} Rug | Equza Living Co.`,
    seoDescription: `${template.description} ${template.materials.join(', ')} rug handcrafted in ${template.origin}. Starting at ₹${price}.`,
    isActive: true,
    isFeatured: Math.random() > 0.85, // 15% chance
    sortOrder: index + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {
      template: template.nameBase,
      colorPrimary: template.colors[0],
      sizeCategory: sizeInfo.popular ? 'popular' : 'specialty',
      priceCategory: price < 4000 ? 'affordable' : price < 7000 ? 'premium' : 'luxury'
    }
  };
}

async function uploadProducts(products) {
  console.log('🔥 Uploading products to Firestore...');
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const batchProducts = products.slice(i, i + BATCH_SIZE);
    
    batchProducts.forEach(product => {
      const docRef = doc(db, 'products', product.id);
      batch.set(docRef, product);
    });
    
    console.log(`   📦 Batch ${Math.floor(i/BATCH_SIZE) + 1}: Uploading ${batchProducts.length} products`);
    await batch.commit();
    console.log(`   ✅ Batch completed: ${batchProducts.map(p => p.name).join(', ')}`);
  }
}

async function updateCollectionProductReferences(products) {
  console.log('\n🔗 Updating collection-product relationships...');
  const collectionProductMap = {};
  
  products.forEach(product => {
    product.collections.forEach(collectionId => {
      if (!collectionProductMap[collectionId]) collectionProductMap[collectionId] = [];
      collectionProductMap[collectionId].push(product.id);
    });
  });
  
  const batch = writeBatch(db);
  for (const [collectionId, productIds] of Object.entries(collectionProductMap)) {
    const collectionRef = doc(db, 'collections', collectionId);
    batch.update(collectionRef, { 
      productIds: productIds, 
      productCount: productIds.length, 
      updatedAt: new Date() 
    });
    console.log(`   🏷️  ${collectionId}: ${productIds.length} products`);
  }
  
  await batch.commit();
  console.log('   ✅ Collection relationships updated');
}

// Main execution
async function seedFastData() {
  console.log('🌱 Starting FAST Firebase data seeding (no image upload)...');
  console.log('📊 Target: 50 products with Unsplash URLs and proper relationships\n');
  
  try {
    console.log('🏭 Generating 50 products...');
    const products = [];
    
    // Generate exactly 50 products by cycling through templates
    for (let i = 0; i < 50; i++) {
      const templateIndex = i % productTemplates.length;
      const template = productTemplates[templateIndex];
      const product = generateProduct(template, i, 50);
      products.push(product);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   📋 Generated ${i + 1}/50 products`);
      }
    }
    
    // Save backup
    const backupData = {
      products,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalProducts: products.length,
        collections: { style: styleCollections, space: spaceCollections },
        note: 'Using direct Unsplash URLs for faster seeding'
      }
    };
    writeFileSync('generated-products-fast.json', JSON.stringify(backupData, null, 2));
    console.log('\n💾 Product data backed up to generated-products-fast.json');
    
    // Upload to Firebase
    await uploadProducts(products);
    await updateCollectionProductReferences(products);
    
    // Analytics
    const featuredCount = products.filter(p => p.isFeatured).length;
    const avgPrice = Math.round(products.reduce((sum, p) => sum + p.price.startingFrom, 0) / products.length);
    
    const summary = {
      byStyle: {},
      bySpace: {},
      byPrice: { affordable: 0, premium: 0, luxury: 0 }
    };
    
    products.forEach(product => {
      const styleCollection = product.collections.find(c => styleCollections.includes(c));
      if (styleCollection) {
        summary.byStyle[styleCollection] = (summary.byStyle[styleCollection] || 0) + 1;
      }
      
      product.roomTypes.forEach(room => {
        summary.bySpace[room] = (summary.bySpace[room] || 0) + 1;
      });
      
      const price = product.price.startingFrom;
      if (price < 4000) summary.byPrice.affordable++;
      else if (price < 7000) summary.byPrice.premium++;
      else summary.byPrice.luxury++;
    });
    
    console.log('\n🎉 FAST data seeding completed successfully!');
    console.log(`📈 Summary: ${products.length} products, ${featuredCount} featured, $${avgPrice} avg price`);
    
    console.log('\n🎨 Style Distribution:');
    Object.entries(summary.byStyle).forEach(([style, count]) => {
      console.log(`   • ${style}: ${count} products`);
    });
    
    console.log('\n🏠 Space Distribution:');
    Object.entries(summary.bySpace).forEach(([space, count]) => {
      console.log(`   • ${space}: ${count} products`);
    });
    
    console.log('\n💰 Price Distribution:');
    console.log(`   • Affordable (<$4,000): ${summary.byPrice.affordable} products`);
    console.log(`   • Premium ($4,000-$7,000): ${summary.byPrice.premium} products`);
    console.log(`   • Luxury (>$7,000): ${summary.byPrice.luxury} products`);
    
    console.log('\n✨ All products now have:');
    console.log('   • High-quality Unsplash rug images (direct URLs)');
    console.log('   • Proper collection relationships (style + space)');
    console.log('   • Comprehensive product specifications');
    console.log('   • SEO-optimized titles and descriptions');
    console.log('   • Realistic pricing and featured status');
    
  } catch (error) {
    console.error('\n❌ Error during data seeding:', error.message);
    process.exit(1);
  }
}

seedFastData();