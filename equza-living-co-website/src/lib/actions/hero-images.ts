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
  type HeroImageData,
  type AllHeroImages
} from '@/lib/firebase/hero-images';
import { checkAdminStatus } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/config';
import { revalidatePath } from 'next/cache';

async function verifyAdminAuth(): Promise<{ isAdmin: boolean; userId?: string; email?: string }> {
  try {
    const isAdmin = await checkAdminStatus();
    const user = auth?.currentUser;
    return {
      isAdmin,
      userId: user?.uid,
      email: user?.email || undefined,
    };
  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return { isAdmin: false };
  }
}

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
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.email) {
      redirect('/admin/login');
    }

    await initializeHeroImages(auth.email);

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
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.email) {
      redirect('/admin/login');
    }

    await updatePageHeroImage(pageType, imageData, auth.email);

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
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin || !auth.email) {
      redirect('/admin/login');
    }

    // Transform updates to include the required fields
    const transformedUpdates: Partial<Omit<AllHeroImages, 'updatedAt'>> = {};
    Object.entries(updates).forEach(([pageType, updateData]) => {
      if (updateData && pageType !== 'updatedAt') {
        (transformedUpdates as any)[pageType] = {
          ...updateData,
          uploadedAt: new Date(), // Will be replaced with Timestamp in the function
          uploadedBy: auth.email,
        } as HeroImageData;
      }
    });

    await updateMultipleHeroImages(transformedUpdates, auth.email);

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
