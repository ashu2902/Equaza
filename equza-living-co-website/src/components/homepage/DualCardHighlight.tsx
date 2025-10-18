import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { SafeImage } from '@/components/ui/SafeImage';

export interface DualCardHighlightProps {
  copy: {
    title: string;
    description: string;
    cta: { label: string; href: string };
  };
  media: {
    image: { src: string; alt: string };
  };
  className?: string;
}

export function DualCardHighlight({
  copy,
  media,
  className,
}: DualCardHighlightProps) {
  return (
    <section
      className={cn('w-full', className)}
      aria-label={copy?.title || 'Highlight'}
    >
      <div className='mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl bg-white/60 p-4 md:p-6 border border-neutral-200'>
          {/* Copy card */}
          <div className='rounded-xl bg-white p-6 border border-neutral-200 flex flex-col justify-center'>
            {copy?.title && (
              <h2 className='font-serif text-2xl md:text-3xl text-neutral-900 mb-2'>
                {copy.title}
              </h2>
            )}
            {copy?.description && (
              <p className='text-neutral-700 mb-4 leading-relaxed'>
                {copy.description}
              </p>
            )}
            {copy?.cta?.href && copy?.cta?.label && (
              <Link
                href={copy.cta.href}
                className='inline-block rounded-full bg-[#98342d] text-white text-sm px-4 py-2 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#98342d]'
              >
                {copy.cta.label}
              </Link>
            )}
          </div>

          {/* Media card */}
          <div className='rounded-xl overflow-hidden border border-neutral-200 bg-white'>
            {media?.image?.src ? (
              <div className='relative aspect-[4/3]'>
                <SafeImage
                  src={media.image.src}
                  alt={media.image.alt || ''}
                  fill
                  className='object-cover'
                />
              </div>
            ) : (
              <div className='aspect-[4/3] bg-neutral-200' />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
