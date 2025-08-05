/**
 * Safe Space Tiles Section
 * 
 * Uses SafeCollection data contract for space-based collections.
 * Enhanced with room-specific icons and descriptions.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Bed, 
  MoveHorizontal,
  Sofa,
  DoorOpen,
  Bath
} from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';
import { SafeCollection } from '@/types/safe';
import { Typography } from '@/components/ui/Typography';
import { Container } from '@/components/ui/Container';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

interface SafeSpaceTilesSectionProps {
  title: string;
  subtitle: string;
  spaceCollections: SafeCollection[]; // Always an array, never null
  loading?: boolean;
  error?: string | null;
}

// Room icon mapping
const getRoomIcon = (slug: string) => {
  switch (slug.toLowerCase()) {
    case 'living-room':
    case 'living':
      return Sofa;
    case 'bedroom':
    case 'bed':
      return Bed;
    case 'hallway':
    case 'hall':
    case 'entryway':
      return MoveHorizontal;
    case 'dining':
    case 'dining-room':
      return Home;
    case 'bathroom':
    case 'bath':
      return Bath;
    case 'office':
    case 'study':
      return DoorOpen;
    default:
      return Home;
  }
};

// Room description mapping
const getRoomDescription = (slug: string): string => {
  switch (slug.toLowerCase()) {
    case 'living-room':
    case 'living':
      return 'Create warmth and comfort in your living spaces with our carefully curated collection of rugs.';
    case 'bedroom':
    case 'bed':
      return 'Transform your bedroom into a peaceful retreat with soft, luxurious rugs that add comfort underfoot.';
    case 'hallway':
    case 'hall':
    case 'entryway':
      return 'Make a stunning first impression with durable, beautiful rugs designed for high-traffic areas.';
    case 'dining':
    case 'dining-room':
      return 'Enhance your dining experience with elegant rugs that complement your décor and define the space.';
    case 'bathroom':
    case 'bath':
      return 'Add luxury and comfort to your bathroom with moisture-resistant, soft rugs.';
    case 'office':
    case 'study':
      return 'Create an inspiring workspace with sophisticated rugs that add warmth and style to your office.';
    default:
      return 'Discover the perfect rug to complement and enhance your space.';
  }
};

export function SafeSpaceTilesSection({
  title,
  subtitle,
  spaceCollections,
  loading = false,
  error = null
}: SafeSpaceTilesSectionProps) {
  
  // Loading State
  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-stone-50 to-stone-100">
        <Container>
          <div className="text-center space-y-4 mb-12">
            <Typography variant="h2" className="font-serif">
              {title}
            </Typography>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <SpaceTileSkeleton key={index} />
            ))}
          </div>
        </Container>
      </section>
    );
  }
  
  // Error State
  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-stone-50 to-stone-100">
        <Container>
          <div className="text-center space-y-4">
            <Typography variant="h2" className="font-serif">
              {title}
            </Typography>
            <Typography variant="body" className="text-gray-600 max-w-md mx-auto">
              Unable to load space collections: {error}
            </Typography>
          </div>
        </Container>
      </section>
    );
  }
  
  // Empty State
  if (spaceCollections.length === 0) {
    return (
      <section className="py-16 lg:py-24" style={{backgroundColor: '#f1eee9'}}>
        <Container>
          <div className="text-center space-y-6">
            <Typography variant="h2" className="text-4xl md:text-5xl font-normal leading-tight font-libre-baskerville" style={{ color: '#98342d' }}>
              {title}
            </Typography>
            <Typography variant="subtitle1" className="text-xl max-w-3xl mx-auto leading-relaxed font-poppins" style={{ color: '#666666' }}>
              {subtitle}
            </Typography>
            <div className="mt-8 p-8 bg-white/50 backdrop-blur-sm rounded-2xl max-w-md mx-auto" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <Typography variant="body" className="font-poppins" style={{ color: '#666666' }}>
                No space collections available at the moment. Please check back soon.
              </Typography>
            </div>
          </div>
        </Container>
      </section>
    );
  }
  
  // Success State with Space Collections
  return (
    <section className="py-16 lg:py-24" style={{backgroundColor: '#f1eee9'}}>
      <Container size="xl">
        <FadeIn>
          <div className="text-center space-y-6 mb-16">
            <Typography variant="h2" className="text-4xl md:text-5xl font-normal leading-tight font-libre-baskerville" style={{ color: '#98342d' }}>
              {title}
            </Typography>
            <Typography variant="subtitle1" className="text-xl max-w-3xl mx-auto leading-relaxed font-poppins" style={{ color: '#666666' }}>
              {subtitle}
            </Typography>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spaceCollections.map((collection, index) => (
            <SafeSpaceTile
              key={collection.id}
              collection={collection}
              index={index}
              priority={index === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

/**
 * Individual Space Tile Component
 */
interface SafeSpaceTileProps {
  collection: SafeCollection;
  index: number;
  priority?: boolean;
}

function SafeSpaceTile({ collection, index, priority = false }: SafeSpaceTileProps) {
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
          
          {/* Collection Image - heroImage guaranteed to exist */}
          <div className="relative h-80 sm:h-96 lg:h-[450px] bg-gray-100 overflow-hidden">
            <SafeImage
              src={collection.heroImage.url}
              alt={collection.heroImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              priority={priority}
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
            
            {/* Product Count Badge */}
            {collection.productIds.length > 0 && (
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-black/30 backdrop-blur-sm">
                  {collection.productIds.length} {collection.productIds.length === 1 ? 'Piece' : 'Pieces'}
                </span>
              </div>
            )}
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="space-y-4">
                <Typography 
                  variant="h3" 
                  className="text-white font-normal text-3xl lg:text-4xl drop-shadow-lg font-libre-baskerville"
                >
                  {collection.name}
                </Typography>
                
                <Typography 
                  variant="body" 
                  className="text-white/95 text-base lg:text-lg leading-relaxed drop-shadow-md font-poppins"
                >
                  {collection.description || roomDescription}
                </Typography>
                
                <div className="inline-flex items-center text-white font-medium text-base pt-2 drop-shadow-md font-poppins">
                  <span>Explore {collection.name}</span>
                  <svg 
                    className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                      isHovered ? 'translate-x-1' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </SlideUp>
  );
}

/**
 * Space Tile Skeleton for Loading State
 */
function SpaceTileSkeleton() {
  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
      <div className="relative h-80 sm:h-96 lg:h-[450px] bg-gray-200 animate-pulse" />
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="space-y-4">
          <div className="h-10 bg-gray-300 rounded w-3/4 animate-pulse" />
          <div className="h-6 bg-gray-300 rounded w-full animate-pulse" />
          <div className="h-6 bg-gray-300 rounded w-2/3 animate-pulse" />
          <div className="h-5 bg-gray-300 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}