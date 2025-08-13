import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface FeatureStripItem {
  icon?: string; // emoji or short label for decorative icon
  label: string;
}

export interface FeatureStripProps {
  items: FeatureStripItem[];
  className?: string;
}

/**
 * FeatureStrip — simple 3-up (responsive) icon + label list
 * Server component; no client interactivity required
 */
export function FeatureStrip({ items, className }: FeatureStripProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={cn('w-full', className)} aria-label="Site features">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-center text-neutral-600">
          {items.map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="flex items-center">
              <span className="font-sans italic text-xs md:text-sm leading-snug text-neutral-700 px-2 md:px-3 whitespace-nowrap">
                {item.label}
              </span>
              {idx < items.length - 1 && (
                <span aria-hidden className="mx-2 md:mx-4 text-[#98342d] align-middle text-xs md:text-sm">★</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


