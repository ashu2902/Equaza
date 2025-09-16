/**
 * Our Story - Simplified Section
 * Remove squares, show concise copy and one CTA: "Read Our Full Story"
 */

'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

interface OurStorySimpleProps {
  title?: string;
  body?: string;
  ctaHref?: string;
}

export function OurStorySimple({
  title = 'Where Traditional Craftsmanship Meets Modern Design',
  body = 'For three generations, our family has woven stories into rugs. Each piece carries the soul of Indian artistry, thoughtfully crafted for contemporary homes.',
  ctaHref = '/our-story',
}: OurStorySimpleProps) {
  return (
    <section className="py-16" style={{ backgroundColor: '#f1eee9' }}>
      <Container size="xl">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <Typography
              variant="h2"
              className="text-3xl md:text-4xl font-normal font-libre-baskerville"
              style={{ color: '#98342d' }}
            >
              {title}
            </Typography>
            <Typography
              variant="subtitle1"
              className="text-lg md:text-xl font-poppins"
              style={{ color: '#4b5563' }}
            >
              {body}
            </Typography>
            <SlideUp delay={0.2}>
              <div>
                <Link
                  href={ctaHref}
                  className="inline-block rounded-full bg-[#98342d] text-white px-5 py-2 text-sm hover:brightness-95"
                >
                  Read Our Full Story
                </Link>
              </div>
            </SlideUp>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

export default OurStorySimple;


