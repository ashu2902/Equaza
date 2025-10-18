'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { cn } from '@/lib/utils/cn';

export interface WeaveTypeItem {
  weaveType: string;
  image?: { src: string; alt: string };
  href: string;
}

export interface WeaveTypesCarouselProps {
  weaveTypes: WeaveTypeItem[];
  className?: string;
}

export function WeaveTypesCarousel({
  weaveTypes,
  className,
}: WeaveTypesCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate derived values
  const itemsPerView = isMobile ? 1 : 2;
  const totalSlides = weaveTypes
    ? Math.ceil(weaveTypes.length / itemsPerView)
    : 0;

  // Autoscroll effect - only on mobile
  useEffect(() => {
    if (
      !weaveTypes ||
      weaveTypes.length === 0 ||
      !isMobile ||
      totalSlides <= 1 ||
      isHovered ||
      isPaused
    )
      return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [weaveTypes, isMobile, totalSlides, isHovered, isPaused]);

  // Early return after all hooks
  if (!weaveTypes || weaveTypes.length === 0) return null;

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
    if (touchStartX === null || touchEndX === null) return;
    const deltaX = touchStartX - touchEndX;
    const SWIPE_THRESHOLD = 50;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) goNext();
      else goPrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <section
      className={cn('w-full py-12 md:py-16', className)}
      aria-label='Weave Types'
      style={{ backgroundColor: '#f1eee9' }}
    >
      <div className='mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16'>
        <div className='text-center space-y-4 mb-8'>
          <h2
            className='text-3xl md:text-4xl font-normal font-libre-baskerville'
            style={{ color: '#98342d' }}
          >
            Weave Types
          </h2>
          <p
            className='text-base md:text-lg font-poppins'
            style={{ color: '#666666' }}
          >
            Explore our diverse collection of handcrafted weaving techniques
          </p>
        </div>

        {isMobile ? (
          // Mobile: Carousel with touch support
          <div
            className='relative'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Track */}
            <div className='overflow-hidden'>
              <div
                className='flex transition-transform duration-500'
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {weaveTypes.map((item, slideIndex) => {
                  return (
                    <div key={slideIndex} className='min-w-full px-1'>
                      <div className='flex gap-6 justify-center'>
                        <div className='w-80 flex-shrink-0'>
                          <Link
                            href={item.href}
                            className='block hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#98342d] transition-opacity'
                          >
                            <figure className='relative rounded-xl overflow-hidden border border-neutral-200'>
                              <div className='relative aspect-[4/3]'>
                                {item.image?.src ? (
                                  <SafeImage
                                    src={item.image.src}
                                    alt={item.image.alt || item.weaveType}
                                    fill
                                    className='object-cover'
                                  />
                                ) : (
                                  <div className='w-full h-full bg-neutral-200 flex items-center justify-center'>
                                    <span className='text-neutral-500 text-sm'>
                                      No image
                                    </span>
                                  </div>
                                )}
                              </div>
                              <figcaption className='absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-sm font-medium'>
                                {item.weaveType}
                              </figcaption>
                            </figure>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile: Only show indicators, no arrows */}
            {totalSlides > 1 && (
              <div className='mt-4 flex items-center justify-center gap-2'>
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 w-6 rounded-full bg-neutral-300',
                      i === index && 'bg-[#98342d]'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Desktop: Grid layout showing all items
          <div className='grid grid-cols-2 gap-8 max-w-6xl mx-auto'>
            {weaveTypes.map((item, itemIndex) => (
              <div key={itemIndex} className='w-full'>
                <Link
                  href={item.href}
                  className='block hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#98342d] transition-opacity'
                >
                  <figure className='relative rounded-2xl overflow-hidden border border-neutral-200 shadow-lg'>
                    <div className='relative aspect-[4/3]'>
                      {item.image?.src ? (
                        <SafeImage
                          src={item.image.src}
                          alt={item.image.alt || item.weaveType}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='w-full h-full bg-neutral-200 flex items-center justify-center'>
                          <span className='text-neutral-500 text-sm'>
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <figcaption className='absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-black/60 text-white text-base font-medium'>
                      {item.weaveType}
                    </figcaption>
                  </figure>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
