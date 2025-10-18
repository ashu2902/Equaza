import React from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';

export interface ImageBannerCTAProps {
  title: string;
  image: { src: string; alt: string };
  cta?: { label: string; href: string };
}

export function ImageBannerCTA({ title, image, cta }: ImageBannerCTAProps) {
  return (
    <section aria-label={title}>
      <div className='relative w-full'>
        <div className='relative mx-auto max-w-[1280px] overflow-hidden'>
          <div className='relative aspect-[4/3] md:aspect-[21/9] rounded-2xl'>
            {image?.src ? (
              <SafeImage
                src={image.src}
                alt={image.alt || ''}
                fill
                className='object-cover'
              />
            ) : (
              <div className='w-full h-full bg-neutral-200' />
            )}
            <div className='absolute inset-0 bg-black/25' />
            <div className='absolute inset-0 flex items-center justify-center text-center px-6'>
              <div>
                <h2 className='font-serif text-2xl md:text-3xl lg:text-4xl text-white'>
                  {title}
                </h2>
                {cta?.href && cta?.label && (
                  <div className='mt-4'>
                    <Link
                      href={cta.href}
                      className='inline-block rounded-full bg-white/90 text-[#98342d] px-4 py-2 text-sm hover:bg-white'
                    >
                      {cta.label}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
