/**
 * Safe Collection Card Component
 * 
 * Simpler card layout for collection grids.
 * Uses SafeCollection data contract - no null checks needed.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SafeCollection } from '@/types/safe';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { SafeImage } from '@/components/ui/SafeImage';

interface SafeCollectionCardProps {
  collection: SafeCollection; // Guaranteed safe data
  priority?: boolean;
  showProductCount?: boolean;
  className?: string;
}

export function SafeCollectionCard({ 
  collection,
  priority = false,
  showProductCount = true,
  className = ''
}: SafeCollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300">
        <Link href={`/collections/${collection.slug}`} className="block">
          {/* Image Container - heroImage is guaranteed to exist */}
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
            <SafeImage
              src={collection.heroImage.url}
              alt={collection.heroImage.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Collection Type Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className={`
                inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white backdrop-blur-sm
                ${collection.type === 'style' 
                  ? 'bg-blue-500/80' 
                  : 'bg-green-500/80'
                }
              `}>
                {collection.type === 'style' ? 'Style' : 'Space'}
              </span>
            </div>

            {/* Product Count */}
            {showProductCount && collection.productIds.length > 0 && (
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-black/30 backdrop-blur-sm">
                  {collection.productIds.length}
                </span>
              </div>
            )}

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <div className="space-y-2">
                <Typography 
                  variant="h4" 
                  className="text-white font-semibold"
                >
                  {collection.name}
                </Typography>
                
                {collection.description && (
                  <Typography 
                    variant="body" 
                    className="text-white/90 text-sm line-clamp-2"
                  >
                    {collection.description}
                  </Typography>
                )}
                
                <div className="inline-flex items-center text-white/80 font-medium text-sm pt-2">
                  <span>View Collection</span>
                  <motion.svg 
                    className="w-4 h-4 ml-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: isHovered ? 2 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}