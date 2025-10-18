/**
 * Featured Products Section
 * Displays individual featured rug products in a grid layout matching Figma design
 */

'use client';

import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';
import { SafeProductGrid } from '@/components/product/SafeProductGrid';
import { SafeProduct } from '@/types/safe';

interface FeaturedProductsSectionProps {
  title?: string;
  subtitle?: string;
  products: SafeProduct[];
  loading?: boolean;
  error?: string | null;
}

export function FeaturedProductsSection({
  title = 'Featured Products',
  subtitle = 'Handpicked rugs showcasing exceptional craftsmanship and design',
  products,
  loading = false,
  error = null,
}: FeaturedProductsSectionProps) {
  return (
    <section className='py-16 lg:py-24' style={{ backgroundColor: '#f1eee9' }}>
      <Container size='xl'>
        <FadeIn>
          <div className='text-center space-y-6 mb-16'>
            <Typography
              variant='h2'
              className='text-4xl md:text-5xl font-normal leading-tight font-libre-baskerville'
              style={{ color: '#98342d' }}
            >
              {title}
            </Typography>
            <Typography
              variant='subtitle1'
              className='text-xl max-w-3xl mx-auto leading-relaxed font-poppins'
              style={{ color: '#666666' }}
            >
              {subtitle}
            </Typography>
          </div>
        </FadeIn>

        <SlideUp delay={0.2}>
          <SafeProductGrid
            products={products}
            loading={loading}
            error={error}
            className='max-w-none'
            gridCols={{
              default: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
            }}
          />
        </SlideUp>
      </Container>
    </section>
  );
}
