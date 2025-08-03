'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Collection } from '@/types';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';

interface CollectionCardProps {
  collection: Collection;
  className?: string;
  priority?: boolean;
  showProductCount?: boolean;
  productCount?: number;
}

export const CollectionCard: FC<CollectionCardProps> = ({
  collection,
  className = '',
  priority = false,
  showProductCount = true,
  productCount
}) => {
  const displayProductCount = productCount ?? collection.productIds.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300">
        <Link href={`/collections/${collection.slug}`} className="block">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
            {collection.heroImage && (
              <Image
                src={collection.heroImage.url}
                alt={collection.heroImage.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}

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
            {showProductCount && displayProductCount > 0 && (
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-white/90 text-stone-900 backdrop-blur-sm">
                  {displayProductCount} {displayProductCount === 1 ? 'piece' : 'pieces'}
                </span>
              </div>
            )}

            {/* Collection Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <Typography
                variant="h3"
                className="font-serif text-white mb-2 group-hover:text-white/90 transition-colors"
              >
                {collection.name}
              </Typography>
              <Typography
                variant="body1"
                className="text-white/90 line-clamp-2 group-hover:text-white/80 transition-colors"
              >
                {collection.description}
              </Typography>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

CollectionCard.displayName = 'CollectionCard';