/**
 * Settings Data Layer
 * Firestore operations for site settings with validation
 */

import type { SiteSettings, Lookbook } from '@/types';
import { getAdminFirestore } from './server-app';


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
 * Get site settings
 */
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const db = getAdminFirestore();
    const docRef = db.collection('settings').doc(SETTINGS_DOC_ID);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
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
      updatedAt: convertedData.updatedAt || new Date(),
      updatedBy: convertedData.updatedBy || 'system',
    };
    
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw new Error('Failed to fetch site settings');
  }
};

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
      updatedAt: new Date() as any,
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
    
    const db = getAdminFirestore();
    const docRef = db.collection('settings').doc(SETTINGS_DOC_ID);
    const updateData = {
      ...sanitizedUpdates,
      updatedAt: new Date() as any,
      updatedBy: sanitizeInput(updatedBy),
    };
    
    await docRef.update(updateData);
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
    
    const db = getAdminFirestore();
    const docRef = db.collection('settings').doc(SETTINGS_DOC_ID);
    const docData = {
      ...settingsData,
      updatedAt: new Date() as any,
      updatedBy: sanitizeInput(updatedBy),
    };
    
    await docRef.set(docData);
  } catch (error) {
    console.error('Error initializing site settings:', error);
    throw new Error('Failed to initialize site settings');
  }
};

/**
 * Get current lookbook
 */
export const getCurrentLookbook = async (): Promise<Lookbook | null> => {
  try {
    const db = getAdminFirestore();
    const docRef = db.collection('settings').doc(LOOKBOOK_DOC_ID);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
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
      uploadedAt: convertedData.uploadedAt || new Date(),
      uploadedBy: convertedData.uploadedBy || 'system',
      isActive: convertedData.isActive || false,
    };
    
    // Only return if it's active
    return lookbook.isActive ? lookbook : null;
  } catch (error) {
    console.error('Error fetching current lookbook:', error);
    throw new Error('Failed to fetch current lookbook');
  }
};

/**
 * Update current lookbook (admin only)
 */
export const updateCurrentLookbook = async (
  lookbookData: Omit<Lookbook, 'uploadedAt' | 'uploadedBy'>,
  uploadedBy: string = 'admin'
): Promise<void> => {
  try {
    validateLookbookData(lookbookData);
    
    const db = getAdminFirestore();
    const docRef = db.collection('settings').doc(LOOKBOOK_DOC_ID);
    const docData = {
      ...lookbookData,
      version: sanitizeInput(lookbookData.version),
      filename: sanitizeInput(lookbookData.filename),
      uploadedAt: new Date(),
      uploadedBy: sanitizeInput(uploadedBy),
    };
    
    await docRef.set(docData);
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
    const db = getAdminFirestore();
    const docRef = db.collection('settings').doc(LOOKBOOK_DOC_ID);
    
    await docRef.update({
      isActive: false,
      uploadedBy: sanitizeInput(updatedBy),
      uploadedAt: new Date(),
    });
  } catch (error) {
    console.error('Error deactivating lookbook:', error);
    throw new Error('Failed to deactivate lookbook');
  }
};

/**
 * Get contact information from settings
 */
export const getContactInfo = async (): Promise<{
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
};

/**
 * Get SEO defaults from settings
 */
export const getSEODefaults = async (): Promise<SiteSettings['seoDefaults']> => {
  try {
    const settings = await getSiteSettingsWithDefaults();
    
    return settings.seoDefaults;
  } catch (error) {
    console.error('Error getting SEO defaults:', error);
    throw new Error('Failed to get SEO defaults');
  }
};

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