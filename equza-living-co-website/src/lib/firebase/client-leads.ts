/**
 * Client-Side Leads Data Layer
 * Firestore operations for lead management using client-side Firebase SDK
 */

import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

import type {
  ContactFormData,
  CustomizeFormData,
  EnquiryFormData,
  TradeFormData,
} from '@/types';
import { db } from './config';
import {
  createLeadData,
  validateLeadCreationInput,
  sanitizeInput,
} from '@/lib/schemas/lead-schema';

/**
 * Create lead from contact form (client-side)
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
 * Create lead from customize form (client-side)
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
 * Create lead from enquiry form (client-side)
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
 * Create lead from trade form (client-side)
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
