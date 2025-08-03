'use client';

import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Collection } from '@/types';
import { CollectionCard } from './CollectionCard';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

interface CollectionGridProps {
  collections: Collection[];
  title?: string;
  description?: string;
  className?: string;
  showProductCount?: boolean;
  productCounts?: Record<string, number>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  maxItems?: number;
  priorityCount?: number;
  filterByType?: 'style' | 'space';
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const CollectionGrid: FC<CollectionGridProps> = ({
  collections,
  title,
  description,
  className = '',
  showProductCount = true,
  productCounts = {},
  onLoadMore,
  hasMore = false,
  loading = false,
  emptyMessage = 'No collections found',
  emptyDescription = 'Check back later for new collections.',
  maxItems,
  priorityCount = 4,
  filterByType
}) => {
  const filteredCollections = useMemo(() => {
    let filtered = collections;
    
    // Filter by type if specified
    if (filterByType) {
      filtered = filtered.filter(collection => collection.type === filterByType);
    }
    
    // Limit items if specified
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }
    
    return filtered;
  }, [collections, filterByType, maxItems]);

  const isEmpty = filteredCollections.length === 0;

  if (isEmpty && !loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto space-y-4">
          <Typography
            variant="h3"
            className="text-stone-900 font-serif"
          >
            {emptyMessage}
          </Typography>
          <Typography
            variant="body1"
            className="text-stone-600"
          >
            {emptyDescription}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="text-center space-y-4">
          {title && (
            <Typography
              variant="h2"
              className="font-serif text-stone-900"
            >
              {title}
            </Typography>
          )}
          {description && (
            <Typography
              variant="body1"
              className="text-stone-600 max-w-2xl mx-auto"
            >
              {description}
            </Typography>
          )}
        </div>
      )}

      {/* Filter by Type Indicator */}
      {filterByType && (
        <div className="text-center">
          <span className={`
            inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
            ${filterByType === 'style' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
            }
          `}>
            {filterByType === 'style' ? 'Style Collections' : 'Space Collections'}
          </span>
        </div>
      )}

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {filteredCollections.map((collection, index) => (
          <motion.div
            key={collection.id}
            variants={item}
            className="flex"
          >
            <CollectionCard
              collection={collection}
              className="w-full"
              priority={index < priorityCount}
              showProductCount={showProductCount}
              productCount={productCounts[collection.id] ?? 0}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse"
            >
              <div className="aspect-[4/3] bg-stone-200 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-full" />
                <div className="h-3 bg-stone-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && onLoadMore && !loading && (
        <div className="text-center pt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? 'Loading...' : 'Load More Collections'}
          </Button>
        </div>
      )}

      {/* Results Count */}
      {!isEmpty && !loading && (
        <div className="text-center pt-4">
          <Typography
            variant="caption"
            className="text-stone-500"
          >
            Showing {filteredCollections.length} of {collections.length} collections
            {maxItems && collections.length > maxItems && (
              <span> (limited to {maxItems})</span>
            )}
            {filterByType && (
              <span> • Filtered by {filterByType} collections</span>
            )}
          </Typography>
        </div>
      )}

      {/* Collection Types Summary */}
      {!filterByType && !isEmpty && !loading && (
        <div className="flex justify-center gap-6 pt-6 border-t border-stone-200">
          <div className="text-center">
            <Typography variant="h4" className="font-serif text-stone-900">
              {collections.filter(c => c.type === 'style').length}
            </Typography>
            <Typography variant="caption" className="text-stone-500">
              Style Collections
            </Typography>
          </div>
          <div className="w-px bg-stone-200" />
          <div className="text-center">
            <Typography variant="h4" className="font-serif text-stone-900">
              {collections.filter(c => c.type === 'space').length}
            </Typography>
            <Typography variant="caption" className="text-stone-500">
              Space Collections
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

CollectionGrid.displayName = 'CollectionGrid';