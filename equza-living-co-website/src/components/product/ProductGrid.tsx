'use client';

import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

interface ProductGridProps {
  products: Product[];
  title?: string;
  description?: string;
  className?: string;
  showPrice?: boolean;
  showEnquiry?: boolean;
  onEnquiry?: (productId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  maxItems?: number;
  priorityCount?: number;
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

export const ProductGrid: FC<ProductGridProps> = ({
  products,
  title,
  description,
  className = '',
  showPrice = true,
  showEnquiry = true,
  onEnquiry,
  onLoadMore,
  hasMore = false,
  loading = false,
  emptyMessage = 'No products found',
  emptyDescription = 'Try adjusting your filters or check back later for new arrivals.',
  maxItems,
  priorityCount = 6
}) => {
  const displayProducts = useMemo(() => {
    if (maxItems) {
      return products.slice(0, maxItems);
    }
    return products;
  }, [products, maxItems]);

  const isEmpty = displayProducts.length === 0;

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

      {/* Grid - Centered Responsive Layout */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 justify-items-center justify-center mx-auto">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={item}
              className="flex justify-center w-full"
            >
              <ProductCard
                product={product}
                showPrice={showPrice}
                showEnquiry={showEnquiry}
                onEnquiry={onEnquiry}
                priority={priorityCount ? index < priorityCount : false}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse"
            >
              <div className="aspect-square bg-stone-200 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
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
            {loading ? 'Loading...' : 'Load More Products'}
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
            Showing {displayProducts.length} of {products.length} products
            {maxItems && products.length > maxItems && (
              <span> (limited to {maxItems})</span>
            )}
          </Typography>
        </div>
      )}
    </div>
  );
};

ProductGrid.displayName = 'ProductGrid';