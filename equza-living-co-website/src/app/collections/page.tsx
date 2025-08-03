'use client';

/**
 * Collections Page - Main Collections Landing
 * 
 * Displays collections organized by tabs: "Rugs by Style" and "Rugs by Space"
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSafeStyleCollections, getSafeSpaceCollections } from '@/lib/firebase/safe-firestore';
import { isDataResult } from '@/types/safe';

// Components
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { SafeCollectionTilesSection } from '@/components/homepage/SafeCollectionTilesSection';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

// Loading components
import { LoadingSkeleton } from '@/components/homepage/LoadingSkeleton';

/**
 * Collections Page Component
 */
export default function CollectionsPage() {
  const [styleCollections, setStyleCollections] = useState<any[]>([]);
  const [spaceCollections, setSpaceCollections] = useState<any[]>([]);
  const [styleError, setStyleError] = useState<string | null>(null);
  const [spaceError, setSpaceError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const [styleResult, spaceResult] = await Promise.all([
          getSafeStyleCollections(),
          getSafeSpaceCollections(),
        ]);

        // Use actual Firebase data for style collections
        if (isDataResult(styleResult) && styleResult.data) {
          setStyleCollections(styleResult.data);
          setStyleError(styleResult.error);
        } else {
          setStyleCollections([]);
          setStyleError(styleResult?.error || 'No style collections found');
        }

        // Use actual Firebase data for space collections
        if (isDataResult(spaceResult) && spaceResult.data) {
          setSpaceCollections(spaceResult.data);
          setSpaceError(spaceResult.error);
        } else {
          setSpaceCollections([]);
          setSpaceError(spaceResult?.error || 'No space collections found');
        }
      } catch (error) {
        console.error('Failed to fetch collections:', error);
        setStyleCollections([]);
        setSpaceCollections([]);
        setStyleError('Failed to load style collections');
        setSpaceError('Failed to load space collections');
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ backgroundColor: '#f1eee9' }}>
        {/* Hero Section */}
        <SectionErrorBoundary sectionName="collections hero">
          <section className="py-16 md:py-24">
            <Container size="lg">
              <FadeIn>
                <div className="text-center max-w-3xl mx-auto">
                  <Typography
                    variant="h1"
                    className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                    style={{ 
                      fontFamily: 'Libre Baskerville',
                      color: '#98342d'
                    }}
                  >
                    Collections
                  </Typography>
                  <Typography
                    variant="body"
                    className="text-lg md:text-xl text-gray-600 leading-relaxed"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Discover our curated collections of handcrafted rugs, each telling its own story through traditional artistry and contemporary design.
                  </Typography>
                </div>
              </FadeIn>
            </Container>
          </section>
        </SectionErrorBoundary>

        {/* Collections Content */}
        <SectionErrorBoundary sectionName="collections content">
          <section className="pb-16 md:pb-24">
            {loading ? (
              <div style={{ padding: '45px 48px' }}>
                <LoadingSkeleton variant="tiles" />
              </div>
            ) : (
              <CollectionsTabsSection 
                styleCollections={styleCollections}
                spaceCollections={spaceCollections}
                styleError={styleError}
                spaceError={spaceError}
              />
            )}
          </section>
        </SectionErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

/**
 * Collections Tabs Section Component
 */
interface CollectionsTabsSectionProps {
  styleCollections: any[];
  spaceCollections: any[];
  styleError: string | null;
  spaceError: string | null;
}

function CollectionsTabsSection({ 
  styleCollections, 
  spaceCollections, 
  styleError, 
  spaceError 
}: CollectionsTabsSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'style' | 'space'>('style');

  // Handle URL hash on mount and updates
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#space') {
      setActiveTab('space');
    } else {
      setActiveTab('style');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'style' | 'space') => {
    setActiveTab(tab);
    // Update URL hash
    const newUrl = tab === 'space' ? '/collections#space' : '/collections#style';
    router.replace(newUrl, { scroll: false });
  };

  return (
    <SlideUp delay={0.2}>
      <div className="w-full max-w-7xl mx-auto px-4 space-y-12">
        {/* Tab Navigation - Fixed Toggle Switch */}
        <div className="flex justify-center">
          <div 
            className="relative inline-flex"
            style={{
              width: '400px',
              height: '60px',
              background: '#E3D0BF',
              border: '2px solid #B49578',
              borderRadius: '100px',
              padding: '2px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Moving White Background - Full Coverage */}
            <div 
              className="absolute transition-all duration-300 ease-in-out z-0"
              style={{
                width: '198px',     // (400-4)/2 = 198 for exact half with minimal padding
                height: '56px',     // 60-4 = 56 for 2px padding on all sides
                background: '#FFFFFF',
                borderRadius: '100px',
                top: '2px',         // 2px from top
                left: activeTab === 'style' ? '2px' : '200px', // 2px from left, or 2px + half width = 200px
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            
            {/* Tab Buttons Container */}
            <div className="relative flex w-full h-full z-10">
              {/* Style Tab */}
              <button
                onClick={() => handleTabChange('style')}
                className="flex-1 flex items-center justify-center text-center transition-all duration-300 font-medium"
                style={{
                  fontFamily: 'Poppins',
                  fontSize: '16px',
                  color: activeTab === 'style' ? '#98342d' : '#666666',
                  fontWeight: activeTab === 'style' ? '600' : '500'
                }}
              >
                Rugs by style
              </button>
              
              {/* Space Tab */}
              <button
                onClick={() => handleTabChange('space')}
                className="flex-1 flex items-center justify-center text-center transition-all duration-300 font-medium"
                style={{
                  fontFamily: 'Poppins',
                  fontSize: '16px',
                  color: activeTab === 'space' ? '#98342d' : '#666666',
                  fontWeight: activeTab === 'space' ? '600' : '500'
                }}
              >
                Rugs by Space
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Tab Description */}
          <div className="text-center space-y-4">
            <Typography
              variant="h2"
              className="text-3xl md:text-4xl font-bold"
              style={{ 
                fontFamily: 'Libre Baskerville',
                color: '#98342d'
              }}
            >
              {activeTab === 'style' ? 'Rugs by Style' : 'Rugs by Space'}
            </Typography>
            <Typography 
              variant="body" 
              className="text-gray-600 max-w-2xl mx-auto"
              style={{ fontFamily: 'Poppins' }}
            >
              {activeTab === 'style' 
                ? 'Explore our diverse style collections, each with its own personality and aesthetic. From bold contemporary designs to timeless traditional patterns.'
                : 'Find the perfect rug for every room in your home. Our space-curated collections help you discover pieces that complement your lifestyle and interior design.'
              }
            </Typography>
          </div>

          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'style' ? (
            styleError ? (
              <div className="text-center py-8">
                <Typography variant="body" className="text-red-600">
                  {styleError}
                </Typography>
              </div>
            ) : (
              <div className="space-y-6 w-full">
                <Typography 
                  variant="body" 
                  className="text-center text-gray-600"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Showing {styleCollections.length} collections
                </Typography>
                <div className="w-full flex justify-center">
                  <Suspense fallback={<LoadingSkeleton variant="tiles" />}>
                    <SafeCollectionTilesSection
                      title="Our Style Collections"
                      subtitle="Discover rugs organized by aesthetic and design philosophy"
                      collections={styleCollections}
                      loading={false}
                      error={null}
                      type="style"
                    />
                  </Suspense>
                </div>
              </div>
            )
          ) : (
            spaceError ? (
              <div className="text-center py-8">
                <Typography variant="body" className="text-red-600">
                  {spaceError}
                </Typography>
              </div>
            ) : (
              <div className="space-y-6 w-full">
                <Typography 
                  variant="body" 
                  className="text-center text-gray-600"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Showing {spaceCollections.length} collections
                </Typography>
                <div className="w-full flex justify-center">
                  <Suspense fallback={<LoadingSkeleton variant="tiles" />}>
                    <SafeCollectionTilesSection
                      title="Our Space Collections"
                      subtitle="Find the perfect rug for every room in your home"
                      collections={spaceCollections}
                      loading={false}
                      error={null}
                      type="space"
                    />
                  </Suspense>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </SlideUp>
  );
}

