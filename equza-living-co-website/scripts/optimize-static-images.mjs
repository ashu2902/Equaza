import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';
import sharp from 'sharp';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'optimized-assets');
const STATIC_DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'static-image-map.json');

// Define the target widths for responsive images
const TARGET_WIDTHS = [640, 1080, 1920];

const STATIC_DATA_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'static-data.json');

/**
 * Reads the static data file and extracts all remote image URLs.
 * NOTE: This is a simplified extraction and should be expanded for production.
 */
async function extractImageUrls() {
  try {
    const fileContent = await fs.readFile(STATIC_DATA_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    const urls = [];

    // 1. Homepage Data (Hero, Room Highlight, Craftsmanship, Lookbook)
    const home = data.homePageData;
    if (home?.hero?.[0]?.image?.src) {
      urls.push({ id: 'homepage-hero', url: home.hero[0].image.src, filename: 'homepage-hero' });
    }
    if (home?.roomHighlight?.image?.src) {
      urls.push({ id: 'room-highlight', url: home.roomHighlight.image.src, filename: 'room-highlight' });
    }
    if (home?.craftsmanship?.image?.src) {
      urls.push({ id: 'craftsmanship-image', url: home.craftsmanship.image.src, filename: 'craftsmanship-image' });
    }
    if (home?.lookbook?.thumbnail?.src) {
      urls.push({ id: 'lookbook-thumbnail', url: home.lookbook.thumbnail.src, filename: 'lookbook-thumbnail' });
    }

    // 2. Collections
    data.collections?.forEach((col, index) => {
      if (col.heroImage?.url) {
        urls.push({ id: `collection-${col.id}`, url: col.heroImage.url, filename: `collection-${col.slug}` });
      }
    });

    // 3. Weave Types
    data.weaveTypes?.forEach((weave, index) => {
      if (weave.image?.url) {
        urls.push({ id: `weave-type-${weave.id}`, url: weave.image.url, filename: `weave-type-${weave.slug}` });
      }
    });

    // 4. Products (Only featured products for now, to limit build time)
    data.products?.filter(p => p.isFeatured)?.forEach((product, index) => {
      product.images?.forEach((img, imgIndex) => {
        if (img.isMain && img.url) {
          urls.push({ id: `product-${product.id}-main`, url: img.url, filename: `product-${product.slug}-main` });
        }
      });
    });

    return urls;
  } catch (error) {
    console.error('❌ Error extracting image URLs from static data. Did you run fetch-static-data.mjs?', error.message);
    return [];
  }
}

/**
 * Downloads a remote image and returns its buffer.
 * @param {string} url The remote URL of the image.
 * @returns {Promise<Buffer>} The image buffer.
 */
async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Optimizes an image buffer into multiple responsive WebP files.
 * @param {Buffer} buffer The image buffer.
 * @param {string} filename The base filename (e.g., 'homepage-hero').
 * @returns {Promise<string | null>} The public path of the largest generated image, or null.
 */
async function optimizeImage(buffer, filename) {
  const sharpImage = sharp(buffer);
  const metadata = await sharpImage.metadata();
  let largestPublicPath = null;

  if (!metadata.width) {
    console.warn(`Skipping ${filename}: Could not determine image width.`);
    return null;
  }

  console.log(`Processing ${filename} (Original width: ${metadata.width}px)`);

  // Sort widths descending to ensure we track the largest one successfully generated
  const sortedWidths = [...TARGET_WIDTHS].sort((a, b) => b - a);

  for (const width of sortedWidths) {
    if (width > metadata.width) {
      continue;
    }

    const outputFileName = `${filename}-${width}w.webp`;
    const outputFilePath = path.join(OUTPUT_DIR, outputFileName);
    const publicPath = `/optimized-assets/${outputFileName}`;

    await sharpImage
      .clone()
      .resize(width)
      .webp({ quality: 80 })
      .toFile(outputFilePath);

    console.log(`  -> Generated ${outputFileName}`);

    // Since we are iterating descending, the first one successfully generated is the largest
    if (!largestPublicPath) {
      largestPublicPath = publicPath;
    }
  }
  return largestPublicPath;
}

async function main() {
  console.log('--- Starting Static Image Optimization ---');

  try {
    // 1. Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`Output directory created: ${OUTPUT_DIR}`);

    const staticImageMap = {};

    // 2. Process all remote images
    const remoteImageUrls = await extractImageUrls();
    console.log(`Found ${remoteImageUrls.length} remote images to optimize.`);

    for (const { id, url, filename } of remoteImageUrls) {
      try {
        console.log(`\n[${id}] Downloading image from: ${url}`);
        const buffer = await downloadImage(url);
        const staticPath = await optimizeImage(buffer, filename);
        
        if (staticPath) {
          staticImageMap[id] = staticPath;
        }
      } catch (error) {
        console.error(`\n[${id}] Error processing image:`, error.message);
      }
    }

    // 3. Write the static image map to a JSON file
    await fs.writeFile(
      STATIC_DATA_PATH,
      JSON.stringify(staticImageMap, null, 2),
      'utf-8'
    );
    console.log(`\nStatic image map written to: ${STATIC_DATA_PATH}`);

    console.log('\n--- Static Image Optimization Complete ---');
  } catch (error) {
    console.error('⚠️  Warning: Error during optimization process (continuing build):', error.message);
    // Don't exit with error code - this is an optional optimization step
    // The app will work without optimized images
  }
}

main();
