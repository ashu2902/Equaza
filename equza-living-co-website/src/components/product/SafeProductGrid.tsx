/**
 * Safe Product Grid Component
 *
 * Renders a grid of SafeProductCard components with loading and error states.
 * Handles empty states gracefully.
 */

'use client';

import { SafeProduct } from '@/types/safe';
import { SafeProductCard } from './SafeProductCard';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

interface SafeProductGridProps {
  products: SafeProduct[]; // Always an array, never null
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLoading?: boolean;
  className?: string;
  gridCols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function SafeProductGrid({
  products,
  loading = false,
  error = null,
  title,
  subtitle,
  showLoadMore = false,
  onLoadMore,
  loadMoreLoading = false,
  className = '',
  gridCols = { default: 1, sm: 2, md: 2, lg: 3, xl: 4 },
}: SafeProductGridProps) {
  // Loading State
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {title && (
          <div className='text-center space-y-2'>
            <Typography variant='h2' className='font-serif'>
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant='body'
                className='text-gray-600 max-w-2xl mx-auto'
              >
                {subtitle}
              </Typography>
            )}
          </div>
        )}

        <div
          className={`grid grid-cols-${gridCols.default} sm:grid-cols-${gridCols.sm || gridCols.default} md:grid-cols-${gridCols.md || gridCols.sm || gridCols.default} lg:grid-cols-${gridCols.lg || gridCols.md || gridCols.sm || gridCols.default} xl:grid-cols-${gridCols.xl || gridCols.lg || gridCols.md || gridCols.sm || gridCols.default} gap-6`}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`text-center space-y-4 py-12 ${className}`}>
        <Typography variant='h3' className='text-gray-900'>
          Unable to Load Products
        </Typography>
        <Typography variant='body' className='text-gray-600 max-w-md mx-auto'>
          {error}
        </Typography>
        <Button onClick={() => window.location.reload()} variant='outline'>
          Try Again
        </Button>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className={`text-center space-y-4 py-12 ${className}`}>
        <Typography variant='h3' className='text-gray-900'>
          No Products Found
        </Typography>
        <Typography variant='body' className='text-gray-600 max-w-md mx-auto'>
          We couldn't find any products matching your criteria. Try adjusting
          your filters or check back later.
        </Typography>
      </div>
    );
  }

  // Success State with Products
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      {title && (
        <div className='text-center space-y-3'>
          <Typography
            variant='h2'
            className='font-libre-baskerville font-normal'
            style={{ color: '#98342d' }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant='body'
              className='font-poppins max-w-2xl mx-auto'
              style={{ color: '#666666' }}
            >
              {subtitle}
            </Typography>
          )}
        </div>
      )}

      {/* Product Grid */}
      <div
        className={`grid grid-cols-${gridCols.default} sm:grid-cols-${gridCols.sm || gridCols.default} md:grid-cols-${gridCols.md || gridCols.sm || gridCols.default} lg:grid-cols-${gridCols.lg || gridCols.md || gridCols.sm || gridCols.default} xl:grid-cols-${gridCols.xl || gridCols.lg || gridCols.md || gridCols.sm || gridCols.default} gap-6`}
      >
        {products.map((product, index) => (
          <SafeProductCard
            key={product.id}
            product={product}
            priority={index < 4} // Prioritize first 4 images
          />
        ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && onLoadMore && (
        <div className='text-center pt-8'>
          <Button
            onClick={onLoadMore}
            disabled={loadMoreLoading}
            variant='outline'
            size='lg'
          >
            {loadMoreLoading ? 'Loading...' : 'Load More Products'}
          </Button>
        </div>
      )}

      {/* Product Count */}
      <div className='text-center'>
        <Typography variant='caption' className='text-gray-500'>
          Showing {products.length}{' '}
          {products.length === 1 ? 'product' : 'products'}
        </Typography>
      </div>
    </div>
  );
}

/**
 * Product Card Skeleton for Loading State
 */
function ProductCardSkeleton() {
  return (
    <div className='bg-white rounded-lg overflow-hidden shadow-sm'>
      <div className='aspect-square bg-gray-200 animate-pulse' />
      <div className='p-4 space-y-2'>
        <div className='h-4 bg-gray-200 rounded animate-pulse' />
        <div className='h-3 bg-gray-200 rounded w-3/4 animate-pulse' />
        <div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse' />
        <div className='h-8 bg-gray-200 rounded animate-pulse mt-3' />
      </div>
    </div>
  );
}
