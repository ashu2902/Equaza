'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/MotionWrapper';
import { SafeProduct } from '@/types/safe';

const BRAND = {
  name: 'EQUZA LIVING CO.',
};

interface HeroSectionProps {
  featuredProducts: SafeProduct[];
  siteSettings?: any;
}

export function HeroSection({ featuredProducts, siteSettings }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    if (featuredProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const currentProduct = featuredProducts[currentSlide];

  return (
    <section className="relative min-h-screen overflow-hidden" style={{backgroundColor: '#f1eee9'}}>
      {/* Hero Background Image */}
      {featuredProducts.length > 0 && currentProduct && (
        <div className="absolute inset-0">
          <Image
            src={(() => {
              const mainImage = currentProduct.images.find(img => img.isMain);
              return mainImage ? mainImage.url : currentProduct.images[0]?.url || '/placeholder-rug.jpg';
            })()}
            alt={(() => {
              const mainImage = currentProduct.images.find(img => img.isMain);
              return mainImage ? mainImage.alt : currentProduct.images[0]?.alt || currentProduct.name;
            })()}
            fill
            className="object-cover"
            priority
          />
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Navigation Arrows */}
      {featuredProducts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 z-20"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 z-20"
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Minimal Hero Content - Clean and Simple */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="space-y-6">
              {/* Brand Name - Minimal */}
              <Typography variant="overline" className="text-white font-medium tracking-wider text-sm opacity-90">
                {BRAND.name}
              </Typography>
              
              {/* Main Headline - Clean and Readable */}
              <Typography 
                variant="h1" 
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal leading-tight text-white"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                Crafted Calm for Modern Spaces
              </Typography>
            </div>
          </FadeIn>

          {/* Blended CTA Button - Elegant and Soft */}
          <SlideUp delay={0.2}>
            <div className="mt-8">
              <Button 
                asChild 
                size="lg" 
                className="px-10 py-3 text-white font-medium backdrop-blur-sm border border-white/30 hover:border-white/50 hover:backdrop-blur-md transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(152, 52, 45, 0.8)',
                  boxShadow: '0 8px 32px rgba(152, 52, 45, 0.3)'
                }}
              >
                <Link href="/collections">
                  Explore Now
                </Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </div>

      {/* Elegant Product Info Card - Blended Design */}
      <div className="absolute bottom-8 left-8 z-10 max-w-sm">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="space-y-3">
            <Typography variant="h4" className="font-serif font-normal text-lg" style={{ color: '#98342d' }}>
              {currentProduct?.name || 'Heritage Medallion'}
            </Typography>
            <Typography variant="body2" className="text-gray-700 text-sm leading-relaxed">
              A classic traditional rug featuring an intricate central medallion pattern.
            </Typography>
            <div className="pt-2">
              <Link 
                href={currentProduct ? `/product/${currentProduct.slug}` : '/collections'}
                className="inline-flex items-center text-sm font-medium transition-all duration-200 hover:translate-x-1"
                style={{ color: '#98342d' }}
              >
                View Details
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Slide Indicators */}
      {featuredProducts.length > 1 && (
        <div className="absolute bottom-8 right-8 flex space-x-3 z-10">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex space-x-2">
            {featuredProducts.map((_, index) => (
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