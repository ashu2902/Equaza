/**
 * Admin Product Management Actions
 * Server-side actions for admin product CRUD operations
 */

'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Product } from '@/types';
import { 
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  isProductSlugAvailable 
} from '@/lib/firebase/products';
import { checkAdminStatus } from '@/lib/firebase/auth';
import { cookies } from 'next/headers';
import { getAdminAuth } from '@/lib/firebase/server-app';

export interface AdminProductResult {
  success: boolean;
  message: string;
  productId?: string;
  errors?: Record<string, string>;
}

export interface BulkProductResult {
  success: boolean;
  message: string;
  processed: number;
  errors: number;
  results: Array<{ id?: string; error?: string; name: string }>;
}

/**
 * Verify admin authentication
 */
async function verifyAdminAuth(): Promise<{ isAdmin: boolean; userId?: string }> {
  try {
    let isAdmin = false;
    let userId: string | undefined = undefined;
    try {
      const cookieStore = cookies();
      const session = cookieStore.get('__session')?.value;
      if (session) {
        const adminAuth = getAdminAuth();
        const decoded = await adminAuth.verifySessionCookie(session, true);
        isAdmin = !!decoded?.admin;
        userId = decoded?.uid;
      }
    } catch {}
    if (!isAdmin) {
      isAdmin = await checkAdminStatus();
      // userId remains undefined if relying on client-only auth
    }
    return { isAdmin, userId };
  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return { isAdmin: false };
  }
}

/**
 * Validate product data
 */
function validateProductData(data: Partial<Product>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 1) {
    errors.name = 'Product name is required';
  } else if (data.name.length > 200) {
    errors.name = 'Product name is too long (max 200 characters)';
  }

  if (!data.slug || data.slug.trim().length < 1) {
    errors.slug = 'Product slug is required';
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
  }

  if (!data.description || data.description.trim().length < 1) {
    errors.description = 'Product description is required';
  } else if (data.description.length > 1000) {
    errors.description = 'Description is too long (max 1000 characters)';
  }

  if (!data.story || data.story.trim().length < 1) {
    errors.story = 'Product story is required';
  } else if (data.story.length > 2000) {
    errors.story = 'Story is too long (max 2000 characters)';
  }

  if (!data.images || data.images.length === 0) {
    errors.images = 'At least one product image is required';
  } else {
    const hasMainImage = data.images.some(img => img.isMain);
    if (!hasMainImage) {
      errors.images = 'At least one image must be marked as main';
    }
  }

  if (!data.collections || data.collections.length === 0) {
    errors.collections = 'Product must belong to at least one collection';
  }

  if (!data.roomTypes || data.roomTypes.length === 0) {
    errors.roomTypes = 'Product must be assigned to at least one room type';
  }

  if (data.price) {
    if (data.price.isVisible && (!data.price.startingFrom || data.price.startingFrom <= 0)) {
      errors.price = 'Price is required when price visibility is enabled';
    }
    if (!data.price.currency) {
      errors.priceCurrency = 'Price currency is required';
    }
  }

  if (!data.specifications) {
    errors.specifications = 'Product specifications are required';
  } else {
    if (!data.specifications.materials || data.specifications.materials.length === 0) {
      errors.specificationsMaterials = 'At least one material is required';
    }
    if (!data.specifications.weaveType) {
      errors.specificationsWeaveType = 'Weave type is required';
    }
    if (!data.specifications.availableSizes || data.specifications.availableSizes.length === 0) {
      errors.specificationsSizes = 'At least one size is required';
    }
    if (!data.specifications.origin) {
      errors.specificationsOrigin = 'Origin is required';
    }
    if (!data.specifications.craftTime) {
      errors.specificationsCraftTime = 'Craft time is required';
    }
  }

  if (data.sortOrder !== undefined && data.sortOrder < 0) {
    errors.sortOrder = 'Sort order must be a positive number';
  }

  return errors;
}

/**
 * Create new product (admin only)
 */
export async function createAdminProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AdminProductResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      return {
        success: false,
        message: 'Authentication required. Please log in as an admin.',
        errors: { auth: 'Not authenticated as admin' },
      };
    }

    // Validate product data
    const errors = validateProductData(productData);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    // Check slug availability
    const isSlugAvailable = await isProductSlugAvailable(productData.slug);
    if (!isSlugAvailable) {
      return {
        success: false,
        message: 'Product slug is already in use',
        errors: { slug: 'This slug is already in use' },
      };
    }

    // Create product
    const productId = await createProduct(productData);

    // Invalidate cache
    revalidateTag('products');
    revalidateTag('products-stats');
    revalidateTag('product-filter-options');
    if (productData.isFeatured) {
      revalidateTag('featured-products');
    }

    // Log admin action
    console.log('Admin product created:', {
      productId,
      adminId: auth.userId,
      name: productData.name,
      collections: productData.collections,
    });

    return {
      success: true,
      message: 'Product created successfully',
      productId,
    };

  } catch (error) {
    console.error('Error creating product:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create product',
    };
  }
}

/**
 * Update existing product (admin only)
 */
export async function updateAdminProduct(
  productId: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<AdminProductResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Validate update data
    const errors = validateProductData(updates);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please check the form for errors',
        errors,
      };
    }

    // Check slug availability if slug is being updated
    if (updates.slug) {
      const isSlugAvailable = await isProductSlugAvailable(updates.slug, productId);
      if (!isSlugAvailable) {
        return {
          success: false,
          message: 'Product slug is already in use',
          errors: { slug: 'This slug is already in use' },
        };
      }
    }

    // Get original product for comparison
    const originalProduct = await getProductById(productId);
    if (!originalProduct) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    // Update product
    await updateProduct(productId, updates);

    // Invalidate cache
    revalidateTag('products');
    revalidateTag(`product-${productId}`);
    revalidateTag(`product-slug-${originalProduct.slug}`);
    if (updates.slug) {
      revalidateTag(`product-slug-${updates.slug}`);
    }
    if (updates.isFeatured !== undefined) {
      revalidateTag('featured-products');
    }
    revalidateTag('products-stats');
    revalidateTag('product-filter-options');

    // Log admin action
    console.log('Admin product updated:', {
      productId,
      adminId: auth.userId,
      updates: Object.keys(updates),
    });

    return {
      success: true,
      message: 'Product updated successfully',
      productId,
    };

  } catch (error) {
    console.error('Error updating product:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update product',
    };
  }
}

/**
 * Delete product (admin only)
 */
export async function deleteAdminProduct(
  productId: string
): Promise<AdminProductResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Get product for logging
    const product = await getProductById(productId);
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }

    // TODO: Check for related data (enquiries, etc.) and handle accordingly
    // const relatedEnquiries = await getEnquiriesByProduct(productId);
    // if (relatedEnquiries.length > 0) {
    //   return {
    //     success: false,
    //     message: `Cannot delete product with ${relatedEnquiries.length} related enquiries. Please archive the product instead.`,
    //   };
    // }

    // Delete product
    await deleteProduct(productId);

    // Invalidate cache
    revalidateTag('products');
    revalidateTag(`product-${productId}`);
    revalidateTag(`product-slug-${product.slug}`);
    revalidateTag('products-stats');
    revalidateTag('product-filter-options');
    if (product.isFeatured) {
      revalidateTag('featured-products');
    }

    // Log admin action
    console.log('Admin product deleted:', {
      productId,
      adminId: auth.userId,
      name: product.name,
      collections: product.collections,
    });

    return {
      success: true,
      message: 'Product deleted successfully',
      productId,
    };

  } catch (error) {
    console.error('Error deleting product:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete product',
    };
  }
}

/**
 * Bulk update product sort orders
 */
export async function updateProductSortOrders(
  sortUpdates: Array<{ id: string; sortOrder: number }>
): Promise<AdminProductResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Update sort orders
    await Promise.all(
      sortUpdates.map(update =>
        updateProduct(update.id, { sortOrder: update.sortOrder })
      )
    );

    // Invalidate cache
    revalidateTag('products');

    // Log admin action
    console.log('Admin product sort orders updated:', {
      adminId: auth.userId,
      updatedCount: sortUpdates.length,
    });

    return {
      success: true,
      message: `Updated sort order for ${sortUpdates.length} products`,
    };

  } catch (error) {
    console.error('Error updating product sort orders:', error);
    
    return {
      success: false,
      message: 'Failed to update sort orders',
    };
  }
}

/**
 * Toggle product active status
 */
export async function toggleProductStatus(
  productId: string,
  isActive: boolean
): Promise<AdminProductResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Update product status
    await updateProduct(productId, { isActive });

    // Invalidate cache
    revalidateTag('products');
    revalidateTag(`product-${productId}`);

    // Log admin action
    console.log('Admin product status toggled:', {
      productId,
      adminId: auth.userId,
      isActive,
    });

    return {
      success: true,
      message: `Product ${isActive ? 'activated' : 'deactivated'} successfully`,
      productId,
    };

  } catch (error) {
    console.error('Error toggling product status:', error);
    
    return {
      success: false,
      message: 'Failed to update product status',
    };
  }
}

/**
 * Toggle product featured status
 */
export async function toggleProductFeatured(
  productId: string,
  isFeatured: boolean
): Promise<AdminProductResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Update product featured status
    await updateProduct(productId, { isFeatured });

    // Invalidate cache
    revalidateTag('products');
    revalidateTag(`product-${productId}`);
    revalidateTag('featured-products');

    // Log admin action
    console.log('Admin product featured status toggled:', {
      productId,
      adminId: auth.userId,
      isFeatured,
    });

    return {
      success: true,
      message: `Product ${isFeatured ? 'featured' : 'unfeatured'} successfully`,
      productId,
    };

  } catch (error) {
    console.error('Error toggling product featured status:', error);
    
    return {
      success: false,
      message: 'Failed to update product featured status',
    };
  }
}

/**
 * Duplicate product
 */
export async function duplicateProduct(
  productId: string,
  newName: string,
  newSlug: string
): Promise<AdminProductResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    // Get original product
    const originalProduct = await getProductById(productId);
    if (!originalProduct) {
      return {
        success: false,
        message: 'Original product not found',
      };
    }

    // Check slug availability
    const isSlugAvailable = await isProductSlugAvailable(newSlug);
    if (!isSlugAvailable) {
      return {
        success: false,
        message: 'Product slug is already in use',
        errors: { slug: 'This slug is already in use' },
      };
    }

    // Create duplicate product
    const duplicateData = {
      ...originalProduct,
      name: newName,
      slug: newSlug,
      isActive: false, // Start as inactive
      isFeatured: false, // Start as not featured
      sortOrder: originalProduct.sortOrder + 1000, // Place at end
    };
    
    // Remove fields that shouldn't be copied
    delete (duplicateData as any).id;
    delete (duplicateData as any).createdAt;
    delete (duplicateData as any).updatedAt;

    const newProductId = await createProduct(duplicateData);

    // Invalidate cache
    revalidateTag('products');

    // Log admin action
    console.log('Admin product duplicated:', {
      originalId: productId,
      newId: newProductId,
      adminId: auth.userId,
    });

    return {
      success: true,
      message: 'Product duplicated successfully',
      productId: newProductId,
    };

  } catch (error) {
    console.error('Error duplicating product:', error);
    
    return {
      success: false,
      message: 'Failed to duplicate product',
    };
  }
}

/**
 * Bulk update products
 */
export async function bulkUpdateProducts(
  productIds: string[],
  updates: Partial<Pick<Product, 'isActive' | 'isFeatured' | 'collections' | 'roomTypes'>>
): Promise<BulkProductResult> {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth();
    if (!auth.isAdmin) {
      redirect('/admin/login');
    }

    const results: Array<{ id?: string; error?: string; name: string }> = [];
    let processed = 0;
    let errors = 0;

    // Process each product
    for (const productId of productIds) {
      try {
        const product = await getProductById(productId);
        if (!product) {
          results.push({
            error: 'Product not found',
            name: `Product ${productId}`,
          });
          errors++;
          continue;
        }

        await updateProduct(productId, updates);
        results.push({
          id: productId,
          name: product.name,
        });
        processed++;

      } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        results.push({
          error: error instanceof Error ? error.message : 'Update failed',
          name: `Product ${productId}`,
        });
        errors++;
      }
    }

    // Invalidate cache
    revalidateTag('products');
    if (updates.isFeatured !== undefined) {
      revalidateTag('featured-products');
    }

    // Log admin action
    console.log('Admin bulk product update:', {
      adminId: auth.userId,
      processed,
      errors,
      updates: Object.keys(updates),
    });

    return {
      success: processed > 0,
      message: `Processed ${processed} products successfully${errors > 0 ? `, ${errors} errors` : ''}`,
      processed,
      errors,
      results,
    };

  } catch (error) {
    console.error('Error bulk updating products:', error);
    
    return {
      success: false,
      message: 'Failed to process bulk update',
      processed: 0,
      errors: productIds.length,
      results: [],
    };
  }
}