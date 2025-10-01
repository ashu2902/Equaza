/**
 * Room Highlight Carousel
 * Swipable carousel showing key room cards: Living Room, Bedroom, Narrow Spaces
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sofa, Bed, MoveHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { SafeCollection } from '@/types/safe';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { SafeImage } from '@/components/ui/SafeImage';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

interface RoomHighlightCarouselProps {
  title?: string;
  subtitle?: string;
  spaceCollections: SafeCollection[];
}

function RoomCard({ collection }: { collection: SafeCollection }) {
  const icon = (() => {
    const slug = collection.slug.toLowerCase();
    if (slug.includes('living')) return Sofa;
    if (slug.includes('bed')) return Bed;
    return MoveHorizontal; // Narrow / hallway
  })();
  const Icon = icon;

  return (
    <Link href={`/collections/${collection.slug}`} className="block group">
      <div className="relative bg-white rounded-2xl overflow-hidden border border-neutral-200">
        <div className="relative aspect-[2.5/1]">
          <SafeImage
            src={collection.heroImage.url}
            alt={collection.heroImage.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-medium leading-tight">
              {collection.name}
            </p>
            <p className="text-xs opacity-90">Explore designs</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function RoomHighlightCarousel({
  title = 'Living Room',
  subtitle = 'Swipe to explore Bedroom and Narrow Spaces',
  spaceCollections,
}: RoomHighlightCarouselProps) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const items = useMemo(() => {
    // Keep only living-room, bedroom, and narrow/hallway spaces if available, preserving this order
    const bySlug = (s: string) => spaceCollections.find((c) => c.slug.toLowerCase().includes(s));
    const living = bySlug('living');
    const bedroom = bySlug('bed');
    const narrow = bySlug('narrow') || bySlug('hall') || bySlug('entry');
    return [living, bedroom, narrow].filter(Boolean) as SafeCollection[];
  }, [spaceCollections]);

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [items.length, index]);

  // Autoscroll effect
  useEffect(() => {
    if (items.length <= 1 || isHovered || isPaused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(interval);
  }, [items.length, isHovered, isPaused]);

  if (items.length === 0) return null;

  const goNext = () => {
    setIndex((prev) => (prev + 1) % items.length);
    setIsPaused(true); // Pause autoscroll when user manually navigates
    setTimeout(() => setIsPaused(false), 6000); // Resume after 6 seconds
  };
  const goPrev = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsPaused(true); // Pause autoscroll when user manually navigates
    setTimeout(() => setIsPaused(false), 6000); // Resume after 6 seconds
  };

  const handleTouchStart = (e: any) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    setTouchStartX(e.changedTouches[0].clientX);
    setTouchEndX(null);
  };
  const handleTouchMove = (e: any) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    setTouchEndX(e.changedTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const deltaX = touchStartX - touchEndX;
    const SWIPE_THRESHOLD = 50;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) goNext();
      else goPrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: '#f1eee9' }}>
      <Container size="xl">
        <FadeIn>
          <div className="text-center space-y-4 mb-8">
            <Typography variant="h2" className="text-3xl md:text-4xl font-normal font-libre-baskerville" style={{ color: '#98342d' }}>
              {title}
            </Typography>
            <Typography variant="subtitle1" className="text-base md:text-lg font-poppins" style={{ color: '#666666' }}>
              {subtitle}
            </Typography>
          </div>
        </FadeIn>

        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {items.map((c) => (
                <div key={c.id} className="min-w-full px-1">
                  <SlideUp>
                    <RoomCard collection={c} />
                  </SlideUp>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous room"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next room"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="mt-4 flex items-center justify-center gap-2">
                {items.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 w-6 rounded-full bg-neutral-300',
                      i === index && 'bg-[#98342d]'
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

export default RoomHighlightCarousel;


