import { Timestamp } from 'firebase/firestore';

// Product interfaces
export interface ProductImage {
  url: string;
  alt: string;
  storageRef: string;
  isMain: boolean;
  sortOrder: number;
}

export interface ProductSize {
  dimensions: string;
  isCustom: boolean;
}

export interface ProductSpecifications {
  materials: string[];
  weaveType: string;
  availableSizes: ProductSize[];
  origin: string;
  craftTime: string;
}

export interface ProductPrice {
  isVisible: boolean;
  startingFrom: number;
  currency: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  story: string;
  images: ProductImage[];
  specifications: ProductSpecifications;
  collections: string[];
  // roomTypes removed from the product model; keep optional for backward compatibility
  roomTypes?: string[];
  price: ProductPrice;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection interfaces
export interface CollectionImage {
  url: string;
  alt: string;
  storageRef: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'style' | 'space';
  heroImage: CollectionImage;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  productIds: string[];
}

// Weave Type interface
export interface WeaveType {
  id: string;
  name: string;
  slug: string;
  image: ProductImage; // Reusing ProductImage structure
  sortOrder: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Lead interfaces
export interface UploadedFile {
  filename: string;
  url: string;
  storageRef: string;
}

export interface CustomizationDetails {
  preferredSize: string;
  preferredMaterials: string[];
  moodboardFiles: UploadedFile[];
}

export interface LeadNote {
  content: string;
  createdBy: string;
  createdAt: Timestamp;
}

export type LeadType = 'contact' | 'trade' | 'customize' | 'product-enquiry';
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'closed';

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone?: string | null;
  message?: string;
  source: string;
  productId?: string;
  customizationDetails?: CustomizationDetails;
  status: LeadStatus;
  assignedTo?: string;
  notes: LeadNote[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Page interfaces
export interface PageSection {
  type: 'text' | 'image' | 'quote' | 'timeline';
  content: string;
  image?: CollectionImage;
  order: number;
}

export interface PageContent {
  sections: PageSection[];
}

export type PageType = 'our-story' | 'craftsmanship' | 'trade';

export interface Page {
  id: string;
  type: PageType;
  title: string;
  slug: string;
  content: PageContent;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  updatedAt: Timestamp;
  updatedBy: string;
}

// Admin interfaces
export interface AdminPermissions {
  canManageProducts: boolean;
  canManageCollections: boolean;
  canManagePages: boolean;
  canManageLeads: boolean;
  canManageUsers: boolean;
}

export type AdminRole = 'admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermissions;
  isActive: boolean;
  lastLogin: Timestamp;
  createdAt: Timestamp;
}

// Settings interfaces
export interface SocialLinks {
  instagram?: string;
  pinterest?: string;
  facebook?: string;
}

export interface SEODefaults {
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  calendlyUrl: string;
  socialLinks: SocialLinks;
  seoDefaults: SEODefaults;
  updatedAt: Timestamp;
  updatedBy: string;
}

// Lookbook interface
export interface Lookbook {
  version: string;
  filename: string;
  url: string;
  storageRef: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
  isActive: boolean;
}

// Form data interfaces
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface CustomizeFormData {
  name: string;
  email: string;
  phone?: string;
  preferredSize: string;
  preferredMaterials?: string[];
  moodboardFiles?: File[];
  message?: string;
}

export interface EnquiryFormData {
  name: string;
  email: string;
  message: string;
  productId: string;
}

export interface TradeFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter interfaces
export interface ProductFilters {
  collectionId?: string;
  weaveType?: string;
  materials?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
}

export interface CollectionFilters {
  type?: 'style' | 'space';
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface LeadFilters {
  type?: LeadType;
  status?: LeadStatus;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}
