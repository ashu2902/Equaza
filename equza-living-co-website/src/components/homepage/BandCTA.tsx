import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface BandCTAProps {
  headline: string;
  cta: { label: string; href: string };
  className?: string;
}

export function BandCTA({ headline, cta, className }: BandCTAProps) {
  if (!headline) return null;
  return (
    <section className={cn('w-full', className)} aria-label="Primary call to action">
      <div className="mx-auto max-w-[960px] px-6 md:px-10 text-center py-6 rounded-xl border border-neutral-200 bg-white/70">
        <p className="font-serif text-xl md:text-2xl text-neutral-900">{headline}</p>
        {cta?.href && cta?.label && (
          <div className="mt-3">
            <Link href={cta.href} className="inline-block text-[#98342d] hover:underline">
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}


