'use client';

/**
 * Safe Image Component
 * Handles image loading errors gracefully with fallbacks
 */

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  sizes,
  priority,
  quality = 75,
  fallbackSrc = '/placeholder-rug.jpg',
  onLoad,
  onError,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (imgSrc !== fallbackSrc && !hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
      console.warn(
        `Image failed to load: ${src}, using fallback: ${fallbackSrc}`
      );
    }
    onError?.();
  }, [imgSrc, fallbackSrc, hasError, src, onError]);

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  const imageProps = {
    src: imgSrc,
    alt,
    className: cn(className),
    onError: handleError,
    onLoad: handleLoad,
    quality,
    priority,
    sizes,
    ...props,
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return <Image {...imageProps} width={width} height={height} />;
}
