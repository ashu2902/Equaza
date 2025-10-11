/**
 * Safe Firebase Firestore Access Layer
 * 
 * All functions return SafeResult<T> which guarantees:
 * - Valid data or explicit error state
 * - No null/undefined crashes in components
 * - Consistent error handling patterns
 */

import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './config';
import { transformProducts, transformCollections, transformProduct, transformCollection, transformWeaveTypes } from './transformers';
import { SafeProduct, SafeCollection, SafeWeaveType, SafeResult } from '@/types/safe';

/**
 * Generic error handler for Firebase operations
 */
function handleFirebaseError(error: any, operation: string): string {
  console.error(`Firebase ${operation} error:`, error);

  if (!error) {
    return `Unknown error occurred during ${operation}`;
  }

  if (error.code === 'permission-denied') {
    return 'Access denied. Please check your permissions.';
  }

  if (error.code === 'unavailable') {
    return 'Service temporarily unavailable. Please try again.';
  }
  
  if (error.code === 'deadline-exceeded') {
    return 'Request timed out. Please try again.';
  }
  
  return `Failed to ${operation}. Please try again.`;
}

/**
 * Product Data Access Functions
 */

export interface ProductFilters {
  collectionId?: string;
  roomType?: string;
  weaveType?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  limit?: number;
}

export async function getSafeProducts(filters: ProductFilters = {}): Promise<SafeResult<SafeProduct[]>> {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Always filter for active products unless explicitly specified
    if (filters.isActive !== false) {
      constraints.push(where('isActive', '==', true));
    }
    
    if (filters.collectionId) {
      constraints.push(where('collections', 'array-contains', filters.collectionId));
    }
    
    if (filters.weaveType) {
      constraints.push(where('specifications.weaveType', '==', filters.weaveType));
    }
    
    // roomTypes removed
    
    if (filters.isFeatured !== undefined) {
      constraints.push(where('isFeatured', '==', filters.isFeatured));
    }
    
    // Simplified ordering (indexes still building)
    constraints.push(orderBy('sortOrder', 'asc'));
    
    if (filters.limit && filters.limit > 0) {
      constraints.push(firestoreLimit(filters.limit));
    }
    
    const q = query(collection(db, 'products'), ...constraints);
    const snapshot = await getDocs(q);
    
    const products = transformProducts(snapshot.docs);
    
    return { data: products, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch products'), 
      loading: false 
    };
  }
}

export async function getSafeProduct(slug: string): Promise<SafeResult<SafeProduct>> {
  try {
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return { data: null, error: 'Invalid product identifier', loading: false };
    }
    
    const q = query(
      collection(db, 'products'),
      where('slug', '==', slug.trim()),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { data: null, error: 'Product not found', loading: false };
    }
    
    const firstDoc = snapshot.docs[0];
    if (!firstDoc) {
      return { data: null, error: 'Product not found', loading: false };
    }
    
    const product = transformProduct(firstDoc);
    if (!product) {
      return { data: null, error: 'Failed to transform product data', loading: false };
    }
    
    return { data: product, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch product'), 
      loading: false 
    };
  }
}

export async function getSafeFeaturedProducts(limit: number = 6): Promise<SafeResult<SafeProduct[]>> {
  return getSafeProducts({ isFeatured: true, limit });
}

export async function getSafeProductsByCollection(collectionSlug: string, limit?: number): Promise<SafeResult<SafeProduct[]>> {
  try {
    // First get the collection to find its ID
    const collectionResult = await getSafeCollection(collectionSlug);
    
    if (!collectionResult.data) {
      return { data: null, error: 'Collection not found', loading: false };
    }
    
    return getSafeProducts({ collectionId: collectionResult.data.id, limit });
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch products by collection'), 
      loading: false 
    };
  }
}

export async function getSafeProductsByRoom(roomType: string, limit?: number): Promise<SafeResult<SafeProduct[]>> {
  return getSafeProducts({ roomType, limit });
}

export async function getSafeProductsByWeaveType(weaveType: string, limit?: number): Promise<SafeResult<SafeProduct[]>> {
  return getSafeProducts({ weaveType, limit });
}

export async function getSafeWeaveTypes(): Promise<SafeResult<SafeWeaveType[]>> {
  try {
    const q = query(
      collection(db, 'weaveTypes'),
      where('isActive', '==', true),
      orderBy('sortOrder', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const weaveTypes = transformWeaveTypes(snapshot.docs);
    
    return { data: weaveTypes, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch weave types'), 
      loading: false 
    };
  }
}

export interface WeaveTypeWithImage {
  weaveType: string;
  image?: { src: string; alt: string };
  productCount: number;
}

export async function getSafeAvailableWeaveTypes(): Promise<SafeResult<string[]>> {
  try {
    const q = query(
      collection(db, 'products'),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    const weaveTypes = new Set<string>();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.specifications?.weaveType && typeof data.specifications.weaveType === 'string') {
        weaveTypes.add(data.specifications.weaveType);
      }
    });

    const sortedWeaveTypes = Array.from(weaveTypes).sort();
    
    return { data: sortedWeaveTypes, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch available weave types'), 
      loading: false 
    };
  }
}

export async function getSafeWeaveTypesWithImages(): Promise<SafeResult<WeaveTypeWithImage[]>> {
  try {
    const weaveTypesResult = await getSafeWeaveTypes();

    if (weaveTypesResult.error) {
      return { data: null, error: weaveTypesResult.error, loading: false };
    }

    const weaveTypesWithImages: WeaveTypeWithImage[] = weaveTypesResult.data?.map(wt => ({
      weaveType: wt.name,
      image: { src: wt.image.url, alt: wt.image.alt },
      productCount: 0, // Product count is no longer calculated here
    })) || [];
    
    return { data: weaveTypesWithImages, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch weave types with images'), 
      loading: false 
    };
  }
}

/**
 * Collection Data Access Functions
 */

export interface CollectionFilters {
  type?: 'style' | 'space';
  isActive?: boolean;
  limit?: number;
}

export async function getSafeCollections(filters: CollectionFilters = {}): Promise<SafeResult<SafeCollection[]>> {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Always filter for active collections unless explicitly specified
    if (filters.isActive !== false) {
      constraints.push(where('isActive', '==', true));
    }
    
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }
    
    // Simplified ordering (indexes still building)
    constraints.push(orderBy('sortOrder', 'asc'));
    
    if (filters.limit && filters.limit > 0) {
      constraints.push(firestoreLimit(filters.limit));
    }
    
    const q = query(collection(db, 'collections'), ...constraints);
    const snapshot = await getDocs(q);
    
    const collections = transformCollections(snapshot.docs);
    
    return { data: collections, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch collections'), 
      loading: false 
    };
  }
}

export async function getSafeCollection(slug: string): Promise<SafeResult<SafeCollection>> {
  try {
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return { data: null, error: 'Invalid collection identifier', loading: false };
    }
    
    const q = query(
      collection(db, 'collections'),
      where('slug', '==', slug.trim()),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { data: null, error: 'Collection not found', loading: false };
    }
    
    const firstDoc = snapshot.docs[0];
    if (!firstDoc) {
      return { data: null, error: 'Collection not found', loading: false };
    }
    
    const coll = transformCollection(firstDoc);
    
    if (!coll) {
      return { data: null, error: 'Invalid collection data', loading: false };
    }
    
    return { data: coll, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch collection'), 
      loading: false 
    };
  }
}

export async function getSafeStyleCollections(limit?: number): Promise<SafeResult<SafeCollection[]>> {
  return getSafeCollections({ type: 'style', limit });
}

export async function getSafeSpaceCollections(limit?: number): Promise<SafeResult<SafeCollection[]>> {
  return getSafeCollections({ type: 'space', limit });
}

/**
 * Combined Data Access Functions
 */

export interface HomepageData {
  collections: SafeCollection[];
  featuredProducts: SafeProduct[];
  styleCollections: SafeCollection[];
  spaceCollections: SafeCollection[];
}

export async function getSafeHomepageData(): Promise<SafeResult<HomepageData>> {
  try {
    // Fetch all data concurrently
    const [
      collectionsResult,
      featuredProductsResult,
      styleCollectionsResult,
      spaceCollectionsResult
    ] = await Promise.all([
      getSafeCollections({ limit: 12 }),
      getSafeFeaturedProducts(6),
      getSafeStyleCollections(6),
      getSafeSpaceCollections(3)
    ]);
    
    // Even if some requests fail, return partial data
    const homepageData: HomepageData = {
      collections: collectionsResult.data || [],
      featuredProducts: featuredProductsResult.data || [],
      styleCollections: styleCollectionsResult.data || [],
      spaceCollections: spaceCollectionsResult.data || []
    };
    
    // Check if any critical data failed
    const hasErrors = [
      collectionsResult.error,
      featuredProductsResult.error,
      styleCollectionsResult.error,
      spaceCollectionsResult.error
    ].some(error => error !== null);
    
    if (hasErrors) {
      console.warn('Some homepage data failed to load:', {
        collections: collectionsResult.error,
        featuredProducts: featuredProductsResult.error,
        styleCollections: styleCollectionsResult.error,
        spaceCollections: spaceCollectionsResult.error
      });
    }
    
    return { data: homepageData, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch homepage data'), 
      loading: false 
    };
  }
}

/**
 * Search Functions
 */

export async function searchSafeProducts(searchTerm: string, limit: number = 20): Promise<SafeResult<SafeProduct[]>> {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return { data: [], error: null, loading: false };
    }
    
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that could be enhanced with Algolia/ElasticSearch
    const term = searchTerm.toLowerCase().trim();
    
    const q = query(
      collection(db, 'products'),
      where('isActive', '==', true),
      orderBy('name'),
      firestoreLimit(limit)
    );
    
    const snapshot = await getDocs(q);
    const allProducts = transformProducts(snapshot.docs);
    
    // Client-side filtering (could be moved to a search service)
    const filteredProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.specifications.materials.some(material => 
        material.toLowerCase().includes(term)
      )
    );
    
    return { data: filteredProducts, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'search products'), 
      loading: false 
    };
  }
}

/**
 * Individual Product/Collection Access Functions
 */

export async function getSafeProductBySlug(slug: string): Promise<SafeResult<SafeProduct>> {
  try {
    const q = query(
      collection(db, 'products'),
      where('slug', '==', slug),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { data: null, error: 'Product not found', loading: false };
    }
    
    const firstDoc = snapshot.docs[0];
    if (!firstDoc) {
      return { data: null, error: 'Product not found', loading: false };
    }
    
    const product = transformProduct(firstDoc);
    if (!product) {
      return { data: null, error: 'Failed to transform product data', loading: false };
    }
    
    return { data: product, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch product'), 
      loading: false 
    };
  }
}

export async function getSafeCollectionBySlug(slug: string): Promise<SafeResult<SafeCollection>> {
  try {
    const q = query(
      collection(db, 'collections'),
      where('slug', '==', slug),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { data: null, error: 'Collection not found', loading: false };
    }
    
    const firstDoc = snapshot.docs[0];
    if (!firstDoc) {
      return { data: null, error: 'Collection not found', loading: false };
    }
    
    const collection_data = transformCollection(firstDoc);
    if (!collection_data) {
      return { data: null, error: 'Failed to transform collection data', loading: false };
    }
    
    return { data: collection_data, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch collection'), 
      loading: false 
    };
  }
}

export async function getSafeRelatedProducts(productSlug: string, limitCount: number = 4): Promise<SafeResult<SafeProduct[]>> {
  try {
    // Validate input
    if (!productSlug || typeof productSlug !== 'string') {
      console.warn('Invalid product slug provided to getSafeRelatedProducts');
      return { data: [], error: null, loading: false };
    }

    // First get the current product to find its collections
    const currentProductResult = await getSafeProductBySlug(productSlug);

    if (!currentProductResult.data) {
      console.warn(`Product not found for slug: ${productSlug}`);
      return { data: [], error: null, loading: false };
    }

    const currentProduct = currentProductResult.data;

    // Check if product has collections
    if (!currentProduct.collections || currentProduct.collections.length === 0) {
      console.log(`Product ${productSlug} has no collections for related products`);
      return { data: [], error: null, loading: false };
    }

    // Filter out empty or invalid collection IDs
    const validCollections = currentProduct.collections.filter(id => id && typeof id === 'string' && id.trim().length > 0);
    if (validCollections.length === 0) {
      console.log(`Product ${productSlug} has no valid collections for related products`);
      return { data: [], error: null, loading: false };
    }

    // Get products from the same collections, excluding the current product
    try {
      const q = query(
        collection(db, 'products'),
        where('isActive', '==', true),
        where('collections', 'array-contains-any', validCollections),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount + 1) // Get one extra to exclude current product
      );

      const snapshot = await getDocs(q);
      let relatedProducts = transformProducts(snapshot.docs);

      // Filter out the current product
      relatedProducts = relatedProducts.filter(product => product.slug !== productSlug);

      // Limit to desired count
      relatedProducts = relatedProducts.slice(0, limitCount);

      console.log(`Found ${relatedProducts.length} related products for ${productSlug}`);
      return { data: relatedProducts, error: null, loading: false };
    } catch (queryError) {
      console.error('Firebase query error in getSafeRelatedProducts:', queryError);
      return {
        data: null,
        error: handleFirebaseError(queryError, 'fetch related products'),
        loading: false
      };
    }
  } catch (error) {
    console.error('Error in getSafeRelatedProducts:', error);
    return {
      data: null,
      error: handleFirebaseError(error, 'fetch related products'),
      loading: false
    };
  }
}

/**
 * Admin Data Access Functions
 */

export interface AdminStats {
  totalProducts: number;
  totalCollections: number;
  pendingLeads: number;
  totalUsers: number;
  recentActivity: any[];
}

/**
 * Get admin dashboard statistics
 */
export async function getSafeAdminStats(): Promise<SafeResult<AdminStats>> {
  try {
    // Get products count
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const totalProducts = productsSnapshot.size;

    // Get collections count
    const collectionsSnapshot = await getDocs(collection(db, 'collections'));
    const totalCollections = collectionsSnapshot.size;

    // Get pending leads count
    const leadsQuery = query(
      collection(db, 'leads'),
      where('status', 'in', ['new', 'pending'])
    );
    const leadsSnapshot = await getDocs(leadsQuery);
    const pendingLeads = leadsSnapshot.size;

    // For now, assume single admin user
    const totalUsers = 1;

    // Recent activity placeholder
    const recentActivity: any[] = [];

    const stats: AdminStats = {
      totalProducts,
      totalCollections,
      pendingLeads,
      totalUsers,
      recentActivity
    };

    return { data: stats, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch admin stats'), 
      loading: false 
    };
  }
}

/**
 * Get all leads for admin management
 */
export async function getSafeLeads(): Promise<SafeResult<any[]>> {
  try {
    const leadsQuery = query(
      collection(db, 'leads'),
      orderBy('createdAt', 'desc'),
      firestoreLimit(50)
    );
    
    const snapshot = await getDocs(leadsQuery);
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null
    }));

    return { data: leads, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch leads'), 
      loading: false 
    };
  }
}

/**
 * Get collections for admin management (both types)
 */
export async function getSafeAdminCollections(type?: 'style' | 'space'): Promise<SafeResult<SafeCollection[]>> {
  try {
    let collectionsQuery;
    
    if (type) {
      collectionsQuery = query(
        collection(db, 'collections'),
        where('type', '==', type),
        orderBy('name', 'asc')
      );
    } else {
      collectionsQuery = query(
        collection(db, 'collections'),
        orderBy('name', 'asc')
      );
    }
    
    const snapshot = await getDocs(collectionsQuery);
    const collections = transformCollections(snapshot.docs);

    return { data: collections, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch collections'), 
      loading: false 
    };
  }
}

/**
 * Get all products for admin management
 */
export async function getSafeAdminProducts(): Promise<SafeResult<SafeProduct[]>> {
  try {
    const productsQuery = query(
      collection(db, 'products'),
      orderBy('updatedAt', 'desc'),
      firestoreLimit(100)
    );
    
    const snapshot = await getDocs(productsQuery);
    const products = transformProducts(snapshot.docs);

    return { data: products, error: null, loading: false };
  } catch (error) {
    return { 
      data: null, 
      error: handleFirebaseError(error, 'fetch products'), 
      loading: false 
    };
  }
}