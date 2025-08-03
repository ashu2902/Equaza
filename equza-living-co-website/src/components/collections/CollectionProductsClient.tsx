'use client';

/**
 * Client Component for Collection Products Section
 * Handles filtering and sorting state for collection products
 */

import { useState, useCallback, Suspense } from 'react';
import { SafeProduct, ProductFilters } from '@/types/safe';
import { Typography } from '@/components/ui/Typography';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { SortOptions } from '@/components/product/SortOptions';
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
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortOption, setSortOption] = useState<string>('name-asc');

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((newSort: string) => {
    setSortOption(newSort);
  }, []);

  // Apply filters to products
  const filteredProducts = products.filter(product => {
    // Collection filter (already filtered by collection)
    if (filters.collectionId) {
      if (!product.collections?.includes(filters.collectionId)) {
        return false;
      }
    }

    // Room type filter
    if (filters.roomType) {
      if (!product.roomTypes?.includes(filters.roomType)) {
        return false;
      }
    }

    // Materials filter
    if (filters.materials && filters.materials.length > 0) {
      const hasMatchingMaterial = filters.materials.some(material =>
        product.specifications?.materials?.includes(material)
      );
      if (!hasMatchingMaterial) {
        return false;
      }
    }

    // Featured filter
    if (filters.isFeatured !== undefined) {
      if (product.isFeatured !== filters.isFeatured) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return (a.price?.current || 0) - (b.price?.current || 0);
      case 'price-desc':
        return (b.price?.current || 0) - (a.price?.current || 0);
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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <Suspense fallback={<div className="h-96 bg-gray-100 rounded animate-pulse"></div>}>
            <FilterSidebar 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="sticky top-6"
            />
          </Suspense>
        </div>

        {/* Products Content */}
        <div className="flex-1 space-y-6">
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
                onSortChange={handleSortChange}
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
            <Suspense fallback={<LoadingSkeleton />}>
              <ProductGrid 
                products={sortedProducts}
                columns={3}
                showQuickView={true}
                className="gap-6"
              />
            </Suspense>
          )}
        </div>
      </div>
    </SlideUp>
  );
}