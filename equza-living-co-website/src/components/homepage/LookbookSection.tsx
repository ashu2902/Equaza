/**
 * Lookbook Download Section
 * Current lookbook download with preview
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, FileText, Star, Calendar, ArrowRight, Eye } from 'lucide-react';
import type { Lookbook, SiteSettings } from '@/types';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/MotionWrapper';

interface LookbookSectionProps {
  lookbook: Lookbook | null;
  siteSettings: SiteSettings | null;
}

const lookbookFeatures = [
  {
    icon: Star,
    title: 'Latest Collections',
    description: 'Discover our newest designs and seasonal favorites'
  },
  {
    icon: Eye,
    title: 'Room Inspirations',
    description: 'See how our rugs transform real living spaces'
  },
  {
    icon: FileText,
    title: 'Style Guides',
    description: 'Expert tips for choosing the perfect rug for your home'
  }
];

export function LookbookSection({ lookbook, siteSettings }: LookbookSectionProps) {
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#f1eee9' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/patterns/lookbook-bg.svg')] bg-repeat" />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Lookbook Info */}
          <div className="space-y-8">
            <FadeIn>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8" style={{ color: '#98342d' }} />
                  <Typography variant="overline" className="font-medium font-poppins" style={{ color: '#98342d' }}>
                    Digital Catalog
                  </Typography>
                </div>
                
                <Typography 
                  variant="h2" 
                  className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight font-libre-baskerville"
                  style={{ color: '#98342d' }}
                >
                  Latest Lookbook
                  <br />
                  <span style={{ color: '#98342d' }}>Now Available</span>
                </Typography>
                
                {lookbook ? (
                  <div className="space-y-4">
                    <Typography 
                      variant="subtitle1" 
                      className="text-xl leading-relaxed font-poppins"
                      style={{ color: '#4b5563' }}
                    >
                      Explore our {lookbook.version} collection featuring 50+ pages 
                      of stunning rug designs, room inspirations, and style guides.
                    </Typography>
                    
                    <div className="flex items-center space-x-6" style={{ color: '#6b7280' }}>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <Typography variant="body" className="font-poppins">
                          Recently Updated
                        </Typography>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <Typography variant="body" className="font-poppins">
                          PDF • High Quality
                        </Typography>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Typography 
                    variant="subtitle1" 
                    className="text-xl leading-relaxed font-poppins"
                    style={{ color: '#4b5563' }}
                  >
                    Discover our complete collection featuring handcrafted rugs, 
                    room inspirations, and expert styling tips in our comprehensive 
                    digital catalog.
                  </Typography>
                )}
              </div>
            </FadeIn>

            {/* Features */}
            <SlideUp delay={0.2}>
              <div className="space-y-6">
                <Typography variant="h4" className="font-medium font-libre-baskerville" style={{ color: '#98342d' }}>
                  What's Inside:
                </Typography>
                
                <div className="space-y-4">
                  {lookbookFeatures.map((feature, index) => (
                    <ScaleIn key={feature.title} delay={0.3 + index * 0.1}>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#98342d' }}>
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="space-y-1">
                          <Typography variant="body" className="font-medium font-libre-baskerville" style={{ color: '#1f2937' }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="caption" className="font-poppins" style={{ color: '#6b7280' }}>
                            {feature.description}
                          </Typography>
                        </div>
                      </div>
                    </ScaleIn>
                  ))}
                </div>
              </div>
            </SlideUp>

            {/* Download CTA */}
            <SlideUp delay={0.6}>
              <div className="space-y-4">
                 <Button 
                  asChild 
                  variant="secondary"
                  size="lg" 
                  className="px-8 py-4 text-white hover:opacity-90 font-poppins"
                  style={{ backgroundColor: '#98342d' }}
                >
                   <Link href={lookbook?.url || '/lookbook'} target="_blank" rel="noopener">
                    <span className="flex items-center space-x-2">
                      <Download className="w-5 h-5" />
                      <span>Download Free Lookbook</span>
                    </span>
                  </Link>
                </Button>
                
                <Typography variant="caption" className="block font-poppins" style={{ color: '#6b7280' }}>
                  Free download • No email required • 15MB PDF
                </Typography>
              </div>
            </SlideUp>
          </div>

          {/* Right Column - Lookbook Preview */}
          <div className="relative">
            <FadeIn delay={0.4}>
              <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsPreviewHovered(true)}
                onMouseLeave={() => setIsPreviewHovered(false)}
              >
                {/* Main Lookbook Cover */}
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl transform transition-all duration-500 hover:scale-105">
                  
                  {/* Cover Image */}
                  <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                    {lookbook?.url ? (
                      <Image
                        src="/images/lookbook-cover.jpg"
                        alt={`${lookbook.version} Lookbook Cover`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                        className={`object-cover transition-all duration-500 ${
                          isPreviewHovered ? 'scale-110' : 'scale-100'
                        }`}
                      />
                    ) : (
                      /* Fallback Cover Design */
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 p-8 flex flex-col justify-between text-white">
                        <div className="space-y-2">
                          <Typography variant="overline" className="text-primary-200">
                            Equza Living Co.
                          </Typography>
                          <Typography variant="h3" className="text-2xl font-light">
                            Lookbook 2024
                          </Typography>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 opacity-60">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div
                              key={i}
                              className="aspect-square bg-white/20 rounded-sm"
                            />
                          ))}
                        </div>
                        
                        <div className="text-right">
                          <Typography variant="caption" className="text-primary-200">
                            Crafted Calm for Modern Spaces
                          </Typography>
                        </div>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                      isPreviewHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="bg-white rounded-full p-4 shadow-lg">
                        <Download className="w-8 h-8" style={{ color: '#98342d' }} />
                      </div>
                    </div>
                  </div>

                  {/* Lookbook Details */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Typography variant="h4" className="font-medium font-libre-baskerville" style={{ color: '#1f2937' }}>
                          {lookbook?.version || 'Equza Lookbook 2024'}
                        </Typography>
                        <Typography variant="body" className="font-poppins" style={{ color: '#6b7280' }}>
                          Complete Collection Catalog
                        </Typography>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <Typography variant="caption" className="font-medium font-poppins" style={{ color: '#98342d' }}>
                          FREE DOWNLOAD
                        </Typography>
                        <Typography variant="caption" className="font-poppins" style={{ color: '#9ca3af' }}>
                          50+ Pages
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <FileText className="w-4 h-4" />
                          <Typography variant="caption">
                            High-resolution PDF
                          </Typography>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-primary-600">
                          <Typography variant="caption" className="font-medium">
                            Download Now
                          </Typography>
                          <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                            isPreviewHovered ? 'translate-x-1' : 'translate-x-0'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page Flip Effect */}
                <div className="absolute top-4 right-4 w-16 h-20 bg-white rounded-sm shadow-lg transform rotate-12 opacity-80" />
                <div className="absolute top-6 right-6 w-16 h-20 bg-white rounded-sm shadow-lg transform rotate-6 opacity-60" />
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>

      {/* Bottom Stats */}
      <SlideUp delay={0.8}>
        <Container size="xl" className="relative z-10 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <Typography variant="h4" className="text-2xl font-light font-libre-baskerville" style={{ color: '#98342d' }}>
                10K+
              </Typography>
              <Typography variant="caption" className="font-poppins" style={{ color: '#6b7280' }}>
                Downloads
              </Typography>
            </div>
            
            <div className="space-y-2">
              <Typography variant="h4" className="text-2xl font-light font-libre-baskerville" style={{ color: '#98342d' }}>
                50+
              </Typography>
              <Typography variant="caption" className="font-poppins" style={{ color: '#6b7280' }}>
                Pages
              </Typography>
            </div>
            
            <div className="space-y-2">
              <Typography variant="h4" className="text-2xl font-light font-libre-baskerville" style={{ color: '#98342d' }}>
                6
              </Typography>
              <Typography variant="caption" className="font-poppins" style={{ color: '#6b7280' }}>
                Collections
              </Typography>
            </div>
            
            <div className="space-y-2">
              <Typography variant="h4" className="text-2xl font-light font-libre-baskerville" style={{ color: '#98342d' }}>
                100+
              </Typography>
              <Typography variant="caption" className="font-poppins" style={{ color: '#6b7280' }}>
                Rug Designs
              </Typography>
            </div>
          </div>
        </Container>
      </SlideUp>
    </section>
  );
}