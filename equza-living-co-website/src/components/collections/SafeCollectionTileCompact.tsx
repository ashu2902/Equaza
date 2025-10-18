/**
 * SafeCollectionTileCompact
 * Compact square tile used in the PDF "Rugs by Style" grid.
 */

'use client';

import Link from 'next/link';
import { SafeCollection } from '@/types/safe';
import { SafeImage } from '@/components/ui/SafeImage';
import { Typography } from '@/components/ui/Typography';

interface SafeCollectionTileCompactProps {
  collection: SafeCollection;
  priority?: boolean;
}

export function SafeCollectionTileCompact({
  collection,
  priority = false,
}: SafeCollectionTileCompactProps) {
  return (
    <Link href={`/collections/${collection.slug}`} className='block group'>
      <div className='rounded-xl overflow-hidden border border-neutral-200 bg-white'>
        <div className='relative aspect-square'>
          <SafeImage
            src={collection.heroImage.url}
            alt={collection.heroImage.alt}
            fill
            priority={priority}
            sizes='(max-width: 768px) 100vw, (max-width: 1280px) 25vw, 300px'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>
      </div>
      <div className='mt-3 text-center'>
        <Typography
          variant='h4'
          className='font-serif text-xl text-neutral-900 text-center'
        >
          {collection.name}
        </Typography>
      </div>
    </Link>
  );
}
