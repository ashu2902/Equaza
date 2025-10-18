/**
 * Leads Data Layer
 * Firestore operations for lead management with validation
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

import type {
  Lead,
  LeadType,
  LeadStatus,
  LeadFilters,
  LeadNote,
  ContactFormData,
  CustomizeFormData,
  EnquiryFormData,
  TradeFormData,
} from '@/types';
import { db } from './config';
import { getAdminFirestore } from './server-app';
import { Timestamp as AdminTimestamp } from 'firebase-admin/firestore';
import {
  LeadCreationInput,
  LeadUpdateInput,
  LeadFilters as SchemaLeadFilters,
  createLeadData,
  validateLeadData,
  validateLeadCreationInput,
  validateLeadUpdateInput,
  validateLeadFilters,
  sanitizeInput,
  convertFirestoreDocToLead,
  getDefaultLeadData,
} from '@/lib/schemas/lead-schema';

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

// Note: Validation and sanitization functions are now imported from the unified schema

/**
 * Get leads with filters
 */
export const getLeads = async (filters: LeadFilters = {}): Promise<Lead[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }

    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters.assignedTo) {
      constraints.push(where('assignedTo', '==', filters.assignedTo));
    }

    // Date range filtering (simplified - in production you'd want better date handling)
    if (filters.dateFrom) {
      constraints.push(
        where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom))
      );
    }

    if (filters.dateTo) {
      constraints.push(
        where('createdAt', '<=', Timestamp.fromDate(filters.dateTo))
      );
    }

    // Default ordering (newest first)
    constraints.push(orderBy('createdAt', 'desc'));

    // Pagination
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    const q = query(collection(db, 'leads'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc) => convertDoc<Lead>(doc))
      .filter(Boolean) as Lead[];
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw new Error('Failed to fetch leads');
  }
};

/**
 * Get single lead by ID
 */
export const getLeadById = async (id: string): Promise<Lead | null> => {
  try {
    const docRef = doc(db, 'leads', id);
    const docSnap = await getDoc(docRef);

    return convertDoc<Lead>(docSnap);
  } catch (error) {
    console.error('Error fetching lead by ID:', error);
    throw new Error('Failed to fetch lead');
  }
};

/**
 * Get lead by ID (admin-side)
 */
export const getLeadByIdAdmin = async (id: string): Promise<Lead | null> => {
  try {
    const adminDb = getAdminFirestore();
    const docSnap = await adminDb.collection('leads').doc(id).get();

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

    return { id: docSnap.id, ...convertedData } as Lead;
  } catch (error) {
    console.error('Error fetching lead by ID (admin):', error);
    throw new Error('Failed to fetch lead');
  }
};

/**
 * Get leads by status
 */
export const getLeadsByStatus = async (status: LeadStatus): Promise<Lead[]> => {
  return getLeads({ status });
};

/**
 * Get leads by type
 */
export const getLeadsByType = async (type: LeadType): Promise<Lead[]> => {
  return getLeads({ type });
};

/**
 * Get recent leads
 */
export const getRecentLeads = async (
  limitCount: number = 10
): Promise<Lead[]> => {
  return getLeads({ limit: limitCount });
};

/**
 * Get leads statistics
 */
export const getLeadsStats = async (): Promise<{
  total: number;
  byStatus: Record<LeadStatus, number>;
  byType: Record<LeadType, number>;
  recent: number; // last 7 days
}> => {
  try {
    const allLeads = await getLeads({});
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats = {
      total: allLeads.length,
      byStatus: {
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        closed: 0,
      } as Record<LeadStatus, number>,
      byType: {
        contact: 0,
        trade: 0,
        customize: 0,
        'product-enquiry': 0,
      } as Record<LeadType, number>,
      recent: 0,
    };

    allLeads.forEach((lead) => {
      stats.byStatus[lead.status]++;
      stats.byType[lead.type]++;

      const leadDate = lead.createdAt.toDate();
      if (leadDate >= sevenDaysAgo) {
        stats.recent++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting leads stats:', error);
    throw new Error('Failed to get leads stats');
  }
};

/**
 * Create lead from contact form
 */
export const createContactLead = async (
  formData: ContactFormData,
  source: string = 'contact-form'
): Promise<string> => {
  try {
    // Create lead data using unified schema
    const leadData = createLeadData({
      type: 'contact',
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: formData.phone ? sanitizeInput(formData.phone) : null,
      message: sanitizeInput(formData.message),
      source: sanitizeInput(source),
      status: 'new',
      notes: [],
    });

    // Validate the complete lead data
    const validatedData = validateLeadCreationInput(leadData);

    // Add timestamps
    const docData = {
      ...validatedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'leads'), docData);

    return docRef.id;
  } catch (error) {
    console.error('Error creating contact lead:', error);
    throw new Error('Failed to create contact lead');
  }
};

/**
 * Create lead from customize form
 */
export const createCustomizeLead = async (
  formData: CustomizeFormData,
  source: string = 'customize-form'
): Promise<string> => {
  try {
    // Create lead data using unified schema
    const leadData = createLeadData({
      type: 'customize',
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: formData.phone ? sanitizeInput(formData.phone) : null,
      message: formData.message ? sanitizeInput(formData.message) : undefined,
      source: sanitizeInput(source),
      status: 'new',
      notes: [],
      customizationDetails: {
        preferredSize: sanitizeInput(formData.preferredSize),
        preferredMaterials: formData.preferredMaterials || [],
        moodboardFiles:
          formData.moodboardFiles?.map((file) => ({
            filename: file.name,
            url: '', // Will be populated after upload
            storageRef: '', // Will be populated after upload
          })) || [],
      },
    });

    // Validate the complete lead data
    const validatedData = validateLeadCreationInput(leadData);

    // Add timestamps
    const docData = {
      ...validatedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'leads'), docData);

    return docRef.id;
  } catch (error) {
    console.error('Error creating customize lead:', error);
    throw new Error('Failed to create customize lead');
  }
};

/**
 * Create lead from enquiry form
 */
export const createEnquiryLead = async (
  formData: EnquiryFormData,
  source: string = 'product-enquiry'
): Promise<string> => {
  try {
    // Create lead data using unified schema
    const leadData = createLeadData({
      type: 'product-enquiry',
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message),
      source: sanitizeInput(source),
      productId: sanitizeInput(formData.productId),
      status: 'new',
      notes: [],
    });

    // Validate the complete lead data
    const validatedData = validateLeadCreationInput(leadData);

    // Add timestamps
    const docData = {
      ...validatedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'leads'), docData);

    return docRef.id;
  } catch (error) {
    console.error('Error creating enquiry lead:', error);
    throw new Error('Failed to create enquiry lead');
  }
};

/**
 * Create lead from trade form
 */
export const createTradeLead = async (
  formData: TradeFormData,
  source: string = 'trade-form'
): Promise<string> => {
  try {
    // Create lead data using unified schema
    const leadData = createLeadData({
      type: 'trade',
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: formData.phone ? sanitizeInput(formData.phone) : null,
      message: sanitizeInput(formData.message),
      source: sanitizeInput(source),
      status: 'new',
      notes: [],
      company: formData.company ? sanitizeInput(formData.company) : undefined,
    });

    // Validate the complete lead data
    const validatedData = validateLeadCreationInput(leadData);

    // Add timestamps
    const docData = {
      ...validatedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'leads'), docData);

    return docRef.id;
  } catch (error) {
    console.error('Error creating trade lead:', error);
    throw new Error('Failed to create trade lead');
  }
};

/**
 * Update lead status
 */
export const updateLeadStatus = async (
  id: string,
  status: LeadStatus,
  assignedTo?: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'leads', id);
    const updateData: any = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw new Error('Failed to update lead status');
  }
};

/**
 * Update lead status (admin-side)
 */
export const updateLeadStatusAdmin = async (
  id: string,
  status: LeadStatus,
  assignedTo?: string
): Promise<void> => {
  try {
    const adminDb = getAdminFirestore();
    const updateData: any = {
      status,
      updatedAt: AdminTimestamp.now(),
    };

    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
    }

    await adminDb.collection('leads').doc(id).update(updateData);
  } catch (error) {
    console.error('Error updating lead status (admin):', error);
    throw new Error('Failed to update lead status');
  }
};

/**
 * Add note to lead
 */
export const addLeadNote = async (
  id: string,
  noteContent: string,
  createdBy: string
): Promise<void> => {
  try {
    const lead = await getLeadById(id);
    if (!lead) throw new Error('Lead not found');

    const newNote: LeadNote = {
      content: sanitizeInput(noteContent),
      createdBy: sanitizeInput(createdBy),
      createdAt: Timestamp.now(),
    };

    const updatedNotes = [...lead.notes, newNote];

    const docRef = doc(db, 'leads', id);
    await updateDoc(docRef, {
      notes: updatedNotes,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error adding lead note:', error);
    throw new Error('Failed to add lead note');
  }
};

/**
 * Add note to lead (admin-side)
 */
export const addLeadNoteAdmin = async (
  id: string,
  noteContent: string,
  createdBy: string
): Promise<void> => {
  try {
    const lead = await getLeadByIdAdmin(id);
    if (!lead) throw new Error('Lead not found');

    const adminDb = getAdminFirestore();
    const adminTimestamp = AdminTimestamp.now();
    const newNote: LeadNote = {
      content: sanitizeInput(noteContent),
      createdBy: sanitizeInput(createdBy),
      createdAt: Timestamp.fromDate(adminTimestamp.toDate()),
    };

    const updatedNotes = [...lead.notes, newNote];

    await adminDb.collection('leads').doc(id).update({
      notes: updatedNotes,
      updatedAt: AdminTimestamp.now(),
    });
  } catch (error) {
    console.error('Error adding lead note (admin):', error);
    throw new Error('Failed to add lead note');
  }
};

/**
 * Update lead
 */
export const updateLead = async (
  id: string,
  updates: Partial<Omit<Lead, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    validateLeadData(updates);

    const docRef = doc(db, 'leads', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating lead:', error);
    throw new Error('Failed to update lead');
  }
};

/**
 * Update lead (admin-side)
 */
export const updateLeadAdmin = async (
  id: string,
  updates: Partial<Omit<Lead, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    validateLeadData(updates);

    const adminDb = getAdminFirestore();
    const updateData = {
      ...updates,
      updatedAt: AdminTimestamp.now(),
    };

    await adminDb.collection('leads').doc(id).update(updateData);
  } catch (error) {
    console.error('Error updating lead (admin):', error);
    throw new Error('Failed to update lead');
  }
};

/**
 * Delete lead (admin only)
 */
export const deleteLead = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'leads', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw new Error('Failed to delete lead');
  }
};

/**
 * Delete lead (admin-side)
 */
export const deleteLeadAdmin = async (id: string): Promise<void> => {
  try {
    const adminDb = getAdminFirestore();
    await adminDb.collection('leads').doc(id).delete();
  } catch (error) {
    console.error('Error deleting lead (admin):', error);
    throw new Error('Failed to delete lead');
  }
};

/**
 * Search leads by name or email
 */
export const searchLeads = async (
  searchTerm: string,
  limitCount: number = 20
): Promise<Lead[]> => {
  try {
    if (!searchTerm.trim()) return [];

    const searchTermLower = searchTerm.toLowerCase();

    // Get all leads and filter client-side for better search
    const allLeads = await getLeads({ limit: 100 });

    return allLeads
      .filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTermLower) ||
          lead.email.toLowerCase().includes(searchTermLower) ||
          (lead.message && lead.message.toLowerCase().includes(searchTermLower))
      )
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error searching leads:', error);
    throw new Error('Failed to search leads');
  }
};
