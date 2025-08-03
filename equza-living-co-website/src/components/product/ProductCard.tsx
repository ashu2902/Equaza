'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
  showPrice?: boolean;
  showEnquiry?: boolean;
  onEnquiry?: (productId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  className = '',
  priority = false,
  showPrice = true,
  showEnquiry = true,
  onEnquiry
}) => {
  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  const hoverImage = product.images.find(img => !img.isMain) || product.images[1];

  const handleEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnquiry) {
      onEnquiry(product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${className} flex flex-col items-center`}
      style={{
        gap: '21px',
        width: '100%',
        maxWidth: '354.7px',
        aspectRatio: '354.7/509'
      }}
    >
      <Link href={`/product/${product.slug}`} className="group block" style={{ width: '100%', height: '100%' }}>
        {/* Image Container - Responsive Figma Design */}
        <div 
          className="relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 w-full"
          style={{
            aspectRatio: '354.7/459',
            border: '5px solid #D8BF9F',
            borderRadius: '40px'
          }}
        >
          {mainImage && (
            <Image
              src={mainImage.url}
              alt={mainImage.alt}
              fill
              className="object-cover"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                borderRadius: '35px' // Slightly smaller to account for border
              }}
            />
          )}

          {/* Quick Enquiry Button */}
          {showEnquiry && (
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleEnquiry}
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-stone-900 border-0 shadow-sm"
                aria-label={`Enquire about ${product.name}`}
              >
                Enquire
              </Button>
            </div>
          )}
        </div>

        {/* Product Name - Responsive Figma Design */}
        <h3 
          className="w-full text-center"
          style={{
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: 'clamp(18px, 4vw, 24px)',
            lineHeight: '1.2',
            color: '#000000',
            textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
          }}
        >
          {product.name}
        </h3>
      </Link>
    </motion.div>
  );
};

ProductCard.displayName = 'ProductCard';