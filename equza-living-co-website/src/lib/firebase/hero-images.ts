/**
 * Hero Images Data Layer
 * Firestore operations for page hero images with caching
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

import { db } from './config';

export interface HeroImageData {
  imageUrl: string;
  altText: string;
  isActive: boolean;
  uploadedAt: any;
  uploadedBy: string;
}

export interface AllHeroImages {
  'our-story': HeroImageData;
  'craftsmanship': HeroImageData;
  'trade': HeroImageData;
  'customize': HeroImageData;
  updatedAt?: any;
}

// Document ID for hero images
const HERO_IMAGES_DOC_ID = 'hero-images';

/**
 * Get all hero images (client-safe, no caching)
 */
export const getHeroImages = async (): Promise<AllHeroImages | null> => {
  try {
    const docRef = doc(db, 'settings', HERO_IMAGES_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    const convertedData = { ...data };
    
    // Convert Firestore Timestamps to ISO strings for client components
    Object.keys(convertedData).forEach(key => {
      if (convertedData[key] && typeof convertedData[key] === 'object') {
        if (convertedData[key].uploadedAt && convertedData[key].uploadedAt.toDate) {
          convertedData[key].uploadedAt = convertedData[key].uploadedAt.toDate().toISOString();
        }
      }
    });
    
    return convertedData as AllHeroImages;
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return null;
  }
};

/**
 * Get hero images with fallback defaults
 */
export const getHeroImagesWithDefaults = async (): Promise<AllHeroImages> => {
  try {
    const heroImages = await getHeroImages();
    
    if (heroImages) {
      return heroImages;
    }
    
    // Auto-initialize if no data exists
    return getStaticDefaults();
  } catch (error) {
    console.warn('Error getting hero images, falling back to static:', error);
    return getStaticDefaults();
  }
};

/**
 * Get static default hero images (always works)
 */
function getStaticDefaults(): AllHeroImages {
  return {
    'our-story': {
      imageUrl: '/images/our-story-hero.jpg',
      altText: 'Our story - heritage craftsmanship',
      isActive: true,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'static-fallback',
    },
    'craftsmanship': {
      imageUrl: '/images/craftsmanship-hero.jpg',
      altText: 'Master artisan weaving traditional rug',
      isActive: true,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'static-fallback',
    },
    'trade': {
      imageUrl: '/images/trade-hero.jpg',
      altText: 'Business partnership handshake with rugs in background',
      isActive: true,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'static-fallback',
    },
    'customize': {
      imageUrl: '/images/craftsmanship-hero.jpg',
      altText: 'Traditional rug weaving background',
      isActive: true,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'static-fallback',
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get hero image for a specific page
 */
export const getPageHeroImage = async (pageType: keyof Omit<AllHeroImages, 'updatedAt'>): Promise<HeroImageData | null> => {
  try {
    const heroImages = await getHeroImagesWithDefaults();
    return heroImages[pageType] || null;
  } catch (error) {
    console.error(`Error getting hero image for page ${pageType}:`, error);
    return null;
  }
};

/**
 * Update hero image for a specific page (admin only)
 */
export const updatePageHeroImage = async (
  pageType: keyof Omit<AllHeroImages, 'updatedAt'>,
  imageData: Omit<HeroImageData, 'uploadedAt' | 'uploadedBy'>,
  updatedBy: string = 'admin'
): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', HERO_IMAGES_DOC_ID);
    
    // Get current data first
    const currentData = await getHeroImagesWithDefaults();
    
    const updateData = {
      ...currentData,
      [pageType]: {
        ...imageData,
        uploadedAt: Timestamp.now(),
        uploadedBy: updatedBy,
      },
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(docRef, updateData);
  } catch (error) {
    console.error(`Error updating hero image for page ${pageType}:`, error);
    throw new Error(`Failed to update hero image for ${pageType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update multiple hero images at once (admin only)
 */
export const updateMultipleHeroImages = async (
  updates: Partial<Omit<AllHeroImages, 'updatedAt'>>,
  updatedBy: string = 'admin'
): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', HERO_IMAGES_DOC_ID);
    
    // Get current data first
    const currentData = await getHeroImagesWithDefaults();
    
    // Update each page's data with timestamp
    const updateData = { ...currentData };
    Object.keys(updates).forEach(pageType => {
      if (pageType !== 'updatedAt' && updates[pageType as keyof typeof updates]) {
        updateData[pageType as keyof AllHeroImages] = {
          ...updates[pageType as keyof typeof updates] as HeroImageData,
          uploadedAt: Timestamp.now(),
          uploadedBy: updatedBy,
        };
      }
    });
    
    updateData.updatedAt = Timestamp.now();
    
    await setDoc(docRef, updateData);
    
    console.log('Updated multiple hero images:', Object.keys(updates));
  } catch (error) {
    console.error('Error updating multiple hero images:', error);
    throw new Error('Failed to update hero images');
  }
};

/**
 * Initialize hero images with defaults (creates if doesn't exist)
 */
export const initializeHeroImages = async (updatedBy: string = 'system'): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', HERO_IMAGES_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    // Only initialize if document doesn't exist
    if (!docSnap.exists()) {
      const defaultData = await getHeroImagesWithDefaults();
      await setDoc(docRef, {
        ...defaultData,
        updatedAt: Timestamp.now(),
      });
      
      console.log('Initialized hero images with defaults');
    }
  } catch (error) {
    console.error('Error initializing hero images:', error);
    throw new Error('Failed to initialize hero images');
  }
};
