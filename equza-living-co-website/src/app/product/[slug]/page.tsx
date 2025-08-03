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
import { isDataResult } from '@/types/safe';

// Components
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EnquiryModal } from '@/components/forms/EnquiryModal';
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
      product: { data: null, error: 'Failed to load product', loading: false },
      relatedProducts: { data: null, error: 'Failed to load related products', loading: false },
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
                      
                      <Typography 
                        variant="h3" 
                        className="text-xl md:text-2xl text-gray-600 mb-6"
                        style={{ fontFamily: 'Poppins' }}
                      >
                        {product.specifications?.weaveType || 'Hand-knotted'}, {product.specifications?.materials?.join(' & ') || 'Wool & Viscose'}
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

                    {/* Product Specifications */}
                    <Suspense fallback={<div className="h-32 bg-gray-100 rounded animate-pulse"></div>}>
                      <ProductSpecs 
                        specifications={product.specifications}
                        className="border-t border-b border-gray-200 py-6"
                      />
                    </Suspense>

                    {/* Customer Reviews Section */}
                    <div className="border-b border-gray-200 pb-6">
                      <Typography 
                        variant="h3" 
                        className="text-lg font-semibold mb-4"
                        style={{ 
                          fontFamily: 'Poppins',
                          color: '#98342d'
                        }}
                      >
                        Customer Reviews
                      </Typography>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          <Typography 
                            variant="h2" 
                            className="text-2xl font-bold mr-2"
                            style={{ fontFamily: 'Libre Baskerville' }}
                          >
                            4.5
                          </Typography>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <Typography 
                          variant="body" 
                          className="text-gray-600"
                          style={{ fontFamily: 'Poppins' }}
                        >
                          (25 reviews)
                        </Typography>
                      </div>

                      {/* Review Stats */}
                      <div className="space-y-2">
                        {[
                          { stars: 5, percentage: 60 },
                          { stars: 4, percentage: 30 },
                          { stars: 3, percentage: 8 },
                          { stars: 2, percentage: 2 },
                          { stars: 1, percentage: 0 },
                        ].map((review) => (
                          <div key={review.stars} className="flex items-center space-x-3">
                            <span className="text-sm w-2" style={{ fontFamily: 'Poppins' }}>
                              {review.stars}
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 rounded">
                              <div 
                                className="h-2 rounded"
                                style={{ 
                                  backgroundColor: '#98342d',
                                  width: `${review.percentage}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500 w-8" style={{ fontFamily: 'Poppins' }}>
                              {review.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add to Cart / Enquiry */}
                    <div className="space-y-4">
                      <Button 
                        size="lg" 
                        className="w-full text-lg py-4"
                        style={{ 
                          backgroundColor: '#98342d',
                          fontFamily: 'Poppins'
                        }}
                      >
                        Add to Cart
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full text-lg py-4"
                        style={{ 
                          borderColor: '#98342d',
                          color: '#98342d',
                          fontFamily: 'Poppins'
                        }}
                      >
                        Enquire About This Rug
                      </Button>
                    </div>
                  </div>
                </SlideUp>
              </div>
            </Container>
          </section>
        </SectionErrorBoundary>

        {/* Product Story Section */}
        <SectionErrorBoundary sectionName="product story">
          <section className="py-16 bg-white">
            <Container size="lg">
              <SlideUp delay={0.3}>
                <div className="max-w-4xl mx-auto text-center">
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
                    {product.story || `This exquisite rug is a testament to the artistry of traditional rug making. Inspired by the natural world, its design incorporates subtle patterns and textures that evoke a sense of calm and sophistication. Handcrafted by skilled artisans using time-honored techniques, this rug is not just a floor covering but a piece of art that adds warmth and character to any space.`}
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
                    <div className="text-center">
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

                    <Suspense fallback={<LoadingSkeleton />}>
                      <ProductGrid 
                        products={relatedProducts}
                        columns={4}
                        showQuickView={true}
                        className="gap-6"
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

