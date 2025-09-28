/**
 * Trade Page - Partnership Program
 * 
 * Benefits, testimonials, and partnership application form
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Globe, 
  Package, 
  Shield
} from 'lucide-react';

// Components
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { HeroSection } from '@/components/ui/HeroSection';
import { TradeForm } from '@/components/forms/TradeForm';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/MotionWrapper';

// Actions
import { submitTradePageForm } from '@/lib/actions/trade';

export const metadata: Metadata = {
  title: 'Trade Partnership | Equza Living Co. - Wholesale & Retail Partners',
  description: 'Join our trade partnership program and bring authentic handcrafted rugs to your customers. Competitive wholesale pricing, marketing support, and dedicated account management.',
  openGraph: {
    title: 'Trade Partnership | Equza Living Co.',
    description: 'Partner with us to offer authentic handcrafted rugs',
    images: ['/images/og-trade.jpg'],
  },
};

const partnershipBenefits = [
  {
    icon: TrendingUp,
    title: 'Competitive Margins',
    description: 'Attractive wholesale pricing with healthy profit margins for your business growth.'
  },
  {
    icon: Package,
    title: 'Exclusive Collections',
    description: 'Access to partner-only designs and early releases of new collections.'
  },
  {
    icon: Users,
    title: 'Marketing Support',
    description: 'Professional marketing materials, product photography, and brand guidelines.'
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'Every rug is backed by our uncompromising commitment to craftsmanship and lasting quality.'
  },
  {
    icon: Globe,
    title: 'Global Shipping',
    description: 'Worldwide delivery, handled with the same attention we give to every weave.'
  }
];

const partnerTypes = [
  {
    type: 'Interior Designers',
    description: 'Professional designers seeking authentic pieces for client projects'
  },
  {
    type: 'Retail Stores', 
    description: 'Home décor and furniture retailers looking to expand their rug offerings'
  },
  {
    type: 'Online Retailers',
    description: 'E-commerce platforms and marketplaces selling home furnishings'
  },
  {
    type: 'Hospitality',
    description: 'Hotels, restaurants, and commercial spaces needing custom solutions'
  }
];



function TradeHeroSection() {
  return (
    <HeroSection
      pageType="trade"
      title="Trade Partnership"
      subtitle="Partner with us to bring authentic handcrafted rugs to your customers. Join our network of designers, retailers, and industry professionals."
      textAlignment="left"
      overlayOpacity={0.4}
      className="min-h-[70vh] md:min-h-screen flex items-center"
    >
      <SlideUp delay={0.6}>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
            Partner With Us
          </Button>
        </div>
      </SlideUp>
    </HeroSection>
  );
}

function BenefitsSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18 bg-white">
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              Partnership Benefits
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              We believe in building long-term partnerships that benefit both your business and our artisan communities.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partnershipBenefits.map((benefit, index) => (
            <ScaleIn key={index} delay={index * 0.1}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{backgroundColor: '#98342d'}}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <Typography variant="h5" className="text-gray-900 mb-3">
                    {benefit.title}
                  </Typography>
                  
                  <Typography variant="body" className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </ScaleIn>
          ))}
        </div>
      </Container>
    </div>
  );
}

function PartnerTypesSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              Who We Partner With
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Our partnership program is designed to support various types of businesses in the home décor industry.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerTypes.map((partner, index) => (
            <SlideUp key={index} delay={index * 0.1}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <Typography variant="h5" className="text-gray-900 mb-3">
                    {partner.type}
                  </Typography>
                  
                  <Typography variant="body" className="text-gray-600 text-sm leading-relaxed">
                    {partner.description}
                  </Typography>
                </CardContent>
              </Card>
            </SlideUp>
          ))}
        </div>
      </Container>
    </div>
  );
}



function ApplicationSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18 bg-white">
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              Ready to Partner with Us?
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Take the first step towards a successful partnership. Fill out our application and we'll be in touch within 3 business days.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <SlideUp delay={0.4}>
            <TradeForm
              onSubmit={submitTradePageForm}
              title="Partnership Application"
              description="Tell us about your business and how we can work together."
              showCard={true}
            />
          </SlideUp>
        </div>
      </Container>
    </div>
  );
}

function FooterSection() {
  return (
    <div className="py-16" style={{backgroundColor: '#d4b896'}}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Typography variant="h4" className="font-bold text-gray-900 mb-4">
              EQUZA LIVING CO.
            </Typography>
            <Typography variant="body" className="text-gray-700 mb-4">
              Crafting stories, one rug at a time. Committed to the world.
            </Typography>
          </div>
          
          {/* Explore */}
          <div>
            <Typography variant="h6" className="font-bold text-gray-900 mb-4">
              Explore
            </Typography>
            <div className="space-y-2">
              <Typography variant="body" className="text-gray-700">Our Story</Typography>
              <Typography variant="body" className="text-gray-700">Craftsmanship</Typography>
              <Typography variant="body" className="text-gray-700">Collections</Typography>
            </div>
          </div>
          
          {/* Connect */}
          <div>
            <Typography variant="h6" className="font-bold text-gray-900 mb-4">
              Connect
            </Typography>
            <div className="space-y-2">
              <Typography variant="body" className="text-gray-700">hello@equzaliving.com</Typography>
              <Typography variant="body" className="text-gray-700">+91 81269 65999</Typography>
              <Typography variant="body" className="text-gray-700">Unit 1096, Vaishali Nagar</Typography>
              <Typography variant="body" className="text-gray-700">Jaipur 302021</Typography>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-600 flex flex-col md:flex-row justify-between items-center">
          <Typography variant="small" className="text-gray-700 mb-4 md:mb-0">
            © 2024 Equza Living Co.
          </Typography>
          <div className="flex items-center space-x-4">
            {/* Social media icons would go here */}
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function TradePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <section className="py-6 border-b border-gray-200" style={{backgroundColor: '#f1eee9'}}>
          <Container size="lg">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Trade' }
            ]} />
          </Container>
        </section>
        {/* Hero Section */}
        <SectionErrorBoundary sectionName="trade hero">
          <TradeHeroSection />
        </SectionErrorBoundary>

        {/* Benefits */}
        <SectionErrorBoundary sectionName="benefits section">
          <BenefitsSection />
        </SectionErrorBoundary>

        {/* Partner Types */}
        <SectionErrorBoundary sectionName="partner types">
          <PartnerTypesSection />
        </SectionErrorBoundary>

        {/* Application Form */}
        <SectionErrorBoundary sectionName="application section">
          <ApplicationSection />
        </SectionErrorBoundary>

        {/* Footer */}
        <SectionErrorBoundary sectionName="footer section">
          <FooterSection />
        </SectionErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}