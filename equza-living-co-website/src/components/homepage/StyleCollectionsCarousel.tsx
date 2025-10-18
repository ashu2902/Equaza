/**
 * Style Collections Carousel
 * Sliding carousel for displaying style collections with navigation controls
 */

'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { SafeCollection } from '@/types/safe';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';
import { SafeCollectionTileCompact } from '@/components/collections/SafeCollectionTileCompact';

interface StyleCollectionsCarouselProps {
  title?: string;
  subtitle?: string;
  collections: SafeCollection[];
  loading?: boolean;
  error?: string | null;
}

export function StyleCollectionsCarousel({
  title = 'Rugs by Style',
  subtitle = 'Discover our curated collections, each telling a unique story through craftsmanship and design',
  collections,
  loading = false,
  error = null,
}: StyleCollectionsCarouselProps) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Calculate responsive items per view
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      if (width < 640) {
        setItemsPerView(1); // sm: 1 item
      } else if (width < 768) {
        setItemsPerView(2); // md: 2 items
      } else if (width < 1024) {
        setItemsPerView(3); // lg: 3 items
      } else {
        setItemsPerView(4); // xl: 4 items
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const totalSlides = Math.ceil(collections.length / itemsPerView);

  // Auto-scroll effect
  useEffect(() => {
    if (collections.length <= itemsPerView || isHovered || isPaused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [collections.length, itemsPerView, totalSlides, isHovered, isPaused]);

  // Early returns
  if (!loading && !error && (!collections || collections.length === 0)) {
    return (
      <section className='py-8 lg:py-12' style={{ backgroundColor: '#f1eee9' }}>
        <Container size='xl'>
          <FadeIn>
            <div className='text-center space-y-4 mb-16'>
              <Typography
                variant='h2'
                className='text-3xl md:text-4xl font-normal font-libre-baskerville'
                style={{ color: '#98342d' }}
              >
                {title}
              </Typography>
              <Typography
                variant='body'
                className='text-base md:text-lg font-poppins'
                style={{ color: '#666666' }}
              >
                {subtitle}
              </Typography>
            </div>
          </FadeIn>

          <SlideUp delay={0.2}>
            <div className='text-center py-12'>
              <Typography
                variant='h4'
                className='font-libre-baskerville mb-4'
                style={{ color: '#98342d' }}
              >
                No Collections Available
              </Typography>
              <Typography
                variant='body1'
                className='font-poppins'
                style={{ color: '#6b7280' }}
              >
                Check back later for new collections.
              </Typography>
            </div>
          </SlideUp>
        </Container>
      </section>
    );
  }

  const goNext = () => {
    setIndex((prev) => (prev + 1) % totalSlides);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 7000);
  };

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 7000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    setTouchStartX(touch.clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    setTouchEndX(touch.clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goNext();
    } else if (isRightSwipe) {
      goPrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Get collections for current slide
  const getCurrentSlideCollections = () => {
    const startIndex = index * itemsPerView;
    const endIndex = startIndex + itemsPerView;
    return collections.slice(startIndex, endIndex);
  };

  return (
    <section className='py-8 lg:py-12' style={{ backgroundColor: '#f1eee9' }}>
      <Container size='xl'>
        <FadeIn>
          <div className='text-center space-y-4 mb-16'>
            <h2
              className='text-3xl md:text-4xl font-normal font-libre-baskerville'
              style={{ color: '#98342d' }}
            >
              {title}
            </h2>
            <p
              className='text-base md:text-lg font-poppins'
              style={{ color: '#666666' }}
            >
              {subtitle}
            </p>
          </div>
        </FadeIn>

        <SlideUp delay={0.2}>
          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className='bg-white rounded-2xl overflow-hidden animate-pulse'
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div className='aspect-[4/3] bg-gray-200' />
                  <div className='p-6 space-y-3'>
                    <div className='h-6 bg-gray-200 rounded w-3/4 mx-auto' />
                    <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto' />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className='text-center py-12'>
              <Typography
                variant='h4'
                className='font-libre-baskerville mb-4'
                style={{ color: '#98342d' }}
              >
                Unable to Load Collections
              </Typography>
              <Typography
                variant='body1'
                className='font-poppins'
                style={{ color: '#6b7280' }}
              >
                {error}
              </Typography>
            </div>
          ) : (
            <div
              className='relative'
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Carousel Track */}
              <div className='overflow-hidden'>
                <div
                  className='flex transition-transform duration-500 ease-in-out'
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className='min-w-full'>
                      <div
                        className={cn(
                          'grid gap-6 md:gap-8',
                          itemsPerView === 1 && 'grid-cols-1',
                          itemsPerView === 2 && 'grid-cols-2',
                          itemsPerView === 3 && 'grid-cols-3',
                          itemsPerView === 4 && 'grid-cols-4'
                        )}
                      >
                        {collections
                          .slice(
                            slideIndex * itemsPerView,
                            (slideIndex + 1) * itemsPerView
                          )
                          .map((collection, itemIndex) => (
                            <SlideUp
                              key={collection.id}
                              delay={itemIndex * 0.1}
                            >
                              <SafeCollectionTileCompact
                                collection={collection}
                                priority={slideIndex === 0 && itemIndex < 2}
                              />
                            </SlideUp>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls */}
              {totalSlides > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={goPrev}
                    className={cn(
                      'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4',
                      'w-12 h-12 rounded-full bg-white shadow-lg',
                      'flex items-center justify-center',
                      'hover:bg-gray-50 transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'z-10'
                    )}
                    disabled={totalSlides <= 1}
                    aria-label='Previous collections'
                  >
                    <ChevronLeft className='w-6 h-6 text-gray-700' />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={goNext}
                    className={cn(
                      'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4',
                      'w-12 h-12 rounded-full bg-white shadow-lg',
                      'flex items-center justify-center',
                      'hover:bg-gray-50 transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'z-10'
                    )}
                    disabled={totalSlides <= 1}
                    aria-label='Next collections'
                  >
                    <ChevronRight className='w-6 h-6 text-gray-700' />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {totalSlides > 1 && (
                <div className='flex justify-center mt-8 space-x-2'>
                  {Array.from({ length: totalSlides }).map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => setIndex(dotIndex)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all duration-200',
                        dotIndex === index
                          ? 'bg-red-600 w-8'
                          : 'bg-gray-300 hover:bg-gray-400'
                      )}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </SlideUp>
      </Container>
    </section>
  );
}
