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
import { SideBySideShowcase } from '@/components/homepage/SideBySideShowcase';
import { ImageBannerCTA } from '@/components/homepage/ImageBannerCTA';

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
      featuredProductsResult,
      homeCms
    ] = await Promise.all([
      getSafeHomepageData(),
      getSafeStyleCollections(6),
      getSafeSpaceCollections(3),
      getSafeFeaturedProducts(9),
      getHomePageData()
    ]);

    return {
      homepage: homepageResult,
      styleCollections: styleCollectionsResult,
      spaceCollections: spaceCollectionsResult,
      featuredProducts: featuredProductsResult,
      homeCms
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
        <div className="flex flex-col gap-10 md:gap-14 lg:gap-18">
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

          {/* Techniques showcase */}
          <SectionErrorBoundary sectionName="techniques showcase">
            <SideBySideShowcase
              items={(
                data.homeCms?.techniques && data.homeCms.techniques.length === 2
              )
                ? (data.homeCms.techniques as any).map((t: any) => ({
                    title: t.title,
                    image: { src: t.image?.src || '', alt: t.image?.alt || t.title },
                    href: t.href,
                  })) as any
                : [
                    { title: 'Hand-knotted', image: { src: '', alt: 'Hand-knotted' }, href: '/collections/hand-knotted' },
                    { title: 'Hand tufted', image: { src: '', alt: 'Hand tufted' }, href: '/collections/hand-tufted' },
                  ]}
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

          {/* Craftsmanship banner */}
          <SectionErrorBoundary sectionName="craftsmanship banner">
            <ImageBannerCTA
              title={data.homeCms?.craftsmanship?.title || 'Hands of Heritage'}
              image={{
                src: data.homeCms?.craftsmanship?.image?.src || '',
                alt: data.homeCms?.craftsmanship?.image?.alt || 'Craftsmanship',
              }}
              cta={{
                label: data.homeCms?.craftsmanship?.cta?.label || 'Explore the Craft',
                href: data.homeCms?.craftsmanship?.cta?.href || '/craftsmanship',
              }}
            />
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

