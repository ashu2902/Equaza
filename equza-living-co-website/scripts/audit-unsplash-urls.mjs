#!/usr/bin/env node

/**
 * Audit Script: Find All Unsplash URLs in Firebase
 * 
 * This script scans all Firebase collections to identify documents
 * containing Unsplash image URLs that need to be migrated.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env.local') });

// Firebase config (using environment variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase config
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  console.error('💡 Make sure .env.local file exists with all Firebase config values');
  process.exit(1);
}

// Initialize Firebase
console.log('🔧 Initializing Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log('✅ Firebase initialized successfully');

// Collections to audit
const COLLECTIONS_TO_AUDIT = [
  'style-collections',
  'space-collections', 
  'products',
  'homepage-data',
  'featured-products',
  'testimonials',
  'blog-posts'
];

/**
 * Check if a value contains Unsplash URLs
 */
function findUnsplashUrls(obj, path = '') {
  const results = [];
  
  if (typeof obj === 'string') {
    if (obj.includes('images.unsplash.com')) {
      results.push({
        path,
        url: obj
      });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      results.push(...findUnsplashUrls(item, `${path}[${index}]`));
    });
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;
      results.push(...findUnsplashUrls(value, newPath));
    });
  }
  
  return results;
}

/**
 * Audit a single collection
 */
async function auditCollection(collectionName) {
  console.log(`🔍 Auditing collection: ${collectionName}`);
  
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const results = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const unsplashUrls = findUnsplashUrls(data);
      
      if (unsplashUrls.length > 0) {
        results.push({
          documentId: doc.id,
          collection: collectionName,
          unsplashUrls: unsplashUrls
        });
      }
    });
    
    console.log(`   📊 Found ${results.length} documents with Unsplash URLs`);
    return results;
    
  } catch (error) {
    console.log(`   ❌ Error auditing ${collectionName}:`, error.message);
    return [];
  }
}

/**
 * Main audit function
 */
async function runAudit() {
  console.log('🚀 Starting Unsplash URL Audit...\n');
  
  const allResults = [];
  let totalDocuments = 0;
  let totalUrls = 0;
  
  for (const collectionName of COLLECTIONS_TO_AUDIT) {
    const results = await auditCollection(collectionName);
    allResults.push(...results);
    totalDocuments += results.length;
    totalUrls += results.reduce((sum, doc) => sum + doc.unsplashUrls.length, 0);
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalCollectionsAudited: COLLECTIONS_TO_AUDIT.length,
      totalDocumentsWithUnsplash: totalDocuments,
      totalUnsplashUrls: totalUrls
    },
    results: allResults,
    migrationPlan: {
      estimatedDownloadSize: `${totalUrls * 2}MB (estimated)`,
      estimatedMigrationTime: `${Math.ceil(totalUrls / 10)} minutes`,
      requiredStorageSpace: `${totalUrls * 3}MB (including optimized versions)`
    }
  };
  
  // Save report
  const reportPath = join(__dirname, '..', 'unsplash-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Display summary
  console.log('\n📋 AUDIT SUMMARY');
  console.log('================');
  console.log(`Collections audited: ${report.summary.totalCollectionsAudited}`);
  console.log(`Documents with Unsplash URLs: ${report.summary.totalDocumentsWithUnsplash}`);
  console.log(`Total Unsplash URLs found: ${report.summary.totalUnsplashUrls}`);
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  if (totalUrls > 0) {
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Review the detailed report');
    console.log('2. Run: npm run migrate:images');
    console.log('3. Run: npm run update:image-refs');
    console.log('4. Remove Unsplash from next.config.ts');
  } else {
    console.log('\n✅ No Unsplash URLs found! Your app is already using Firebase Storage.');
  }
  
  return report;
}

// Run the audit when script is executed directly
console.log('🚀 Starting audit...');
runAudit()
  .then(() => {
    console.log('\n✅ Audit completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Audit failed:', error);
    console.error(error.stack);
    process.exit(1);
  });

export { runAudit };