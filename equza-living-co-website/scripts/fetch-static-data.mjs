/**
 * Script to fetch all public-facing data from Firestore and save it locally
 * for Static Site Generation (SSG).
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const STATIC_DATA_PATH = join(PROJECT_ROOT, 'src', 'data', 'static-data.json');

// Initialize Firebase Admin using environment variables or service account file
if (!getApps().length) {
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
    } 
    // Fallback to service account file (for local development)
    else {
      const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || join(PROJECT_ROOT, 'firebase-service-account.json');
      const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
      credential = cert(serviceAccount);
      if (!projectId) {
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = serviceAccount.project_id;
      }
    }
    
    initializeApp({
      credential,
      projectId: projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (e) {
    console.error('⚠️  Warning: Could not initialize Firebase Admin.', e.message);
    console.error('Ensure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are set, or firebase-service-account.json exists.');
    console.error('Skipping static data pre-fetch. The app will fetch data from Firestore at runtime.');
    process.exit(0); // Exit gracefully - this is optional
  }
}

const db = getFirestore();

/**
 * Fetches all documents from a collection.
 * @param {string} collectionName
 * @returns {Promise<Array<Object>>}
 */
async function fetchCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Fetches a single document.
 * @param {string} collectionName
 * @param {string} docId
 * @returns {Promise<Object | null>}
 */
async function fetchDocument(collectionName, docId) {
  const doc = await db.collection(collectionName).doc(docId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function main() {
  console.log('--- Starting Static Data Pre-fetch from Firestore ---');

  try {
    // 1. Fetch all required data concurrently
    const [
      homePageData,
      collections,
      weaveTypes,
      products,
      siteSettings,
    ] = await Promise.all([
      fetchDocument('pages', 'home'),
      fetchCollection('collections'),
      fetchCollection('weaveTypes'),
      fetchCollection('products'),
      fetchDocument('settings', 'site'),
    ]);

    // 2. Structure the data for the static file
    const staticData = {
      homePageData,
      collections,
      weaveTypes,
      products,
      siteSettings,
      // Add other necessary data here
    };

    // 3. Write the data to the local JSON file
    await fs.writeFile(
      STATIC_DATA_PATH,
      JSON.stringify(staticData, null, 2),
      'utf-8'
    );

    console.log(`✅ Static data successfully written to: ${STATIC_DATA_PATH}`);
    console.log('--- Static Data Pre-fetch Complete ---');

  } catch (error) {
    console.error('⚠️  Warning: Error during static data pre-fetch (continuing build):', error.message);
    console.error('The app will fetch data from Firestore at runtime instead.');
    // Don't exit with error code - this is an optional optimization step
    // The app will work by fetching from Firestore at runtime
  }
}

main();