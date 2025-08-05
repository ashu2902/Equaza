/**
 * Our Story Teaser Section
 * Brief introduction with CTA to full story page
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Users, Award, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/MotionWrapper';

const storyHighlights = [
  {
    icon: Clock,
    value: '3 Generations',
    label: 'Family Legacy'
  },
  {
    icon: MapPin,
    value: 'Rajasthan, India',
    label: 'Artisan Heritage'
  },
  {
    icon: Users,
    value: '50+ Artisans',
    label: 'Master Craftspeople'
  },
  {
    icon: Award,
    value: '1000+ Rugs',
    label: 'Crafted With Love'
  }
];

export function OurStoryTeaser() {
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  return (
    <section className="py-20" style={{backgroundColor: '#f1eee9'}}>
      <Container size="xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Story Content */}
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

            {/* Story Highlights */}
            <SlideUp delay={0.2}>
              <div className="grid grid-cols-2 gap-6">
                {storyHighlights.map((highlight, index) => (
                  <ScaleIn key={highlight.label} delay={0.3 + index * 0.1}>
                    <div className="text-center space-y-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#98342d' }}>
                        <highlight.icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <Typography variant="h4" className="font-semibold font-libre-baskerville" style={{ color: '#1f2937' }}>
                          {highlight.value}
                        </Typography>
                        <Typography variant="caption" className="font-poppins" style={{ color: '#6b7280' }}>
                          {highlight.label}
                        </Typography>
                      </div>
                    </div>
                  </ScaleIn>
                ))}
              </div>
            </SlideUp>

            {/* Quote */}
            <SlideUp delay={0.6}>
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

            {/* CTA Buttons */}
            <SlideUp delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-4">
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
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4"
                >
                  <Link href="/craftsmanship">
                    See Our Craftsmanship
                  </Link>
                </Button>
              </div>
            </SlideUp>
          </div>

          {/* Right Column - Visual Story */}
          <div className="relative">
            <FadeIn delay={0.4}>
              <div className="relative space-y-6">
                
                {/* Main Story Image */}
                <div 
                  className="relative bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
                  onMouseEnter={() => setIsVideoHovered(true)}
                  onMouseLeave={() => setIsVideoHovered(false)}
                >
                  <div className="relative h-80 bg-gray-100">
                    <Image
                      src="/images/artisan-weaving.jpg"
                      alt="Master artisan weaving traditional rug"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      className={`object-cover transition-all duration-500 ${
                        isVideoHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    
                    {/* Play Button Overlay for Video */}
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                      isVideoHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-0 h-0 border-l-[12px] border-l-primary-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-3">
                    <Typography variant="h4" className="font-medium font-libre-baskerville" style={{ color: '#1f2937' }}>
                      Meet Our Artisans
                    </Typography>
                    <Typography variant="body" className="font-poppins" style={{ color: '#6b7280' }}>
                      Watch the magic unfold as our master weavers bring designs to life
                    </Typography>
                  </div>
                </div>

                {/* Secondary Images */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-32 bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src="/images/traditional-loom.jpg"
                      alt="Traditional weaving loom"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="relative h-32 bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src="/images/color-threads.jpg"
                      alt="Colorful weaving threads"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 text-white rounded-full px-4 py-2 shadow-lg" style={{ backgroundColor: '#98342d' }}>
                  <Typography variant="caption" className="font-medium font-poppins">
                    Est. 1985
                  </Typography>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}