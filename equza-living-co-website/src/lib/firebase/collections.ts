/**
 * Collections Data Layer
 * Firestore operations for collections with caching and validation
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
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { unstable_cache } from 'next/cache';

import type { Collection, CollectionFilters } from '@/types';
import { db } from './config';

// Cache configuration
const CACHE_TAGS = {
  collections: 'collections',
  collection: (id: string) => `collection-${id}`,
  collectionSlug: (slug: string) => `collection-slug-${slug}`,
} as const;

const CACHE_REVALIDATE = {
  collections: 300, // 5 minutes
  collection: 600, // 10 minutes
} as const;

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
const validateCollectionData = (data: Partial<Collection>): void => {
  if (data.name && (data.name.length < 1 || data.name.length > 100)) {
    throw new Error('Collection name must be between 1 and 100 characters');
  }
  
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    throw new Error('Collection slug must contain only lowercase letters, numbers, and hyphens');
  }
  
  if (data.type && !['style', 'space'].includes(data.type)) {
    throw new Error('Collection type must be either "style" or "space"');
  }
  
  if (data.sortOrder && data.sortOrder < 0) {
    throw new Error('Sort order must be a positive number');
  }
};

// Cache tags helper
const getCacheTags = (type?: 'style' | 'space'): string[] => {
  const tags: string[] = [CACHE_TAGS.collections];
  if (type) tags.push(`collections-${type}`);
  return tags;
};

/**
 * Get collections with filters and caching
 */
export const getCollections = unstable_cache(
  async (filters: CollectionFilters = {}): Promise<Collection[]> => {
    try {
      const constraints: QueryConstraint[] = [];
      
      // Apply filters
      if (filters.type) {
        constraints.push(where('type', '==', filters.type));
      }
      
      if (filters.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }
      
      // Default ordering
      constraints.push(orderBy('sortOrder', 'asc'));
      
      // Pagination
      if (filters.limit) {
        constraints.push(limit(filters.limit));
      }
      
      const q = query(collection(db, 'collections'), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs
        .map(doc => convertDoc<Collection>(doc))
        .filter(Boolean) as Collection[];
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw new Error('Failed to fetch collections');
    }
  },
  ['collections'],
  {
    revalidate: CACHE_REVALIDATE.collections,
    tags: getCacheTags(),
  }
);

/**
 * Get collections by type with caching
 */
export const getCollectionsByType = unstable_cache(
  async (type: 'style' | 'space'): Promise<Collection[]> => {
    return getCollections({ type, isActive: true });
  },
  ['collections-by-type'],
  {
    revalidate: CACHE_REVALIDATE.collections,
    tags: getCacheTags(),
  }
);

/**
 * Get single collection by ID with caching
 */
export const getCollectionById = unstable_cache(
  async (id: string): Promise<Collection | null> => {
    try {
      const docRef = doc(db, 'collections', id);
      const docSnap = await getDoc(docRef);
      
      return convertDoc<Collection>(docSnap);
    } catch (error) {
      console.error('Error fetching collection by ID:', error);
      throw new Error('Failed to fetch collection');
    }
  },
  ['collection-by-id'],
  {
    revalidate: CACHE_REVALIDATE.collection,
    tags: [CACHE_TAGS.collections],
  }
);

/**
 * Get single collection by slug with caching
 */
export const getCollectionBySlug = unstable_cache(
  async (slug: string): Promise<Collection | null> => {
    try {
      const q = query(
        collection(db, 'collections'),
        where('slug', '==', slug),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      return convertDoc<Collection>(snapshot.docs[0]!);
    } catch (error) {
      console.error('Error fetching collection by slug:', error);
      throw new Error('Failed to fetch collection');
    }
  },
  ['collection-by-slug'],
  {
    revalidate: CACHE_REVALIDATE.collection,
    tags: [CACHE_TAGS.collections],
  }
);

/**
 * Get featured collections
 */
export const getFeaturedCollections = unstable_cache(
  async (limitCount: number = 6): Promise<Collection[]> => {
    try {
      const q = query(
        collection(db, 'collections'),
        where('isActive', '==', true),
        where('isFeatured', '==', true),
        orderBy('sortOrder', 'asc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs
        .map(doc => convertDoc<Collection>(doc))
        .filter(Boolean) as Collection[];
    } catch (error) {
      console.error('Error fetching featured collections:', error);
      throw new Error('Failed to fetch featured collections');
    }
  },
  ['featured-collections'],
  {
    revalidate: CACHE_REVALIDATE.collections,
    tags: [CACHE_TAGS.collections, 'featured-collections'],
  }
);

/**
 * Search collections by name
 */
export const searchCollections = async (
  searchTerm: string,
  limitCount: number = 10
): Promise<Collection[]> => {
  try {
    if (!searchTerm.trim()) return [];
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Get all active collections and filter client-side for better search
    const allCollections = await getCollections({ 
      isActive: true, 
      limit: 100 
    });
    
    return allCollections
      .filter(collection => 
        collection.name.toLowerCase().includes(searchTermLower) ||
        collection.description.toLowerCase().includes(searchTermLower)
      )
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error searching collections:', error);
    throw new Error('Failed to search collections');
  }
};

/**
 * Get collections count by type
 */
export const getCollectionsCount = unstable_cache(
  async (): Promise<{ total: number; style: number; space: number }> => {
    try {
      const [allCollections, styleCollections, spaceCollections] = await Promise.all([
        getCollections({ isActive: true }),
        getCollections({ type: 'style', isActive: true }),
        getCollections({ type: 'space', isActive: true }),
      ]);
      
      return {
        total: allCollections.length,
        style: styleCollections.length,
        space: spaceCollections.length,
      };
    } catch (error) {
      console.error('Error getting collections count:', error);
      throw new Error('Failed to get collections count');
    }
  },
  ['collections-count'],
  {
    revalidate: CACHE_REVALIDATE.collections,
    tags: [CACHE_TAGS.collections],
  }
);

/**
 * Create new collection (admin only)
 */
export const createCollection = async (
  collectionData: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    validateCollectionData(collectionData);
    
    const docData = {
      ...collectionData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'collections'), docData);
    
    // Invalidate cache
    // revalidateTag(CACHE_TAGS.collections);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw new Error('Failed to create collection');
  }
};

/**
 * Update collection (admin only)
 */
export const updateCollection = async (
  id: string,
  updates: Partial<Omit<Collection, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    validateCollectionData(updates);
    
    const docRef = doc(db, 'collections', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    await updateDoc(docRef, updateData);
    
    // Invalidate cache
    // revalidateTag(CACHE_TAGS.collections);
    // revalidateTag(CACHE_TAGS.collection(id));
  } catch (error) {
    console.error('Error updating collection:', error);
    throw new Error('Failed to update collection');
  }
};

/**
 * Add a product ID to a collection's productIds array (idempotent)
 */
export const addProductIdToCollection = async (
  collectionId: string,
  productId: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'collections', collectionId);
    await updateDoc(docRef, {
      productIds: arrayUnion(productId),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error adding product to collection:', error);
    throw new Error('Failed to add product to collection');
  }
};

/**
 * Remove a product ID from a collection's productIds array (idempotent)
 */
export const removeProductIdFromCollection = async (
  collectionId: string,
  productId: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'collections', collectionId);
    await updateDoc(docRef, {
      productIds: arrayRemove(productId),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error removing product from collection:', error);
    throw new Error('Failed to remove product from collection');
  }
};

/**
 * Delete collection (admin only)
 */
export const deleteCollection = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'collections', id);
    await deleteDoc(docRef);
    
    // Invalidate cache
    // revalidateTag(CACHE_TAGS.collections);
    // revalidateTag(CACHE_TAGS.collection(id));
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw new Error('Failed to delete collection');
  }
};

/**
 * Check if collection slug is available
 */
export const isCollectionSlugAvailable = async (slug: string, excludeId?: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'collections'),
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
    console.error('Error checking collection slug availability:', error);
    throw new Error('Failed to check slug availability');
  }
};