/**
 * Hero Section Component
 * Reusable hero section with Firebase-powered background images
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';
import { useHeroImage, type PageType } from '@/lib/hooks/useHeroImage';

export interface HeroSectionProps {
  pageType: PageType;
  title: string;
  subtitle?: string;
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkHref?: string;
  textAlignment?: 'left' | 'center';
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function HeroSection({
  pageType,
  title,
  subtitle,
  showBackLink = true,
  backLinkText = 'Back to Home',
  backLinkHref = '/',
  textAlignment = 'left',
  overlayOpacity = 0.4,
  className = '',
  children,
}: HeroSectionProps) {
  const { heroImage, isLoading, error } = useHeroImage(pageType);

  // Determine text colors based on alignment and overlay
  const textColorClass = overlayOpacity > 0.3 ? 'text-white' : 'text-gray-900';
  const subtitleColorClass = overlayOpacity > 0.3 ? 'text-white/90' : 'text-gray-600';
  const backLinkColorClass = overlayOpacity > 0.3 
    ? 'text-white/80 hover:text-white' 
    : 'text-gray-600 hover:text-gray-900';

  const alignmentClass = textAlignment === 'center' 
    ? 'text-center max-w-4xl mx-auto' 
    : 'max-w-4xl';

  return (
    <section className={`relative py-16 md:py-24 ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {overlayOpacity > 0 && (
          <div 
            className="absolute inset-0 bg-black z-10"
            style={{ opacity: overlayOpacity }}
          />
        )}
        
        {!isLoading && heroImage?.imageUrl && (
          <img 
            src={heroImage.imageUrl}
            alt={heroImage.altText || 'Hero background'}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 40%' }}
            onError={(e) => {
              console.error('Error loading hero image:', heroImage.imageUrl);
              // Fallback to static image on error
              e.currentTarget.src = getStaticFallbackImage(pageType);
            }}
          />
        )}
        
        {/* Loading state - show static fallback */}
        {(isLoading || error) && (
          <img 
            src={getStaticFallbackImage(pageType)}
            alt={getStaticFallbackAltText(pageType)}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 40%' }}
          />
        )}
      </div>
      
      {/* Content */}
      <Container size="lg" className="relative z-20">
        <div className={`space-y-8 ${alignmentClass}`}>
          <FadeIn>
            {/* Title */}
            <Typography
              variant="h1"
              className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 ${textColorClass}`}
              style={{ 
                fontFamily: 'Libre Baskerville',
                color: overlayOpacity <= 0.3 ? '#98342d' : undefined
              }}
            >
              {title}
            </Typography>
            
            {/* Subtitle */}
            {subtitle && (
              <Typography
                variant="body"
                className={`text-xl md:text-2xl leading-relaxed max-w-3xl ${subtitleColorClass}`}
                style={{ fontFamily: 'Poppins' }}
              >
                {subtitle}
              </Typography>
            )}
          </FadeIn>

          {/* Back Link */}
          {showBackLink && (
            <SlideUp delay={0.3}>
              <Link 
                href={backLinkHref}
                className={`inline-flex items-center transition-colors group ${backLinkColorClass}`}
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span style={{ fontFamily: 'Poppins' }}>{backLinkText}</span>
              </Link>
            </SlideUp>
          )}

          {/* Custom content */}
          {children}
        </div>
      </Container>
    </section>
  );
}

/**
 * Get static fallback image for error cases
 */
function getStaticFallbackImage(pageType: PageType): string {
  const fallbackImages = {
    'our-story': '/images/our-story-hero.jpg',
    'craftsmanship': '/images/craftsmanship-hero.jpg',
    'trade': '/images/trade-hero.jpg',
    'customize': '/images/craftsmanship-hero.jpg',
  };
  
  return fallbackImages[pageType];
}

/**
 * Get static fallback alt text
 */
function getStaticFallbackAltText(pageType: PageType): string {
  const fallbackAltTexts = {
    'our-story': 'Our story - heritage craftsmanship',
    'craftsmanship': 'Master artisan weaving traditional rug',
    'trade': 'Business partnership handshake with rugs in background',
    'customize': 'Traditional rug weaving background',
  };
  
  return fallbackAltTexts[pageType];
}
