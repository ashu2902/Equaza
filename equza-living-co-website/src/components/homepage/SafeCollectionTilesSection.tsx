/**
 * Safe Collection Tiles Section
 *
 * Uses SafeCollection data contract for bulletproof rendering.
 * Handles loading and error states gracefully.
 */

'use client';

import { SafeCollection } from '@/types/safe';
import { SafeCollectionTile } from '@/components/collections/SafeCollectionTile';
import { Typography } from '@/components/ui/Typography';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/ui/MotionWrapper';

interface SafeCollectionTilesSectionProps {
  title: string;
  subtitle: string;
  collections: SafeCollection[]; // Always an array, never null
  loading?: boolean;
  error?: string | null;
  type?: 'style' | 'space';
}

export function SafeCollectionTilesSection({
  title,
  subtitle,
  collections,
  loading = false,
  error = null,
  type,
}: SafeCollectionTilesSectionProps) {
  // Loading State
  if (loading) {
    return (
      <section className='py-16 lg:py-24 bg-white'>
        <Container>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array.from({ length: type === 'space' ? 3 : 6 }).map(
              (_, index) => (
                <CollectionTileSkeleton key={index} />
              )
            )}
          </div>
        </Container>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className='py-16 lg:py-24 bg-white'>
        <Container>
          <div className='text-center space-y-4'>
            <Typography variant='h2' className='font-serif'>
              {title}
            </Typography>
            <Typography
              variant='body'
              className='text-gray-600 max-w-md mx-auto'
            >
              Unable to load collections: {error}
            </Typography>
          </div>
        </Container>
      </section>
    );
  }

  // Empty State
  if (collections.length === 0) {
    return (
      <section className='py-16 lg:py-24 bg-white'>
        <Container>
          <div className='text-center space-y-4'>
            <Typography variant='h2' className='font-serif'>
              {title}
            </Typography>
            <Typography
              variant='body'
              className='text-gray-600 max-w-md mx-auto'
            >
              No collections available at the moment. Please check back soon.
            </Typography>
          </div>
        </Container>
      </section>
    );
  }

  // Success State with Collections
  return (
    <section className='py-16 lg:py-24' style={{ backgroundColor: '#f1eee9' }}>
      <Container size='xl'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {collections.map((collection, index) => (
            <SafeCollectionTile
              key={collection.id}
              collection={collection}
              index={index}
              priority={index < 3}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

/**
 * Collection Tile Skeleton for Loading State
 */
function CollectionTileSkeleton() {
  return (
    <div className='relative bg-white rounded-xl overflow-hidden shadow-lg'>
      <div className='relative h-64 sm:h-72 lg:h-80 bg-gray-200 animate-pulse' />
      <div className='absolute inset-0 p-6 flex flex-col justify-end'>
        <div className='space-y-3'>
          <div className='h-8 bg-gray-300 rounded w-3/4 animate-pulse' />
          <div className='h-4 bg-gray-300 rounded w-full animate-pulse' />
          <div className='h-4 bg-gray-300 rounded w-1/3 animate-pulse' />
        </div>
      </div>
    </div>
  );
}
