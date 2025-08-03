/**
 * Admin Products Management Page
 * 
 * CRUD interface for managing products
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye,
  Package,
  Image as ImageIcon,
  Calendar,
  DollarSign,
  Tag,
  Grid3X3
} from 'lucide-react';

// Components
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

// Firebase
import { getSafeAdminProducts } from '@/lib/firebase/safe-firestore';
import { isDataResult } from '@/types/safe';

export const metadata: Metadata = {
  title: 'Products Management | Admin | Equza Living Co.',
  description: 'Manage products for Equza Living Co.',
  robots: 'noindex,nofollow',
};

/**
 * Get Products Data
 */
async function getProductsData() {
  try {
    const products = await getSafeAdminProducts();
    
    return {
      products: isDataResult(products) ? products.data : [],
      error: products.error
    };
  } catch (error) {
    console.error('Products data fetch error:', error);
    return {
      products: [],
      error: 'Failed to load products'
    };
  }
}

/**
 * Product Card Component
 */
function ProductCard({ product }: { product: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button size="sm" variant="outline" className="bg-white/90" asChild>
              <Link href={`/product/${product.slug}`}>
                <Eye className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            product.status === 'published' 
              ? 'bg-green-100 text-green-800'
              : product.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {product.status || 'draft'}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">
              {product.collection || 'No Collection'}
            </p>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/products/${product.slug}/edit`}>
                <Edit3 className="h-3 w-3" />
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price and Size */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-3 w-3 mr-1" />
            {product.price ? `$${product.price}` : 'Price on request'}
          </div>
          <div className="text-gray-500">
            {product.dimensions || 'Custom size'}
          </div>
        </div>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
          </div>
          <div className="flex items-center">
            <Grid3X3 className="h-3 w-3 mr-1" />
            {product.category || 'Uncategorized'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Products List Component
 */
function ProductsList({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Typography variant="h4" className="text-gray-600 mb-2">
            No Products Yet
          </Typography>
          <p className="text-gray-500 mb-6">
            Add your first product to get started with your catalog
          </p>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid cols={{ default: 1, sm: 2, lg: 3, xl: 4 }} gap={6}>
      {products.map((product, index) => (
        <SlideUp key={product.id || product.slug} delay={index * 0.05}>
          <ProductCard product={product} />
        </SlideUp>
      ))}
    </Grid>
  );
}

/**
 * Admin Products Page
 */
export default async function AdminProductsPage() {
  const { products, error } = await getProductsData();

  // Calculate stats
  const stats = {
    total: products.length,
    published: products.filter(p => p.status === 'published').length,
    draft: products.filter(p => p.status === 'draft').length,
    featured: products.filter(p => p.featured).length
  };

  return (
    <AdminPageTemplate title="Products Management">
      <div className="space-y-8">
        {/* Header Actions */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Typography variant="h3" className="text-gray-900 mb-2">
                Products
              </Typography>
              <p className="text-gray-600">
                Manage your product catalog and inventory
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/admin/products/import">
                  <Package className="h-4 w-4 mr-2" />
                  Import
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/products/bulk">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Link>
              </Button>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Stats Overview */}
        <FadeIn delay={0.1}>
          <Grid cols={{ default: 2, sm: 4 }} gap={4}>
            <Card className="!bg-white !border-[#98342d]/20 !text-[#98342d]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[#98342d]">{stats.total}</p>
                <p className="text-sm text-[#98342d]/70">Total Products</p>
              </CardContent>
            </Card>
            <Card className="!bg-white !border-[#98342d]/20 !text-[#98342d]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                <p className="text-sm text-[#98342d]/70">Published</p>
              </CardContent>
            </Card>
            <Card className="!bg-white !border-[#98342d]/20 !text-[#98342d]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                <p className="text-sm text-[#98342d]/70">Draft</p>
              </CardContent>
            </Card>
            <Card className="!bg-white !border-[#98342d]/20 !text-[#98342d]">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.featured}</p>
                <p className="text-sm text-[#98342d]/70">Featured</p>
              </CardContent>
            </Card>
          </Grid>
        </FadeIn>

        {/* Search and Filters */}
        <FadeIn delay={0.2}>
          <Card className="!bg-white !border-[#98342d]/20">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                  <Button variant="outline" size="sm">
                    <Tag className="h-4 w-4 mr-2" />
                    Category
                  </Button>
                  <Button variant="outline" size="sm">
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Collection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Error State */}
        {error && (
          <Card className="!border-red-200 !bg-red-50 !text-red-700">
            <CardContent className="p-4">
              <div className="flex items-center text-red-700">
                <div className="flex-shrink-0 mr-3">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">
                  {error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsList products={products} />
          </Suspense>
        </div>
      </div>
    </AdminPageTemplate>
  );
}