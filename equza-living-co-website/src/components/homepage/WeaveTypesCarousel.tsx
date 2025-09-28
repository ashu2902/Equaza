'use client';

import React from 'react';
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

export function WeaveTypesCarousel({ weaveTypes, className }: WeaveTypesCarouselProps) {
  if (!weaveTypes || weaveTypes.length === 0) return null;
  
  return (
    <section className={cn('w-full', className)} aria-label="Weave Types">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">
        {/* Horizontal scrollable container */}
        <div 
          className="overflow-x-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {weaveTypes.map((item) => {
              const Figure = (
                <figure className="relative rounded-xl overflow-hidden border border-neutral-200 w-80 flex-shrink-0">
                  <div className="relative aspect-[4/3]">
                    {item.image?.src ? (
                      <SafeImage 
                        src={item.image.src} 
                        alt={item.image.alt || item.weaveType} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                        <span className="text-neutral-500 text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <figcaption className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-sm font-medium">
                    {item.weaveType}
                  </figcaption>
                </figure>
              );

              return (
                <div key={item.weaveType}>
                  <Link 
                    href={item.href} 
                    className="block hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#98342d] transition-opacity"
                  >
                    {Figure}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}