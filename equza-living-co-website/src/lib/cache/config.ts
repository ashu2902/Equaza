/**
 * Centralized Caching Configuration
 * 
 * This module provides a unified caching system for the application,
 * making it easier to manage cache times, tags, and invalidation.
 */

import { unstable_cache } from 'next/cache';
import { revalidateTag, revalidatePath } from 'next/cache';

// Cache duration constants (in seconds)
export const CACHE_DURATION = {
  // Very short cache for frequently updated data
  REAL_TIME: 30, // 30 seconds
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 600, // 10 minutes
  VERY_LONG: 1800, // 30 minutes
  STATIC: 3600, // 1 hour
} as const;

// Cache tags for different data types
export const CACHE_TAGS = {
  // Core data
  products: 'products',
  collections: 'collections',
  leads: 'leads',
  pages: 'pages',
  settings: 'settings',
  
  // Specific entities
  product: (id: string) => `product-${id}`,
  productSlug: (slug: string) => `product-slug-${slug}`,
  collection: (id: string) => `collection-${id}`,
  collectionSlug: (slug: string) => `collection-slug-${slug}`,
  lead: (id: string) => `lead-${id}`,
  page: (type: string) => `page-${type}`,
  
  // Aggregated data
  featuredProducts: 'featured-products',
  styleCollections: 'style-collections',
  spaceCollections: 'space-collections',
  weaveTypes: 'weave-types',
  homepage: 'homepage',
  
  // Admin data
  productsStats: 'products-stats',
  leadsStats: 'leads-stats',
  collectionsStats: 'collections-stats',
  
  // Filter options
  productFilterOptions: 'product-filter-options',
  collectionFilterOptions: 'collection-filter-options',
  
  // Site-wide
  siteSettings: 'site-settings',
  contactInfo: 'contact-info',
  seoDefaults: 'seo-defaults',
} as const;

// Cache configuration for different data types
export const CACHE_CONFIG = {
  // Products - shorter cache for frequently updated data
  products: {
    duration: CACHE_DURATION.SHORT,
    tags: [CACHE_TAGS.products] as string[],
  },
  product: {
    duration: CACHE_DURATION.MEDIUM,
    tags: (id: string) => [CACHE_TAGS.product(id)],
  },
  productSlug: {
    duration: CACHE_DURATION.MEDIUM,
    tags: (slug: string) => [CACHE_TAGS.productSlug(slug)],
  },
  featuredProducts: {
    duration: CACHE_DURATION.SHORT,
    tags: [CACHE_TAGS.featuredProducts] as string[],
  },
  
  // Collections - medium cache
  collections: {
    duration: CACHE_DURATION.MEDIUM,
    tags: [CACHE_TAGS.collections] as string[],
  },
  collection: {
    duration: CACHE_DURATION.LONG,
    tags: (id: string) => [CACHE_TAGS.collection(id)],
  },
  collectionSlug: {
    duration: CACHE_DURATION.LONG,
    tags: (slug: string) => [CACHE_TAGS.collectionSlug(slug)],
  },
  styleCollections: {
    duration: CACHE_DURATION.MEDIUM,
    tags: [CACHE_TAGS.styleCollections] as string[],
  },
  spaceCollections: {
    duration: CACHE_DURATION.MEDIUM,
    tags: [CACHE_TAGS.spaceCollections] as string[],
  },
  
  // Leads - very short cache for real-time updates
  leads: {
    duration: CACHE_DURATION.REAL_TIME,
    tags: [CACHE_TAGS.leads] as string[],
  },
  lead: {
    duration: CACHE_DURATION.SHORT,
    tags: (id: string) => [CACHE_TAGS.lead(id)],
  },
  leadsStats: {
    duration: CACHE_DURATION.SHORT,
    tags: [CACHE_TAGS.leadsStats] as string[],
  },
  
  // Pages - longer cache for content
  page: {
    duration: CACHE_DURATION.LONG,
    tags: (type: string) => [CACHE_TAGS.page(type)],
  },
  homepage: {
    duration: CACHE_DURATION.MEDIUM,
    tags: [CACHE_TAGS.homepage] as string[],
  },
  
  // Settings - long cache
  settings: {
    duration: CACHE_DURATION.VERY_LONG,
    tags: [CACHE_TAGS.settings] as string[],
  },
  siteSettings: {
    duration: CACHE_DURATION.VERY_LONG,
    tags: [CACHE_TAGS.siteSettings] as string[],
  },
  contactInfo: {
    duration: CACHE_DURATION.VERY_LONG,
    tags: [CACHE_TAGS.contactInfo] as string[],
  },
  
  // Weave types - medium cache
  weaveTypes: {
    duration: CACHE_DURATION.MEDIUM,
    tags: [CACHE_TAGS.weaveTypes] as string[],
  },
};

/**
 * Create a cached function with standardized configuration
 */
export function createCachedFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  key: string | string[],
  config: {
    duration: number;
    tags: string[] | ((...args: T) => string[]);
  }
) {
  return unstable_cache(
    fn,
    Array.isArray(key) ? key : [key],
    {
      revalidate: config.duration,
      tags: typeof config.tags === 'function' ? [] : (config.tags as string[]),
    }
  );
}

/**
 * Invalidate cache for a specific entity
 */
export function invalidateEntityCache(
  entityType: 'product' | 'collection' | 'lead' | 'page',
  id: string,
  additionalTags: string[] = []
) {
  const tags = [CACHE_TAGS[entityType](id), ...additionalTags];
  
  // Also invalidate the main collection cache
  if (entityType === 'product') {
    tags.push(CACHE_TAGS.products, CACHE_TAGS.featuredProducts);
  } else if (entityType === 'collection') {
    tags.push(CACHE_TAGS.collections, CACHE_TAGS.styleCollections, CACHE_TAGS.spaceCollections);
  } else if (entityType === 'lead') {
    tags.push(CACHE_TAGS.leads, CACHE_TAGS.leadsStats);
  } else if (entityType === 'page') {
    tags.push(CACHE_TAGS.pages, CACHE_TAGS.homepage);
  }
  
  // Remove duplicates
  const uniqueTags = [...new Set(tags)];
  
  // Invalidate all tags
  uniqueTags.forEach(tag => revalidateTag(tag));
  
  console.log(`Cache invalidated for ${entityType}:${id}`, { tags: uniqueTags });
}

/**
 * Invalidate cache for multiple entities
 */
export function invalidateMultipleEntities(
  entities: Array<{ type: 'product' | 'collection' | 'lead' | 'page'; id: string }>,
  additionalTags: string[] = []
) {
  const allTags = new Set<string>();
  
  entities.forEach(({ type, id }) => {
    allTags.add(CACHE_TAGS[type](id));
    
    // Add collection tags
    if (type === 'product') {
      allTags.add(CACHE_TAGS.products);
      allTags.add(CACHE_TAGS.featuredProducts);
    } else if (type === 'collection') {
      allTags.add(CACHE_TAGS.collections);
      allTags.add(CACHE_TAGS.styleCollections);
      allTags.add(CACHE_TAGS.spaceCollections);
    } else if (type === 'lead') {
      allTags.add(CACHE_TAGS.leads);
      allTags.add(CACHE_TAGS.leadsStats);
    } else if (type === 'page') {
      allTags.add(CACHE_TAGS.pages);
      allTags.add(CACHE_TAGS.homepage);
    }
  });
  
  // Add additional tags
  additionalTags.forEach(tag => allTags.add(tag));
  
  // Invalidate all tags
  Array.from(allTags).forEach(tag => revalidateTag(tag));
  
  console.log(`Cache invalidated for multiple entities`, { 
    count: entities.length, 
    tags: Array.from(allTags) 
  });
}

/**
 * Invalidate cache by tags
 */
export function invalidateByTags(tags: string[]) {
  tags.forEach(tag => revalidateTag(tag));
  console.log(`Cache invalidated by tags:`, tags);
}

/**
 * Invalidate cache by path
 */
export function invalidateByPath(path: string) {
  revalidatePath(path);
  console.log(`Cache invalidated by path:`, path);
}

/**
 * Invalidate all caches (use sparingly)
 */
export function invalidateAllCaches() {
  const allTags = Object.values(CACHE_TAGS).filter(tag => typeof tag === 'string');
  allTags.forEach(tag => revalidateTag(tag));
  console.log(`All caches invalidated`);
}

/**
 * Get cache configuration for a specific data type
 */
export function getCacheConfig(dataType: keyof typeof CACHE_CONFIG) {
  return CACHE_CONFIG[dataType];
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Log cache operations in development
 */
export function logCacheOperation(operation: string, details: any) {
  if (isDevelopment()) {
    console.log(`[CACHE] ${operation}:`, details);
  }
}
