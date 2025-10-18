import React from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { cn } from '@/lib/utils/cn';

export interface ShowcaseItem {
  title: string;
  image: { src: string; alt: string };
  href?: string;
}

export interface SideBySideShowcaseProps {
  items: [ShowcaseItem, ShowcaseItem];
  className?: string;
}

export function SideBySideShowcase({
  items,
  className,
}: SideBySideShowcaseProps) {
  if (!items || items.length !== 2) return null;
  return (
    <section className={cn('w-full', className)} aria-label='Showcase'>
      <div className='mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {items.map((item, idx) => {
            const Figure = (
              <figure className='relative rounded-xl overflow-hidden border border-neutral-200'>
                <div className='relative aspect-[4/3]'>
                  {item.image?.src ? (
                    <SafeImage
                      src={item.image.src}
                      alt={item.image.alt || ''}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-neutral-200' />
                  )}
                </div>
                {item.title && (
                  <figcaption className='absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs md:text-sm'>
                    {item.title}
                  </figcaption>
                )}
              </figure>
            );

            return (
              <div key={`${item.title}-${idx}`}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className='block hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#98342d]'
                  >
                    {Figure}
                  </Link>
                ) : (
                  Figure
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
