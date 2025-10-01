/**
 * Products Data Layer
 * Firestore operations for products with centralized caching and validation
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryConstraint,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

import type { Product, ProductFilters } from '@/types';
import { db } from './config';
import { 
  createCachedFunction, 
  CACHE_CONFIG, 
  invalidateEntityCache,
  logCacheOperation 
} from '@/lib/cache/config';

// Helper function to convert Firestore document to typed object with proper serialization
const convertDoc = <T>(doc: DocumentSnapshot | QueryDocumentSnapshot): T | null => {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  const convertedData = { ...data };
  
  // Convert Firestore Timestamps to ISO strings for client components
  Object.keys(convertedData).forEach(key => {
    if (convertedData[key] && typeof convertedData[key] === 'object' && convertedData[key].toDate) {
      convertedData[key] = convertedData[key].toDate().toISOString();
    }
  });
  
  return { id: doc.id, ...convertedData } as T;
};

// Validation function
const validateProductData = (data: Partial<Product>): void => {
  if (data.name && (data.name.length < 1 || data.name.length > 200)) {
    throw new Error('Product name must be between 1 and 200 characters');
  }
  
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    throw new Error('Product slug must contain only lowercase letters, numbers, and hyphens');
  }
  
  if (data.price && data.price.startingFrom < 0) {
    throw new Error('Product price must be positive');
  }
  
  if (data.sortOrder && data.sortOrder < 0) {
    throw new Error('Sort order must be a positive number');
  }
  
  if (data.images && data.images.length === 0) {
    throw new Error('Product must have at least one image');
  }
  
  if (data.images && !data.images.some(img => img.isMain)) {
    throw new Error('Product must have one main image');
  }
};

/**
 * Get products with filters and caching
 */
export const getProducts = createCachedFunction(
  async (filters: ProductFilters = {}): Promise<Product[]> => {
    try {
      logCacheOperation('getProducts', { filters });
      
      const constraints: QueryConstraint[] = [];
      
      // Apply filters
      if (filters.collectionId) {
        constraints.push(where('collections', 'array-contains', filters.collectionId));
      }
      
      if (filters.materials && filters.materials.length > 0) {
        // For materials, we need to check if any of the filter materials match
        constraints.push(where('specifications.materials', 'array-contains-any', filters.materials));
      }
      
      if (filters.weaveType) {
        constraints.push(where('specifications.weaveType', '==', filters.weaveType));
      }
      
      if (filters.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }
      
      if (filters.isFeatured !== undefined) {
        constraints.push(where('isFeatured', '==', filters.isFeatured));
      }
      
      // Default ordering
      constraints.push(orderBy('sortOrder', 'asc'));
      
      // Pagination
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }
      
      const q = query(collection(db, 'products'), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs
        .map(doc => convertDoc<Product>(doc))
        .filter(Boolean) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  },
  'products',
  CACHE_CONFIG.products
);

/**
 * Get single product by ID with caching
 */
export const getProductById = createCachedFunction(
  async (id: string): Promise<Product | null> => {
    try {
      logCacheOperation('getProductById', { id });
      
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      return convertDoc<Product>(docSnap);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Failed to fetch product');
    }
  },
  'product-by-id',
  CACHE_CONFIG.product
);

/**
 * Get single product by slug with caching
 */
export const getProductBySlug = createCachedFunction(
  async (slug: string): Promise<Product | null> => {
    try {
      logCacheOperation('getProductBySlug', { slug });
      
      const q = query(
        collection(db, 'products'),
        where('slug', '==', slug),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      return convertDoc<Product>(snapshot.docs[0]!);
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw new Error('Failed to fetch product');
    }
  },
  'product-by-slug',
  CACHE_CONFIG.productSlug
);

/**
 * Get featured products
 */
export const getFeaturedProducts = createCachedFunction(
  async (limitCount: number = 8): Promise<Product[]> => {
    try {
      logCacheOperation('getFeaturedProducts', { limitCount });
      
      const q = query(
        collection(db, 'products'),
        where('isActive', '==', true),
        where('isFeatured', '==', true),
        orderBy('sortOrder', 'asc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs
        .map(doc => convertDoc<Product>(doc))
        .filter(Boolean) as Product[];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw new Error('Failed to fetch featured products');
    }
  },
  'featured-products',
  CACHE_CONFIG.featuredProducts
);

/**
 * Get products by collection
 */
export const getProductsByCollection = createCachedFunction(
  async (collectionId: string, limitCount?: number): Promise<Product[]> => {
    logCacheOperation('getProductsByCollection', { collectionId, limitCount });
    return getProducts({ 
      collectionId, 
      isActive: true, 
      limit: limitCount 
    });
  },
  'products-by-collection',
  CACHE_CONFIG.products
);

/**
 * Get products by room type
 */
// getProductsByRoomType removed

/**
 * Search products by name and description
 */
export const searchProducts = async (
  searchTerm: string,
  limitCount: number = 20
): Promise<Product[]> => {
  try {
    if (!searchTerm.trim()) return [];
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Get all active products and filter client-side for better search
    const allProducts = await getProducts({ 
      isActive: true, 
      limit: 100 
    });
    
    return allProducts
      .filter(product => 
        product.name.toLowerCase().includes(searchTermLower) ||
        product.description.toLowerCase().includes(searchTermLower) ||
        product.story.toLowerCase().includes(searchTermLower) ||
        product.specifications.materials.some(material => 
          material.toLowerCase().includes(searchTermLower)
        ) ||
        product.collections.some(collection => 
          collection.toLowerCase().includes(searchTermLower)
        )
      )
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};

/**
 * Get related products (same collection, excluding current product)
 */
export const getRelatedProducts = async (
  productId: string,
  limitCount: number = 4
): Promise<Product[]> => {
  try {
    const product = await getProductById(productId);
    if (!product || product.collections.length === 0) return [];
    
    // Get products from the same collection
    const relatedProducts = await getProducts({
      collectionId: product.collections[0], // Use first collection
      isActive: true,
      limit: limitCount + 1, // Get one extra to account for filtering out current product
    });
    
    return relatedProducts
      .filter(p => p.id !== productId)
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw new Error('Failed to fetch related products');
  }
};

/**
 * Get products count and statistics
 */
export const getProductsStats = createCachedFunction(
  async (): Promise<{
    total: number;
    active: number;
    featured: number;
    byCollection: Record<string, number>;
  }> => {
    try {
      logCacheOperation('getProductsStats', {});
      
      const [allProducts, activeProducts, featuredProducts] = await Promise.all([
        getProducts({}),
        getProducts({ isActive: true }),
        getProducts({ isActive: true, isFeatured: true }),
      ]);
      
      // Count by collection
      const byCollection: Record<string, number> = {};
      activeProducts.forEach(product => {
        product.collections.forEach(collectionId => {
          byCollection[collectionId] = (byCollection[collectionId] || 0) + 1;
        });
      });
      
      return {
        total: allProducts.length,
        active: activeProducts.length,
        featured: featuredProducts.length,
        byCollection,
      };
    } catch (error) {
      console.error('Error getting products stats:', error);
      throw new Error('Failed to get products stats');
    }
  },
  'products-stats',
  CACHE_CONFIG.products
);

/**
 * Get products by weave type
 */
export const getProductsByWeaveType = createCachedFunction(
  async (weaveType: string, limitCount?: number): Promise<Product[]> => {
    logCacheOperation('getProductsByWeaveType', { weaveType, limitCount });
    return getProducts({ 
      weaveType, 
      isActive: true, 
      limit: limitCount 
    });
  },
  'products-by-weave-type',
  CACHE_CONFIG.products
);

/**
 * Get available weave types
 */
export const getAvailableWeaveTypes = createCachedFunction(
  async (): Promise<string[]> => {
    try {
      logCacheOperation('getAvailableWeaveTypes', {});
      
      const products = await getProducts({ isActive: true });
      
      const weaveTypes = new Set<string>();
      
      products.forEach(product => {
        if (product.specifications.weaveType) {
          weaveTypes.add(product.specifications.weaveType);
        }
      });
      
      return Array.from(weaveTypes).sort();
    } catch (error) {
      console.error('Error getting available weave types:', error);
      throw new Error('Failed to get weave types');
    }
  },
  'available-weave-types',
  CACHE_CONFIG.products
);

/**
 * Get available filter options
 */
export const getProductFilterOptions = createCachedFunction(
  async (): Promise<{
    materials: string[];
    collections: string[];
    weaveTypes: string[];
  }> => {
    try {
      logCacheOperation('getProductFilterOptions', {});
      
      const products = await getProducts({ isActive: true });
      
      const materials = new Set<string>();
      const collections = new Set<string>();
      const weaveTypes = new Set<string>();
      
      products.forEach(product => {
        product.specifications.materials.forEach(material => materials.add(material));
        product.collections.forEach(collection => collections.add(collection));
        if (product.specifications.weaveType) {
          weaveTypes.add(product.specifications.weaveType);
        }
      });
      
      return {
        materials: Array.from(materials).sort(),
        collections: Array.from(collections).sort(),
        weaveTypes: Array.from(weaveTypes).sort(),
      };
    } catch (error) {
      console.error('Error getting product filter options:', error);
      throw new Error('Failed to get filter options');
    }
  },
  'product-filter-options',
  CACHE_CONFIG.products
);

/**
 * Create new product (admin only)
 */
export const createProduct = async (
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    validateProductData(productData);
    
    const docData = {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'products'), docData);
    
    // Invalidate cache
    invalidateEntityCache('product', docRef.id, [
      'products',
      'featured-products',
      'products-stats',
      'product-filter-options'
    ]);
    
    logCacheOperation('createProduct', { productId: docRef.id });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};

/**
 * Update product (admin only)
 */
export const updateProduct = async (
  id: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    validateProductData(updates);
    
    const docRef = doc(db, 'products', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    await updateDoc(docRef, updateData);
    
    // Invalidate cache
    invalidateEntityCache('product', id, [
      'products',
      'featured-products',
      'products-stats',
      'product-filter-options'
    ]);
    
    logCacheOperation('updateProduct', { productId: id, updates: Object.keys(updates) });
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

/**
 * Delete product (admin only)
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    
    // Invalidate cache
    invalidateEntityCache('product', id, [
      'products',
      'featured-products',
      'products-stats',
      'product-filter-options'
    ]);
    
    logCacheOperation('deleteProduct', { productId: id });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

/**
 * Check if product slug is available
 */
export const isProductSlugAvailable = async (slug: string, excludeId?: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('slug', '==', slug)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return true;
    
    // If excluding an ID (for updates), check if the found doc is the same
    if (excludeId) {
      return snapshot.docs.every(doc => doc.id === excludeId);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking product slug availability:', error);
    throw new Error('Failed to check slug availability');
  }
};