/**
 * Validation schemas using Zod for form validation and data validation
 */

import { z } from 'zod';

import { FORMS, FILE_UPLOAD } from './constants';

// Helper schemas
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

const phoneSchema = z
  .union([z.string(), z.undefined()])
  .optional()
  .refine(
    (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val),
    'Please enter a valid phone number'
  );

const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')
  .trim();

// File validation schema
const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= FILE_UPLOAD.maxSize,
    `File size must be less than ${FILE_UPLOAD.maxSize / 1024 / 1024}MB`
  )
  .refine(
    (file) => FILE_UPLOAD.allowedTypes.includes(file.type),
    `Only ${FILE_UPLOAD.allowedTypes.join(', ')} files are allowed`
  );

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(
      FORMS.contact.maxMessageLength,
      `Message must be less than ${FORMS.contact.maxMessageLength} characters`
    )
    .trim(),
});

// Customize form schema
export const customizeFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  preferredSize: z.string().min(1, 'Preferred size is required'),
  preferredMaterials: z.array(z.string()).optional().default([]),
  moodboardFiles: z
    .array(fileSchema)
    .optional()
    .default([])
    .refine((files) => files.length <= 5, 'Maximum 5 files allowed'),
  message: z
    .string()
    .max(
      FORMS.customize.maxMessageLength,
      `Message must be less than ${FORMS.customize.maxMessageLength} characters`
    )
    .optional()
    .transform((val) => val?.trim() || undefined),
});

// Product enquiry form schema
export const enquiryFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: z
    .string()
    .min(10, 'Please provide more details about your enquiry')
    .max(
      FORMS.enquiry.maxMessageLength,
      `Message must be less than ${FORMS.enquiry.maxMessageLength} characters`
    )
    .trim(),
  productId: z.string().min(1, 'Product ID is required'),
});

// Trade form schema
export const tradeFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: z
    .string()
    .max(100, 'Company name is too long')
    .optional()
    .transform((val) => val?.trim() || undefined),
  message: z
    .string()
    .min(10, 'Please provide more details about your business')
    .max(
      FORMS.trade.maxMessageLength,
      `Message must be less than ${FORMS.trade.maxMessageLength} characters`
    )
    .trim(),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

// Product filter schema
export const productFiltersSchema = z.object({
  collectionId: z.string().optional(),
  roomType: z.string().optional(),
  materials: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional().default(12),
  offset: z.number().min(0).optional().default(0),
});

// Collection filter schema
export const collectionFiltersSchema = z.object({
  type: z.enum(['style', 'space']).optional(),
  isActive: z.boolean().optional().default(true),
  limit: z.number().min(1).max(50).optional().default(20),
  offset: z.number().min(0).optional().default(0),
});

// Lead filter schema
export const leadFiltersSchema = z.object({
  type: z.enum(['contact', 'trade', 'customize', 'product-enquiry']).optional(),
  status: z
    .enum(['new', 'contacted', 'qualified', 'converted', 'closed'])
    .optional(),
  assignedTo: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0),
});

// Admin user schema
export const adminUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  role: z.enum(['admin', 'editor', 'viewer']),
  permissions: z.object({
    canManageProducts: z.boolean(),
    canManageCollections: z.boolean(),
    canManagePages: z.boolean(),
    canManageLeads: z.boolean(),
    canManageUsers: z.boolean(),
  }),
  isActive: z.boolean().default(true),
});

// Product schema (for admin use)
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().min(1, 'Description is required').max(1000),
  story: z.string().max(2000).optional(),
  specifications: z.object({
    materials: z.array(z.string()).min(1, 'Materials are required'),
    weaveType: z.string().min(1, 'Weave type is required'),
    availableSizes: z
      .array(
        z.object({
          dimensions: z.string(),
          isCustom: z.boolean().default(false),
        })
      )
      .min(1, 'Dimensions are required'),
    origin: z.string().optional(),
    craftTime: z.string().optional(),
  }),
  collections: z
    .array(z.string())
    .min(1, 'At least one collection is required'),
  price: z.object({
    isVisible: z.boolean().default(false),
    startingFrom: z.number().min(0).optional(),
    currency: z.string().default('INR'),
  }),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().min(0).default(0),
});

// Collection schema (for admin use)
export const collectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().min(1, 'Description is required').max(500),
  type: z.enum(['style', 'space']),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
});

// Page schema (for admin use)
export const pageSchema = z.object({
  type: z.enum(['our-story', 'craftsmanship', 'trade']),
  title: z.string().min(1, 'Title is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  content: z.object({
    sections: z.array(
      z.object({
        type: z.enum(['text', 'image', 'quote', 'timeline']),
        content: z.string(),
        order: z.number().min(0),
      })
    ),
  }),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  isActive: z.boolean().default(true),
});

// API response schema
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
  type: z.enum(['products', 'collections', 'all']).optional().default('all'),
  limit: z.number().min(1).max(50).optional().default(10),
});

// Rate limiting schema
export const rateLimitSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  limit: z.number().min(1).max(1000).default(5),
  window: z.number().min(1000).max(86400000).default(3600000), // 1 hour default
});

// Environment validation schema
export const environmentSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_CONTACT_EMAIL: emailSchema,
  NEXT_PUBLIC_CONTACT_PHONE: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

// Type exports for TypeScript
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CustomizeFormData = z.infer<typeof customizeFormSchema>;
export type EnquiryFormData = z.infer<typeof enquiryFormSchema>;
export type TradeFormData = z.infer<typeof tradeFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;
export type CollectionFilters = z.infer<typeof collectionFiltersSchema>;
export type LeadFilters = z.infer<typeof leadFiltersSchema>;
export type AdminUserData = z.infer<typeof adminUserSchema>;
export type ProductData = z.infer<typeof productSchema>;
export type CollectionData = z.infer<typeof collectionSchema>;
export type PageData = z.infer<typeof pageSchema>;
export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema> & {
  data?: T;
};
export type SearchData = z.infer<typeof searchSchema>;

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePhone = (phone: string): boolean => {
  return phoneSchema.safeParse(phone).success;
};

export const validateFile = (file: File): boolean => {
  return fileSchema.safeParse(file).success;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};
