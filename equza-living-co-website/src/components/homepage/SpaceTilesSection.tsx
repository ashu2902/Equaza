/**
 * Space Tiles Section  
 * "Rugs by Space" - 3 mega tiles for room types
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Home, Bed, Minus } from 'lucide-react';
import type { Collection } from '@/types';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

interface SpaceTilesSectionProps {
  collections: Collection[];
  title: string;
  subtitle: string;
}

interface SpaceTileProps {
  collection: Collection;
  index: number;
}

// Icon mapping for room types
const getRoomIcon = (slug: string) => {
  switch (slug) {
    case 'living-room':
      return Home;
    case 'bedroom':
      return Bed;
    case 'hallway':
      return Minus;
    default:
      return Home;
  }
};

// Get room description
const getRoomDescription = (slug: string) => {
  switch (slug) {
    case 'living-room':
      return 'Create a warm, inviting atmosphere where family and friends gather. Our living room rugs combine comfort with style.';
    case 'bedroom':
      return 'Transform your bedroom into a peaceful sanctuary. Soft, luxurious rugs that feel amazing underfoot.';
    case 'hallway':
      return 'Make a lasting first impression with runners and rugs that welcome guests with elegance and style.';
    default:
      return 'Discover the perfect rug for your space with our carefully curated room-specific collections.';
  }
};

function SpaceTile({ collection, index }: SpaceTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = getRoomIcon(collection.slug);
  const roomDescription = getRoomDescription(collection.slug);

  return (
    <SlideUp delay={index * 0.2}>
      <Link 
        href={`/collections/${collection.slug}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
          
          {/* Collection Image */}
          <div className="relative h-80 sm:h-96 lg:h-[450px] bg-gray-100 overflow-hidden">
            <Image
              src={collection.heroImage.url}
              alt={collection.heroImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-90' : 'opacity-70'
            }`} />
            
            {/* Room Icon */}
            <div className="absolute top-6 left-6">
              <div className={`w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                isHovered ? 'bg-white/30 scale-110' : 'bg-white/20'
              }`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="space-y-4">
                <Typography 
                  variant="h2" 
                  className="text-3xl lg:text-4xl font-light text-white"
                >
                  {collection.name}
                </Typography>
                
                <Typography 
                  variant="body" 
                  className="text-white/90 text-lg leading-relaxed max-w-md"
                >
                  {roomDescription}
                </Typography>
                
                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="space-y-1">
                    <Typography variant="h4" className="text-white font-medium">
                      {collection.productCount || 0}+
                    </Typography>
                    <Typography variant="caption" className="text-white/80">
                      Rug Options
                    </Typography>
                  </div>
                  
                  <div className={`flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 ${
                    isHovered ? 'bg-white/20 translate-x-2' : 'bg-white/10'
                  }`}>
                    <Typography variant="body" className="text-white font-medium">
                      Explore Space
                    </Typography>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Content Card */}
          <div className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Typography variant="h4" className="text-gray-900">
                  Perfect for {collection.name}s
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  {collection.description}
                </Typography>
              </div>
              
              <div className={`p-3 bg-primary-50 rounded-full transition-all duration-300 ${
                isHovered ? 'bg-primary-100 rotate-12' : 'bg-primary-50'
              }`}>
                <ArrowRight className="w-5 h-5 text-primary-600" />
              </div>
            </div>
          </div>
          
          {/* Hover Effect Border */}
          <div className={`absolute inset-0 border-3 border-primary-500 rounded-2xl transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
      </Link>
    </SlideUp>
  );
}

export function SpaceTilesSection({ 
  collections, 
  title, 
  subtitle 
}: SpaceTilesSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <Container size="xl">
        <div className="space-y-16">
          
          {/* Section Header */}
          <FadeIn>
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-1 bg-primary-600" />
                <Typography variant="overline" className="text-primary-600 font-medium">
                  Room Collections
                </Typography>
                <div className="w-8 h-1 bg-primary-600" />
              </div>
              
              <Typography 
                variant="h2" 
                className="text-3xl md:text-4xl lg:text-5xl font-light"
              >
                {title}
              </Typography>
              
              <Typography 
                variant="subtitle" 
                className="text-xl text-gray-600 leading-relaxed"
              >
                {subtitle}
              </Typography>
            </div>
          </FadeIn>

          {/* Space Collections Grid */}
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => (
                <SpaceTile 
                  key={collection.id} 
                  collection={collection} 
                  index={index}
                />
              ))}
            </div>
          ) : (
            /* Fallback when no collections */
            <FadeIn>
              <div className="text-center py-16 space-y-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                  <Home className="w-8 h-8 text-gray-400" />
                </div>
                
                <div className="space-y-2">
                  <Typography variant="h4" className="text-gray-800">
                    Room Collections Coming Soon
                  </Typography>
                  <Typography variant="body" className="text-gray-600">
                    We're preparing space-specific collections for you
                  </Typography>
                </div>
              </div>
            </FadeIn>
          )}

          {/* View All Spaces CTA */}
          <SlideUp delay={0.8}>
            <div className="text-center">
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="px-8 py-4"
              >
                <Link href="/collections?type=space">
                  <span className="flex items-center space-x-2">
                    <span>View All Room Collections</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </Container>
    </section>
  );
}