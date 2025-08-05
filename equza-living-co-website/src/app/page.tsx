/**
 * Homepage - Safe Data Architecture
 * 
 * Uses safe data access functions and error boundaries.
 * All components receive guaranteed-safe data structures.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { 
  getSafeHomepageData,
  getSafeStyleCollections,
  getSafeSpaceCollections,
  getSafeFeaturedProducts 
} from '@/lib/firebase/safe-firestore';
import { isDataResult, ErrorResult } from '@/types/safe';

// Safe components with error boundaries
import { HeroSection } from '@/components/homepage/HeroSection';

import { StyleCollectionsSection } from '@/components/homepage/StyleCollectionsSection';
import { SafeSpaceTilesSection } from '@/components/homepage/SafeSpaceTilesSection';
import { CustomRugBanner } from '@/components/homepage/CustomRugBanner';
import { OurStoryTeaser } from '@/components/homepage/OurStoryTeaser';
import { LookbookSection } from '@/components/homepage/LookbookSection';
import { ContactSection } from '@/components/homepage/ContactSection';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';

// Loading components
import { LoadingSkeleton } from '@/components/homepage/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Equza Living Co. - Handcrafted Rugs for Modern Spaces',
  description: 'Discover our premium collection of handcrafted rugs. From traditional to contemporary styles, find the perfect rug for your living room, bedroom, or hallway.',
  openGraph: {
    title: 'Equza Living Co. - Handcrafted Rugs',
    description: 'Premium handcrafted rugs for modern spaces',
    images: ['/images/og-homepage.jpg'],
  },
};

/**
 * Homepage Data Fetching
 * Uses safe data access with comprehensive error handling
 */
async function getHomepageData() {
  try {
    // Fetch all data concurrently for better performance
    const [
      homepageResult,
      styleCollectionsResult,
      spaceCollectionsResult,
      featuredProductsResult
    ] = await Promise.all([
      getSafeHomepageData(),
      getSafeStyleCollections(6),
      getSafeSpaceCollections(3),
getSafeFeaturedProducts(9)
    ]);

    return {
      homepage: homepageResult,
      styleCollections: styleCollectionsResult,
      spaceCollections: spaceCollectionsResult,
      featuredProducts: featuredProductsResult
    };
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
    
    // Return error state for all sections
    return {
      homepage: { data: null, error: 'Failed to load homepage data', loading: false } as ErrorResult,
      styleCollections: { data: null, error: 'Failed to load style collections', loading: false } as ErrorResult,
      spaceCollections: { data: null, error: 'Failed to load space collections', loading: false } as ErrorResult,
      featuredProducts: { data: null, error: 'Failed to load featured products', loading: false } as ErrorResult
    };
  }
}

/**
 * Homepage Component
 */
export default async function HomePage() {
  const data = await getHomepageData();
  
  // Extract safe data with fallbacks
  const featuredProducts = isDataResult(data.featuredProducts) ? data.featuredProducts.data : [];
  const styleCollections = isDataResult(data.styleCollections) ? data.styleCollections.data : [];
  const spaceCollections = isDataResult(data.spaceCollections) ? data.spaceCollections.data : [];
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{backgroundColor: '#f1eee9'}}>
        {/* Hero Section with Featured Products */}
        <SectionErrorBoundary sectionName="hero section">
          <HeroSection
            featuredProducts={featuredProducts}
            siteSettings={null} // TODO: Add safe site settings
          />
        </SectionErrorBoundary>

        {/* Content sections with 90px gaps as per Figma */}
        <div className="flex flex-col gap-[90px]">
          {/* Rugs by Style Collections */}
          <SectionErrorBoundary sectionName="style collections">
            <StyleCollectionsSection
              title="Rugs by Style"
              subtitle="Discover our curated collections, each telling a unique story through craftsmanship and design"
              collections={styleCollections}
              loading={false}
              error={data.styleCollections.error}
            />
          </SectionErrorBoundary>

          {/* Rugs by Space Collections */}
          <SectionErrorBoundary sectionName="space collections">
            <SafeSpaceTilesSection
              title="Rugs by Space"
              subtitle="Find the perfect rug for every room in your home, from living areas to intimate bedrooms"
              spaceCollections={spaceCollections}
              loading={false}
              error={data.spaceCollections.error}
            />
          </SectionErrorBoundary>

          {/* Custom Rug Banner */}
          <SectionErrorBoundary sectionName="custom rug banner">
            <CustomRugBanner />
          </SectionErrorBoundary>

          {/* Our Story Teaser */}
          <SectionErrorBoundary sectionName="our story section">
            <OurStoryTeaser />
          </SectionErrorBoundary>

          {/* Lookbook Section */}
          <SectionErrorBoundary sectionName="lookbook section">
            <Suspense fallback={<LoadingSkeleton variant="lookbook" />}>
              <LookbookSection lookbook={null} siteSettings={null} />
            </Suspense>
          </SectionErrorBoundary>

          {/* Contact Section */}
          <SectionErrorBoundary sectionName="contact section">
            <ContactSection siteSettings={null} />
          </SectionErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
}

