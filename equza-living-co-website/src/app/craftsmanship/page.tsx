/**
 * Craftsmanship Page - "Hands of Heritage"
 * 
 * Editorial layout showcasing our artisan heritage and craftsmanship
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Users, Award, Heart, Sparkles } from 'lucide-react';

// Components
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/MotionWrapper';

export const metadata: Metadata = {
  title: 'Craftsmanship | Equza Living Co. - Heritage of Handcrafted Excellence',
  description: 'Discover the ancient art of rug weaving through our skilled artisans in Bhadohi, Kashmir, and Jaipur. Each rug tells a story of heritage, patience, and masterful craftsmanship.',
  openGraph: {
    title: 'Craftsmanship | Equza Living Co.',
    description: 'Heritage of Handcrafted Excellence - Meet our artisans',
    images: ['/images/og-craftsmanship.jpg'],
  },
};

const craftingLocations = [
  {
    city: 'Bhadohi',
    region: 'Uttar Pradesh',
    specialty: 'Hand-Knotted Excellence',
    description: 'Known as the carpet capital of India, Bhadohi has been perfecting the art of hand-knotted rugs for over 500 years.',
    heritage: 'Since 1500s',
    icon: Award,
    highlights: ['Hand-knotted Persian technique', 'Wool and silk mastery', 'Geometric patterns']
  },
  {
    city: 'Kashmir',
    region: 'Jammu & Kashmir',
    specialty: 'Silk Artistry',
    description: 'The paradise valley where silk rugs reach their zenith, blending Mughal traditions with contemporary elegance.',
    heritage: 'Since 1400s',
    icon: Sparkles,
    highlights: ['Pure silk rugs', 'Intricate Kashmiri motifs', 'Natural dyes']
  },
  {
    city: 'Jaipur',
    region: 'Rajasthan',
    specialty: 'Royal Traditions',
    description: 'The pink city where royal patronage created a legacy of bold patterns and vibrant colors in flat-weave rugs.',
    heritage: 'Since 1600s',
    icon: Heart,
    highlights: ['Dhurrie flat-weaves', 'Bold geometric designs', 'Royal color palettes']
  }
];

const craftingProcess = [
  {
    step: '01',
    title: 'Design & Planning',
    description: 'Master weavers translate your vision into traditional patterns, selecting colors that honor both innovation and heritage.',
    timeframe: '2-3 days'
  },
  {
    step: '02', 
    title: 'Material Selection',
    description: 'Hand-picking the finest wool from Himalayan highlands and silk from Kashmir valleys, ensuring each fiber meets our exacting standards.',
    timeframe: '1-2 days'
  },
  {
    step: '03',
    title: 'Natural Dyeing',
    description: 'Using ancient recipes passed down through generations, our artisans create vibrant, lasting colors from natural sources.',
    timeframe: '3-5 days'
  },
  {
    step: '04',
    title: 'Hand Weaving',
    description: 'Each knot tied by hand, each pattern emerging slowly under the patient care of master craftspeople. This is where time becomes art.',
    timeframe: '2-6 months'
  },
  {
    step: '05',
    title: 'Finishing Touches',
    description: 'Careful washing, precise trimming, and final quality inspection ensure your rug meets the standards of generations past.',
    timeframe: '1-2 weeks'
  }
];

const artisanStats = [
  { number: '150+', label: 'Master Artisans', description: 'Skilled craftspeople across our partner workshops' },
  { number: '25', label: 'Average Years', description: 'Of experience per master weaver' },
  { number: '500+', label: 'Rug Knots', description: 'Hand-tied per square inch in our finest pieces' },
  { number: '3', label: 'Generations', description: 'Average family legacy in the craft' }
];

function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center" style={{backgroundColor: '#f1eee9'}}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
          src="/images/craftsmanship-hero.jpg" 
          alt="Master artisan weaving a traditional rug"
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
              Hands of Heritage
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.4}>
            <Typography variant="lead" className="text-white/90 mb-8 max-w-2xl">
              Every rug tells a story of ancient techniques, patient hands, and timeless traditions. 
              Journey with us through the sacred art of handcrafted excellence.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Explore Our Process
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                Meet Our Artisans
              </Button>
            </div>
          </SlideUp>
        </div>
      </Container>
    </div>
  );
}

function ArtisanStatsSection() {
  return (
    <div className="py-24" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              Crafting Excellence in Numbers
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Behind every rug lies generations of expertise, patience, and an unwavering commitment to perfection.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {artisanStats.map((stat, index) => (
            <ScaleIn key={index} delay={index * 0.1}>
              <div className="text-center">
                <Typography variant="h1" className="text-5xl font-bold mb-2" style={{color: '#98342d'}}>
                  {stat.number}
                </Typography>
                <Typography variant="h4" className="text-gray-900 mb-2">
                  {stat.label}
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  {stat.description}
                </Typography>
              </div>
            </ScaleIn>
          ))}
        </div>
      </Container>
    </div>
  );
}

function LocationsSection() {
  return (
    <div className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              Our Craft Centers
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              From the royal workshops of Jaipur to the silk valleys of Kashmir, 
              discover the heritage cities where our rugs come to life.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {craftingLocations.map((location, index) => (
            <SlideUp key={index} delay={index * 0.2}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <location.icon className="w-8 h-8" style={{color: '#98342d'}} />
                    <span className="text-sm text-gray-500">{location.heritage}</span>
                  </div>
                  
                  <div className="mb-4">
                    <Typography variant="h3" className="text-gray-900 mb-1">
                      {location.city}
                    </Typography>
                    <Typography variant="small" className="text-gray-500 mb-2">
                      {location.region}
                    </Typography>
                    <Typography variant="h5" className="mb-4" style={{color: '#98342d'}}>
                      {location.specialty}
                    </Typography>
                  </div>
                  
                  <Typography variant="body" className="text-gray-600 mb-6">
                    {location.description}
                  </Typography>
                  
                  <div className="space-y-2">
                    {location.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full mr-3" style={{backgroundColor: '#98342d'}}></div>
                        {highlight}
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

function ProcessSection() {
  return (
    <div className="py-24" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              The Sacred Process
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              From vision to masterpiece, each rug undergoes a timeless journey of transformation. 
              Witness the ancient art that turns raw materials into heirloom treasures.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="space-y-12">
          {craftingProcess.map((process, index) => (
            <SlideUp key={index} delay={index * 0.1}>
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <span 
                      className="text-4xl font-bold mr-6 opacity-20" 
                      style={{color: '#98342d'}}
                    >
                      {process.step}
                    </span>
                    <div>
                      <Typography variant="h4" className="text-gray-900 mb-1">
                        {process.title}
                      </Typography>
                      <Typography variant="small" className="text-gray-500">
                        {process.timeframe}
                      </Typography>
                    </div>
                  </div>
                  <Typography variant="body" className="text-gray-600 leading-relaxed">
                    {process.description}
                  </Typography>
                </div>
                
                <div className="flex-1">
                  <div 
                    className="aspect-[4/3] rounded-lg bg-gray-200"
                    style={{backgroundColor: '#98342d', opacity: 0.1}}
                  >
                    {/* Placeholder for process images */}
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">Process Image {index + 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SlideUp>
          ))}
        </div>
      </Container>
    </div>
  );
}

function CallToActionSection() {
  return (
    <div className="py-24 bg-white">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <SlideUp>
            <Typography variant="h2" className="mb-6 text-gray-900">
              Ready to Own a Piece of Heritage?
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 mb-8 leading-relaxed">
              Every rug in our collection carries the soul of its maker and the spirit of centuries-old traditions. 
              Discover pieces that transform spaces and connect you to the timeless art of handcrafted excellence.
            </Typography>
          </SlideUp>
          <SlideUp delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/collections">
                  Explore Our Collections
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/customize">
                  Create Custom Rug
                </Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </Container>
    </div>
  );
}

export default function CraftsmanshipPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Hero Section */}
        <SectionErrorBoundary sectionName="craftsmanship hero">
          <HeroSection />
        </SectionErrorBoundary>

        {/* Artisan Stats */}
        <SectionErrorBoundary sectionName="artisan stats">
          <ArtisanStatsSection />
        </SectionErrorBoundary>

        {/* Craft Locations */}
        <SectionErrorBoundary sectionName="craft locations">
          <LocationsSection />
        </SectionErrorBoundary>

        {/* Crafting Process */}
        <SectionErrorBoundary sectionName="crafting process">
          <ProcessSection />
        </SectionErrorBoundary>

        {/* Call to Action */}
        <SectionErrorBoundary sectionName="cta section">
          <CallToActionSection />
        </SectionErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}