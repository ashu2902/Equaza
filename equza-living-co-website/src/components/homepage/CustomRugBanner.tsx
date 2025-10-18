/**
 * Custom Rug Banner
 * "You Imagine It. We Weave It." section
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Palette, Ruler, Heart } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/MotionWrapper';

const customizationFeatures = [
  {
    icon: Palette,
    title: 'Colors & Patterns',
    description: 'Choose from hundreds of colors and create unique patterns',
  },
  {
    icon: Ruler,
    title: 'Custom Sizes',
    description: 'Any size you need, perfectly crafted to fit your space',
  },
  {
    icon: Heart,
    title: 'Personal Touch',
    description: 'Add meaningful symbols, motifs, or family elements',
  },
];

export function CustomRugBanner() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className='relative py-16 overflow-hidden'
      style={{ backgroundColor: '#98342d' }}
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className="absolute inset-0 bg-[url('/patterns/traditional-motif.svg')] bg-repeat" />
      </div>

      {/* Floating Elements */}
      <div className='absolute top-20 left-10 w-4 h-4 bg-primary-300 rounded-full animate-pulse opacity-60' />
      <div className='absolute top-40 right-20 w-6 h-6 bg-primary-400 rounded-full animate-pulse opacity-40 delay-1000' />
      <div className='absolute bottom-32 left-1/4 w-3 h-3 bg-primary-200 rounded-full animate-pulse opacity-50 delay-500' />

      <Container size='xl' className='relative z-10'>
        <div className='grid grid-cols-1 gap-16 items-center'>
          {/* Left Column - Message */}
          <div className='space-y-8 text-white'>
            <FadeIn>
              <div className='space-y-6'>
                <div className='flex items-center space-x-3'>
                  <Sparkles className='w-8 h-8' style={{ color: '#f5f5f4' }} />
                  <Typography
                    variant='overline'
                    className='font-medium font-poppins'
                    style={{ color: '#f5f5f4' }}
                  >
                    Custom Creations
                  </Typography>
                </div>

                <Typography
                  variant='h2'
                  className='text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-white font-libre-baskerville'
                >
                  You Imagine It.
                  <br />
                  <span style={{ color: '#f5f5f4' }}>We Weave It.</span>
                </Typography>

                <Typography
                  variant='subtitle1'
                  className='text-xl leading-relaxed max-w-lg font-poppins'
                  style={{ color: '#e5e5e5' }}
                >
                  Transform your vision into a handcrafted masterpiece. Our
                  artisans bring your unique design dreams to life with
                  traditional techniques and modern creativity.
                </Typography>
              </div>
            </FadeIn>

            {/* Features */}
            <SlideUp delay={0.2}>
              <div className='space-y-6'>
                {customizationFeatures.map((feature, index) => (
                  <ScaleIn key={feature.title} delay={0.3 + index * 0.1}>
                    <div className='flex items-start space-x-4'>
                      <div className='flex-shrink-0 w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center'>
                        <feature.icon className='w-6 h-6 text-primary-200' />
                      </div>

                      <div className='space-y-1'>
                        <Typography
                          variant='h4'
                          className='text-white font-medium font-libre-baskerville'
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant='body'
                          className='font-poppins'
                          style={{ color: '#e5e5e5' }}
                        >
                          {feature.description}
                        </Typography>
                      </div>
                    </div>
                  </ScaleIn>
                ))}
              </div>
            </SlideUp>

            {/* Single CTA per spec */}
            <SlideUp delay={0.6}>
              <div className='flex'>
                <Button
                  asChild
                  size='lg'
                  className='px-8 py-4 !bg-white !text-[#98342d] hover:!bg-gray-50 hover:!text-[#98342d] font-medium border-0 shadow-md'
                >
                  <Link href='/customize'>Start Designing</Link>
                </Button>
              </div>
            </SlideUp>
          </div>
          {/* Right-side visual removed per spec */}
        </div>
      </Container>
      {/* Bottom stats removed per spec */}
    </section>
  );
}
