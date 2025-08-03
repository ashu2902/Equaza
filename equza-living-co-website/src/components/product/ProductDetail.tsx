'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Heart, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { ImageGallery } from './ImageGallery';
import { ProductSpecs } from './ProductSpecs';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

interface ProductDetailProps {
  product: Product;
  className?: string;
  onEnquiry?: (productId: string) => void;
  onShare?: (product: Product) => void;
  onWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export const ProductDetail: FC<ProductDetailProps> = ({
  product,
  className = '',
  onEnquiry,
  onShare,
  onWishlist,
  isWishlisted = false
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'specs'>('story');

  const handleEnquiry = () => {
    if (onEnquiry) {
      onEnquiry(product.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(product);
    } else {
      // Fallback to native sharing
      if (navigator.share) {
        navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  const handleWishlist = () => {
    if (onWishlist) {
      onWishlist(product.id);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="order-2 lg:order-1">
          <ImageGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Product Information */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            {/* Featured Badge */}
            {product.isFeatured && (
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-stone-900 text-white">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              </div>
            )}

            {/* Title */}
            <Typography
              variant="h1"
              className="font-serif text-stone-900"
            >
              {product.name}
            </Typography>

            {/* Collections */}
            {product.collections.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.collections.map((collection, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    {collection}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <Typography
              variant="body1"
              className="text-stone-600 leading-relaxed"
            >
              {product.description}
            </Typography>
          </div>

          {/* Price */}
          {product.price.isVisible && (
            <Card className="p-6 bg-stone-50 border-stone-200">
              <div className="space-y-3">
                <Typography
                  variant="h3"
                  className="font-semibold text-stone-900"
                >
                  From {formatPrice(product.price.startingFrom, product.price.currency)}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-stone-600"
                >
                  Final pricing depends on size, materials, and customization options.
                  Contact us for a detailed quote.
                </Typography>
              </div>
            </Card>
          )}

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography
                variant="caption"
                className="text-stone-500 uppercase tracking-wider mb-1 block"
              >
                Materials
              </Typography>
              <Typography
                variant="body2"
                className="text-stone-900"
              >
                {product.specifications.materials.slice(0, 2).join(', ')}
                {product.specifications.materials.length > 2 && '...'}
              </Typography>
            </div>
            <div>
              <Typography
                variant="caption"
                className="text-stone-500 uppercase tracking-wider mb-1 block"
              >
                Craft Time
              </Typography>
              <Typography
                variant="body2"
                className="text-stone-900"
              >
                {product.specifications.craftTime}
              </Typography>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleEnquiry}
            >
              Enquire About This Piece
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {onWishlist && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlist}
                  className={`px-4 ${isWishlisted ? 'text-red-600 border-red-600' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center pt-4 border-t border-stone-200">
            <Typography
              variant="body2"
              className="text-stone-500"
            >
              Free consultation • Custom sizing available • Worldwide shipping
            </Typography>
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('story')}
            className={`
              px-6 py-3 font-medium text-sm border-b-2 transition-colors
              ${activeTab === 'story'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
              }
            `}
          >
            Story & Craftsmanship
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`
              px-6 py-3 font-medium text-sm border-b-2 transition-colors
              ${activeTab === 'specs'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
              }
            `}
          >
            Specifications
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'story' && (
            <div className="space-y-6">
              <Typography
                variant="h3"
                className="font-serif text-stone-900"
              >
                The Story Behind This Piece
              </Typography>
              <Typography
                variant="body1"
                className="text-stone-600 leading-relaxed whitespace-pre-line"
              >
                {product.story}
              </Typography>
            </div>
          )}

          {activeTab === 'specs' && (
            <ProductSpecs
              specifications={product.specifications}
              layout="grid"
            />
          )}
        </motion.div>
      </div>

      {/* Room Types */}
      {product.roomTypes.length > 0 && (
        <Card className="p-6">
          <Typography
            variant="h4"
            className="font-serif text-stone-900 mb-4"
          >
            Perfect For
          </Typography>
          <div className="flex flex-wrap gap-2">
            {product.roomTypes.map((roomType, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-stone-100 text-stone-700"
              >
                {roomType}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

ProductDetail.displayName = 'ProductDetail';