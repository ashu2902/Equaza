/**
 * Hero Image Hook
 * React hook for fetching and managing hero images from Firebase
 */

'use client';

import { useState, useEffect } from 'react';
import { getPageHeroImage, type HeroImageData } from '@/lib/firebase/hero-images';

export interface UseHeroImageResult {
  heroImage: HeroImageData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export type PageType = 'our-story' | 'craftsmanship' | 'trade' | 'customize';

/**
 * Hook to fetch and manage hero image for a specific page
 */
export function useHeroImage(pageType: PageType): UseHeroImageResult {
  const [heroImage, setHeroImage] = useState<HeroImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroImage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const imageData = await getPageHeroImage(pageType);
      
      if (imageData) {
        setHeroImage(imageData);
      } else {
        // If no Firebase data, use static fallback
        setHeroImage({
          imageUrl: getStaticFallbackImage(pageType),
          altText: getStaticFallbackAltText(pageType),
          isActive: true,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'static-fallback',
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hero image';
      setError(errorMessage);
      console.error(`Error fetching hero image for ${pageType}:`, err);
      
      // Set fallback image on error
      setHeroImage({
        imageUrl: getStaticFallbackImage(pageType),
        altText: getStaticFallbackAltText(pageType),
        isActive: true,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'error-fallback',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchHeroImage();
  };

  useEffect(() => {
    fetchHeroImage();
  }, [pageType]);

  return {
    heroImage,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Get static fallback image path for a page type
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
 * Get static fallback alt text for a page type
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

/**
 * Hook for multiple hero images (useful for admin interfaces)
 */
export function useAllHeroImages() {
  const [heroImages, setHeroImages] = useState<Record<PageType, HeroImageData | null>>({
    'our-story': null,
    'craftsmanship': null,
    'trade': null,
    'customize': null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllHeroImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const pageTypes: PageType[] = ['our-story', 'craftsmanship', 'trade', 'customize'];
      const promises = pageTypes.map(async (pageType) => {
        const imageData = await getPageHeroImage(pageType);
        return { pageType, imageData };
      });
      
      const results = await Promise.all(promises);
      
      const newHeroImages = {} as Record<PageType, HeroImageData | null>;
      results.forEach(({ pageType, imageData }) => {
        newHeroImages[pageType] = imageData;
      });
      
      setHeroImages(newHeroImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hero images';
      setError(errorMessage);
      console.error('Error fetching all hero images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchAllHeroImages();
  };

  useEffect(() => {
    fetchAllHeroImages();
  }, []);

  return {
    heroImages,
    isLoading,
    error,
    refetch,
  };
}
