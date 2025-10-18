/**
 * Safe Product Card Component
 *
 * Uses SafeProduct data contract - no null checks needed.
 * All image arrays are guaranteed to have at least one item.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SafeProduct } from '@/types/safe';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { EnquiryModal } from '@/components/forms/EnquiryModal';
import { submitProductCardEnquiry } from '@/lib/actions/enquiry';

interface SafeProductCardProps {
  product: SafeProduct; // Guaranteed safe data
  priority?: boolean;
  showPrice?: boolean;
  showEnquiry?: boolean;
  className?: string;
  onEnquiry?: (product: SafeProduct) => void;
}

export function SafeProductCard({
  product,
  priority = false,
  showPrice = true,
  showEnquiry = true,
  className = '',
  onEnquiry,
}: SafeProductCardProps) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Use images provided on the product (already coming from Firebase)
  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];
  const hoverImage =
    product.images.find((img) => !img.isMain) ||
    product.images[1] ||
    product.images[0];

  const handleEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnquiry) {
      onEnquiry(product);
    } else {
      setIsEnquiryOpen(true);
    }
  };

  const handleEnquirySubmit = async (data: any) => {
    try {
      const result = await submitProductCardEnquiry(data);
      if (result.success) {
        setIsEnquiryOpen(false);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      throw error;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`group relative bg-white overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] ${className}`}
        style={{
          borderRadius: '16px',
          boxShadow:
            '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          e.currentTarget.style.boxShadow =
            '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08)';
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          e.currentTarget.style.boxShadow =
            '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)';
        }}
      >
        <Link href={`/product/${product.slug}`} className='block'>
          <div className='aspect-square relative overflow-hidden'>
            {/* Main Image */}
            {mainImage && (
              <Image
                src={mainImage.url}
                alt={mainImage.alt}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className={`object-cover transition-all duration-500 ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}
                priority={priority}
              />
            )}

            {/* Hover Image (if different from main) */}
            {hoverImage && mainImage && hoverImage.url !== mainImage.url && (
              <Image
                src={hoverImage.url}
                alt={hoverImage.alt}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className={`object-cover transition-all duration-500 ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
              />
            )}

            {/* Overlay removed to avoid any chance of black layer covering the image */}

            {/* Featured Badge */}
            {product.isFeatured && (
              <div className='absolute top-3 left-3 z-10'>
                <span
                  className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white font-poppins'
                  style={{ backgroundColor: '#98342d' }}
                >
                  Featured
                </span>
              </div>
            )}
          </div>
        </Link>

        <Link href={`/product/${product.slug}`} className='block'>
          <div className='p-6'>
            <div className='space-y-3'>
              <Typography
                variant='h4'
                className='font-medium line-clamp-1 font-libre-baskerville'
                style={{ color: '#1f2937' }}
              >
                {product.name}
              </Typography>

              {/* Materials */}
              {product.specifications.materials.length > 0 && (
                <Typography
                  variant='body2'
                  className='line-clamp-1 font-poppins'
                  style={{ color: '#6b7280' }}
                >
                  {product.specifications.materials.join(', ')}
                </Typography>
              )}

              {/* Origin and Weave Type */}
              <Typography
                variant='caption'
                className='font-poppins'
                style={{ color: '#9ca3af' }}
              >
                {product.specifications.weaveType} •{' '}
                {product.specifications.origin}
              </Typography>

              {/* Price */}
              {showPrice &&
                product.price.isVisible &&
                product.price.startingFrom > 0 && (
                  <Typography
                    variant='body'
                    className='font-medium text-gray-900'
                  >
                    From ₹{product.price.startingFrom.toLocaleString('en-IN')}
                  </Typography>
                )}

              {/* Enquiry Button */}
              {showEnquiry && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleEnquiry}
                  className='w-full mt-3'
                >
                  Enquire Now
                </Button>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Enquiry Modal */}
      {isEnquiryOpen && (
        <EnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          product={product}
          onSubmit={handleEnquirySubmit}
        />
      )}
    </>
  );
}
