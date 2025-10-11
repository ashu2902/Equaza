'use client';

/**
 * Client Component for Collection Products Section
 * Handles filtering and sorting state for collection products
 */

import { useState, useCallback, Suspense } from 'react';
import { SafeProduct } from '@/types/safe';
import { Typography } from '@/components/ui/Typography';
import { SafeProductGrid } from '@/components/product/SafeProductGrid';
import { SortOptions, SortOption } from '@/components/product/SortOptions';
import { LoadingSkeleton } from '@/components/homepage/LoadingSkeleton';
import { SlideUp } from '@/components/ui/MotionWrapper';

interface CollectionProductsClientProps {
  products: SafeProduct[];
  productsError?: string | null;
}

export function CollectionProductsClient({ 
  products, 
  productsError 
}: CollectionProductsClientProps) {
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortOption(newSort);
  }, []);

  // Apply sorting
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return (a.price?.startingFrom || 0) - (b.price?.startingFrom || 0);
      case 'price-desc':
        return (b.price?.startingFrom || 0) - (a.price?.startingFrom || 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  if (productsError) {
    return (
      <div className="text-center py-16">
        <Typography variant="body" className="text-red-600">
          {productsError}
        </Typography>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Typography 
          variant="body" 
          className="text-gray-600"
          style={{ fontFamily: 'Poppins' }}
        >
          No rugs found in this collection.
        </Typography>
      </div>
    );
  }

  return (
    <SlideUp delay={0.3}>
      <div className="space-y-6">
        {/* Products Content */}
        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Typography 
            variant="body" 
            className="text-gray-600"
            style={{ fontFamily: 'Poppins' }}
          >
            Showing {sortedProducts.length} of {products.length} rugs
          </Typography>
          
          <Suspense fallback={<div className="h-10 w-48 bg-gray-100 rounded animate-pulse"></div>}>
                          <SortOptions
              value={sortOption}
              onChange={handleSortChange}
              className="w-full sm:w-auto"
            />
          </Suspense>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <Typography 
              variant="body" 
              className="text-gray-600"
              style={{ fontFamily: 'Poppins' }}
            >
              No rugs match your current filters.
            </Typography>
          </div>
        ) : (
          <Suspense fallback={<LoadingSkeleton variant="tiles" />}>
            <SafeProductGrid 
              products={sortedProducts}
              className="gap-6"
              gridCols={{ 
                default: 1, 
                sm: 2, 
                md: 3, 
                lg: 4, 
                xl: 4 
              }}
            />
          </Suspense>
        )}
      </div>
    </SlideUp>
  );
}