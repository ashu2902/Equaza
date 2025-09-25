/**
 * Safe Type Definitions - Bulletproof Data Contracts
 * 
 * These types guarantee that components receive valid, non-null data.
 * All nullable/undefined fields are transformed at the data layer.
 */

export interface SafeImage {
  url: string;
  alt: string;
  storageRef: string;
  isMain: boolean;
  sortOrder: number;
}

export interface SafeProductSize {
  dimensions: string;
  isCustom: boolean;
}

export interface SafeProductSpecifications {
  materials: string[];
  weaveType: string;
  availableSizes: SafeProductSize[];
  origin: string;
  craftTime: string;
}

export interface SafeProductPrice {
  isVisible: boolean;
  startingFrom: number;
  currency: string;
}

export interface SafeProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  story: string;
  images: SafeImage[]; // ALWAYS array with at least 1 item, NEVER empty
  specifications: SafeProductSpecifications;
  collections: string[];
  price: SafeProductPrice;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string; // ISO string, not Timestamp
  updatedAt: string; // ISO string, not Timestamp
}

export interface SafeCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'style' | 'space';
  heroImage: SafeImage; // ALWAYS defined, NEVER null
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  sortOrder: number;
  productIds: string[];
  createdAt: string; // ISO string, not Timestamp
  updatedAt: string; // ISO string, not Timestamp
}

// Fallback constants for when data is missing/invalid
export const FALLBACK_PRODUCT_IMAGE: SafeImage = {
  url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY0Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSIxNzUiIHk9IjE3NSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM5ODM0MkQiPgo8cGF0aCBkPSJNMTIgMkwyIDdMMTIgMTJMMjIgN0wxMiAyWiIvPgo8cGF0aCBkPSJNMiA3TDEyIDEyVjIyTDIgMTdWN1oiLz4KPHN2Zz4KPHN2Zz4=',
  alt: 'Handcrafted rug placeholder',
  storageRef: '',
  isMain: true,
  sortOrder: 0
};

export const FALLBACK_COLLECTION_IMAGE: SafeImage = {
  url: '/collection-placeholder.jpg',
  alt: 'Collection hero image',
  storageRef: '',
  isMain: true,
  sortOrder: 0
};

// Data result types for error handling
export interface DataResult<T> {
  data: T;
  error: null;
  loading: false;
}

export interface ErrorResult {
  data: null;
  error: string;
  loading: false;
}

export interface LoadingResult {
  data: null;
  error: null;
  loading: true;
}

export type SafeResult<T> = DataResult<T> | ErrorResult | LoadingResult;

// Helper type guards
export function isDataResult<T>(result: SafeResult<T>): result is DataResult<T> {
  return result.data !== null && result.error === null && !result.loading;
}

export function isErrorResult<T>(result: SafeResult<T>): result is ErrorResult {
  return result.data === null && result.error !== null && !result.loading;
}

export function isLoadingResult<T>(result: SafeResult<T>): result is LoadingResult {
  return result.data === null && result.error === null && result.loading;
}