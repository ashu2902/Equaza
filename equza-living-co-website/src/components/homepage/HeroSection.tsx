'use client';

import { useState, useEffect, type TouchEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

// Removed brand overline text per design request

interface HeroSlide {
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  image?: { src: string; alt: string; staticSrc?: string };
}

interface HeroSectionProps {
  heroCms?: HeroSlide[] | null;
}

export function HeroSection({ heroCms }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Only use CMS slides for hero content
  const cmsSlides: HeroSlide[] = Array.isArray(heroCms) ? heroCms : [];

  // Auto-rotate slides
  useEffect(() => {
    if (cmsSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cmsSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [cmsSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % cmsSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + cmsSlides.length) % cmsSlides.length);
  };

  const currentCmsSlide: HeroSlide | null = cmsSlides[currentSlide] ?? null;

  const handleTouchStart = (e: TouchEvent) => {
    const firstTouch = e.changedTouches.item(0);
    if (!firstTouch) return;
    setTouchStartX(firstTouch.clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const firstTouch = e.changedTouches.item(0);
    if (!firstTouch) return;
    setTouchEndX(firstTouch.clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const deltaX = touchStartX - touchEndX;
    const SWIPE_THRESHOLD = 50;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Only show slides if we have CMS slides, otherwise show nothing
  if (cmsSlides.length === 0) {
    return null;
  }

  return (
    <section
      id='hero'
      data-hero
      className='relative min-h-screen overflow-hidden'
      style={{ backgroundColor: '#f1eee9' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hero Background Image */}
      {(currentCmsSlide?.image?.staticSrc || currentCmsSlide?.image?.src) && (
        <div className='absolute inset-0'>
          <Image
            src={currentCmsSlide.image.staticSrc || currentCmsSlide.image.src}
            alt={currentCmsSlide.image.alt || 'Hero background'}
            fill
            className='object-cover'
            priority
          />

          {/* Dark overlay for text readability */}
          <div className='absolute inset-0 bg-black/50' />
        </div>
      )}

      {/* Navigation Arrows */}
      {cmsSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='hidden md:block absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 z-20'
            aria-label='Previous slide'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>

          <button
            onClick={nextSlide}
            className='hidden md:block absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 z-20'
            aria-label='Next slide'
          >
            <ChevronRight className='w-6 h-6' />
          </button>
        </>
      )}

      {/* Minimal Hero Content - Clean and Simple */}
      <div className='relative z-10 min-h-screen flex items-center justify-center'>
        <div className='text-left md:text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <FadeIn>
            <div className='space-y-6'>
              {/* Main Headline - Clean and Readable */}
              <Typography
                variant='h1'
                className='text-4xl md:text-5xl lg:text-6xl font-serif font-normal leading-tight text-white text-left md:text-center'
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                {currentCmsSlide?.title || 'Crafted Calm for Modern Spaces'}
              </Typography>
              {currentCmsSlide?.subtitle && (
                <Typography
                  variant='body'
                  className='text-white/90 max-w-2xl mx-auto text-left md:text-center'
                >
                  {currentCmsSlide.subtitle}
                </Typography>
              )}
            </div>
          </FadeIn>

          {/* Blended CTA Button - Elegant and Soft */}
          <SlideUp delay={0.2}>
            <div className='mt-8 flex justify-start md:justify-center'>
              <Button
                asChild
                size='lg'
                className='px-10 py-3 text-white font-medium backdrop-blur-sm border border-white/30 hover:border-white/50 hover:backdrop-blur-md transition-all duration-300'
                style={{
                  backgroundColor: 'rgba(152, 52, 45, 0.8)',
                  boxShadow: '0 8px 32px rgba(152, 52, 45, 0.3)',
                }}
              >
                <Link href={currentCmsSlide?.cta?.href || '/collections'}>
                  {currentCmsSlide?.cta?.label || 'Explore Now'}
                </Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </div>

      {/* PDF variant: no bottom-left product card */}

      {/* Elegant Slide Indicators */}
      {cmsSlides.length > 1 && (
        <div className='absolute bottom-8 right-8 flex space-x-3 z-10'>
          <div className='bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex space-x-2'>
            {cmsSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentSlide
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
