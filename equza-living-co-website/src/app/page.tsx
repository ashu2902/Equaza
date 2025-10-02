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
  getSafeFeaturedProducts,
  getSafeWeaveTypesWithImages
} from '@/lib/firebase/safe-firestore';
import { getHomePageData, type HomePageData } from '@/lib/firebase/pages';
import { isDataResult, ErrorResult } from '@/types/safe';

// Safe components with error boundaries
import { HeroSection } from '@/components/homepage/HeroSection';

import { StyleCollectionsSection } from '@/components/homepage/StyleCollectionsSection';
import { SafeSpaceTilesSection } from '@/components/homepage/SafeSpaceTilesSection';
import { CustomRugBanner } from '@/components/homepage/CustomRugBanner';
import { OurStoryTeaser } from '@/components/homepage/OurStoryTeaser';
import { LookbookSection } from '@/components/homepage/LookbookSection';
import { LookbookCompact } from '@/components/homepage/LookbookCompact';
import { ContactSection } from '@/components/homepage/ContactSection';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FeatureStrip } from '@/components/homepage/FeatureStrip';
import { DualCardHighlight } from '@/components/homepage/DualCardHighlight';
import RoomHighlightCarousel from '@/components/homepage/RoomHighlightCarousel';
import { WeaveTypesCarousel } from '@/components/homepage/WeaveTypesCarousel';

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

// Revalidate every 5 minutes to ensure fresh data
export const revalidate = 300;

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
      featuredProductsResult,
      weaveTypesResult,
      homeCms
    ] = await Promise.all([
      getSafeHomepageData(),
      getSafeStyleCollections(6),
      getSafeSpaceCollections(),
      getSafeFeaturedProducts(9),
      getSafeWeaveTypesWithImages(),
      getHomePageData()
    ]);

    return {
      homepage: homepageResult,
      styleCollections: styleCollectionsResult,
      spaceCollections: spaceCollectionsResult,
      featuredProducts: featuredProductsResult,
      weaveTypes: weaveTypesResult,
      homeCms
    };
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
    
    // Return error state for all sections
    return {
      homepage: { data: null, error: 'Failed to load homepage data', loading: false } as ErrorResult,
      styleCollections: { data: null, error: 'Failed to load style collections', loading: false } as ErrorResult,
      spaceCollections: { data: null, error: 'Failed to load space collections', loading: false } as ErrorResult,
      featuredProducts: { data: null, error: 'Failed to load featured products', loading: false } as ErrorResult,
      weaveTypes: { data: null, error: 'Failed to load weave types', loading: false } as ErrorResult
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
  const weaveTypesWithImages = isDataResult(data.weaveTypes) ? data.weaveTypes.data : [];
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{backgroundColor: '#f1eee9'}}>
        {/* Hero Section with Featured Products */}
        <SectionErrorBoundary sectionName="hero section">
          <HeroSection
            heroCms={Array.isArray(data.homeCms?.hero) ? data.homeCms?.hero as any : null}
          />
        </SectionErrorBoundary>

        {/* Feature Strip below hero */}
        <div className="py-6">
          <SectionErrorBoundary sectionName="feature strip">
            <FeatureStrip
              items={(data.homeCms?.features && data.homeCms.features.length > 0)
                ? data.homeCms.features.map((f: any) => ({ icon: f.icon, label: f.label }))
                : [
                    { icon: '⭐', label: 'Signature Styles' },
                    { icon: '🌱', label: 'Ethical Craftsmanship' },
                    { icon: '🌍', label: 'Global Standards' },
                  ]}
            />
          </SectionErrorBoundary>
        </div>

        {/* Content sections with standardized spacing rhythm */}
        <div className="flex flex-col gap-1">
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

          {/* Living/Bedroom/Narrow carousel */}
          <SectionErrorBoundary sectionName="room highlight carousel">
            <RoomHighlightCarousel
              title={data.homeCms?.roomHighlight?.title || 'Rugs by Space'}
              subtitle={data.homeCms?.roomHighlight?.description || 'Swipe to explore Bedroom and Narrow Spaces'}
              spaceCollections={spaceCollections}
            />
          </SectionErrorBoundary>

          {/* Weave Types Carousel */}
          <SectionErrorBoundary sectionName="weave types carousel">
            <WeaveTypesCarousel
              weaveTypes={weaveTypesWithImages.map(item => ({
                weaveType: item.weaveType,
                href: `/collections?weave=${encodeURIComponent(item.weaveType)}`,
                image: item.image
              }))}
            />
          </SectionErrorBoundary>

          {/* Custom Rug Banner - Moved to replace white section */}
          <SectionErrorBoundary sectionName="custom rug banner">
            <CustomRugBanner />
          </SectionErrorBoundary>

          {/* Our Story Teaser - Updated section replacing brand block */}
          <SectionErrorBoundary sectionName="our story teaser">
            <OurStoryTeaser />
          </SectionErrorBoundary>


          {/* Rugs by Space moved lower/not in PDF primary flow; keep but below heritage */}

          {/* Lookbook Section (compact per PDF) */}
          <SectionErrorBoundary sectionName="lookbook section">
            <Suspense fallback={<LoadingSkeleton variant="lookbook" />}>
              <LookbookCompact
                thumbnail={data.homeCms?.lookbook?.thumbnail || null}
                caption={data.homeCms?.lookbook?.caption || null}
                pdfUrl={data.homeCms?.lookbook?.pdfStorageRef || null}
              />
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

