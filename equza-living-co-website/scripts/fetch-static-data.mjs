/**
 * Script to fetch all public-facing data from Firestore and save it locally
 * for Static Site Generation (SSG).
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

// --- Configuration ---
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const STATIC_DATA_PATH = join(PROJECT_ROOT, 'src', 'data', 'static-data.json');

/**
 * Initialize Firebase Admin SDK
 * Returns null if initialization fails (credentials not available)
 */
function initializeFirebase() {
  if (getApps().length > 0) {
    return getFirestore(); // Already initialized
  }

  try {
    let credential;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    // Try environment variables first (for Vercel/production)
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      credential = cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      });
      console.log('✅ Using Firebase Admin credentials from environment variables');
    } 
    // Fallback to service account file (for local development)
    else {
      const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || join(PROJECT_ROOT, 'firebase-service-account.json');
      try {
        const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
        credential = cert(serviceAccount);
        if (!projectId) {
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = serviceAccount.project_id;
        }
        console.log('✅ Using Firebase Admin credentials from service account file');
      } catch (fileError) {
        throw new Error(`Service account file not found at ${SERVICE_ACCOUNT_PATH}`);
      }
    }
    
    if (!projectId) {
      throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is required');
    }
    
    initializeApp({
      credential,
      projectId: projectId,
    });
    
    return getFirestore();
  } catch (e) {
    console.warn('⚠️  Could not initialize Firebase Admin:', e.message);
    console.warn('   Static data pre-fetch will be skipped.');
    console.warn('   The app will fetch data from Firestore at runtime instead.');
    return null;
  }
}

/**
 * Fetches all documents from a collection.
 * @param {Firestore} db - Firestore instance
 * @param {string} collectionName
 * @returns {Promise<Array<Object>>}
 */
async function fetchCollection(db, collectionName) {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Fetches a single document.
 * @param {Firestore} db - Firestore instance
 * @param {string} collectionName
 * @param {string} docId
 * @returns {Promise<Object | null>}
 */
async function fetchDocument(db, collectionName, docId) {
  const doc = await db.collection(collectionName).doc(docId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

/**
 * Generates a hash/checksum of the data to detect changes
 */
function generateDataHash(data) {
  const dataString = JSON.stringify(data, null, 0); // No formatting for consistent hash
  return createHash('sha256').update(dataString).digest('hex').substring(0, 16);
}

/**
 * Validates that the fetched data is complete and has expected structure
 */
function validateData(data) {
  const warnings = [];
  const errors = [];

  // Check homepage data
  if (!data.homePageData) {
    warnings.push('Homepage data is missing');
  } else if (!data.homePageData.hero || data.homePageData.hero.length === 0) {
    warnings.push('Homepage hero section is missing or empty');
  }

  // Check collections
  if (!Array.isArray(data.collections)) {
    errors.push('Collections must be an array');
  } else {
    const activeCollections = data.collections.filter(c => c.isActive !== false);
    if (activeCollections.length === 0) {
      warnings.push('No active collections found');
    }
    // Validate collection structure
    data.collections.forEach((col, index) => {
      if (!col.name || !col.slug) {
        errors.push(`Collection at index ${index} is missing name or slug`);
      }
    });
  }

  // Check weave types
  if (!Array.isArray(data.weaveTypes)) {
    errors.push('Weave types must be an array');
  } else {
    const activeWeaveTypes = data.weaveTypes.filter(w => w.isActive !== false);
    if (activeWeaveTypes.length === 0) {
      warnings.push('No active weave types found');
    }
  }

  // Check products
  if (!Array.isArray(data.products)) {
    errors.push('Products must be an array');
  } else {
    const activeProducts = data.products.filter(p => p.isActive !== false);
    if (activeProducts.length === 0) {
      warnings.push('No active products found');
    }
    // Validate product structure
    data.products.forEach((product, index) => {
      if (!product.name || !product.slug) {
        errors.push(`Product at index ${index} is missing name or slug`);
      }
      if (!product.images || product.images.length === 0) {
        warnings.push(`Product "${product.name || product.id}" has no images`);
      }
    });
  }

  return { warnings, errors, isValid: errors.length === 0 };
}

/**
 * Compares new data with existing data to detect changes
 */
async function compareWithExisting(newData) {
  try {
    const existingContent = await fs.readFile(STATIC_DATA_PATH, 'utf-8');
    const existingData = JSON.parse(existingContent);
    
    const existingHash = existingData._metadata?.dataHash;
    const newHash = generateDataHash(newData);
    
    if (existingHash && existingHash === newHash) {
      return {
        hasChanged: false,
        message: 'Data unchanged since last build',
        existingHash,
        newHash,
      };
    }
    
    // Count changes
    const changes = {
      collections: {
        old: existingData.collections?.length || 0,
        new: newData.collections?.length || 0,
      },
      products: {
        old: existingData.products?.length || 0,
        new: newData.products?.length || 0,
      },
      weaveTypes: {
        old: existingData.weaveTypes?.length || 0,
        new: newData.weaveTypes?.length || 0,
      },
    };
    
    return {
      hasChanged: true,
      message: 'Data has changed since last build',
      existingHash,
      newHash,
      changes,
    };
  } catch (error) {
    // File doesn't exist or is invalid - this is the first build
    return {
      hasChanged: true,
      message: 'First build - no existing data to compare',
      existingHash: null,
      newHash: generateDataHash(newData),
    };
  }
}

async function main() {
  console.log('--- Starting Static Data Pre-fetch from Firestore ---');

  // Try to initialize Firebase
  const db = initializeFirebase();
  
  if (!db) {
    console.log('ℹ️  Firebase credentials not available. Skipping static data pre-fetch.');
    console.log('   The app will fetch data from Firestore at runtime.');
    // Create an empty file so optimize-static-images.mjs doesn't error
    await fs.writeFile(STATIC_DATA_PATH, JSON.stringify({}, null, 2), 'utf-8');
    return;
  }

  try {
    console.log('📥 Fetching data from Firestore...');
    
    // 1. Fetch all required data concurrently
    const [
      homePageData,
      collections,
      weaveTypes,
      products,
      siteSettings,
    ] = await Promise.all([
      fetchDocument(db, 'pages', 'home'),
      fetchCollection(db, 'collections'),
      fetchCollection(db, 'weaveTypes'),
      fetchCollection(db, 'products'),
      fetchDocument(db, 'settings', 'site'),
    ]);

    // 2. Structure the data for the static file
    const staticData = {
      homePageData,
      collections: collections || [],
      weaveTypes: weaveTypes || [],
      products: products || [],
      siteSettings,
    };

    // 3. Validate the data
    console.log('🔍 Validating fetched data...');
    const validation = validateData(staticData);
    
    if (validation.errors.length > 0) {
      console.error('❌ Data validation errors:');
      validation.errors.forEach(error => console.error(`   - ${error}`));
      throw new Error('Data validation failed');
    }
    
    if (validation.warnings.length > 0) {
      console.warn('⚠️  Data validation warnings:');
      validation.warnings.forEach(warning => console.warn(`   - ${warning}`));
    } else {
      console.log('✅ Data validation passed');
    }

    // 4. Compare with existing data to detect changes
    console.log('🔄 Comparing with existing data...');
    const comparison = await compareWithExisting(staticData);
    console.log(`   ${comparison.message}`);
    if (comparison.hasChanged && comparison.changes) {
      console.log('   Changes detected:');
      if (comparison.changes.collections.old !== comparison.changes.collections.new) {
        console.log(`     - Collections: ${comparison.changes.collections.old} → ${comparison.changes.collections.new}`);
      }
      if (comparison.changes.products.old !== comparison.changes.products.new) {
        console.log(`     - Products: ${comparison.changes.products.old} → ${comparison.changes.products.new}`);
      }
      if (comparison.changes.weaveTypes.old !== comparison.changes.weaveTypes.new) {
        console.log(`     - Weave Types: ${comparison.changes.weaveTypes.old} → ${comparison.changes.weaveTypes.new}`);
      }
    }

    // 5. Generate data hash for change detection
    const dataHash = generateDataHash(staticData);
    
    // 6. Add metadata about when this was generated
    staticData._metadata = {
      generatedAt: new Date().toISOString(),
      buildTime: true,
      dataHash,
      recordCounts: {
        collections: staticData.collections.length,
        products: staticData.products.length,
        weaveTypes: staticData.weaveTypes.length,
        activeCollections: staticData.collections.filter(c => c.isActive !== false).length,
        activeProducts: staticData.products.filter(p => p.isActive !== false).length,
        activeWeaveTypes: staticData.weaveTypes.filter(w => w.isActive !== false).length,
      },
      previousHash: comparison.existingHash || null,
      hasChanged: comparison.hasChanged,
    };

    // 7. Ensure the data directory exists
    const dataDir = join(PROJECT_ROOT, 'src', 'data');
    await fs.mkdir(dataDir, { recursive: true });

    // 8. Write the data to the local JSON file (creates or updates)
    await fs.writeFile(
      STATIC_DATA_PATH,
      JSON.stringify(staticData, null, 2),
      'utf-8'
    );

    console.log(`✅ Static data successfully written to: ${STATIC_DATA_PATH}`);
    console.log(`   - Homepage data: ${homePageData ? '✓' : '✗'}`);
    console.log(`   - Collections: ${staticData.collections.length} (${staticData._metadata.recordCounts.activeCollections} active)`);
    console.log(`   - Weave Types: ${staticData.weaveTypes.length} (${staticData._metadata.recordCounts.activeWeaveTypes} active)`);
    console.log(`   - Products: ${staticData.products.length} (${staticData._metadata.recordCounts.activeProducts} active)`);
    console.log(`   - Site Settings: ${siteSettings ? '✓' : '✗'}`);
    console.log(`   - Data Hash: ${dataHash}`);
    console.log('--- Static Data Pre-fetch Complete ---');

  } catch (error) {
    console.error('❌ Error during static data pre-fetch:', error.message);
    console.error('   The app will fetch data from Firestore at runtime instead.');
    // Create an empty file so optimize-static-images.mjs doesn't error
    await fs.writeFile(STATIC_DATA_PATH, JSON.stringify({}, null, 2), 'utf-8');
  }
}

main();