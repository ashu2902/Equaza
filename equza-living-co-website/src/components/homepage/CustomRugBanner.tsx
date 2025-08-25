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
    description: 'Choose from hundreds of colors and create unique patterns'
  },
  {
    icon: Ruler,
    title: 'Custom Sizes',
    description: 'Any size you need, perfectly crafted to fit your space'
  },
  {
    icon: Heart,
    title: 'Personal Touch',
    description: 'Add meaningful symbols, motifs, or family elements'
  }
];

export function CustomRugBanner() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#98342d' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/patterns/traditional-motif.svg')] bg-repeat" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary-300 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-40 right-20 w-6 h-6 bg-primary-400 rounded-full animate-pulse opacity-40 delay-1000" />
      <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-primary-200 rounded-full animate-pulse opacity-50 delay-500" />

      <Container size="xl" className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Message */}
          <div className="space-y-8 text-white">
            <FadeIn>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-8 h-8" style={{ color: '#f5f5f4' }} />
                                  <Typography variant="overline" className="font-medium font-poppins" style={{ color: '#f5f5f4' }}>
                  Custom Creations
                </Typography>
                </div>
                
                <Typography 
                  variant="h2" 
                  className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-white font-libre-baskerville"
                >
                  You Imagine It.
                  <br />
                  <span style={{ color: '#f5f5f4' }}>We Weave It.</span>
                </Typography>
                
                <Typography 
                  variant="subtitle1" 
                  className="text-xl leading-relaxed max-w-lg font-poppins"
                  style={{ color: '#e5e5e5' }}
                >
                  Transform your vision into a handcrafted masterpiece. Our artisans 
                  bring your unique design dreams to life with traditional techniques 
                  and modern creativity.
                </Typography>
              </div>
            </FadeIn>

            {/* Features */}
            <SlideUp delay={0.2}>
              <div className="space-y-6">
                {customizationFeatures.map((feature, index) => (
                  <ScaleIn key={feature.title} delay={0.3 + index * 0.1}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-primary-200" />
                      </div>
                      
                      <div className="space-y-1">
                        <Typography variant="h4" className="text-white font-medium font-libre-baskerville">
                          {feature.title}
                        </Typography>
                        <Typography variant="body" className="font-poppins" style={{ color: '#e5e5e5' }}>
                          {feature.description}
                        </Typography>
                      </div>
                    </div>
                  </ScaleIn>
                ))}
              </div>
            </SlideUp>

            {/* CTA Buttons */}
            <SlideUp delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="px-8 py-4 !bg-white !text-[#98342d] hover:!bg-gray-50 hover:!text-[#98342d] font-medium border-0 shadow-md"
                >
                  <Link href="/customize">
                    Start Designing
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  size="lg"
                  className="px-8 py-4 !bg-transparent !border-2 !border-white !text-white hover:!bg-white hover:!text-[#98342d] font-medium transition-all duration-300"
                >
                  <Link href="/craftsmanship">
                    See Our Process
                  </Link>
                </Button>
              </div>
            </SlideUp>
          </div>

          {/* Right Column - Interactive Visual */}
          <div className="relative">
            <FadeIn delay={0.4}>
              <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Main Image Container */}
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl transform transition-all duration-500 hover:scale-105">
                  
                  {/* Custom Rug Preview */}
                  <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      
                      {/* Animated Weaving Pattern */}
                      <div className="grid grid-cols-8 gap-1 w-full h-full p-4">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-sm transition-all duration-1000 ${
                              isHovered 
                                ? `bg-primary-${[400, 500, 600][i % 3]} delay-${i * 50}`
                                : 'bg-gray-300'
                            }`}
                            style={{
                              animationDelay: `${i * 20}ms`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Center Message */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-center space-y-2">
                        <Typography variant="h4" className="text-gray-900 font-medium">
                          Your Design Here
                        </Typography>
                        <Typography variant="body" className="text-gray-600">
                          Unlimited Possibilities
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Customization Options */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-gray-700">
                      <Typography variant="body" className="font-medium">
                        Size: Custom
                      </Typography>
                      <Typography variant="body" className="font-medium">
                        Material: Your Choice
                      </Typography>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Typography variant="caption" className="text-gray-500">
                        Timeline: 4-8 weeks
                      </Typography>
                      
                      <div className="flex items-center space-x-2 text-primary-600">
                        <Typography variant="caption" className="font-medium">
                          Start Design
                        </Typography>
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                          isHovered ? 'translate-x-1' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Design Elements */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isHovered ? 'scale-110 rotate-12' : 'scale-100'
                }`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                
                <div className={`absolute -bottom-4 -left-4 w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 delay-100 ${
                  isHovered ? 'scale-110 -rotate-12' : 'scale-100'
                }`}>
                  <Palette className="w-6 h-6 text-primary-800" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>

      {/* Bottom Stats */}
      <SlideUp delay={0.8}>
        <Container size="xl" className="relative z-10 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="space-y-2">
              <Typography variant="h3" className="text-3xl font-light text-primary-300">
                500+
              </Typography>
              <Typography variant="body" className="text-primary-100">
                Custom Rugs Created
              </Typography>
            </div>
            
            <div className="space-y-2">
              <Typography variant="h3" className="text-3xl font-light text-primary-300">
                100%
              </Typography>
              <Typography variant="body" className="text-primary-100">
                Satisfaction Guarantee
              </Typography>
            </div>
            
            <div className="space-y-2">
              <Typography variant="h3" className="text-3xl font-light text-primary-300">
                4-8 weeks
              </Typography>
              <Typography variant="body" className="text-primary-100">
                Crafting Timeline
              </Typography>
            </div>
          </div>
        </Container>
      </SlideUp>
    </section>
  );
}