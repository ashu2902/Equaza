/**
 * Admin Collection Management Actions
 * Server-side actions for admin collection CRUD operations
 */

'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Collection } from '@/types';
import { 
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionById,
  isCollectionSlugAvailable 
} from '@/lib/firebase/collections';
import { checkAdminStatus } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/config';

export interface AdminCollectionResult {
  success: boolean;
  message: string;
  collectionId?: string;
  errors?: Record<string, string>;
}

/**
 * Verify admin authentication
 */
async function verifyAdminAuth(): Promise<{ isAdmin: boolean; userId?: string }> {
  try {
    const isAdmin = await checkAdminStatus();
    const userId = auth?.currentUser?.uid;
    return {
      isAdmin,
      userId,
    };
  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return { isAdmin: false };
  }
}

/**
 * Validate collection data
 */
function validateCollectionData(data: Partial<Collection>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 1) {
    errors.name = 'Collection name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Collection name is too long (max 100 characters)';
  }

  if (!data.slug || data.slug.trim().length < 1) {
    errors.slug = 'Collection slug is required';
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
  }

  if (!data.description || data.description.trim().length < 1) {
    errors.description = 'Collection description is required';
  } else if (data.description.length > 500) {
    errors.description = 'Description is too long (max 500 characters)';
  }

  if (!data.type || !['style', 'space'].includes(data.type)) {
    errors.type = 'Collection type must be either "style" or "space"';
  }

  if (!data.heroImage || !data.heroImage.url) {
    errors.heroImage = 'Hero image is required';
  }

  if (data.sortOrder !== undefined && data.sortOrder < 0) {
    errors.sortOrder = 'Sort order must be a positive number';
  }

  return errors;
}

/**
 * Create new collection (admin only)
 */
export async function createAdminCollection(
  collectionData: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AdminCollectionResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Validate collection data
    const errors = validateCollectionData(collectionData);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    // Check slug availability
    const isSlugAvailable = await isCollectionSlugAvailable(collectionData.slug);
    if (!isSlugAvailable) {
      return {
        success: false,
        message: 'Collection slug is already in use',
        errors: { slug: 'This slug is already in use' },
      };
    }

    // Create collection
    const collectionId = await createCollection(collectionData);

    // Invalidate cache
    revalidateTag('collections');
    revalidateTag('collections-count');

    // Log admin action
    console.log('Admin collection created:', {
      collectionId,
      adminId: auth.userId,
      name: collectionData.name,
      type: collectionData.type,
    });

    return {
      success: true,
      message: 'Collection created successfully',
      collectionId,
    };

  } catch (error) {
    console.error('Error creating collection:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create collection',
    };
  }
}

/**
 * Update existing collection (admin only)
 */
export async function updateAdminCollection(
  collectionId: string,
  updates: Partial<Omit<Collection, 'id' | 'createdAt'>>
): Promise<AdminCollectionResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Validate update data
    const errors = validateCollectionData(updates);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    // Check slug availability if slug is being updated
    if (updates.slug) {
      const isSlugAvailable = await isCollectionSlugAvailable(updates.slug, collectionId);
      if (!isSlugAvailable) {
        return {
          success: false,
          message: 'Collection slug is already in use',
          errors: { slug: 'This slug is already in use' },
        };
      }
    }

    // Get original collection for comparison
    const originalCollection = await getCollectionById(collectionId);
    if (!originalCollection) {
      return {
        success: false,
        message: 'Collection not found',
      };
    }

    // Update collection
    await updateCollection(collectionId, updates);

    // Invalidate cache
    revalidateTag('collections');
    revalidateTag(`collection-${collectionId}`);
    revalidateTag(`collection-slug-${originalCollection.slug}`);
    if (updates.slug) {
      revalidateTag(`collection-slug-${updates.slug}`);
    }

    // Log admin action
    console.log('Admin collection updated:', {
      collectionId,
      adminId: auth.userId,
      updates: Object.keys(updates),
    });

    return {
      success: true,
      message: 'Collection updated successfully',
      collectionId,
    };

  } catch (error) {
    console.error('Error updating collection:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update collection',
    };
  }
}

/**
 * Delete collection (admin only)
 */
export async function deleteAdminCollection(
  collectionId: string
): Promise<AdminCollectionResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Get collection for logging
    const collection = await getCollectionById(collectionId);
    if (!collection) {
      return {
        success: false,
        message: 'Collection not found',
      };
    }

    // TODO: Check if collection has products and handle accordingly
    // const productsInCollection = await getProductsByCollection(collectionId);
    // if (productsInCollection.length > 0) {
    //   return {
    //     success: false,
    //     message: `Cannot delete collection with ${productsInCollection.length} products. Please reassign or delete products first.`,
    //   };
    // }

    // Delete collection
    await deleteCollection(collectionId);

    // Invalidate cache
    revalidateTag('collections');
    revalidateTag(`collection-${collectionId}`);
    revalidateTag(`collection-slug-${collection.slug}`);
    revalidateTag('collections-count');

    // Log admin action
    console.log('Admin collection deleted:', {
      collectionId,
      adminId: auth.userId,
      name: collection.name,
      type: collection.type,
    });

    return {
      success: true,
      message: 'Collection deleted successfully',
      collectionId,
    };

  } catch (error) {
    console.error('Error deleting collection:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete collection',
    };
  }
}

/**
 * Bulk update collection sort orders
 */
export async function updateCollectionSortOrders(
  sortUpdates: Array<{ id: string; sortOrder: number }>
): Promise<AdminCollectionResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Update sort orders
    await Promise.all(
      sortUpdates.map(update =>
        updateCollection(update.id, { sortOrder: update.sortOrder })
      )
    );

    // Invalidate cache
    revalidateTag('collections');

    // Log admin action
    console.log('Admin collection sort orders updated:', {
      adminId: auth.userId,
      updatedCount: sortUpdates.length,
    });

    return {
      success: true,
      message: `Updated sort order for ${sortUpdates.length} collections`,
    };

  } catch (error) {
    console.error('Error updating collection sort orders:', error);
    
    return {
      success: false,
      message: 'Failed to update sort orders',
    };
  }
}

/**
 * Toggle collection active status
 */
export async function toggleCollectionStatus(
  collectionId: string,
  isActive: boolean
): Promise<AdminCollectionResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Update collection status
    await updateCollection(collectionId, { isActive });

    // Invalidate cache
    revalidateTag('collections');
    revalidateTag(`collection-${collectionId}`);

    // Log admin action
    console.log('Admin collection status toggled:', {
      collectionId,
      adminId: auth.userId,
      isActive,
    });

    return {
      success: true,
      message: `Collection ${isActive ? 'activated' : 'deactivated'} successfully`,
      collectionId,
    };

  } catch (error) {
    console.error('Error toggling collection status:', error);
    
    return {
      success: false,
      message: 'Failed to update collection status',
    };
  }
}

/**
 * Duplicate collection
 */
export async function duplicateCollection(
  collectionId: string,
  newName: string,
  newSlug: string
): Promise<AdminCollectionResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Get original collection
    const originalCollection = await getCollectionById(collectionId);
    if (!originalCollection) {
      return {
        success: false,
        message: 'Original collection not found',
      };
    }

    // Check slug availability
    const isSlugAvailable = await isCollectionSlugAvailable(newSlug);
    if (!isSlugAvailable) {
      return {
        success: false,
        message: 'Collection slug is already in use',
        errors: { slug: 'This slug is already in use' },
      };
    }

    // Create duplicate collection
    const duplicateData = {
      ...originalCollection,
      name: newName,
      slug: newSlug,
      isActive: false, // Start as inactive
      sortOrder: originalCollection.sortOrder + 1000, // Place at end
    };
    
    // Remove fields that shouldn't be copied
    delete (duplicateData as any).id;
    delete (duplicateData as any).createdAt;
    delete (duplicateData as any).updatedAt;

    const newCollectionId = await createCollection(duplicateData);

    // Invalidate cache
    revalidateTag('collections');

    // Log admin action
    console.log('Admin collection duplicated:', {
      originalId: collectionId,
      newId: newCollectionId,
      adminId: auth.userId,
    });

    return {
      success: true,
      message: 'Collection duplicated successfully',
      collectionId: newCollectionId,
    };

  } catch (error) {
    console.error('Error duplicating collection:', error);
    
    return {
      success: false,
      message: 'Failed to duplicate collection',
    };
  }
}