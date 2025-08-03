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
  Handshake, 
  TrendingUp, 
  Users, 
  Award, 
  Globe, 
  Package, 
  Shield,
  Star,
  Quote,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

// Components
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
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
    description: 'Attractive wholesale pricing with healthy profit margins for your business growth.',
    highlight: 'Up to 50% margin'
  },
  {
    icon: Package,
    title: 'Exclusive Collections',
    description: 'Access to partner-only designs and early releases of new collections.',
    highlight: 'Partner exclusives'
  },
  {
    icon: Users,
    title: 'Marketing Support',
    description: 'Professional marketing materials, product photography, and brand guidelines.',
    highlight: 'Full marketing kit'
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'Every rug backed by our quality promise and comprehensive return policy.',
    highlight: '100% guaranteed'
  },
  {
    icon: Globe,
    title: 'Global Shipping',
    description: 'Reliable worldwide shipping with tracking and insurance coverage.',
    highlight: 'Worldwide delivery'
  },
  {
    icon: Award,
    title: 'Dedicated Support',
    description: 'Personal account manager for ordering, training, and business development.',
    highlight: 'Personal manager'
  }
];

const partnerTypes = [
  {
    type: 'Interior Designers',
    description: 'Professional designers seeking authentic pieces for client projects',
    benefits: ['Design consultation', 'Custom sizing options', 'Project pricing', 'Sample program'],
    minOrder: 'No minimum'
  },
  {
    type: 'Retail Stores', 
    description: 'Home décor and furniture retailers looking to expand their rug offerings',
    benefits: ['Wholesale pricing', 'Display materials', 'Staff training', 'Marketing support'],
    minOrder: '$2,500'
  },
  {
    type: 'Online Retailers',
    description: 'E-commerce platforms and marketplaces selling home furnishings',
    benefits: ['Digital assets', 'Product data feeds', 'Drop-shipping options', 'SEO content'],
    minOrder: '$1,500'
  },
  {
    type: 'Hospitality',
    description: 'Hotels, restaurants, and commercial spaces needing custom solutions',
    benefits: ['Volume pricing', 'Custom designs', 'Project management', 'Installation support'],
    minOrder: '$5,000'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Interior Designer',
    company: 'Chen Design Studio',
    location: 'San Francisco, CA',
    quote: 'Equza\'s rugs have become my go-to for clients who want authentic, handcrafted pieces. The quality is exceptional and my clients love the stories behind each rug.',
    rating: 5,
    image: '/images/testimonial-sarah.jpg'
  },
  {
    name: 'Marcus Williams',
    role: 'Store Owner',
    company: 'Heritage Home Décor',
    location: 'Austin, TX',
    quote: 'The partnership program exceeded our expectations. Great margins, beautiful products, and excellent support. Our customers can\'t get enough of these rugs.',
    rating: 5,
    image: '/images/testimonial-marcus.jpg'
  },
  {
    name: 'Elena Rodriguez',
    role: 'E-commerce Manager',
    company: 'Modern Living Co.',
    location: 'Miami, FL',
    quote: 'Working with Equza has been seamless. Their digital assets and product information make it easy to showcase these beautiful rugs to our online customers.',
    rating: 5,
    image: '/images/testimonial-elena.jpg'
  }
];

const processSteps = [
  {
    step: '01',
    title: 'Application',
    description: 'Submit your partnership application with business details and requirements.',
    timeframe: '5 minutes'
  },
  {
    step: '02',
    title: 'Review',
    description: 'Our team reviews your application and conducts a business compatibility assessment.',
    timeframe: '3 business days'
  },
  {
    step: '03',
    title: 'Consultation',
    description: 'Schedule a call to discuss partnership details, pricing, and expectations.',
    timeframe: '30-45 minutes'
  },
  {
    step: '04',
    title: 'Agreement',
    description: 'Receive partnership agreement, wholesale pricing, and account setup.',
    timeframe: '1-2 days'
  },
  {
    step: '05',
    title: 'Launch',
    description: 'Access partner portal, marketing materials, and place your first order.',
    timeframe: 'Same day'
  }
];

function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center" style={{backgroundColor: '#f1eee9'}}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="/images/trade-hero.jpg" 
          alt="Business partnership handshake with rugs in background"
          className="w-full h-full object-cover"
          style={{objectPosition: 'center 40%'}}
        />
      </div>
      
      {/* Content */}
      <Container className="relative z-20">
        <div className="max-w-4xl">
          <FadeIn>
            <Link 
              href="/" 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </FadeIn>
          
          <SlideUp delay={0.2}>
            <Typography variant="h1" className="text-white mb-6">
              Trade Partnership
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.4}>
            <Typography variant="lead" className="text-white/90 mb-8 max-w-3xl">
              Partner with us to bring authentic handcrafted rugs to your customers. 
              Join our network of designers, retailers, and industry professionals.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                View Benefits
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                Apply Now
              </Button>
            </div>
          </SlideUp>
        </div>
      </Container>
    </div>
  );
}

function BenefitsSection() {
  return (
    <div className="py-24 bg-white">
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
                  
                  <Typography variant="body" className="text-gray-600 mb-4 leading-relaxed">
                    {benefit.description}
                  </Typography>
                  
                  <div 
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{backgroundColor: '#98342d'}}
                  >
                    {benefit.highlight}
                  </div>
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
    <div className="py-24" style={{backgroundColor: '#f1eee9'}}>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {partnerTypes.map((partner, index) => (
            <SlideUp key={index} delay={index * 0.2}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Typography variant="h4" className="text-gray-900">
                      {partner.type}
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                      Min: {partner.minOrder}
                    </Typography>
                  </div>
                  
                  <Typography variant="body" className="text-gray-600 mb-6">
                    {partner.description}
                  </Typography>
                  
                  <div className="space-y-2">
                    {partner.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full mr-3" style={{backgroundColor: '#98342d'}}></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          ))}
        </div>
      </Container>
    </div>
  );
}

function TestimonialsSection() {
  return (
    <div className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              What Our Partners Say
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Hear from successful partners who have grown their business with Equza.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <SlideUp key={index} delay={index * 0.2}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-current" 
                        style={{color: '#98342d'}} 
                      />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-gray-300 mb-4" />
                  
                  <Typography variant="body" className="text-gray-600 mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </Typography>
                  
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-full bg-gray-200 mr-4"
                      style={{backgroundColor: '#98342d', opacity: 0.1}}
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Photo
                      </div>
                    </div>
                    <div>
                      <Typography variant="h6" className="text-gray-900">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="small" className="text-gray-500">
                        {testimonial.role}, {testimonial.company}
                      </Typography>
                      <Typography variant="small" className="text-gray-400">
                        {testimonial.location}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SlideUp>
          ))}
        </div>
      </Container>
    </div>
  );
}

function ProcessSection() {
  return (
    <div className="py-24" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              How It Works
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Getting started as an Equza partner is simple. Here's what you can expect from application to launch.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <SlideUp key={index} delay={index * 0.1}>
                <div className="flex items-center gap-8">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                      style={{backgroundColor: '#98342d'}}
                    >
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Typography variant="h4" className="text-gray-900">
                        {step.title}
                      </Typography>
                      <Typography variant="small" className="text-gray-500">
                        {step.timeframe}
                      </Typography>
                    </div>
                    <Typography variant="body" className="text-gray-600">
                      {step.description}
                    </Typography>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

function ApplicationSection() {
  return (
    <div className="py-24 bg-white">
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
        
        <div className="max-w-2xl mx-auto">
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

function ContactSection() {
  return (
    <div className="py-24" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              Questions About Partnership?
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Our partnership team is here to answer your questions and help you get started.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <SlideUp delay={0.3}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: '#98342d'}}>
                <Phone className="w-8 h-8 text-white" />
              </div>
              <Typography variant="h5" className="text-gray-900 mb-2">
                Call Us
              </Typography>
              <Typography variant="body" className="text-gray-600">
                +1 (555) 123-4567
              </Typography>
              <Typography variant="small" className="text-gray-500">
                Mon-Fri, 9AM-6PM EST
              </Typography>
            </div>
          </SlideUp>
          
          <SlideUp delay={0.4}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: '#98342d'}}>
                <Mail className="w-8 h-8 text-white" />
              </div>
              <Typography variant="h5" className="text-gray-900 mb-2">
                Email Us
              </Typography>
              <Typography variant="body" className="text-gray-600">
                partners@equzaliving.com
              </Typography>
              <Typography variant="small" className="text-gray-500">
                Response within 24 hours
              </Typography>
            </div>
          </SlideUp>
          
          <SlideUp delay={0.5}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: '#98342d'}}>
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <Typography variant="h5" className="text-gray-900 mb-2">
                Schedule Call
              </Typography>
              <Typography variant="body" className="text-gray-600">
                Book a consultation
              </Typography>
              <Button variant="outline" size="sm" className="mt-2">
                Schedule Now
              </Button>
            </div>
          </SlideUp>
        </div>
      </Container>
    </div>
  );
}

export default function TradePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Hero Section */}
        <SectionErrorBoundary sectionName="trade hero">
          <HeroSection />
        </SectionErrorBoundary>

        {/* Benefits */}
        <SectionErrorBoundary sectionName="benefits section">
          <BenefitsSection />
        </SectionErrorBoundary>

        {/* Partner Types */}
        <SectionErrorBoundary sectionName="partner types">
          <PartnerTypesSection />
        </SectionErrorBoundary>

        {/* Testimonials */}
        <SectionErrorBoundary sectionName="testimonials section">
          <TestimonialsSection />
        </SectionErrorBoundary>

        {/* Process */}
        <SectionErrorBoundary sectionName="process section">
          <ProcessSection />
        </SectionErrorBoundary>

        {/* Application Form */}
        <SectionErrorBoundary sectionName="application section">
          <ApplicationSection />
        </SectionErrorBoundary>

        {/* Contact */}
        <SectionErrorBoundary sectionName="contact section">
          <ContactSection />
        </SectionErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}