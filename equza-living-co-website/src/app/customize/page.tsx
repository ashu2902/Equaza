/**
 * Customize Page - Custom Rug Request Form
 * 
 * "You Imagine It. We Weave It." - Custom rug design form
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Palette, Ruler, Heart } from 'lucide-react';

// Components
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { HeroSection } from '@/components/ui/HeroSection';
import { CustomizeFormSection } from './CustomizeFormSection';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/MotionWrapper';

export const metadata: Metadata = {
  title: 'Customize Your Rug | Equza Living Co. - Bespoke Handcrafted Rugs',
  description: 'Create your perfect custom rug with Equza Living Co. Choose your size, materials, colors, and design. Our skilled artisans will bring your vision to life.',
  openGraph: {
    title: 'Customize Your Rug | Equza Living Co.',
    description: 'Design your perfect custom handcrafted rug',
    images: ['/images/og-customize.jpg'],
  },
};

const customizationFeatures = [
  {
    icon: Palette,
    title: 'Colors & Patterns',
    description: 'Choose from hundreds of colors and create unique patterns that reflect your style'
  },
  {
    icon: Ruler,
    title: 'Custom Sizes',
    description: 'Any size you need, perfectly crafted to fit your space and requirements'
  },
  {
    icon: Heart,
    title: 'Personal Touch',
    description: 'Add meaningful symbols, motifs, or family elements to make it truly yours'
  }
];

const processSteps = [
  {
    step: '01',
    title: 'Share Your Vision',
    description: 'Tell us about your dream rug through our detailed form and inspiration uploads'
  },
  {
    step: '02',
    title: 'Design Consultation',
    description: 'Our experts work with you to refine the design and select perfect materials'
  },
  {
    step: '03',
    title: 'Masterful Creation',
    description: 'Skilled artisans handcraft your rug using traditional techniques and premium materials'
  },
  {
    step: '04',
    title: 'Delivered to You',
    description: 'Your unique masterpiece is carefully packaged and delivered to your door'
  }
];

/**
 * Customize Page Component
 */
export default function CustomizePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{ backgroundColor: '#f1eee9' }}>
        <section className="py-6 border-b border-gray-200">
          <Container size="lg">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Customize' }
            ]} />
          </Container>
        </section>
        {/* Hero Section */}
        <SectionErrorBoundary sectionName="customize hero">
          <HeroSection
            pageType="customize"
            title="You Imagine It.
We Weave It."
            subtitle="Create a one-of-a-kind handcrafted rug that perfectly captures your vision. Our master artisans will transform your ideas into a stunning reality."
            textAlignment="left"
            overlayOpacity={0.2}
            className="py-16 md:py-24"
          />
        </SectionErrorBoundary>

        {/* Features Section */}
        <SectionErrorBoundary sectionName="customization features">
          <section className="py-16 bg-white">
            <Container size="lg">
              <SlideUp delay={0.4}>
                <div className="text-center mb-16">
                  <Typography 
                    variant="h2" 
                    className="text-3xl md:text-4xl font-bold mb-6"
                    style={{ 
                      fontFamily: 'Libre Baskerville',
                      color: '#98342d'
                    }}
                  >
                    Endless Possibilities
                  </Typography>
                  <Typography 
                    variant="body" 
                    className="text-lg text-gray-600 max-w-2xl mx-auto"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Every aspect of your rug can be customized to create something truly unique
                  </Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {customizationFeatures.map((feature, index) => (
                    <ScaleIn key={feature.title} delay={0.5 + index * 0.1}>
                      <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div 
                          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(152, 52, 45, 0.1)' }}
                        >
                          <feature.icon 
                            className="w-8 h-8"
                            style={{ color: '#98342d' }}
                          />
                        </div>
                        <Typography 
                          variant="h3" 
                          className="text-xl font-bold mb-4"
                          style={{ 
                            fontFamily: 'Libre Baskerville',
                            color: '#98342d'
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography 
                          variant="body" 
                          className="text-gray-600"
                          style={{ fontFamily: 'Poppins' }}
                        >
                          {feature.description}
                        </Typography>
                      </div>
                    </ScaleIn>
                  ))}
                </div>
              </SlideUp>
            </Container>
          </section>
        </SectionErrorBoundary>

        {/* Process Section */}
        <SectionErrorBoundary sectionName="customization process">
          <section className="py-16 md:py-24">
            <Container size="lg">
              <SlideUp delay={0.6}>
                <div className="text-center mb-16">
                  <Typography 
                    variant="h2" 
                    className="text-3xl md:text-4xl font-bold mb-6"
                    style={{ 
                      fontFamily: 'Libre Baskerville',
                      color: '#98342d'
                    }}
                  >
                    How It Works
                  </Typography>
                  <Typography 
                    variant="body" 
                    className="text-lg text-gray-600 max-w-2xl mx-auto"
                    style={{ fontFamily: 'Poppins' }}
                  >
                    From concept to creation, we guide you through every step of the journey
                  </Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {processSteps.map((step, index) => (
                    <SlideUp key={step.step} delay={0.7 + index * 0.1}>
                      <div className="text-center">
                        <div 
                          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                          style={{ backgroundColor: '#98342d' }}
                        >
                          <span style={{ fontFamily: 'Libre Baskerville' }}>
                            {step.step}
                          </span>
                        </div>
                        <Typography 
                          variant="h3" 
                          className="text-lg font-bold mb-4"
                          style={{ 
                            fontFamily: 'Libre Baskerville',
                            color: '#98342d'
                          }}
                        >
                          {step.title}
                        </Typography>
                        <Typography 
                          variant="body" 
                          className="text-gray-600 text-sm"
                          style={{ fontFamily: 'Poppins' }}
                        >
                          {step.description}
                        </Typography>
                      </div>
                    </SlideUp>
                  ))}
                </div>
              </SlideUp>
            </Container>
          </section>
        </SectionErrorBoundary>

        {/* Form Section */}
        <SectionErrorBoundary sectionName="customize form">
          <section className="py-16 md:py-24 bg-white">
            <Container size="lg">
              <SlideUp delay={0.8}>
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <Typography 
                      variant="h2" 
                      className="text-3xl md:text-4xl font-bold mb-6"
                      style={{ 
                        fontFamily: 'Libre Baskerville',
                        color: '#98342d'
                      }}
                    >
                      Start Your Custom Journey
                    </Typography>
                    <Typography 
                      variant="body" 
                      className="text-lg text-gray-600"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      Share your vision with us and let our artisans create something extraordinary
                    </Typography>
                  </div>

                  <CustomizeFormSection />
                </div>
              </SlideUp>
            </Container>
          </section>
        </SectionErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

/**
 * Form Loading Skeleton
 */
function CustomizeFormSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
      <div className="h-12 bg-gray-200 rounded w-32"></div>
    </div>
  );
}