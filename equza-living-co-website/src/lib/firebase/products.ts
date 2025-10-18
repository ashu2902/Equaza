/**
 * Products Data Layer
 * Firestore operations for products with validation
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
import { getAdminFirestore } from './server-app';
import { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';

// Helper function to convert Firestore document to typed object with proper serialization
const convertDoc = <T>(
  doc: DocumentSnapshot | QueryDocumentSnapshot
): T | null => {
  if (!doc.exists()) return null;

  const data = doc.data();
  const convertedData = { ...data };

  // Convert Firestore Timestamps to ISO strings for client components
  Object.keys(convertedData).forEach((key) => {
    if (
      convertedData[key] &&
      typeof convertedData[key] === 'object' &&
      convertedData[key].toDate
    ) {
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
    throw new Error(
      'Product slug must contain only lowercase letters, numbers, and hyphens'
    );
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

  if (data.images && !data.images.some((img) => img.isMain)) {
    throw new Error('Product must have one main image');
  }
};

/**
 * Get products with filters
 */
export const getProducts = async (
  filters: ProductFilters = {}
): Promise<Product[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.collectionId) {
      constraints.push(
        where('collections', 'array-contains', filters.collectionId)
      );
    }

    if (filters.materials && filters.materials.length > 0) {
      // For materials, we need to check if any of the filter materials match
      constraints.push(
        where(
          'specifications.materials',
          'array-contains-any',
          filters.materials
        )
      );
    }

    if (filters.weaveType) {
      constraints.push(
        where('specifications.weaveType', '==', filters.weaveType)
      );
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
      .map((doc) => convertDoc<Product>(doc))
      .filter(Boolean) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

/**
 * Get single product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    return convertDoc<Product>(docSnap);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error('Failed to fetch product');
  }
};

/**
 * Get product by ID (admin-side)
 */
export const getProductByIdAdmin = async (
  id: string
): Promise<Product | null> => {
  try {
    const adminDb = getAdminFirestore();
    const docSnap = await adminDb.collection('products').doc(id).get();

    if (!docSnap.exists) return null;

    const data = docSnap.data();
    const convertedData = { ...data };

    // Convert Firestore Timestamps to ISO strings for client components
    Object.keys(convertedData).forEach((key) => {
      if (
        convertedData[key] &&
        typeof convertedData[key] === 'object' &&
        convertedData[key].toDate
      ) {
        convertedData[key] = convertedData[key].toDate().toISOString();
      }
    });

    return { id: docSnap.id, ...convertedData } as Product;
  } catch (error) {
    console.error('Error fetching product by ID (admin):', error);
    throw new Error('Failed to fetch product');
  }
};

/**
 * Get single product by slug
 */
export const getProductBySlug = async (
  slug: string
): Promise<Product | null> => {
  try {
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
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (
  limitCount: number = 8
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('isActive', '==', true),
      where('isFeatured', '==', true),
      orderBy('sortOrder', 'asc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc) => convertDoc<Product>(doc))
      .filter(Boolean) as Product[];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
};

/**
 * Get products by collection
 */
export const getProductsByCollection = async (
  collectionId: string,
  limitCount?: number
): Promise<Product[]> => {
  return getProducts({
    collectionId,
    isActive: true,
    limit: limitCount,
  });
};

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
      limit: 100,
    });

    return allProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTermLower) ||
          product.description.toLowerCase().includes(searchTermLower) ||
          product.story.toLowerCase().includes(searchTermLower) ||
          product.specifications.materials.some((material) =>
            material.toLowerCase().includes(searchTermLower)
          ) ||
          product.collections.some((collection) =>
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
      .filter((p) => p.id !== productId)
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching related products:', error);
    throw new Error('Failed to fetch related products');
  }
};

/**
 * Get products count and statistics
 */
export const getProductsStats = async (): Promise<{
  total: number;
  active: number;
  featured: number;
  byCollection: Record<string, number>;
}> => {
  try {
    const [allProducts, activeProducts, featuredProducts] = await Promise.all([
      getProducts({}),
      getProducts({ isActive: true }),
      getProducts({ isActive: true, isFeatured: true }),
    ]);

    // Count by collection
    const byCollection: Record<string, number> = {};
    activeProducts.forEach((product) => {
      product.collections.forEach((collectionId) => {
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
};

/**
 * Get products by weave type
 */
export const getProductsByWeaveType = async (
  weaveType: string,
  limitCount?: number
): Promise<Product[]> => {
  return getProducts({
    weaveType,
    isActive: true,
    limit: limitCount,
  });
};

/**
 * Get available weave types
 */
export const getAvailableWeaveTypes = async (): Promise<string[]> => {
  try {
    const products = await getProducts({ isActive: true });

    const weaveTypes = new Set<string>();

    products.forEach((product) => {
      if (product.specifications.weaveType) {
        weaveTypes.add(product.specifications.weaveType);
      }
    });

    return Array.from(weaveTypes).sort();
  } catch (error) {
    console.error('Error getting available weave types:', error);
    throw new Error('Failed to get weave types');
  }
};

/**
 * Get available filter options
 */
export const getProductFilterOptions = async (): Promise<{
  materials: string[];
  collections: string[];
  weaveTypes: string[];
}> => {
  try {
    const products = await getProducts({ isActive: true });

    const materials = new Set<string>();
    const collections = new Set<string>();
    const weaveTypes = new Set<string>();

    products.forEach((product) => {
      product.specifications.materials.forEach((material) =>
        materials.add(material)
      );
      product.collections.forEach((collection) => collections.add(collection));
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
};

/**
 * Create new product (admin only)
 */
export const createProduct = async (
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    validateProductData(productData);

    const adminDb = getAdminFirestore();
    const docData = {
      ...productData,
      createdAt: AdminTimestamp.now(),
      updatedAt: AdminTimestamp.now(),
    };

    const docRef = await adminDb.collection('products').add(docData);

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

    const adminDb = getAdminFirestore();

    // Clean the updates object to remove any client-side timestamps
    const cleanUpdates = { ...updates };

    // Remove any timestamp fields that might be from client-side SDK
    // Note: We never update createdAt - it's immutable
    delete cleanUpdates.updatedAt;

    // Convert any remaining timestamp-like fields to admin timestamps
    Object.keys(cleanUpdates).forEach((key) => {
      const value = (cleanUpdates as any)[key];
      if (value && typeof value === 'object' && value.toDate) {
        // This is a Firestore timestamp, convert to admin timestamp
        (cleanUpdates as any)[key] = AdminTimestamp.fromDate(value.toDate());
      }
    });

    const updateData = {
      ...cleanUpdates,
      updatedAt: AdminTimestamp.now(),
    };

    await adminDb.collection('products').doc(id).update(updateData);
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
    const adminDb = getAdminFirestore();
    await adminDb.collection('products').doc(id).delete();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

/**
 * Check if product slug is available (client-side)
 */
export const isProductSlugAvailable = async (
  slug: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    const q = query(collection(db, 'products'), where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return true;

    // If excluding an ID (for updates), check if the found doc is the same
    if (excludeId) {
      return snapshot.docs.every((doc) => doc.id === excludeId);
    }

    return false;
  } catch (error) {
    console.error('Error checking product slug availability:', error);
    throw new Error('Failed to check slug availability');
  }
};

/**
 * Check if product slug is available (admin-side)
 */
export const isProductSlugAvailableAdmin = async (
  slug: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    const adminDb = getAdminFirestore();
    const q = adminDb.collection('products').where('slug', '==', slug);
    const snapshot = await q.get();

    if (snapshot.empty) return true;

    // If excluding an ID (for updates), check if the found doc is the same
    if (excludeId) {
      return snapshot.docs.every((doc) => doc.id === excludeId);
    }

    return false;
  } catch (error) {
    console.error('Error checking product slug availability (admin):', error);
    throw new Error('Failed to check slug availability');
  }
};
