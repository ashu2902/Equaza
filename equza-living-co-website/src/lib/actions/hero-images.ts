/**
 * Server Actions for Hero Images Management
 * Admin-only actions for managing hero images
 */

'use server';

import { redirect } from 'next/navigation';
import { 
  initializeHeroImages, 
  updatePageHeroImage, 
  updateMultipleHeroImages,
  type HeroImageData 
} from '@/lib/firebase/hero-images';
import { validateAdminAuth } from '@/lib/firebase/auth';
import { revalidatePath } from 'next/cache';

export interface HeroImageActionResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Initialize hero images with default values
 */
export async function initializeHeroImagesAction(): Promise<HeroImageActionResult> {
  try {
    // Validate admin authentication
    const user = await validateAdminAuth();
    if (!user) {
      redirect('/admin/login');
    }

    await initializeHeroImages(user.email || 'admin');

    // Revalidate affected paths
    revalidatePath('/admin/hero-images');
    revalidatePath('/our-story');
    revalidatePath('/craftsmanship');
    revalidatePath('/trade');
    revalidatePath('/customize');

    return {
      success: true,
      message: 'Hero images initialized successfully',
    };
  } catch (error) {
    console.error('Error initializing hero images:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to initialize hero images',
    };
  }
}

/**
 * Update hero image for a specific page
 */
export async function updatePageHeroImageAction(
  pageType: 'our-story' | 'craftsmanship' | 'trade' | 'customize',
  imageData: Omit<HeroImageData, 'uploadedAt' | 'uploadedBy'>
): Promise<HeroImageActionResult> {
  try {
    // Validate admin authentication
    const user = await validateAdminAuth();
    if (!user) {
      redirect('/admin/login');
    }

    await updatePageHeroImage(pageType, imageData, user.email || 'admin');

    // Revalidate affected paths
    revalidatePath('/admin/hero-images');
    revalidatePath(`/${pageType}`);

    return {
      success: true,
      message: `Hero image updated for ${pageType} page`,
    };
  } catch (error) {
    console.error(`Error updating hero image for ${pageType}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update hero image',
    };
  }
}

/**
 * Update multiple hero images at once
 */
export async function updateMultipleHeroImagesAction(
  updates: Partial<Record<'our-story' | 'craftsmanship' | 'trade' | 'customize', Omit<HeroImageData, 'uploadedAt' | 'uploadedBy'>>>
): Promise<HeroImageActionResult> {
  try {
    // Validate admin authentication
    const user = await validateAdminAuth();
    if (!user) {
      redirect('/admin/login');
    }

    await updateMultipleHeroImages(updates, user.email || 'admin');

    // Revalidate affected paths
    revalidatePath('/admin/hero-images');
    Object.keys(updates).forEach(pageType => {
      revalidatePath(`/${pageType}`);
    });

    return {
      success: true,
      message: `Updated hero images for ${Object.keys(updates).length} pages`,
    };
  } catch (error) {
    console.error('Error updating multiple hero images:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update hero images',
    };
  }
}
