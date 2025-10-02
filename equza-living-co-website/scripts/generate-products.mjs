/**
 * Generate 50 Products with Collection Relationships
 * Creates comprehensive product data with Unsplash images
 */

import { writeFileSync } from 'fs';

// Existing collections from our database
const styleCollections = [
  'modern-minimalist',
  'traditional-heritage', 
  'modern-rugs',
  'asymmetrical-rugs',
  'wool-rugs'
];

const spaceCollections = [
  'living-room',
  'bedroom', 
  'dining-room'
];

// Curated Unsplash rug images (high quality, commercial use)
const rugImages = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=900&fit=crop&q=80', // Modern geometric
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=900&fit=crop&q=80', // Traditional pattern
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=900&fit=crop&q=80', // Elegant wool
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=900&fit=crop&q=80', // Abstract design
  'https://images.unsplash.com/photo-1631679706909-fae5c4064ae2?w=1200&h=900&fit=crop&q=80', // Bedroom rug
  'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200&h=900&fit=crop&q=80', // Living room setting
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&h=900&fit=crop&q=80', // Vintage style
  'https://images.unsplash.com/photo-1521998238608-a6db0bbd16a8?w=1200&h=900&fit=crop&q=80', // Contemporary
  'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&h=900&fit=crop&q=80', // Textured
  'https://images.unsplash.com/photo-1542082297-83ea019b07c2?w=1200&h=900&fit=crop&q=80', // Colorful
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=900&fit=crop&q=80', // Minimalist
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&h=900&fit=crop&q=80', // Artistic
  'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200&h=900&fit=crop&q=80', // Traditional
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=900&fit=crop&q=80', // Modern living
  'https://images.unsplash.com/photo-1574882481084-46b7c0b71d76?w=1200&h=900&fit=crop&q=80', // Luxury
  'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&h=900&fit=crop&q=80', // Bohemian
  'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?w=1200&h=900&fit=crop&q=80', // Persian
  'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=900&fit=crop&q=80', // Scandinavian
  'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&h=900&fit=crop&q=80', // Industrial
  'https://images.unsplash.com/photo-1549497538-303791108f95?w=1200&h=900&fit=crop&q=80', // Rustic
];

// Product templates with realistic data
const productTemplates = [
  // Modern Minimalist Collection
  {
    name: 'Arctic Serenity',
    description: 'Clean white and gray geometric patterns create a sense of calm and space in any modern room.',
    styleType: 'modern-minimalist',
    materials: ['Wool', 'Cotton'],
    weaveType: 'Hand-tufted',
    origin: 'Bhadohi',
    priceRange: [2500, 3500]
  },
  {
    name: 'Urban Lines',
    description: 'Sleek linear patterns in charcoal and cream bring contemporary sophistication to your space.',
    styleType: 'modern-minimalist', 
    materials: ['Wool', 'Silk'],
    weaveType: 'Hand-knotted',
    origin: 'Kashmir',
    priceRange: [4500, 6500]
  },
  {
    name: 'Zen Garden',
    description: 'Subtle textures and neutral tones inspired by Japanese minimalist design principles.',
    styleType: 'modern-minimalist',
    materials: ['Bamboo Silk', 'Wool'],
    weaveType: 'Hand-knotted',
    origin: 'Jaipur',
    priceRange: [3500, 4500]
  },
  {
    name: 'Concrete Dreams',
    description: 'Industrial-inspired gray tones with subtle texture variations for modern urban homes.',
    styleType: 'modern-minimalist',
    materials: ['Wool', 'Viscose'],
    weaveType: 'Hand-tufted',
    origin: 'Bhadohi',
    priceRange: [2800, 3800]
  },
  
  // Traditional Heritage Collection
  {
    name: 'Royal Medallion',
    description: 'Classic Persian medallion design with intricate floral borders in rich burgundy and gold.',
    styleType: 'traditional-heritage',
    materials: ['Pure Silk'],
    weaveType: 'Hand-knotted',
    origin: 'Kashmir',
    priceRange: [8500, 12000]
  },
  {
    name: 'Ancient Wisdom',
    description: 'Traditional motifs passed down through generations, featuring deep blues and ivory.',
    styleType: 'traditional-heritage',
    materials: ['Wool', 'Silk'],
    weaveType: 'Hand-knotted',
    origin: 'Bhadohi',
    priceRange: [5500, 7500]
  },
  {
    name: 'Imperial Gardens',
    description: 'Botanical patterns inspired by Mughal gardens with emerald greens and golden accents.',
    styleType: 'traditional-heritage',
    materials: ['Silk', 'Cotton'],
    weaveType: 'Hand-knotted',
    origin: 'Kashmir',
    priceRange: [9500, 13500]
  },
  {
    name: 'Heritage Tapestry',
    description: 'Rich tapestry of traditional symbols and patterns in warm terracotta and cream.',
    styleType: 'traditional-heritage',
    materials: ['Wool'],
    weaveType: 'Hand-knotted',
    origin: 'Jaipur',
    priceRange: [4500, 6000]
  },
  
  // Modern Rugs Collection
  {
    name: 'Digital Wave',
    description: 'Contemporary pixel-inspired patterns that blur the line between digital and traditional art.',
    styleType: 'modern-rugs',
    materials: ['Wool', 'Viscose'],
    weaveType: 'Hand-tufted',
    origin: 'Bhadohi',
    priceRange: [3200, 4200]
  },
  {
    name: 'Neon Nights',
    description: 'Bold contemporary design with electric color combinations for the adventurous decorator.',
    styleType: 'modern-rugs',
    materials: ['Acrylic', 'Wool'],
    weaveType: 'Hand-tufted',
    origin: 'Jaipur',
    priceRange: [2800, 3800]
  },
  {
    name: 'Cosmic Flow',
    description: 'Abstract celestial patterns in deep purples and silvers create an otherworldly atmosphere.',
    styleType: 'modern-rugs',
    materials: ['Silk', 'Metallic Thread'],
    weaveType: 'Hand-knotted',
    origin: 'Kashmir',
    priceRange: [7500, 9500]
  },
  {
    name: 'Urban Jungle',
    description: 'Contemporary interpretation of botanical themes with stylized leaves and organic shapes.',
    styleType: 'modern-rugs',
    materials: ['Wool', 'Cotton'],
    weaveType: 'Hand-tufted',
    origin: 'Bhadohi',
    priceRange: [3500, 4500]
  },
  
  // Asymmetrical Rugs Collection
  {
    name: 'Broken Symmetry',
    description: 'Intentionally unbalanced geometric patterns that create dynamic visual interest.',
    styleType: 'asymmetrical-rugs',
    materials: ['Wool', 'Silk'],
    weaveType: 'Hand-knotted',
    origin: 'Kashmir',
    priceRange: [5500, 7500]
  },
  {
    name: 'Chaos Theory',
    description: 'Mathematical chaos rendered in beautiful abstract patterns with gold accents.',
    styleType: 'asymmetrical-rugs',
    materials: ['Wool', 'Metallic Thread'],
    weaveType: 'Hand-tufted',
    origin: 'Jaipur',
    priceRange: [4200, 5800]
  },
  {
    name: 'Fluid Motion',
    description: 'Organic flowing patterns that seem to move and shift as you look at them.',
    styleType: 'asymmetrical-rugs',
    materials: ['Silk', 'Viscose'],
    weaveType: 'Hand-knotted',
    origin: 'Kashmir',
    priceRange: [6500, 8500]
  },
  
  // Wool Rugs Collection
  {
    name: 'Highland Comfort',
    description: 'Premium Highland wool in natural earth tones with subtle striped patterns.',
    styleType: 'wool-rugs',
    materials: ['Highland Wool'],
    weaveType: 'Hand-woven',
    origin: 'Bhadohi',
    priceRange: [3800, 4800]
  },
  {
    name: 'Merino Luxury',
    description: 'Ultra-soft Merino wool in rich chocolate and cream color combinations.',
    styleType: 'wool-rugs',
    materials: ['Merino Wool'],
    weaveType: 'Hand-knotted',
    origin: 'Kashmir',
    priceRange: [5500, 7000]
  },
  {
    name: 'Shepherd\'s Dream',
    description: 'Traditional wool craftsmanship with time-honored patterns in natural colors.',
    styleType: 'wool-rugs',
    materials: ['Pure Wool'],
    weaveType: 'Hand-woven',
    origin: 'Jaipur',
    priceRange: [3200, 4200]
  }
];

// Room size variations
const roomSizes = [
  { dimensions: '5x8 ft', space: 'bedroom', popular: true },
  { dimensions: '6x9 ft', space: 'bedroom', popular: true },
  { dimensions: '8x10 ft', space: 'living-room', popular: true },
  { dimensions: '9x12 ft', space: 'living-room', popular: true },
  { dimensions: '10x14 ft', space: 'living-room', popular: false },
  { dimensions: '7x10 ft', space: 'dining-room', popular: true },
  { dimensions: '8x11 ft', space: 'dining-room', popular: false },
  { dimensions: '4x6 ft', space: 'bedroom', popular: false },
  { dimensions: '12x15 ft', space: 'living-room', popular: false }
];

// Craft time based on complexity and size
const getCraftTime = (weaveType, materials) => {
  const baseTime = {
    'Hand-knotted': ['4-6 months', '6-8 months', '8-12 months'],
    'Hand-tufted': ['2-3 months', '3-4 months', '4-5 months'],
    'Hand-woven': ['1-2 months', '2-3 months', '3-4 months']
  };
  
  const hasComplexMaterials = materials.includes('Silk') || materials.includes('Pure Silk');
  const timeIndex = hasComplexMaterials ? 2 : Math.floor(Math.random() * 3);
  
  return baseTime[weaveType][timeIndex];
};

// Generate random variations
function generateProduct(template, index) {
  const imageIndex = index % rugImages.length;
  const sizeVariation = roomSizes[Math.floor(Math.random() * roomSizes.length)];
  const priceVariation = template.priceRange[0] + Math.floor(Math.random() * (template.priceRange[1] - template.priceRange[0]));
  
  // Determine space collections based on size
  const spaceCollectionIds = [];
  if (sizeVariation.space === 'living-room') spaceCollectionIds.push('living-room');
  if (sizeVariation.space === 'bedroom') spaceCollectionIds.push('bedroom');
  if (sizeVariation.space === 'dining-room') spaceCollectionIds.push('dining-room');
  
  // Add random secondary space
  if (Math.random() > 0.7) {
    const otherSpaces = spaceCollections.filter(s => !spaceCollectionIds.includes(s));
    if (otherSpaces.length > 0) {
      spaceCollectionIds.push(otherSpaces[Math.floor(Math.random() * otherSpaces.length)]);
    }
  }
  
  const slug = `${template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;
  
  return {
    id: slug,
    name: `${template.name} ${index > 15 ? 'II' : ''}`.trim(),
    slug: slug,
    description: template.description,
    story: `Handcrafted in ${template.origin} using traditional ${template.weaveType.toLowerCase()} techniques. This piece represents the perfect blend of heritage craftsmanship and contemporary design sensibilities.`,
    images: [
      {
        url: rugImages[imageIndex],
        alt: `${template.name} - Handcrafted ${template.weaveType} Rug`,
        storageRef: `/products/${slug}/main.jpg`,
        isMain: true,
        sortOrder: 0
      },
      {
        url: rugImages[(imageIndex + 10) % rugImages.length],
        alt: `${template.name} - Detail View`,
        storageRef: `/products/${slug}/detail.jpg`, 
        isMain: false,
        sortOrder: 1
      }
    ],
    specifications: {
      materials: template.materials,
      weaveType: template.weaveType,
      availableSizes: [
        { dimensions: sizeVariation.dimensions, isCustom: false },
        { dimensions: 'Custom Size', isCustom: true }
      ],
      origin: template.origin,
      craftTime: getCraftTime(template.weaveType, template.materials)
    },
    collections: [template.styleType, ...spaceCollectionIds],
    roomTypes: spaceCollectionIds,
    price: {
      isVisible: true,
      startingFrom: priceVariation,
      currency: 'INR'
    },
    seoTitle: `${template.name} - Handcrafted ${template.weaveType} Rug | Equza Living Co.`,
    seoDescription: template.description.substring(0, 150),
    isActive: true,
    isFeatured: Math.random() > 0.8, // 20% chance of being featured
    sortOrder: index,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Generate all 50 products
function generateAllProducts() {
  const products = [];
  
  // Generate products based on templates (cycling through them)
  for (let i = 0; i < 50; i++) {
    const templateIndex = i % productTemplates.length;
    const template = productTemplates[templateIndex];
    const product = generateProduct(template, i + 1);
    products.push(product);
  }
  
  return products;
}

// Generate the products
const products = generateAllProducts();

// Write to JSON file
const outputData = {
  products: products,
  metadata: {
    totalProducts: products.length,
    generatedAt: new Date().toISOString(),
    collections: {
      style: styleCollections,
      space: spaceCollections
    },
    description: 'Generated 50 products with collection relationships and Unsplash images'
  }
};

writeFileSync('generated-products.json', JSON.stringify(outputData, null, 2));

console.log('🎉 Generated 50 products successfully!');
console.log(`📊 Distribution:`);
console.log(`   • Total Products: ${products.length}`);
console.log(`   • Featured Products: ${products.filter(p => p.isFeatured).length}`);
console.log(`   • Style Collections: ${styleCollections.length}`);
console.log(`   • Space Collections: ${spaceCollections.length}`);
console.log(`   • Unique Images: ${rugImages.length}`);
console.log(`📄 Data saved to: generated-products.json`);

// Collection distribution
const collectionStats = {};
products.forEach(product => {
  product.collections.forEach(collection => {
    collectionStats[collection] = (collectionStats[collection] || 0) + 1;
  });
});

console.log(`\n📈 Collection Distribution:`);
Object.entries(collectionStats).forEach(([collection, count]) => {
  console.log(`   • ${collection}: ${count} products`);
});