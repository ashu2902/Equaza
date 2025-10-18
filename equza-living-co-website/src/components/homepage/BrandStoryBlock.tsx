import React from 'react';

interface BrandStoryBlockProps {
  overline?: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}

export function BrandStoryBlock({
  overline = 'EQUZA LIVING CO.',
  title,
  body,
  cta,
}: BrandStoryBlockProps) {
  return (
    <section aria-label='Brand story'>
      <div className='mx-auto max-w-[960px] px-6 md:px-10 text-center'>
        <p className='text-xs tracking-wider text-[#98342d] mb-2'>{overline}</p>
        <h2 className='font-serif text-2xl md:text-3xl text-neutral-900 mb-3'>
          {title}
        </h2>
        <p className='text-neutral-700 leading-relaxed mb-4'>{body}</p>
        {cta?.href && cta?.label && (
          <a
            href={cta.href}
            className='inline-block text-[#98342d] hover:underline text-sm'
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  );
}
