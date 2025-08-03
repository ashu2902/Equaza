/**
 * Collection Tiles Section
 * "Rugs by Style" - 6 collection tiles in responsive grid
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import type { Collection } from '@/types';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Grid } from '@/components/ui/Grid';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

interface CollectionTilesSectionProps {
  collections: Collection[];
  title: string;
  subtitle: string;
}

interface CollectionTileProps {
  collection: Collection;
  index: number;
}

function CollectionTile({ collection, index }: CollectionTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SlideUp delay={index * 0.1}>
      <Link 
        href={`/collections/${collection.slug}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          {/* Collection Image */}
          <div className="relative h-64 sm:h-72 lg:h-80 bg-gray-100 overflow-hidden">
            <Image
              src={collection.heroImage.url}
              alt={collection.heroImage.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-80' : 'opacity-60'
            }`} />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <div className="space-y-3">
                <Typography 
                  variant="h3" 
                  className="text-2xl font-light text-white"
                >
                  {collection.name}
                </Typography>
                
                <Typography 
                  variant="body" 
                  className="text-white/90 line-clamp-2 leading-relaxed"
                >
                  {collection.description}
                </Typography>
                
                {/* Product Count */}
                <div className="flex items-center justify-between pt-2">
                  <Typography variant="caption" className="text-white/80">
                    {collection.productCount || 0} Products
                  </Typography>
                  
                  <div className={`flex items-center space-x-1 transform transition-transform duration-300 ${
                    isHovered ? 'translate-x-1' : 'translate-x-0'
                  }`}>
                    <Typography variant="caption" className="text-white font-medium">
                      Explore
                    </Typography>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hover Effect Border */}
          <div className={`absolute inset-0 border-2 border-primary-500 rounded-xl transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
      </Link>
    </SlideUp>
  );
}

export function CollectionTilesSection({ 
  collections, 
  title, 
  subtitle 
}: CollectionTilesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <Container size="xl">
        <div className="space-y-16">
          
          {/* Section Header */}
          <FadeIn>
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-1 bg-primary-600" />
                <Typography variant="overline" className="text-primary-600 font-medium">
                  Collections
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

          {/* Collections Grid */}
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => (
                <CollectionTile 
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
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>
                
                <div className="space-y-2">
                  <Typography variant="h4" className="text-gray-800">
                    Collections Coming Soon
                  </Typography>
                  <Typography variant="body" className="text-gray-600">
                    We're preparing amazing collections for you
                  </Typography>
                </div>
              </div>
            </FadeIn>
          )}

          {/* View All Collections CTA */}
          <SlideUp delay={0.6}>
            <div className="text-center">
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="px-8 py-4"
              >
                <Link href="/collections?type=style">
                  <span className="flex items-center space-x-2">
                    <span>View All Style Collections</span>
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