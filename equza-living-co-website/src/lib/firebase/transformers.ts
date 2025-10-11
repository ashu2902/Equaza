/**
 * Safe Data Transformers
 * 
 * Transform raw Firebase data into guaranteed-safe data structures.
 * Handle all edge cases: null, undefined, empty arrays, invalid data.
 */

import { DocumentSnapshot } from 'firebase/firestore';
import { 
  SafeProduct, 
  SafeCollection, 
  SafeWeaveType, 
  SafeImage, 
  SafeProductSize,
  SafeProductSpecifications,
  SafeProductPrice,
  FALLBACK_PRODUCT_IMAGE, 
  FALLBACK_COLLECTION_IMAGE 
} from '@/types/safe';

/**
 * Convert Firebase Timestamp or any date-like value to ISO string
 */
function transformTimestamp(timestamp: any): string {
  if (!timestamp) return new Date().toISOString();
  
  // Firebase Timestamp object
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  
  // JavaScript Date object
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  
  // String date
  if (typeof timestamp === 'string') {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }
  
  // Fallback
  return new Date().toISOString();
}

/**
 * Transform raw image data into SafeImage with validation
 */
function transformImage(rawImage: any): SafeImage | null {
  if (!rawImage || typeof rawImage !== 'object') return null;
  
  // Required fields validation
  if (!rawImage.url || typeof rawImage.url !== 'string') return null;
  if (!rawImage.alt || typeof rawImage.alt !== 'string') return null;
  
  return {
    url: rawImage.url.trim(),
    alt: rawImage.alt.trim(),
    storageRef: rawImage.storageRef || '',
    isMain: Boolean(rawImage.isMain),
    sortOrder: typeof rawImage.sortOrder === 'number' ? rawImage.sortOrder : 0
  };
}

/**
 * Transform raw product size data
 */
function transformProductSize(rawSize: any): SafeProductSize | null {
  if (!rawSize || typeof rawSize !== 'object') return null;
  if (!rawSize.dimensions || typeof rawSize.dimensions !== 'string') return null;
  
  return {
    dimensions: rawSize.dimensions.trim(),
    isCustom: Boolean(rawSize.isCustom)
  };
}

/**
 * Transform product specifications with safe defaults
 */
function transformSpecifications(rawSpecs: any): SafeProductSpecifications {
  if (!rawSpecs || typeof rawSpecs !== 'object') {
    return {
      materials: [],
      weaveType: 'Hand-Knotted',
      availableSizes: [],
      origin: '',
      craftTime: ''
    };
  }
  
  // Transform available sizes
  const rawSizes = Array.isArray(rawSpecs.availableSizes) ? rawSpecs.availableSizes : [];
  const availableSizes = rawSizes
    .map(transformProductSize)
    .filter((size: SafeProductSize | null): size is SafeProductSize => size !== null);
  
  return {
        materials: Array.isArray(rawSpecs.materials)
      ? rawSpecs.materials.filter((m: any) => typeof m === 'string' && m.trim().length > 0)
      : [],
    weaveType: rawSpecs.weaveType || 'Hand-Knotted',
    availableSizes,
    origin: rawSpecs.origin || '',
    craftTime: rawSpecs.craftTime || ''
  };
}

/**
 * Transform product price with safe defaults
 */
function transformPrice(rawPrice: any): SafeProductPrice {
  if (!rawPrice || typeof rawPrice !== 'object') {
    return {
      isVisible: false,
      startingFrom: 0,
      currency: 'USD'
    };
  }
  
  return {
    isVisible: Boolean(rawPrice.isVisible),
    startingFrom: typeof rawPrice.startingFrom === 'number' ? rawPrice.startingFrom : 0,
    currency: rawPrice.currency || 'USD'
  };
}

/**
 * Transform Firebase document to SafeProduct
 * Returns null if document is invalid or missing required fields
 */
export function transformProduct(doc: DocumentSnapshot): SafeProduct | null {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  if (!data) return null;
  
  // Validate required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) return null;
  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length === 0) return null;
  
  // Transform images with guaranteed fallback
  const rawImages = Array.isArray(data.images) ? data.images : [];
  const safeImages = rawImages
    .map(transformImage)
    .filter((img): img is SafeImage => img !== null);
  
  // Ensure at least one image always exists
  if (safeImages.length === 0) {
    safeImages.push({
      ...FALLBACK_PRODUCT_IMAGE,
      alt: `${data.name} - Handcrafted rug`
    });
  }
  
  // Ensure exactly one main image exists
  const mainImages = safeImages.filter(img => img.isMain);
  if (mainImages.length === 0 && safeImages.length > 0) {
    if (safeImages[0]) {
      safeImages[0].isMain = true;
    }
  } else if (mainImages.length > 1) {
    // Keep only the first main image, make others non-main
    let foundFirst = false;
    safeImages.forEach(img => {
      if (img.isMain && foundFirst) {
        img.isMain = false;
      } else if (img.isMain && !foundFirst) {
        foundFirst = true;
      }
    });
  }
  
  // Sort images by sortOrder, main image first
  safeImages.sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return a.sortOrder - b.sortOrder;
  });
  
  return {
    id: doc.id,
    name: data.name.trim(),
    slug: data.slug.trim(),
    description: data.description || '',
    story: data.story || '',
    images: safeImages,
    specifications: transformSpecifications(data.specifications),
    collections: Array.isArray(data.collections) 
      ? data.collections.filter(c => typeof c === 'string' && c.trim().length > 0)
      : [],
    // roomTypes removed
    price: transformPrice(data.price),
    seoTitle: data.seoTitle || data.name,
    seoDescription: data.seoDescription || data.description || '',
    isActive: data.isActive !== false, // Default to true
    isFeatured: Boolean(data.isFeatured),
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
    createdAt: transformTimestamp(data.createdAt),
    updatedAt: transformTimestamp(data.updatedAt)
  };
}

/**
 * Transform Firebase document to SafeCollection
 * Returns null if document is invalid or missing required fields
 */
export function transformCollection(doc: DocumentSnapshot): SafeCollection | null {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  if (!data) return null;
  
  // Validate required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) return null;
  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length === 0) return null;
  
  // Transform hero image with guaranteed fallback
  let heroImage: SafeImage;
  const transformedHero = transformImage(data.heroImage);
  
  if (transformedHero) {
    heroImage = transformedHero;
  } else {
    heroImage = {
      ...FALLBACK_COLLECTION_IMAGE,
      alt: `${data.name} collection - Handcrafted rugs`
    };
  }
  
  // Validate and normalize type
  const type = data.type === 'space' ? 'space' : 'style';
  
  return {
    id: doc.id,
    name: data.name.trim(),
    slug: data.slug.trim(),
    description: data.description || '',
    type,
    heroImage,
    seoTitle: data.seoTitle || data.name,
    seoDescription: data.seoDescription || data.description || '',
    isActive: data.isActive !== false, // Default to true
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
    productIds: Array.isArray(data.productIds) 
      ? data.productIds.filter(id => typeof id === 'string' && id.trim().length > 0)
      : [],
    createdAt: transformTimestamp(data.createdAt),
    updatedAt: transformTimestamp(data.updatedAt)
  };
}

/**
 * Transform Firebase document to SafeWeaveType
 * Returns null if document is invalid or missing required fields
 */
export function transformWeaveType(doc: DocumentSnapshot): SafeWeaveType | null {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  if (!data) return null;
  
  // Validate required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) return null;
  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length === 0) return null;
  
  // Transform image with guaranteed fallback
  let image: SafeImage;
  const transformedImage = transformImage(data.image);
  
  if (transformedImage) {
    image = transformedImage;
  } else {
    image = {
      ...FALLBACK_PRODUCT_IMAGE,
      alt: `${data.name} weave type`
    };
  }
  
  return {
    id: doc.id,
    name: data.name.trim(),
    slug: data.slug.trim(),
    image,
    isActive: data.isActive !== false, // Default to true
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
    createdAt: transformTimestamp(data.createdAt),
    updatedAt: transformTimestamp(data.updatedAt)
  };
}

/**
 * Batch transform multiple documents with error isolation
 * If one document fails, others still succeed
 */
export function transformProducts(docs: DocumentSnapshot[]): SafeProduct[] {
  return docs
    .map(doc => {
      try {
        return transformProduct(doc);
      } catch (error) {
        console.error(`Error transforming product ${doc.id}:`, error);
        return null;
      }
    })
    .filter((product): product is SafeProduct => product !== null);
}

export function transformCollections(docs: DocumentSnapshot[]): SafeCollection[] {
  return docs
    .map(doc => {
      try {
        return transformCollection(doc);
      } catch (error) {
        console.error(`Error transforming collection ${doc.id}:`, error);
        return null;
      }
    })
    .filter((collection): collection is SafeCollection => collection !== null);
}

export function transformWeaveTypes(docs: DocumentSnapshot[]): SafeWeaveType[] {
  return docs
    .map(doc => {
      try {
        return transformWeaveType(doc);
      } catch (error) {
        console.error(`Error transforming weave type ${doc.id}:`, error);
        return null;
      }
    })
    .filter((weaveType): weaveType is SafeWeaveType => weaveType !== null);
}