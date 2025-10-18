/**
 * Safe Collection Tile Component
 *
 * Uses SafeCollection data contract - no null checks needed.
 * All data is guaranteed to be valid by the transformers.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SafeCollection } from '@/types/safe';
import { Typography } from '@/components/ui/Typography';
import { SafeImage } from '@/components/ui/SafeImage';

interface SafeCollectionTileProps {
  collection: SafeCollection; // Guaranteed safe data
  index?: number;
  priority?: boolean;
  className?: string;
}

export function SafeCollectionTile({
  collection,
  index = 0,
  priority = false,
  className = '',
}: SafeCollectionTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={className}
    >
      <Link
        href={`/collections/${collection.slug}`}
        className='group block'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className='relative bg-white overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]'
          style={{
            borderRadius: '16px',
            boxShadow:
              '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)';
          }}
        >
          {/* Collection Image - No null checks needed, heroImage is guaranteed */}
          <div className='relative h-80 lg:h-96 bg-gray-100 overflow-hidden'>
            <SafeImage
              src={collection.heroImage.url}
              alt={collection.heroImage.alt}
              fill
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              priority={priority}
            />

            {/* Strong overlay for text readability */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />

            {/* Collection Type Badge */}
            <div className='absolute top-6 left-6 z-10'>
              <span
                className='inline-flex items-center px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 font-poppins'
                style={{
                  backgroundColor: '#98342d',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(152, 52, 45, 0.3)',
                }}
              >
                {collection.type === 'style'
                  ? 'Style Collection'
                  : 'Space Collection'}
              </span>
            </div>

            {/* Product Count Badge
            {collection.productIds.length > 0 && (
              <div className="absolute top-6 right-6 z-10">
                <span 
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 font-poppins"
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {collection.productIds.length} {collection.productIds.length === 1 ? 'Piece' : 'Pieces'}
                </span>
              </div>
            )} */}

            {/* Bottom Content with Better Background */}
            <div className='absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent'>
              <div className='space-y-3 text-white'>
                <Typography
                  variant='h3'
                  className='text-white font-normal text-2xl md:text-3xl drop-shadow-lg font-libre-baskerville'
                >
                  {collection.name}
                </Typography>

                {collection.description && (
                  <Typography
                    variant='body'
                    className='text-white/95 text-sm md:text-base line-clamp-2 drop-shadow-md font-poppins'
                  >
                    {collection.description}
                  </Typography>
                )}

                <div className='inline-flex items-center text-white font-medium text-sm mt-4 drop-shadow-md transition-all duration-300 hover:translate-x-1 font-poppins'>
                  <span>Explore Collection</span>
                  <motion.svg
                    className='w-4 h-4 ml-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </motion.svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
