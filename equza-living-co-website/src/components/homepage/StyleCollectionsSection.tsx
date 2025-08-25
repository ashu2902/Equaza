/**
 * Style Collections Section
 * Displays "Rugs by Style" collections from Firebase matching Figma design
 */

'use client';

import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';
import { SafeCollectionTileCompact } from '@/components/collections/SafeCollectionTileCompact';
import { SafeCollection } from '@/types/safe';

interface StyleCollectionsSectionProps {
  title?: string;
  subtitle?: string;
  collections: SafeCollection[];
  loading?: boolean;
  error?: string | null;
}

export function StyleCollectionsSection({
  title = "Rugs by Style",
  subtitle = "Discover our curated collections, each telling a unique story through craftsmanship and design",
  collections,
  loading = false,
  error = null
}: StyleCollectionsSectionProps) {
  
  // If no collections are available, show an elegant empty state
  if (!loading && !error && (!collections || collections.length === 0)) {
    return (
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#f1eee9' }}>
        <Container size="xl">
          <FadeIn>
            <div className="text-center space-y-6 mb-16">
              <Typography 
                variant="h2" 
                className="text-4xl md:text-5xl font-normal leading-tight font-libre-baskerville"
                align="center"
                style={{ color: '#98342d' }}
              >
                {title}
              </Typography>
              <Typography 
                variant="subtitle1" 
                className="text-xl max-w-3xl mx-auto leading-relaxed font-poppins"
                align="center"
                style={{ color: '#666666' }}
              >
                {subtitle}
              </Typography>
            </div>
          </FadeIn>
          
          <SlideUp delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { name: 'Modern Rugs', gradient: 'from-stone-100 to-stone-200' },
                { name: 'Asymmetrical Rugs', gradient: 'from-amber-50 to-amber-100' },
                { name: 'Wool Rugs', gradient: 'from-stone-50 to-stone-100' }
              ].map((placeholder, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]"
                  style={{ 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <div className={`aspect-[4/3] bg-gradient-to-br ${placeholder.gradient} flex items-center justify-center`}>
                    <Typography 
                      variant="h3" 
                      className="font-libre-baskerville font-normal opacity-30"
                      style={{ color: '#98342d' }}
                    >
                      {placeholder.name.split(' ')[0]}
                    </Typography>
                  </div>
                  <div className="p-6 text-center">
                    <Typography 
                      variant="h4" 
                      className="font-medium mb-2 font-libre-baskerville"
                      style={{ color: '#1f2937' }}
                    >
                      {placeholder.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="font-poppins"
                      style={{ color: '#6b7280' }}
                    >
                      Collections coming soon
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Typography 
                variant="body1" 
                className="font-poppins"
                style={{ color: '#98342d' }}
              >
                Style collections will load from Firebase when available
              </Typography>
            </div>
          </SlideUp>
        </Container>
      </section>
    );
  }
  
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: '#f1eee9' }}>
      <Container size="xl">
        <FadeIn>
          <div className="text-center space-y-6 mb-16">
            <Typography 
              variant="h2" 
              className="text-4xl md:text-5xl font-normal leading-tight font-libre-baskerville"
              align="center"
              style={{ color: '#98342d' }}
            >
              {title}
            </Typography>
            <Typography 
              variant="subtitle1" 
              className="text-xl max-w-3xl mx-auto leading-relaxed font-poppins"
              align="center"
              style={{ color: '#666666' }}
            >
              {subtitle}
            </Typography>
          </div>
        </FadeIn>
        
        <SlideUp delay={0.2}>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden animate-pulse"
                  style={{ 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Typography 
                variant="h4" 
                className="font-libre-baskerville mb-4"
                style={{ color: '#98342d' }}
              >
                Unable to Load Collections
              </Typography>
              <Typography 
                variant="body1" 
                className="font-poppins"
                style={{ color: '#6b7280' }}
              >
                {error}
              </Typography>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {collections.slice(0, 4).map((collection, index) => (
                <SlideUp key={collection.id} delay={index * 0.1}>
                  <SafeCollectionTileCompact collection={collection} priority={index < 2} />
                </SlideUp>
              ))}
            </div>
          )}
        </SlideUp>
      </Container>
    </section>
  );
}