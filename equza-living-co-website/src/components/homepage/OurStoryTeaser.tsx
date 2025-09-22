/**
 * Our Story Teaser Section
 * Brief introduction with CTA to full story page
 */

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

export function OurStoryTeaser() {
  return (
    <section className="py-20" style={{backgroundColor: '#f1eee9'}}>
      <Container size="xl">
        <div className="max-w-4xl">
          {/* Story Content - Left Aligned */}
          <div className="space-y-8">
            <FadeIn>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-1" style={{ backgroundColor: '#98342d' }} />
                  <Typography variant="overline" className="font-medium font-poppins" style={{ color: '#98342d' }}>
                    Our Heritage
                  </Typography>
                </div>
                
                <Typography 
                  variant="h2" 
                  className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight font-libre-baskerville"
                  style={{ color: '#98342d' }}
                >
                  Where Traditional 
                  <br />
                  <span style={{ color: '#98342d' }}>Craftsmanship</span>
                  <br />
                  Meets Modern Design
                </Typography>
                
                <Typography 
                  variant="subtitle1" 
                  className="text-xl leading-relaxed font-poppins"
                  style={{ color: '#4b5563' }}
                >
                  For three generations, our family has been weaving stories into rugs. 
                  From the historic looms of Rajasthan to modern homes around the world, 
                  each piece carries the soul of traditional Indian artistry.
                </Typography>
              </div>
            </FadeIn>

            {/* Quote */}
            <SlideUp delay={0.2}>
              <div className="relative p-6 rounded-xl border-l-4 border-gray-100" style={{ backgroundColor: '#f9fafb', borderLeftColor: '#98342d' }}>
                <Typography variant="body" className="italic text-lg leading-relaxed font-poppins" style={{ color: '#374151' }}>
                  "Every thread tells a story, every pattern holds meaning. 
                  We don't just make rugs – we create heirlooms that connect 
                  generations and cultures."
                </Typography>
                
                <div className="mt-4 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                  <Typography variant="caption" className="font-medium font-poppins" style={{ color: '#98342d' }}>
                    — Rajesh Sharma, Master Weaver & Founder
                  </Typography>
                </div>
              </div>
            </SlideUp>

            {/* CTA Button */}
            <SlideUp delay={0.4}>
              <div className="flex justify-start">
                <Button 
                  asChild 
                  size="lg" 
                  className="px-8 py-4"
                >
                  <Link href="/our-story">
                    <span className="flex items-center space-x-2">
                      <span>Read Our Full Story</span>
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Link>
                </Button>
              </div>
            </SlideUp>
          </div>
        </div>
      </Container>
    </section>
  );
}