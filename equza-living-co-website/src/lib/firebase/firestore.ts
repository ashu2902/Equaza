import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

import type {
  Product,
  Collection,
  Page,
  ProductFilters,
  CollectionFilters,
  ContactFormData,
  CustomizeFormData,
  EnquiryFormData,
  TradeFormData,
} from '@/types';

import { db } from './config';

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

// Collections CRUD operations
export const getCollections = async (filters: CollectionFilters = {}): Promise<Collection[]> => {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }
    
    if (filters.isActive !== undefined) {
      constraints.push(where('isActive', '==', filters.isActive));
    }
    
    constraints.push(orderBy('sortOrder', 'asc'));
    
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }
    
    const q = query(collection(db, 'collections'), ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => convertDoc<Collection>(doc)).filter(Boolean) as Collection[];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching collections:', error);
    throw new Error('Failed to fetch collections');
  }
};

export const getCollection = async (slug: string): Promise<Collection | null> => {
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
    // eslint-disable-next-line no-console
    console.error('Error fetching collection:', error);
    throw new Error('Failed to fetch collection');
  }
};

// Products CRUD operations
export const getProducts = async (filters: ProductFilters = {}): Promise<Product[]> => {
  try {
    const constraints: QueryConstraint[] = [];
    
    if (filters.collectionId) {
      constraints.push(where('collections', 'array-contains', filters.collectionId));
    }
    
    // roomTypes removed
    
    if (filters.isActive !== undefined) {
      constraints.push(where('isActive', '==', filters.isActive));
    }
    
    if (filters.isFeatured !== undefined) {
      constraints.push(where('isFeatured', '==', filters.isFeatured));
    }
    
    constraints.push(orderBy('sortOrder', 'asc'));
    
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }
    
    const q = query(collection(db, 'products'), ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => convertDoc<Product>(doc)).filter(Boolean) as Product[];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getProduct = async (slug: string): Promise<Product | null> => {
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
    // eslint-disable-next-line no-console
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
};

export const getFeaturedProducts = async (limitCount: number = 8): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('isActive', '==', true),
      where('isFeatured', '==', true),
      orderBy('sortOrder', 'asc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => convertDoc<Product>(doc)).filter(Boolean) as Product[];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
};

export const getProductsByCollection = async (collectionSlug: string): Promise<Product[]> => {
  try {
    // First get the collection ID from slug
    const collectionDoc = await getCollection(collectionSlug);
    if (!collectionDoc) return [];
    
    return getProducts({ 
      collectionId: collectionDoc.id, 
      isActive: true 
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching products by collection:', error);
    throw new Error('Failed to fetch products by collection');
  }
};

// Pages CRUD operations
export const getPage = async (slug: string): Promise<Page | null> => {
  try {
    const q = query(
      collection(db, 'pages'),
      where('slug', '==', slug),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    return convertDoc<Page>(snapshot.docs[0]!);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching page:', error);
    throw new Error('Failed to fetch page');
  }
};

// Lead creation functions (for anonymous form submissions)
export const createContactLead = async (data: ContactFormData): Promise<string> => {
  try {
    const leadData = {
      type: 'contact' as const,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      source: 'contact-form',
      status: 'new' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      notes: [],
    };
    
    const docRef = await addDoc(collection(db, 'leads'), leadData);
    return docRef.id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating contact lead:', error);
    throw new Error('Failed to create contact lead');
  }
};

export const createCustomizeLead = async (data: CustomizeFormData): Promise<string> => {
  try {
    const leadData = {
      type: 'customize' as const,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
      source: 'customize-form',
      status: 'new' as const,
      customizationDetails: {
        preferredSize: data.preferredSize,
        preferredMaterials: data.preferredMaterials || [],
        moodboardFiles: [], // Files will be uploaded separately
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      notes: [],
    };
    
    const docRef = await addDoc(collection(db, 'leads'), leadData);
    return docRef.id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating customize lead:', error);
    throw new Error('Failed to create customize lead');
  }
};

export const createEnquiryLead = async (data: EnquiryFormData): Promise<string> => {
  try {
    const leadData = {
      type: 'product-enquiry' as const,
      name: data.name,
      email: data.email,
      message: data.message,
      productId: data.productId,
      source: 'product-enquiry',
      status: 'new' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      notes: [],
    };
    
    const docRef = await addDoc(collection(db, 'leads'), leadData);
    return docRef.id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating enquiry lead:', error);
    throw new Error('Failed to create enquiry lead');
  }
};

export const createTradeLead = async (data: TradeFormData): Promise<string> => {
  try {
    const leadData = {
      type: 'trade' as const,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      source: 'trade-form',
      status: 'new' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      notes: [],
    };
    
    const docRef = await addDoc(collection(db, 'leads'), leadData);
    return docRef.id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating trade lead:', error);
    throw new Error('Failed to create trade lead');
  }
};

// Settings operations
export const getSiteSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default settings if none exist
      return {
        siteName: 'Equza Living Co.',
        siteDescription: 'Premium handcrafted rugs for modern spaces',
        contactEmail: 'info@equzalivingco.com',
        calendlyUrl: 'https://calendly.com/equzalivingco',
        socialLinks: {
          instagram: 'https://instagram.com/equzalivingco',
          pinterest: 'https://pinterest.com/equzalivingco',
          facebook: 'https://facebook.com/equzalivingco',
        },
        seoDefaults: {
          defaultTitle: 'Equza Living Co. - Premium Handcrafted Rugs',
          defaultDescription: 'Discover premium handcrafted rugs that bring crafted calm to modern spaces. Explore our collections of artisan-made rugs from India.',
          ogImage: '/images/og-default.jpg',
        },
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching site settings:', error);
    throw new Error('Failed to fetch site settings');
  }
};

// Lookbook operations
export const getLookbook = async () => {
  try {
    const docRef = doc(db, 'lookbook', 'current');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().isActive) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching lookbook:', error);
    throw new Error('Failed to fetch lookbook');
  }
}; 