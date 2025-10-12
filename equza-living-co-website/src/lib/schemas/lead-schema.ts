/**
 * Unified Lead Schema and Validation
 * 
 * This file defines the canonical lead data structure and validation
 * to ensure consistency across all lead creation and management functions.
 */

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

// Lead Types
export const LeadTypeSchema = z.enum(['contact', 'customize', 'product-enquiry', 'trade']);
export type LeadType = z.infer<typeof LeadTypeSchema>;

// Lead Status
export const LeadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']);
export type LeadStatus = z.infer<typeof LeadStatusSchema>;

// Lead Note Schema
export const LeadNoteSchema = z.object({
  id: z.string(),
  content: z.string().min(1).max(1000),
  author: z.string().min(1).max(100),
  createdAt: z.instanceof(Timestamp),
  type: z.enum(['note', 'call', 'email', 'meeting']).default('note'),
});

// Customization Details Schema
export const CustomizationDetailsSchema = z.object({
  preferredSize: z.string().optional(),
  preferredMaterials: z.array(z.string()).default([]),
  moodboardFiles: z.array(z.object({
    filename: z.string(),
    url: z.string(),
    storageRef: z.string(),
  })).default([]),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  specialRequirements: z.string().optional(),
});

// Base Lead Schema
export const BaseLeadSchema = z.object({
  // Core identification
  id: z.string().optional(), // Will be set by Firestore
  
  // Lead classification
  type: LeadTypeSchema,
  status: LeadStatusSchema.default('new'),
  source: z.string().min(1).max(100),
  
  // Contact information
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional().nullable(),
  company: z.string().max(100).optional(),
  
  // Lead content
  message: z.string().max(2000).optional(),
  
  // Product/Collection reference
  productId: z.string().optional(),
  productRef: z.string().optional(),
  collectionId: z.string().optional(),
  
  // Customization details (for customize leads)
  customizationDetails: CustomizationDetailsSchema.optional(),
  
  // Lead management
  assignedTo: z.string().optional(),
  priority: z.boolean().default(false),
  notes: z.array(LeadNoteSchema).default([]),
  
  // Metadata
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
  
  // Response tracking
  responseTime: z.string().optional(),
  lastContactedAt: z.instanceof(Timestamp).optional(),
});

// Complete Lead Type
export type Lead = z.infer<typeof BaseLeadSchema>;

// Lead Creation Input Schema (without auto-generated fields)
export const LeadCreationInputSchema = BaseLeadSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  notes: true,
}).extend({
  notes: z.array(LeadNoteSchema).optional().default([]),
});

export type LeadCreationInput = z.infer<typeof LeadCreationInputSchema>;

// Lead Update Schema (all fields optional except id)
export const LeadUpdateSchema = BaseLeadSchema.partial().extend({
  id: z.string(),
  updatedAt: z.instanceof(Timestamp),
});

export type LeadUpdateInput = z.infer<typeof LeadUpdateSchema>;

// Lead Filters Schema
export const LeadFiltersSchema = z.object({
  type: LeadTypeSchema.optional(),
  status: LeadStatusSchema.optional(),
  assignedTo: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
});

export type LeadFilters = z.infer<typeof LeadFiltersSchema>;

// Lead Stats Schema
export const LeadStatsSchema = z.object({
  total: z.number(),
  new: z.number(),
  contacted: z.number(),
  qualified: z.number(),
  converted: z.number(),
  closed: z.number(),
  byType: z.record(LeadTypeSchema, z.number()),
  bySource: z.record(z.string(), z.number()),
});

export type LeadStats = z.infer<typeof LeadStatsSchema>;

/**
 * Create a new lead with proper validation and defaults
 */
export function createLeadData(input: Partial<LeadCreationInput>): LeadCreationInput {
  const validatedInput = LeadCreationInputSchema.parse({
    type: 'contact',
    status: 'new',
    source: 'unknown',
    name: '',
    email: '',
    phone: null,
    message: '',
    notes: [],
    priority: false,
    ...input,
  });

  return validatedInput;
}

/**
 * Validate and sanitize lead data
 */
export function validateLeadData(data: unknown): Lead {
  return BaseLeadSchema.parse(data);
}

/**
 * Validate lead creation input
 */
export function validateLeadCreationInput(data: unknown): LeadCreationInput {
  return LeadCreationInputSchema.parse(data);
}

/**
 * Validate lead update input
 */
export function validateLeadUpdateInput(data: unknown): LeadUpdateInput {
  return LeadUpdateSchema.parse(data);
}

/**
 * Validate lead filters
 */
export function validateLeadFilters(data: unknown): LeadFilters {
  return LeadFiltersSchema.parse(data);
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

/**
 * Convert Firestore document to Lead type
 */
export function convertFirestoreDocToLead(doc: any): Lead | null {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  
  // Handle both old nested structure and new flat structure
  const leadData = {
    id: doc.id,
    type: data.type || data.notes?.type || 'contact',
    status: data.status || data.notes?.status || 'new',
    source: data.source || data.notes?.source || 'unknown',
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || data.notes?.phone || null,
    company: data.company || '',
    message: data.message || '',
    productId: data.productId || '',
    productRef: data.productRef || '',
    collectionId: data.collectionId || '',
    customizationDetails: data.customizationDetails || undefined,
    assignedTo: data.assignedTo || '',
    priority: data.priority || false,
    notes: data.notes || [],
    createdAt: data.createdAt || Timestamp.now(),
    updatedAt: data.updatedAt || Timestamp.now(),
    responseTime: data.responseTime || '',
    lastContactedAt: data.lastContactedAt || undefined,
  };

  try {
    return validateLeadData(leadData);
  } catch (error) {
    console.error('Error validating lead data:', error);
    return null;
  }
}

/**
 * Get default lead creation data
 */
export function getDefaultLeadData(type: LeadType, source: string): LeadCreationInput {
  return {
    type,
    status: 'new',
    source,
    name: '',
    email: '',
    phone: null,
    message: '',
    notes: [],
    priority: false,
  };
}
