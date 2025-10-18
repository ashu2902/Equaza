/**
 * Weave Types Data Layer
 * Firestore operations for weave types with validation
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
  Timestamp,
  QueryConstraint,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';

import type { WeaveType } from '@/types'; // Assuming WeaveType is defined here
import { db } from './config';
import { getAdminFirestore } from './server-app';

// Helper function to convert Admin Firestore DocumentSnapshot to client-side format
const convertAdminDocToClientDoc = (adminDoc: any): DocumentSnapshot => {
  return {
    id: adminDoc.id,
    exists: () => adminDoc.exists,
    data: () => adminDoc.data(),
    ref: adminDoc.ref,
    metadata: adminDoc.metadata || {
      fromCache: false,
      hasPendingWrites: false,
    },
    toJSON: () => (adminDoc.toJSON ? adminDoc.toJSON() : {}),
  } as DocumentSnapshot;
};

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
const validateWeaveTypeData = (data: Partial<WeaveType>): void => {
  if (data.name && (data.name.length < 1 || data.name.length > 100)) {
    throw new Error('Weave type name must be between 1 and 100 characters');
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    throw new Error(
      'Weave type slug must contain only lowercase letters, numbers, and hyphens'
    );
  }

  if (data.sortOrder && data.sortOrder < 0) {
    throw new Error('Sort order must be a positive number');
  }

  if (data.image && (!data.image.url || !data.image.alt)) {
    throw new Error('Weave type image must have a URL and alt text');
  }
};

/**
 * Get all active weave types
 */
export const getWeaveTypes = async (): Promise<WeaveType[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    constraints.push(where('isActive', '==', true));
    constraints.push(orderBy('sortOrder', 'asc'));

    const q = query(collection(db, 'weaveTypes'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc) => convertDoc<WeaveType>(doc))
      .filter(Boolean) as WeaveType[];
  } catch (error) {
    console.error('Error fetching weave types:', error);
    throw new Error('Failed to fetch weave types');
  }
};

/**
 * Get single weave type by ID
 */
export const getWeaveTypeById = async (
  id: string
): Promise<WeaveType | null> => {
  try {
    const adminDb = getAdminFirestore();
    const docSnap = await adminDb.collection('weaveTypes').doc(id).get();

    return convertDoc<WeaveType>(convertAdminDocToClientDoc(docSnap));
  } catch (error) {
    console.error('Error fetching weave type by ID:', error);
    throw new Error('Failed to fetch weave type');
  }
};

/**
 * Create new weave type (admin only)
 */
export const createWeaveType = async (
  weaveTypeData: Omit<WeaveType, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const adminDb = getAdminFirestore();
    const docData = {
      ...weaveTypeData,
      createdAt: AdminTimestamp.now(),
      updatedAt: AdminTimestamp.now(),
    };

    const docRef = await adminDb.collection('weaveTypes').add(docData);

    return docRef.id;
  } catch (error) {
    console.error('Error creating weave type:', error);
    throw new Error('Failed to create weave type');
  }
};

/**
 * Update weave type (admin only)
 */
export const updateWeaveType = async (
  id: string,
  updates: Partial<Omit<WeaveType, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
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

    await adminDb.collection('weaveTypes').doc(id).update(updateData);
  } catch (error) {
    console.error('Error updating weave type:', error);
    throw new Error('Failed to update weave type');
  }
};

/**
 * Delete weave type (admin only)
 */
export const deleteWeaveType = async (id: string): Promise<void> => {
  try {
    const adminDb = getAdminFirestore();
    await adminDb.collection('weaveTypes').doc(id).delete();
  } catch (error) {
    console.error('Error deleting weave type:', error);
    throw new Error('Failed to delete weave type');
  }
};

/**
 * Check if weave type slug is available
 */
export const isWeaveTypeSlugAvailable = async (
  slug: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    const adminDb = getAdminFirestore();
    const snapshot = await adminDb
      .collection('weaveTypes')
      .where('slug', '==', slug)
      .get();

    if (snapshot.empty) return true;

    // If excluding an ID (for updates), check if the found doc is the same
    if (excludeId) {
      return snapshot.docs.every((doc) => doc.id === excludeId);
    }

    return false;
  } catch (error) {
    console.error('Error checking weave type slug availability:', error);
    throw new Error('Failed to check slug availability');
  }
};
