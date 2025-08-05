'use client';

import { FC } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SafeCollection } from '@/types/safe';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

interface CollectionHeroProps {
  collection: SafeCollection;
  productCount?: number;
  className?: string;
  onExploreProducts?: () => void;
  showProductCount?: boolean;
}

export const CollectionHero: FC<CollectionHeroProps> = ({
  collection,
  productCount,
  className = '',
  onExploreProducts,
  showProductCount = true
}) => {
  const displayProductCount = productCount ?? collection.productIds.length;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        {collection.heroImage && (
          <Image
            src={collection.heroImage.url}
            alt={collection.heroImage.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="min-h-[70vh] flex items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Collection Type Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className={`
                  inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white backdrop-blur-sm
                  ${collection.type === 'style' 
                    ? 'bg-blue-500/80 border border-blue-400/30' 
                    : 'bg-green-500/80 border border-green-400/30'
                  }
                `}>
                  {collection.type === 'style' ? 'Style Collection' : 'Space Collection'}
                </span>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Typography
                  variant="h1"
                  className="font-serif text-white text-4xl md:text-5xl lg:text-6xl leading-tight"
                >
                  {collection.name}
                </Typography>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typography
                  variant="body1"
                  className="text-white/90 text-lg md:text-xl leading-relaxed max-w-xl"
                >
                  {collection.description}
                </Typography>
              </motion.div>

              {/* Product Count & CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {showProductCount && displayProductCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Typography
                      variant="body1"
                      className="text-white/80"
                    >
                      {displayProductCount} {displayProductCount === 1 ? 'piece' : 'pieces'} in this collection
                    </Typography>
                  </div>
                )}

                {onExploreProducts && (
                  <Button
                    size="lg"
                    onClick={onExploreProducts}
                    className="bg-white text-stone-900 hover:bg-white/90 border-0 font-medium"
                  >
                    Explore Products
                  </Button>
                )}
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pt-8 border-t border-white/20"
              >
                <Typography
                  variant="body2"
                  className="text-white/70"
                >
                  Each piece in this collection is handcrafted with attention to detail and 
                  represents the finest in traditional artistry.
                </Typography>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

CollectionHero.displayName = 'CollectionHero';