/**
 * Individual Collection Page - Dynamic Route
 * 
 * Displays a specific collection with hero banner and product grid
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

// Firebase and Types
import { getSafeCollectionBySlug, getSafeProductsByCollection } from '@/lib/firebase/safe-firestore';
import { isDataResult, ErrorResult } from '@/types/safe';

// Components
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { CollectionHero } from '@/components/collections/CollectionHero';
import { CollectionProductsClient } from '@/components/collections/CollectionProductsClient';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';



interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate Metadata for Collection Page
 */
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collectionResult = await getSafeCollectionBySlug(slug);
  
  if (!isDataResult(collectionResult) || !collectionResult.data) {
    return {
      title: 'Collection Not Found | Equza Living Co.',
      description: 'The requested collection could not be found.',
    };
  }

  const collection = collectionResult.data;
  
  return {
    title: `${collection.name} Collection | Equza Living Co.`,
    description: collection.description || `Explore the ${collection.name} collection of handcrafted rugs from Equza Living Co.`,
    openGraph: {
      title: `${collection.name} Collection | Equza Living Co.`,
      description: collection.description || `Handcrafted rugs from the ${collection.name} collection`,
      images: collection.heroImage ? [collection.heroImage.url] : ['/images/og-collection.jpg'],
    },
  };
}

/**
 * Collection Page Data Fetching
 */
async function getCollectionPageData(slug: string) {
  try {
    const [collectionResult, productsResult] = await Promise.all([
      getSafeCollectionBySlug(slug),
      getSafeProductsByCollection(slug),
    ]);

    return {
      collection: collectionResult,
      products: productsResult,
    };
  } catch (error) {
    console.error('Failed to fetch collection page data:', error);
    
    return {
      collection: { data: null, error: 'Failed to load collection', loading: false } as ErrorResult,
      products: { data: null, error: 'Failed to load products', loading: false } as ErrorResult,
    };
  }
}

/**
 * Collection Page Component
 */
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const data = await getCollectionPageData(slug);
  
  // Check if collection exists
  if (!isDataResult(data.collection) || !data.collection.data) {
    notFound();
  }

  const collection = data.collection.data;
  const products = isDataResult(data.products) ? data.products.data : [];

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
                    {collection.name}
                  </span>
                </nav>
              </FadeIn>
            </Container>
          </section>
        </SectionErrorBoundary>

        {/* Collection Hero */}
        <SectionErrorBoundary sectionName="collection hero">
          <CollectionHero 
            collection={collection}
            className="py-16 md:py-24"
          />
        </SectionErrorBoundary>

        {/* Products Section */}
        <SectionErrorBoundary sectionName="products section">
          <section className="py-16 md:py-24">
            <Container size="lg">
              <div className="space-y-8">
                {/* Back to Collections Link */}
                <SlideUp delay={0.1}>
                  <Link 
                    href="/collections"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span style={{ fontFamily: 'Poppins' }}>Back to Collections</span>
                  </Link>
                </SlideUp>

                {/* Section Header */}
                <SlideUp delay={0.2}>
                  <div className="text-center mb-12">
                    <Typography 
                      variant="h2" 
                      className="text-3xl md:text-4xl font-bold mb-4"
                      style={{ 
                        fontFamily: 'Libre Baskerville',
                        color: '#98342d'
                      }}
                    >
                      {collection.name} Collection
                    </Typography>
                    <Typography 
                      variant="body" 
                      className="text-gray-600 max-w-2xl mx-auto"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {products.length} handcrafted rugs featuring unique designs and premium materials
                    </Typography>
                  </div>
                </SlideUp>

                {/* Products Grid with Filters */}
                <CollectionProductsClient 
                  products={products}
                  productsError={data.products.error}
                />
              </div>
            </Container>
          </section>
        </SectionErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

/**
 * Generate Static Params for Pre-rendering
 */
export async function generateStaticParams() {
  // In a real implementation, you would fetch all collection slugs
  // For now, return empty array to allow dynamic generation
  return [];
}

