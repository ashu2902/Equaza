/**
 * Admin Content Management Actions
 * Server-side actions for admin page/content CRUD operations
 */

'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Page, PageType, SiteSettings, Lookbook } from '@/types';
import { 
  updateSiteSettings,
  updateCurrentLookbook,
  deactivateLookbook,
  getSiteSettings 
} from '@/lib/firebase/settings';
import { checkAdminStatus } from '@/lib/firebase/auth';

export interface AdminPageResult {
  success: boolean;
  message: string;
  pageId?: string;
  errors?: Record<string, string>;
}

export interface AdminSettingsResult {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

/**
 * Verify admin authentication
 */
async function verifyAdminAuth(): Promise<{ isAdmin: boolean; userId?: string }> {
  try {
    const adminStatus = await checkAdminStatus();
    return {
      isAdmin: adminStatus.isAdmin,
      userId: adminStatus.userId,
    };
  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return { isAdmin: false };
  }
}

/**
 * Validate page data
 */
function validatePageData(data: Partial<Page>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 1) {
    errors.title = 'Page title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Page title is too long (max 200 characters)';
  }

  if (!data.slug || data.slug.trim().length < 1) {
    errors.slug = 'Page slug is required';
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
  }

  if (!data.type || !['our-story', 'craftsmanship', 'trade'].includes(data.type)) {
    errors.type = 'Invalid page type';
  }

  if (!data.content || !data.content.sections || data.content.sections.length === 0) {
    errors.content = 'Page content is required';
  }

  if (data.seoTitle && data.seoTitle.length > 60) {
    errors.seoTitle = 'SEO title should be under 60 characters';
  }

  if (data.seoDescription && data.seoDescription.length > 160) {
    errors.seoDescription = 'SEO description should be under 160 characters';
  }

  return errors;
}

/**
 * Validate site settings data
 */
function validateSettingsData(data: Partial<SiteSettings>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (data.siteName !== undefined && (!data.siteName || data.siteName.trim().length < 1)) {
    errors.siteName = 'Site name is required';
  }

  if (data.contactEmail !== undefined && (!data.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail))) {
    errors.contactEmail = 'Valid contact email is required';
  }

  if (data.calendlyUrl !== undefined && data.calendlyUrl && !data.calendlyUrl.startsWith('https://calendly.com/')) {
    errors.calendlyUrl = 'Calendly URL must start with https://calendly.com/';
  }

  if (data.socialLinks?.instagram && !data.socialLinks.instagram.includes('instagram.com')) {
    errors.instagramUrl = 'Invalid Instagram URL';
  }

  if (data.socialLinks?.pinterest && !data.socialLinks.pinterest.includes('pinterest.com')) {
    errors.pinterestUrl = 'Invalid Pinterest URL';
  }

  if (data.socialLinks?.facebook && !data.socialLinks.facebook.includes('facebook.com')) {
    errors.facebookUrl = 'Invalid Facebook URL';
  }

  return errors;
}

/**
 * Create or update page content (admin only)
 */
export async function updatePageContent(
  pageType: PageType,
  pageData: Omit<Page, 'id' | 'updatedAt' | 'updatedBy'>
): Promise<AdminPageResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.userId) {
      redirect('/admin/login');
    }

    // Validate page data
    const errors = validatePageData(pageData);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    // TODO: Implement page CRUD operations
    // For now, we'll log the action
    console.log('Admin page content updated:', {
      pageType,
      adminId: auth.userId,
      title: pageData.title,
    });

    // Invalidate cache (would be implemented with actual page operations)
    revalidateTag(`page-${pageType}`);

    return {
      success: true,
      message: 'Page content updated successfully',
      pageId: pageType,
    };

  } catch (error) {
    console.error('Error updating page content:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update page content',
    };
  }
}

/**
 * Update site settings (admin only)
 */
export async function updateAdminSiteSettings(
  settings: Partial<Omit<SiteSettings, 'updatedAt' | 'updatedBy'>>
): Promise<AdminSettingsResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.userId) {
      redirect('/admin/login');
    }

    // Validate settings data
    const errors = validateSettingsData(settings);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    // Update site settings
    await updateSiteSettings(settings, auth.userId);

    // Invalidate cache
    revalidateTag('site-settings');
    revalidateTag('contact-info');
    if (settings.seoDefaults) {
      revalidateTag('seo-defaults');
    }

    // Log admin action
    console.log('Admin site settings updated:', {
      adminId: auth.userId,
      updates: Object.keys(settings),
    });

    return {
      success: true,
      message: 'Site settings updated successfully',
    };

  } catch (error) {
    console.error('Error updating site settings:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update site settings',
    };
  }
}

/**
 * Update lookbook (admin only)
 */
export async function updateAdminLookbook(
  lookbookData: Omit<Lookbook, 'uploadedAt' | 'uploadedBy'>
): Promise<AdminSettingsResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.userId) {
      redirect('/admin/login');
    }

    // Validate lookbook data
    const errors: Record<string, string> = {};

    if (!lookbookData.version || lookbookData.version.trim().length < 1) {
      errors.version = 'Lookbook version is required';
    }

    if (!lookbookData.filename || lookbookData.filename.trim().length < 1) {
      errors.filename = 'Lookbook filename is required';
    }

    if (!lookbookData.url || !lookbookData.url.startsWith('https://')) {
      errors.url = 'Valid HTTPS URL is required';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    // Update lookbook
    await updateCurrentLookbook(lookbookData, auth.userId);

    // Invalidate cache
    revalidateTag('lookbook');

    // Log admin action
    console.log('Admin lookbook updated:', {
      adminId: auth.userId,
      version: lookbookData.version,
      filename: lookbookData.filename,
    });

    return {
      success: true,
      message: 'Lookbook updated successfully',
    };

  } catch (error) {
    console.error('Error updating lookbook:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update lookbook',
    };
  }
}

/**
 * Deactivate current lookbook (admin only)
 */
export async function deactivateAdminLookbook(): Promise<AdminSettingsResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.userId) {
      redirect('/admin/login');
    }

    // Deactivate lookbook
    await deactivateLookbook(auth.userId);

    // Invalidate cache
    revalidateTag('lookbook');

    // Log admin action
    console.log('Admin lookbook deactivated:', {
      adminId: auth.userId,
    });

    return {
      success: true,
      message: 'Lookbook deactivated successfully',
    };

  } catch (error) {
    console.error('Error deactivating lookbook:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to deactivate lookbook',
    };
  }
}

/**
 * Update SEO defaults (admin only)
 */
export async function updateSEODefaults(
  seoDefaults: SiteSettings['seoDefaults']
): Promise<AdminSettingsResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.userId) {
      redirect('/admin/login');
    }

    // Validate SEO data
    const errors: Record<string, string> = {};

    if (!seoDefaults.defaultTitle || seoDefaults.defaultTitle.trim().length < 1) {
      errors.defaultTitle = 'Default SEO title is required';
    } else if (seoDefaults.defaultTitle.length > 60) {
      errors.defaultTitle = 'SEO title should be under 60 characters';
    }

    if (!seoDefaults.defaultDescription || seoDefaults.defaultDescription.trim().length < 1) {
      errors.defaultDescription = 'Default SEO description is required';
    } else if (seoDefaults.defaultDescription.length > 160) {
      errors.defaultDescription = 'SEO description should be under 160 characters';
    }

    if (!seoDefaults.ogImage || !seoDefaults.ogImage.startsWith('/')) {
      errors.ogImage = 'Valid OG image path is required (starting with /)';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    // Update SEO defaults
    await updateSiteSettings({ seoDefaults }, auth.userId);

    // Invalidate cache
    revalidateTag('site-settings');
    revalidateTag('seo-defaults');

    // Log admin action
    console.log('Admin SEO defaults updated:', {
      adminId: auth.userId,
    });

    return {
      success: true,
      message: 'SEO defaults updated successfully',
    };

  } catch (error) {
    console.error('Error updating SEO defaults:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update SEO defaults',
    };
  }
}

/**
 * Update social links (admin only)
 */
export async function updateSocialLinks(
  socialLinks: SiteSettings['socialLinks']
): Promise<AdminSettingsResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.userId) {
      redirect('/admin/login');
    }

    // Validate social links
    const errors: Record<string, string> = {};

    if (socialLinks.instagram && !socialLinks.instagram.includes('instagram.com')) {
      errors.instagram = 'Invalid Instagram URL';
    }

    if (socialLinks.pinterest && !socialLinks.pinterest.includes('pinterest.com')) {
      errors.pinterest = 'Invalid Pinterest URL';
    }

    if (socialLinks.facebook && !socialLinks.facebook.includes('facebook.com')) {
      errors.facebook = 'Invalid Facebook URL';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the social links for errors',
        errors,
      };
    }

    // Update social links
    await updateSiteSettings({ socialLinks }, auth.userId);

    // Invalidate cache
    revalidateTag('site-settings');
    revalidateTag('contact-info');

    // Log admin action
    console.log('Admin social links updated:', {
      adminId: auth.userId,
      platforms: Object.keys(socialLinks).filter(key => socialLinks[key as keyof typeof socialLinks]),
    });

    return {
      success: true,
      message: 'Social links updated successfully',
    };

  } catch (error) {
    console.error('Error updating social links:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update social links',
    };
  }
}

/**
 * Get current settings for editing (admin only)
 */
export async function getAdminSettings(): Promise<{
  success: boolean;
  settings?: SiteSettings;
  message?: string;
}> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Get current settings
    const settings = await getSiteSettings();

    return {
      success: true,
      settings: settings || undefined,
    };

  } catch (error) {
    console.error('Error getting admin settings:', error);
    
    return {
      success: false,
      message: 'Failed to load settings',
    };
  }
}