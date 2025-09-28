/**
 * Product Detail Page - Dynamic Route
 *
 * Full product page with image gallery, details, specifications, and enquiry
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, Star } from 'lucide-react';

// Firebase and Types
import { getSafeProductBySlug, getSafeRelatedProducts } from '@/lib/firebase/safe-firestore';
import { isDataResult, ErrorResult } from '@/types/safe';

// Components
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { ImageGallery } from '@/components/product/ImageGallery';
import { SafeProductGrid } from '@/components/product/SafeProductGrid';
import { ProductEnquirySection } from '@/components/product/ProductEnquirySection';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

// Loading components
import { LoadingSkeleton } from '@/components/homepage/LoadingSkeleton';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate Metadata for Product Page
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productResult = await getSafeProductBySlug(slug);
  
  if (!isDataResult(productResult) || !productResult.data) {
    return {
      title: 'Product Not Found | Equza Living Co.',
      description: 'The requested product could not be found.',
    };
  }

  const product = productResult.data;
  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  
  return {
    title: `${product.name} | Equza Living Co. - Handcrafted Rug`,
    description: product.description || `Discover the ${product.name}, a handcrafted rug featuring premium materials and exceptional craftsmanship.`,
    openGraph: {
      title: `${product.name} | Equza Living Co.`,
      description: product.description || `Handcrafted ${product.name} rug`,
      images: mainImage ? [mainImage.url] : ['/images/og-product.jpg'],
    },
  };
}

/**
 * Product Page Data Fetching
 */
async function getProductPageData(slug: string) {
  try {
    const [productResult, relatedProductsResult] = await Promise.all([
      getSafeProductBySlug(slug),
      getSafeRelatedProducts(slug, 4), // Get 4 related products
    ]);

    return {
      product: productResult,
      relatedProducts: relatedProductsResult,
    };
  } catch (error) {
    console.error('Failed to fetch product page data:', error);
    
    return {
      product: { data: null, error: 'Failed to load product', loading: false } as ErrorResult,
      relatedProducts: { data: null, error: 'Failed to load related products', loading: false } as ErrorResult,
    };
  }
}

/**
 * Product Page Component
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductPageData(slug);

  // Check if product exists
  if (!isDataResult(data.product) || !data.product.data) {
    notFound();
  }

  const product = data.product.data;
  const relatedProducts = isDataResult(data.relatedProducts) ? data.relatedProducts.data : [];
  const mainImage = product.images.find(img => img.isMain) || product.images[0];

  // Create enquiry handler for client component

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ backgroundColor: '#f1eee9' }}>
        {/* Breadcrumb Navigation */}
        <SectionErrorBoundary sectionName="breadcrumb">
          <section className="py-6 border-b border-gray-200">
            <Container size="lg">
              <FadeIn>
                <nav className="flex items-center space-x-2 text-sm">
                  <Link 
                    href="/" 
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Home
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Link 
                    href="/collections" 
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Collections
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span 
                    className="font-medium"
                    style={{ 
                      color: '#98342d',
                      fontFamily: 'Poppins'
                    }}
                  >
                    {product.name}
                  </span>
                </nav>
              </FadeIn>
            </Container>
          </section>
        </SectionErrorBoundary>

        {/* Product Main Section */}
        <SectionErrorBoundary sectionName="product main">
          <section className="py-16 md:py-24">
            <Container size="lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Product Image Gallery */}
                <SlideUp delay={0.1}>
                  <div className="space-y-4">
                    <Suspense fallback={<div className="aspect-square bg-gray-200 rounded animate-pulse"></div>}>
                      <ImageGallery 
                        images={product.images}
                        productName={product.name}
                        className="rounded-lg overflow-hidden"
                      />
                    </Suspense>
                  </div>
                </SlideUp>

                {/* Product Information */}
                <SlideUp delay={0.2}>
                  <div className="space-y-8">
                    {/* Product Title and Basic Info */}
                    <div>
                      <Typography 
                        variant="h1" 
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{ 
                          fontFamily: 'Libre Baskerville',
                          color: '#98342d'
                        }}
                      >
                        {product.name}
                      </Typography>
                      

                      {/* Price */}
                      {product.price?.isVisible && (
                        <Typography 
                          variant="h2" 
                          className="text-3xl font-bold mb-6"
                          style={{ 
                            fontFamily: 'Libre Baskerville',
                            color: '#98342d'
                          }}
                        >
                          ₹{product.price.startingFrom ? `${product.price.startingFrom.toLocaleString('en-IN')}+` : 'XXX'}
                        </Typography>
                      )}
                    </div>

                    {/* Product Description (without title) */}
                    {product.description && (
                      <div className="border-t border-gray-200 pt-6">
                        <Typography
                          variant="body"
                          className="text-lg leading-relaxed text-gray-700"
                          style={{ fontFamily: 'Poppins' }}
                        >
                          {product.description}
                        </Typography>
                      </div>
                    )}

                    {/* Product Specifications */}
                    <Suspense fallback={<div className="h-32 bg-gray-100 rounded animate-pulse"></div>}>
                      <ProductSpecs
                        specifications={product.specifications}
                        className="border-t border-b border-gray-200 py-6"
                      />
                    </Suspense>

                    {/* Enquiry Button placed after Specifications */}
                    <ProductEnquirySection product={product} />
                  </div>
                </SlideUp>
              </div>
            </Container>
          </section>
        </SectionErrorBoundary>

        {/* Product Story Section */}
        <SectionErrorBoundary sectionName="product story">
          <section className="py-4 md:py-4">
            <Container size="lg">
              <SlideUp delay={0.3}>
                <div>
                  <Typography 
                    variant="h2" 
                    className="text-3xl md:text-4xl font-bold mb-8"
                    style={{ 
                      fontFamily: 'Libre Baskerville',
                      color: '#98342d'
                    }}
                  >
                    The Story Behind This Rug
                  </Typography>
                  
                  <Typography
                    variant="body"
                    className="text-lg leading-relaxed text-gray-700"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {product.story || product.description || `This exquisite rug is a testament to the artistry of traditional rug making. Inspired by the natural world, its design incorporates subtle patterns and textures that evoke a sense of calm and sophistication. Handcrafted by skilled artisans using time-honored techniques, this rug is not just a floor covering but a piece of art that adds warmth and character to any space.`}
                  </Typography>
                </div>
              </SlideUp>
            </Container>
          </section>
        </SectionErrorBoundary>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <SectionErrorBoundary sectionName="related products">
            <section className="py-16 md:py-24">
              <Container size="lg">
                <SlideUp delay={0.4}>
                  <div className="space-y-12">
                    <div>
                      <Typography 
                        variant="h2" 
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ 
                          fontFamily: 'Libre Baskerville',
                          color: '#98342d'
                        }}
                      >
                        You Might Also Like
                      </Typography>
                      <Typography 
                        variant="body" 
                        className="text-gray-600"
                        style={{ fontFamily: 'Poppins' }}
                      >
                        Discover more handcrafted rugs from our collection
                      </Typography>
                    </div>

                    <Suspense fallback={<LoadingSkeleton variant="tiles" />}>
                      <SafeProductGrid 
                        products={relatedProducts}
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
                  </div>
                </SlideUp>
              </Container>
            </section>
          </SectionErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}

/**
 * Generate Static Params for Pre-rendering
 */
export async function generateStaticParams() {
  // In a real implementation, you would fetch all product slugs
  // For now, return empty array to allow dynamic generation
  return [];
}

