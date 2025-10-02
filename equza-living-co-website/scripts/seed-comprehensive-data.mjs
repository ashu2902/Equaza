/**
 * Comprehensive Data Seeding Script
 * Seeds 50 diverse rug products with proper collection relationships
 * Sources images from Unsplash and uploads to Firebase Storage
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fetch from 'node-fetch';

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
const storage = getStorage(app);

// Collection mappings
const STYLE_COLLECTIONS = {
  'modern-minimalist': 'Modern Minimalist',
  'traditional-heritage': 'Traditional Heritage',
  'modern-rugs': 'Modern Rugs',
  'asymmetrical-rugs': 'Asymmetrical Rugs',
  'wool-rugs': 'Wool Rugs'
};

const SPACE_COLLECTIONS = {
  'living-room': 'Living Room',
  'bedroom': 'Bedroom',
  'dining-room': 'Dining Room'
};

// Comprehensive product data
const PRODUCTS_DATA = [
  // Modern Minimalist Collection (10 products)
  {
    name: 'Arctic Waves',
    slug: 'arctic-waves',
    description: 'Flowing white and grey patterns inspired by Arctic ice formations.',
    story: 'Crafted by master weavers in Kashmir, this piece captures the serene beauty of ice flows in the Arctic. Each wave pattern represents months of careful hand-knotting.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['living-room'],
    materials: ['Silk', 'Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '8-10 months',
    dimensions: '8x10 ft',
    price: 75000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'white minimalist rug geometric',
    unsplashId: 'photo-1586023492125-27b2c045efd7'
  },
  {
    name: 'Stone Garden',
    slug: 'stone-garden',
    description: 'Neutral tones with subtle texture variations reminiscent of zen gardens.',
    story: 'Inspired by Japanese zen gardens, this minimalist piece brings tranquility to modern spaces.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['bedroom', 'living-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '6x9 ft',
    price: 45000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'beige neutral rug texture',
    unsplashId: 'photo-1449824913935-59a10b8d2000'
  },
  {
    name: 'Linear Horizon',
    slug: 'linear-horizon',
    description: 'Clean horizontal lines in monochromatic tones for contemporary spaces.',
    story: 'The horizon line has inspired artists for centuries. This piece translates that infinite line into textile art.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['living-room'],
    materials: ['Wool', 'Cotton'],
    weaveType: 'Flat-Weave',
    origin: 'Jaipur',
    craftTime: '2-3 months',
    dimensions: '9x12 ft',
    price: 55000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'striped modern rug lines',
    unsplashId: 'photo-1558618047-3c8c76ca7d13'
  },
  {
    name: 'Cloud Drift',
    slug: 'cloud-drift',
    description: 'Soft, irregular patterns that evoke floating clouds in a clear sky.',
    story: 'Woven with the lightest touch, this rug captures the ephemeral beauty of clouds drifting across the sky.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['bedroom'],
    materials: ['Silk'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '6-8 months',
    dimensions: '5x8 ft',
    price: 65000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'soft white rug cloud pattern',
    unsplashId: 'photo-1631679706909-fae5c4064ae2'
  },
  {
    name: 'Urban Grid',
    slug: 'urban-grid',
    description: 'Geometric grid pattern in charcoal and cream for modern city living.',
    story: 'The urban landscape viewed from above inspired this architectural grid pattern.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['living-room', 'dining-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-5 months',
    dimensions: '8x10 ft',
    price: 48000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'geometric grid rug black white',
    unsplashId: 'photo-1555041469-a586c61ea9bc'
  },
  {
    name: 'Marble Veins',
    slug: 'marble-veins',
    description: 'Organic veining patterns inspired by natural marble formations.',
    story: 'Each vein tells the story of geological time, translated into the timeless art of rug making.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['living-room'],
    materials: ['Silk', 'Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '7-9 months',
    dimensions: '6x9 ft',
    price: 72000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'marble pattern rug veins',
    unsplashId: 'photo-1506439773649-6e0eb8cfb237'
  },
  {
    name: 'Whisper Grey',
    slug: 'whisper-grey',
    description: 'Subtle tonal variations in soft greys create a calming presence.',
    story: 'Sometimes the most powerful statements are whispered. This rug speaks in gentle tones.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['bedroom'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '5x7 ft',
    price: 38000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'grey minimal rug texture',
    unsplashId: 'photo-1571055107559-3e67626fa8be'
  },
  {
    name: 'Eclipse',
    slug: 'eclipse',
    description: 'Bold circular motif in deep charcoal against a cream background.',
    story: 'The rare astronomical event that captivates humanity, captured in wool and silk.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['living-room'],
    materials: ['Wool', 'Silk'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '6-8 months',
    dimensions: '8x8 ft',
    price: 68000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'circle rug modern black white',
    unsplashId: 'photo-1493663284031-b7e3aaa4c4bc'
  },
  {
    name: 'Frost Line',
    slug: 'frost-line',
    description: 'Crystalline patterns in icy blues and whites evoke winter mornings.',
    story: 'The delicate patterns that frost creates on windows inspired this winter masterpiece.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['bedroom'],
    materials: ['Silk'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '8-10 months',
    dimensions: '6x9 ft',
    price: 78000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'blue white rug frost pattern',
    unsplashId: 'photo-1540979388789-6cee28a1cdc9'
  },
  {
    name: 'Pure Form',
    slug: 'pure-form',
    description: 'Undyed natural wool in its purest form, celebrating simplicity.',
    story: 'Sometimes perfection lies in restraint. This rug celebrates the natural beauty of undyed wool.',
    styleCollections: ['modern-minimalist'],
    spaceCollections: ['living-room', 'bedroom'],
    materials: ['Wool'],
    weaveType: 'Flat-Weave',
    origin: 'Jaipur',
    craftTime: '2-3 months',
    dimensions: '9x12 ft',
    price: 42000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'natural wool rug undyed beige',
    unsplashId: 'photo-1513475382585-d06e58bcb0e0'
  },

  // Traditional Heritage Collection (10 products)
  {
    name: 'Royal Persian',
    slug: 'royal-persian',
    description: 'Classic Persian medallion design with intricate borders in rich jewel tones.',
    story: 'A faithful recreation of 16th-century Persian court rugs, each motif carries centuries of tradition.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['living-room', 'dining-room'],
    materials: ['Wool', 'Silk'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '12-18 months',
    dimensions: '10x14 ft',
    price: 150000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'persian rug traditional medallion',
    unsplashId: 'photo-1506905925346-21bda4d32df4'
  },
  {
    name: 'Mughal Garden',
    slug: 'mughal-garden',
    description: 'Intricate floral patterns inspired by the gardens of Mughal emperors.',
    story: 'The paradise gardens of Mughal emperors bloom eternal in this masterpiece of textile art.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['living-room'],
    materials: ['Silk'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '10-14 months',
    dimensions: '8x10 ft',
    price: 125000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'floral traditional rug garden pattern',
    unsplashId: 'photo-1578662996442-48f60103fc96'
  },
  {
    name: 'Kashmiri Bloom',
    slug: 'kashmiri-bloom',
    description: 'Delicate paisley and floral motifs in the traditional Kashmiri style.',
    story: 'Each paisley is a droplet of beauty, flowing across this canvas like a spring garden in Kashmir.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['bedroom', 'living-room'],
    materials: ['Silk', 'Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '8-12 months',
    dimensions: '6x9 ft',
    price: 95000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'paisley rug traditional kashmiri',
    unsplashId: 'photo-1592838064575-70ed626d3a0e'
  },
  {
    name: 'Ancient Tree',
    slug: 'ancient-tree',
    description: 'Tree of life motif with birds and flowers in traditional burgundy and gold.',
    story: 'The tree of life connects earth and heaven, its branches reaching toward eternity.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['living-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Bhadohi',
    craftTime: '6-8 months',
    dimensions: '8x10 ft',
    price: 85000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'tree of life rug traditional',
    unsplashId: 'photo-1565538810643-b5bdb714032a'
  },
  {
    name: 'Heritage Medallion',
    slug: 'heritage-medallion-premium',
    description: 'Central medallion surrounded by intricate geometric patterns.',
    story: 'The medallion represents the cosmic center, surrounded by the harmony of geometric perfection.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['living-room', 'dining-room'],
    materials: ['Wool', 'Silk'],
    weaveType: 'Hand-Knotted',
    origin: 'Bhadohi',
    craftTime: '8-10 months',
    dimensions: '9x12 ft',
    price: 110000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'medallion rug traditional geometric',
    unsplashId: 'photo-1544947950-fa07a98d237f'
  },
  {
    name: 'Rajasthani Splendor',
    slug: 'rajasthani-splendor',
    description: 'Vibrant colors and bold patterns characteristic of Rajasthani textile art.',
    story: 'The royal courts of Rajasthan come alive in this celebration of color and pattern.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['living-room'],
    materials: ['Wool'],
    weaveType: 'Flat-Weave',
    origin: 'Jaipur',
    craftTime: '4-6 months',
    dimensions: '8x10 ft',
    price: 65000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'rajasthani rug colorful traditional',
    unsplashId: 'photo-1578632292335-71aebeaba936'
  },
  {
    name: 'Ottoman Legacy',
    slug: 'ottoman-legacy',
    description: 'Turkish-inspired patterns with deep blues and gold accents.',
    story: 'The Ottoman Empire\'s artistic legacy lives on in this tribute to Turkish rug-making masters.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['living-room', 'dining-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Bhadohi',
    craftTime: '7-9 months',
    dimensions: '10x14 ft',
    price: 98000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'turkish rug blue traditional ottoman',
    unsplashId: 'photo-1558618047-3c8c76ca7d13'
  },
  {
    name: 'Peacock Feather',
    slug: 'peacock-feather',
    description: 'Peacock feather motifs in emerald and sapphire with gold highlights.',
    story: 'The peacock, symbol of immortality and renewal, spreads its feathers across this royal canvas.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['living-room'],
    materials: ['Silk', 'Gold Thread'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '14-18 months',
    dimensions: '8x10 ft',
    price: 180000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'peacock pattern rug traditional ornate',
    unsplashId: 'photo-1555041469-a586c61ea9bc'
  },
  {
    name: 'Vintage Rose',
    slug: 'vintage-rose',
    description: 'Romantic rose patterns in soft pastels with antique patina.',
    story: 'Like roses pressed in an antique book, these patterns carry the fragrance of bygone eras.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['bedroom'],
    materials: ['Wool', 'Silk'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '6-8 months',
    dimensions: '6x9 ft',
    price: 88000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'vintage rose rug floral pattern',
    unsplashId: 'photo-1631679706909-fae5c4064ae2'
  },
  {
    name: 'Palace Corridor',
    slug: 'palace-corridor',
    description: 'Long runner with repeating geometric motifs fit for royal palaces.',
    story: 'This runner has witnessed the footsteps of royalty through palace corridors for centuries.',
    styleCollections: ['traditional-heritage'],
    spaceCollections: ['dining-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Bhadohi',
    craftTime: '5-7 months',
    dimensions: '3x12 ft',
    price: 75000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'runner rug traditional palace corridor',
    unsplashId: 'photo-1571055107559-3e67626fa8be'
  },

  // Modern Rugs Collection (10 products)
  {
    name: 'Digital Waves',
    slug: 'digital-waves',
    description: 'Contemporary wave patterns with pixelated edges in bold colors.',
    story: 'Where digital art meets ancient craft, creating waves that surf between two worlds.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool', 'Synthetic'],
    weaveType: 'Machine-Tufted',
    origin: 'Bhadohi',
    craftTime: '1-2 months',
    dimensions: '8x10 ft',
    price: 35000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'modern wave rug digital pattern',
    unsplashId: 'photo-1586023492125-27b2c045efd7'
  },
  {
    name: 'Neon Dreams',
    slug: 'neon-dreams',
    description: 'Electric color combinations inspired by urban nightlife.',
    story: 'The pulsing energy of city lights after dark, captured in vibrant wool and synthetic fibers.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool', 'Synthetic'],
    weaveType: 'Machine-Tufted',
    origin: 'Bhadohi',
    craftTime: '1-2 months',
    dimensions: '6x9 ft',
    price: 32000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'neon colorful rug modern bright',
    unsplashId: 'photo-1558618047-3c8c76ca7d13'
  },
  {
    name: 'Circuit Board',
    slug: 'circuit-board',
    description: 'Geometric patterns inspired by electronic circuit boards.',
    story: 'The invisible networks that power our world, made visible in thread and pattern.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room', 'dining-room'],
    materials: ['Synthetic', 'Cotton'],
    weaveType: 'Machine-Tufted',
    origin: 'Bhadohi',
    craftTime: '1-2 months',
    dimensions: '9x12 ft',
    price: 38000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'geometric rug circuit pattern modern',
    unsplashId: 'photo-1555041469-a586c61ea9bc'
  },
  {
    name: 'Abstract Flow',
    slug: 'abstract-flow',
    description: 'Flowing abstract forms in contemporary color palettes.',
    story: 'Like paint flowing across canvas, these forms capture movement in static beauty.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '8x10 ft',
    price: 52000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'abstract flow rug modern art',
    unsplashId: 'photo-1506439773649-6e0eb8cfb237'
  },
  {
    name: 'Gradient Sunset',
    slug: 'gradient-sunset',
    description: 'Smooth color transitions from warm oranges to cool purples.',
    story: 'The perfect sunset captured in a gradient that flows like the changing sky.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room', 'bedroom'],
    materials: ['Wool', 'Silk'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-5 months',
    dimensions: '6x9 ft',
    price: 58000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'gradient rug sunset colors modern',
    unsplashId: 'photo-1540979388789-6cee28a1cdc9'
  },
  {
    name: 'Pixel Art',
    slug: 'pixel-art',
    description: 'Large-scale pixel patterns creating modern geometric art.',
    story: 'Each knot is a pixel in this digital masterpiece, bridging technology and tradition.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '8x8 ft',
    price: 48000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'pixel rug geometric modern squares',
    unsplashId: 'photo-1493663284031-b7e3aaa4c4bc'
  },
  {
    name: 'Urban Skyline',
    slug: 'urban-skyline',
    description: 'Stylized city silhouettes in monochromatic tones.',
    story: 'The city never sleeps, and neither does its inspiration for contemporary design.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room', 'dining-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '10x14 ft',
    price: 65000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'skyline rug urban city modern',
    unsplashId: 'photo-1571055107559-3e67626fa8be'
  },
  {
    name: 'Splash Paint',
    slug: 'splash-paint',
    description: 'Paint splatter patterns in vibrant contemporary colors.',
    story: 'The energy of action painting frozen in time, each splash a moment of creative freedom.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool', 'Synthetic'],
    weaveType: 'Machine-Tufted',
    origin: 'Bhadohi',
    craftTime: '2-3 months',
    dimensions: '6x9 ft',
    price: 42000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'paint splash rug modern colorful art',
    unsplashId: 'photo-1578662996442-48f60103fc96'
  },
  {
    name: 'Holographic',
    slug: 'holographic',
    description: 'Iridescent patterns that seem to shift with light and viewing angle.',
    story: 'Light dances across this surface like a hologram, creating magic in every thread.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Synthetic', 'Metallic Thread'],
    weaveType: 'Machine-Tufted',
    origin: 'Bhadohi',
    craftTime: '2-3 months',
    dimensions: '8x10 ft',
    price: 55000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'iridescent rug holographic modern',
    unsplashId: 'photo-1592838064575-70ed626d3a0e'
  },
  {
    name: 'Retro Futurism',
    slug: 'retro-futurism',
    description: 'Vintage sci-fi inspired patterns with metallic accents.',
    story: 'The future as imagined by the past, where chrome and curves dance together.',
    styleCollections: ['modern-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool', 'Metallic Thread'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-5 months',
    dimensions: '8x10 ft',
    price: 62000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'retro futuristic rug metallic modern',
    unsplashId: 'photo-1565538810643-b5bdb714032a'
  },

  // Asymmetrical Rugs Collection (10 products)
  {
    name: 'Broken Symmetry',
    slug: 'broken-symmetry',
    description: 'Deliberately asymmetrical design that challenges traditional balance.',
    story: 'Sometimes beauty lies in the unexpected, in the break from perfect symmetry.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-5 months',
    dimensions: '8x10 ft',
    price: 58000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'asymmetrical rug broken pattern abstract',
    unsplashId: 'photo-1558618047-3c8c76ca7d13'
  },
  {
    name: 'Organic Chaos',
    slug: 'organic-chaos',
    description: 'Natural, irregular patterns inspired by organic growth.',
    story: 'Nature never follows straight lines, and neither does this celebration of organic beauty.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool', 'Jute'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '6x9 ft',
    price: 45000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'organic irregular rug natural pattern',
    unsplashId: 'photo-1586023492125-27b2c045efd7'
  },
  {
    name: 'Lopsided Moon',
    slug: 'lopsided-moon',
    description: 'Crescent shapes that seem to dance off-center across the surface.',
    story: 'The moon in its various phases, captured in a dance of asymmetrical beauty.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['bedroom', 'living-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '6x9 ft',
    price: 48000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'crescent moon rug asymmetrical',
    unsplashId: 'photo-1631679706909-fae5c4064ae2'
  },
  {
    name: 'Fractured Light',
    slug: 'fractured-light',
    description: 'Light ray patterns that break and scatter in unexpected directions.',
    story: 'Light refracted through a prism, each ray finding its own path across the canvas.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Silk', 'Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '6-8 months',
    dimensions: '8x10 ft',
    price: 75000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'light rays rug fractured asymmetrical',
    unsplashId: 'photo-1506439773649-6e0eb8cfb237'
  },
  {
    name: 'Tilted Horizon',
    slug: 'tilted-horizon',
    description: 'Horizon lines that refuse to stay level, creating dynamic tension.',
    story: 'The world tilted on its axis, creating a new perspective on traditional landscapes.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '9x12 ft',
    price: 52000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'tilted lines rug diagonal asymmetrical',
    unsplashId: 'photo-1555041469-a586c61ea9bc'
  },
  {
    name: 'Scattered Stones',
    slug: 'scattered-stones',
    description: 'Stone-like shapes scattered randomly across a neutral field.',
    story: 'Like stones scattered by ancient glaciers, each shape finds its own place in the pattern.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['living-room', 'bedroom'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '8x10 ft',
    price: 46000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'scattered stones rug irregular pattern',
    unsplashId: 'photo-1493663284031-b7e3aaa4c4bc'
  },
  {
    name: 'Unbalanced',
    slug: 'unbalanced',
    description: 'Deliberately off-center composition that creates visual intrigue.',
    story: 'Perfect balance is overrated. This piece finds beauty in the unexpected.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-5 months',
    dimensions: '6x9 ft',
    price: 50000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'unbalanced rug off center design',
    unsplashId: 'photo-1540979388789-6cee28a1cdc9'
  },
  {
    name: 'Shifting Sands',
    slug: 'shifting-sands',
    description: 'Undulating patterns that seem to move like wind-blown sand.',
    story: 'The desert sands never rest, always shifting, always creating new patterns.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool', 'Jute'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '8x10 ft',
    price: 48000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'sand dunes rug flowing pattern',
    unsplashId: 'photo-1571055107559-3e67626fa8be'
  },
  {
    name: 'Irregular Pulse',
    slug: 'irregular-pulse',
    description: 'Rhythmic patterns that skip beats and create syncopated beauty.',
    story: 'Like a jazz rhythm that breaks the rules, this pattern dances to its own beat.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-5 months',
    dimensions: '8x10 ft',
    price: 54000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'rhythmic pattern rug irregular pulse',
    unsplashId: 'photo-1578662996442-48f60103fc96'
  },
  {
    name: 'Gravity Defied',
    slug: 'gravity-defied',
    description: 'Floating elements that seem to defy the laws of physics.',
    story: 'In the world of textiles, gravity is just a suggestion, and beauty floats free.',
    styleCollections: ['asymmetrical-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Silk', 'Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '6-8 months',
    dimensions: '6x9 ft',
    price: 68000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'floating elements rug gravity defying',
    unsplashId: 'photo-1592838064575-70ed626d3a0e'
  },

  // Wool Rugs Collection (10 products)
  {
    name: 'Highland Wool',
    slug: 'highland-wool',
    description: 'Premium highland wool in natural earth tones with subtle texture.',
    story: 'From the highlands where sheep graze freely, this wool carries the essence of mountain air.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['living-room', 'bedroom'],
    materials: ['Highland Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '6-8 months',
    dimensions: '8x10 ft',
    price: 72000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'highland wool rug natural texture',
    unsplashId: 'photo-1449824913935-59a10b8d2000'
  },
  {
    name: 'Merino Meadow',
    slug: 'merino-meadow',
    description: 'Ultra-soft merino wool in meadow greens and soft browns.',
    story: 'The finest merino sheep graze in endless meadows, their wool becoming this luxurious carpet.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['bedroom'],
    materials: ['Merino Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-6 months',
    dimensions: '6x9 ft',
    price: 58000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'merino wool rug soft green meadow',
    unsplashId: 'photo-1513475382585-d06e58bcb0e0'
  },
  {
    name: 'Cozy Cabin',
    slug: 'cozy-cabin',
    description: 'Chunky wool weave in rustic patterns perfect for mountain retreats.',
    story: 'The warmth of a cabin fireplace woven into wool, bringing comfort to any space.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Chunky Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '8x10 ft',
    price: 48000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'chunky wool rug cabin rustic',
    unsplashId: 'photo-1586023492125-27b2c045efd7'
  },
  {
    name: 'Ocean Wool',
    slug: 'ocean-wool',
    description: 'Blue-dyed wool in wave patterns reminiscent of ocean currents.',
    story: 'The ocean\'s rhythm captured in wool, each wave a memory of distant shores.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['living-room', 'bedroom'],
    materials: ['Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '6-8 months',
    dimensions: '9x12 ft',
    price: 85000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'blue wool rug ocean waves pattern',
    unsplashId: 'photo-1540979388789-6cee28a1cdc9'
  },
  {
    name: 'Winter Warmth',
    slug: 'winter-warmth',
    description: 'Thick wool pile in warm ivory and cream tones for ultimate comfort.',
    story: 'When winter winds blow cold, this rug brings the warmth of a thousand sheep.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['bedroom', 'living-room'],
    materials: ['Thick Pile Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-5 months',
    dimensions: '8x10 ft',
    price: 62000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'thick wool rug ivory warm winter',
    unsplashId: 'photo-1631679706909-fae5c4064ae2'
  },
  {
    name: 'Desert Wool',
    slug: 'desert-wool',
    description: 'Naturally dyed wool in desert sand and terracotta tones.',
    story: 'The endless desert sands whisper their colors into this warm, embracing carpet.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Natural Wool'],
    weaveType: 'Flat-Weave',
    origin: 'Jaipur',
    craftTime: '3-4 months',
    dimensions: '10x14 ft',
    price: 55000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'desert wool rug sand terracotta natural',
    unsplashId: 'photo-1571055107559-3e67626fa8be'
  },
  {
    name: 'Forest Floor',
    slug: 'forest-floor',
    description: 'Mixed wool textures in forest greens and earth browns.',
    story: 'The forest floor where moss meets earth, recreated in the finest wool textures.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['living-room'],
    materials: ['Mixed Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-5 months',
    dimensions: '8x10 ft',
    price: 58000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'forest wool rug green brown natural',
    unsplashId: 'photo-1578662996442-48f60103fc96'
  },
  {
    name: 'Midnight Wool',
    slug: 'midnight-wool',
    description: 'Deep black wool with subtle charcoal variations for dramatic interiors.',
    story: 'The depth of midnight sky captured in the darkest, richest wool.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['living-room', 'dining-room'],
    materials: ['Black Wool'],
    weaveType: 'Hand-Knotted',
    origin: 'Kashmir',
    craftTime: '6-8 months',
    dimensions: '8x10 ft',
    price: 78000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'black wool rug midnight dark dramatic',
    unsplashId: 'photo-1493663284031-b7e3aaa4c4bc'
  },
  {
    name: 'Sunrise Wool',
    slug: 'sunrise-wool',
    description: 'Gradient wool from deep orange to soft yellow like a perfect sunrise.',
    story: 'Each morning brings new hope, and this rug captures that daily miracle in wool.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['bedroom'],
    materials: ['Gradient Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '4-5 months',
    dimensions: '6x9 ft',
    price: 52000,
    currency: 'INR',
    isFeatured: false,
    unsplashQuery: 'sunrise wool rug orange yellow gradient',
    unsplashId: 'photo-1506439773649-6e0eb8cfb237'
  },
  {
    name: 'Sheep Cloud',
    slug: 'sheep-cloud',
    description: 'Ultra-fluffy wool that feels like walking on clouds.',
    story: 'If clouds were made of sheep wool, this is how they would feel beneath your feet.',
    styleCollections: ['wool-rugs'],
    spaceCollections: ['bedroom'],
    materials: ['Fluffy Wool'],
    weaveType: 'Hand-Tufted',
    origin: 'Bhadohi',
    craftTime: '3-4 months',
    dimensions: '5x8 ft',
    price: 45000,
    currency: 'INR',
    isFeatured: true,
    unsplashQuery: 'fluffy wool rug cloud soft white',
    unsplashId: 'photo-1592838064575-70ed626d3a0e'
  }
];

/**
 * Upload image from Unsplash to Firebase Storage
 */
async function uploadUnsplashImage(productSlug, unsplashId, imageIndex = 0) {
  try {
    const imageUrl = `https://images.unsplash.com/${unsplashId}?w=800&h=600&fit=crop&crop=center`;
    console.log(`   📸 Downloading image from Unsplash: ${imageUrl}`);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const imageBuffer = await response.buffer();
    const imagePath = `products/${productSlug}/image-${imageIndex}.jpg`;
    const imageRef = ref(storage, imagePath);
    
    console.log(`   📤 Uploading to Firebase Storage: ${imagePath}`);
    const snapshot = await uploadBytes(imageRef, imageBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`   ✅ Image uploaded successfully`);
    return {
      url: downloadURL,
      alt: `${productSlug} rug - view ${imageIndex + 1}`,
      storageRef: imagePath,
      isMain: imageIndex === 0,
      sortOrder: imageIndex
    };
  } catch (error) {
    console.warn(`   ⚠️  Failed to upload image for ${productSlug}:`, error.message);
    // Fallback to Unsplash URL
    return {
      url: `https://images.unsplash.com/${unsplashId}?w=800&h=600&fit=crop&crop=center`,
      alt: `${productSlug} rug - view ${imageIndex + 1}`,
      storageRef: '',
      isMain: imageIndex === 0,
      sortOrder: imageIndex
    };
  }
}

/**
 * Create product object with proper relationships
 */
function createProductObject(productData, images) {
  return {
    id: productData.slug,
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    story: productData.story,
    images: images,
    specifications: {
      materials: productData.materials,
      weaveType: productData.weaveType,
      availableSizes: [
        { dimensions: productData.dimensions, isCustom: false },
        { dimensions: 'Custom Size', isCustom: true }
      ],
      origin: productData.origin,
      craftTime: productData.craftTime
    },
    collections: [...productData.styleCollections, ...productData.spaceCollections],
    roomTypes: productData.spaceCollections,
    price: {
      isVisible: true,
      startingFrom: productData.price,
      currency: productData.currency
    },
    seoTitle: `${productData.name} Handcrafted Rug | Equza Living Co.`,
    seoDescription: productData.description,
    isActive: true,
    isFeatured: productData.isFeatured,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Update collection with product relationships
 */
async function updateCollectionWithProducts() {
  console.log('\n🔗 Updating collection-product relationships...');
  
  // Group products by collection
  const collectionProducts = {};
  
  PRODUCTS_DATA.forEach(product => {
    [...product.styleCollections, ...product.spaceCollections].forEach(collectionSlug => {
      if (!collectionProducts[collectionSlug]) {
        collectionProducts[collectionSlug] = [];
      }
      collectionProducts[collectionSlug].push(product.slug);
    });
  });
  
  // Update each collection
  for (const [collectionSlug, productSlugs] of Object.entries(collectionProducts)) {
    try {
      const collectionRef = doc(db, 'collections', collectionSlug);
      await setDoc(collectionRef, {
        productIds: productSlugs,
        updatedAt: new Date()
      }, { merge: true });
      
      console.log(`   ✅ Updated ${collectionSlug} with ${productSlugs.length} products`);
    } catch (error) {
      console.warn(`   ⚠️  Failed to update collection ${collectionSlug}:`, error.message);
    }
  }
}

/**
 * Main seeding function
 */
async function seedComprehensiveData() {
  console.log('🌱 Starting comprehensive data seeding with 50 products...\n');
  
  try {
    // Seed products in batches
    const batchSize = 10;
    let productCount = 0;
    
    for (let i = 0; i < PRODUCTS_DATA.length; i += batchSize) {
      const batch = PRODUCTS_DATA.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1} (products ${i + 1}-${Math.min(i + batchSize, PRODUCTS_DATA.length)})...`);
      
      for (const productData of batch) {
        try {
          console.log(`\n🏺 Creating product: ${productData.name}`);
          
          // Upload images
          const images = [];
          const mainImage = await uploadUnsplashImage(productData.slug, productData.unsplashId, 0);
          images.push(mainImage);
          
          // Create additional variation images for featured products
          if (productData.isFeatured && productData.unsplashId) {
            const detailImage = await uploadUnsplashImage(productData.slug, productData.unsplashId, 1);
            images.push(detailImage);
          }
          
          // Create product object
          const productObject = createProductObject(productData, images);
          
          // Save to Firestore
          console.log(`   💾 Saving to Firestore...`);
          await setDoc(doc(db, 'products', productData.slug), productObject);
          
          productCount++;
          console.log(`   ✅ Product ${productCount}/50 created successfully`);
          
          // Small delay to avoid overwhelming the services
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`   ❌ Failed to create product ${productData.name}:`, error.message);
        }
      }
    }
    
    // Update collection relationships
    await updateCollectionWithProducts();
    
    console.log('\n🎉 Comprehensive data seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Products created: ${productCount}/50`);
    console.log(`   • Style collections: ${Object.keys(STYLE_COLLECTIONS).length}`);
    console.log(`   • Space collections: ${Object.keys(SPACE_COLLECTIONS).length}`);
    console.log(`   • Featured products: ${PRODUCTS_DATA.filter(p => p.isFeatured).length}`);
    
  } catch (error) {
    console.error('\n❌ Error during comprehensive seeding:', error.message);
  }
}

// Run the seeding
seedComprehensiveData();