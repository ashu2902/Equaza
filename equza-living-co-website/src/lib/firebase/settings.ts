/**
 * Settings Data Layer
 * Firestore operations for site settings with caching and validation
 */

import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { unstable_cache } from 'next/cache';

import type { SiteSettings, Lookbook } from '@/types';
import { db } from './config';

// Cache configuration
const CACHE_TAGS = {
  settings: 'site-settings',
  lookbook: 'lookbook',
} as const;

const CACHE_REVALIDATE = {
  settings: 3600, // 1 hour
  lookbook: 1800, // 30 minutes
} as const;

// Settings document ID (single document approach)
const SETTINGS_DOC_ID = 'site-settings';
const LOOKBOOK_DOC_ID = 'current-lookbook';

// Validation function for settings
const validateSettingsData = (data: Partial<SiteSettings>): void => {
  if (data.siteName && (data.siteName.length < 1 || data.siteName.length > 100)) {
    throw new Error('Site name must be between 1 and 100 characters');
  }
  
  if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    throw new Error('Invalid contact email address');
  }
  
  if (data.calendlyUrl && !data.calendlyUrl.startsWith('https://calendly.com/')) {
    throw new Error('Calendly URL must start with https://calendly.com/');
  }
  
  if (data.socialLinks?.instagram && !data.socialLinks.instagram.includes('instagram.com')) {
    throw new Error('Invalid Instagram URL');
  }
  
  if (data.socialLinks?.pinterest && !data.socialLinks.pinterest.includes('pinterest.com')) {
    throw new Error('Invalid Pinterest URL');
  }
  
  if (data.socialLinks?.facebook && !data.socialLinks.facebook.includes('facebook.com')) {
    throw new Error('Invalid Facebook URL');
  }
};

// Validation function for lookbook
const validateLookbookData = (data: Partial<Lookbook>): void => {
  if (data.version && data.version.length > 20) {
    throw new Error('Version string is too long');
  }
  
  if (data.filename && data.filename.length > 255) {
    throw new Error('Filename is too long');
  }
  
  if (data.url && !data.url.startsWith('https://')) {
    throw new Error('Lookbook URL must be HTTPS');
  }
};

// Helper to sanitize user input
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

/**
 * Get site settings with caching
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    try {
      const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const data = docSnap.data();
      const convertedData = { ...data };
      
      // Convert Firestore Timestamps to ISO strings for client components
      Object.keys(convertedData).forEach(key => {
        if (convertedData[key] && typeof convertedData[key] === 'object' && convertedData[key].toDate) {
          convertedData[key] = convertedData[key].toDate().toISOString();
        }
      });
      
      // Ensure all required properties are present with defaults
      const settings: SiteSettings = {
        siteName: convertedData.siteName || 'Equza Living Co.',
        siteDescription: convertedData.siteDescription || 'Premium handcrafted rugs that bring crafted calm to modern spaces',
        contactEmail: convertedData.contactEmail || 'hello@equzaliving.com',
        calendlyUrl: convertedData.calendlyUrl || 'https://calendly.com/equza-living',
        socialLinks: convertedData.socialLinks || {
          instagram: 'https://instagram.com/equzaliving',
          pinterest: 'https://pinterest.com/equzaliving',
        },
        seoDefaults: convertedData.seoDefaults || {
          defaultTitle: 'Equza Living Co. - Handcrafted Rugs for Modern Spaces',
          defaultDescription: 'Discover premium handcrafted rugs that bring crafted calm to modern spaces.',
          ogImage: '/images/og-default.jpg',
        },
        updatedAt: convertedData.updatedAt || Timestamp.now(),
        updatedBy: convertedData.updatedBy || 'system',
      };
      
      return settings;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      throw new Error('Failed to fetch site settings');
    }
  },
  ['site-settings'],
  {
    revalidate: CACHE_REVALIDATE.settings,
    tags: [CACHE_TAGS.settings],
  }
);

/**
 * Get site settings with fallback defaults
 */
export const getSiteSettingsWithDefaults = async (): Promise<SiteSettings> => {
  try {
    const settings = await getSiteSettings();
    
    if (settings) {
      return settings;
    }
    
    // Return default settings if none exist
    return {
      siteName: 'Equza Living Co.',
      siteDescription: 'Premium handcrafted rugs that bring crafted calm to modern spaces',
      contactEmail: 'hello@equzaliving.com',
      calendlyUrl: 'https://calendly.com/equza-living',
      socialLinks: {
        instagram: 'https://instagram.com/equzaliving',
        pinterest: 'https://pinterest.com/equzaliving',
      },
      seoDefaults: {
        defaultTitle: 'Equza Living Co. - Handcrafted Rugs for Modern Spaces',
        defaultDescription: 'Discover premium handcrafted rugs that bring crafted calm to modern spaces. Browse our collections of artisanal rugs crafted with traditional techniques.',
        ogImage: '/images/og-default.jpg',
      },
      updatedAt: Timestamp.now(),
      updatedBy: 'system',
    };
  } catch (error) {
    console.error('Error getting site settings with defaults:', error);
    throw new Error('Failed to get site settings');
  }
};

/**
 * Update site settings (admin only)
 */
export const updateSiteSettings = async (
  updates: Partial<Omit<SiteSettings, 'updatedAt'>>,
  updatedBy: string = 'admin'
): Promise<void> => {
  try {
    validateSettingsData(updates);
    
    // Sanitize string inputs
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.siteName) {
      sanitizedUpdates.siteName = sanitizeInput(sanitizedUpdates.siteName);
    }
    if (sanitizedUpdates.siteDescription) {
      sanitizedUpdates.siteDescription = sanitizeInput(sanitizedUpdates.siteDescription);
    }
    if (sanitizedUpdates.contactEmail) {
      sanitizedUpdates.contactEmail = sanitizeInput(sanitizedUpdates.contactEmail);
    }
    
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const updateData = {
      ...sanitizedUpdates,
      updatedAt: Timestamp.now(),
      updatedBy: sanitizeInput(updatedBy),
    };
    
    await updateDoc(docRef, updateData);
    
    // Invalidate cache
    // revalidateTag(CACHE_TAGS.settings);
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw new Error('Failed to update site settings');
  }
};

/**
 * Initialize site settings (creates if doesn't exist)
 */
export const initializeSiteSettings = async (
  settingsData: Omit<SiteSettings, 'updatedAt' | 'updatedBy'>,
  updatedBy: string = 'system'
): Promise<void> => {
  try {
    validateSettingsData(settingsData);
    
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const docData = {
      ...settingsData,
      updatedAt: Timestamp.now(),
      updatedBy: sanitizeInput(updatedBy),
    };
    
    await setDoc(docRef, docData);
    
    // Invalidate cache
    // revalidateTag(CACHE_TAGS.settings);
  } catch (error) {
    console.error('Error initializing site settings:', error);
    throw new Error('Failed to initialize site settings');
  }
};

/**
 * Get current lookbook with caching
 */
export const getCurrentLookbook = unstable_cache(
  async (): Promise<Lookbook | null> => {
    try {
      const docRef = doc(db, 'settings', LOOKBOOK_DOC_ID);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const data = docSnap.data();
      const convertedData = { ...data };
      
      // Convert Firestore Timestamps to ISO strings for client components
      Object.keys(convertedData).forEach(key => {
        if (convertedData[key] && typeof convertedData[key] === 'object' && convertedData[key].toDate) {
          convertedData[key] = convertedData[key].toDate().toISOString();
        }
      });
      
      // Ensure all required properties are present with defaults
      const lookbook: Lookbook = {
        version: convertedData.version || '1.0',
        filename: convertedData.filename || 'lookbook.pdf',
        url: convertedData.url || '',
        storageRef: convertedData.storageRef || '',
        uploadedAt: convertedData.uploadedAt || Timestamp.now(),
        uploadedBy: convertedData.uploadedBy || 'system',
        isActive: convertedData.isActive || false,
      };
      
      // Only return if it's active
      return lookbook.isActive ? lookbook : null;
    } catch (error) {
      console.error('Error fetching current lookbook:', error);
      throw new Error('Failed to fetch current lookbook');
    }
  },
  ['current-lookbook'],
  {
    revalidate: CACHE_REVALIDATE.lookbook,
    tags: [CACHE_TAGS.lookbook],
  }
);

/**
 * Update current lookbook (admin only)
 */
export const updateCurrentLookbook = async (
  lookbookData: Omit<Lookbook, 'uploadedAt' | 'uploadedBy'>,
  uploadedBy: string = 'admin'
): Promise<void> => {
  try {
    validateLookbookData(lookbookData);
    
    const docRef = doc(db, 'settings', LOOKBOOK_DOC_ID);
    const docData = {
      ...lookbookData,
      version: sanitizeInput(lookbookData.version),
      filename: sanitizeInput(lookbookData.filename),
      uploadedAt: Timestamp.now(),
      uploadedBy: sanitizeInput(uploadedBy),
    };
    
    await setDoc(docRef, docData);
    
    // Invalidate cache
    // revalidateTag(CACHE_TAGS.lookbook);
  } catch (error) {
    console.error('Error updating current lookbook:', error);
    throw new Error('Failed to update current lookbook');
  }
};

/**
 * Deactivate current lookbook (admin only)
 */
export const deactivateLookbook = async (updatedBy: string = 'admin'): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', LOOKBOOK_DOC_ID);
    
    await updateDoc(docRef, {
      isActive: false,
      uploadedBy: sanitizeInput(updatedBy),
      uploadedAt: Timestamp.now(),
    });
    
    // Invalidate cache
    // revalidateTag(CACHE_TAGS.lookbook);
  } catch (error) {
    console.error('Error deactivating lookbook:', error);
    throw new Error('Failed to deactivate lookbook');
  }
};

/**
 * Get contact information from settings
 */
export const getContactInfo = unstable_cache(
  async (): Promise<{
    email: string;
    calendlyUrl: string;
    socialLinks: SiteSettings['socialLinks'];
  }> => {
    try {
      const settings = await getSiteSettingsWithDefaults();
      
      return {
        email: settings.contactEmail,
        calendlyUrl: settings.calendlyUrl,
        socialLinks: settings.socialLinks,
      };
    } catch (error) {
      console.error('Error getting contact info:', error);
      throw new Error('Failed to get contact info');
    }
  },
  ['contact-info'],
  {
    revalidate: CACHE_REVALIDATE.settings,
    tags: [CACHE_TAGS.settings],
  }
);

/**
 * Get SEO defaults from settings
 */
export const getSEODefaults = unstable_cache(
  async (): Promise<SiteSettings['seoDefaults']> => {
    try {
      const settings = await getSiteSettingsWithDefaults();
      
      return settings.seoDefaults;
    } catch (error) {
      console.error('Error getting SEO defaults:', error);
      throw new Error('Failed to get SEO defaults');
    }
  },
  ['seo-defaults'],
  {
    revalidate: CACHE_REVALIDATE.settings,
    tags: [CACHE_TAGS.settings],
  }
);

/**
 * Update social links only
 */
export const updateSocialLinks = async (
  socialLinks: SiteSettings['socialLinks'],
  updatedBy: string = 'admin'
): Promise<void> => {
  try {
    return updateSiteSettings({ socialLinks }, updatedBy);
  } catch (error) {
    console.error('Error updating social links:', error);
    throw new Error('Failed to update social links');
  }
};

/**
 * Update SEO defaults only
 */
export const updateSEODefaults = async (
  seoDefaults: SiteSettings['seoDefaults'],
  updatedBy: string = 'admin'
): Promise<void> => {
  try {
    return updateSiteSettings({ seoDefaults }, updatedBy);
  } catch (error) {
    console.error('Error updating SEO defaults:', error);
    throw new Error('Failed to update SEO defaults');
  }
};