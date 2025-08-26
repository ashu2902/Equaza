/**
 * Our Story Page - Brand Heritage & Timeline
 * 
 * Storytelling layout with vertical scroll timeline and brand heritage
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Globe, Users, Award, MapPin, Clock, Star } from 'lucide-react';

// Components
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/MotionWrapper';

export const metadata: Metadata = {
  title: 'Our Story | Equza Living Co. - Heritage of Handcrafted Excellence',
  description: 'Discover the journey of Equza Living Co. from a passion for heritage crafts to becoming guardians of traditional rug-making artistry. Our story of preserving ancient techniques while creating modern masterpieces.',
  openGraph: {
    title: 'Our Story | Equza Living Co.',
    description: 'Heritage of Handcrafted Excellence - Our Journey',
    images: ['/images/og-our-story.jpg'],
  },
};

const timelineEvents = [
  {
    year: '2018',
    title: 'The Beginning',
    description: 'Founded with a vision to bridge ancient craftsmanship with contemporary living. Our founders traveled across India, discovering the fading art of traditional rug making.',
    highlight: 'First Workshop Partnership',
    icon: Heart,
    image: '/images/timeline-founding.jpg'
  },
  {
    year: '2019',
    title: 'Artisan Connections',
    description: 'Established partnerships with master weavers in Bhadohi, Kashmir, and Jaipur. Built relationships based on fair trade and preserving traditional techniques.',
    highlight: '25 Master Artisans',
    icon: Users,
    image: '/images/timeline-artisans.jpg'
  },
  {
    year: '2020',
    title: 'Digital Heritage',
    description: 'Launched our digital platform to connect global homes with authentic Indian craftsmanship. Despite challenges, we remained committed to our artisan partners.',
    highlight: 'First Online Collection',
    icon: Globe,
    image: '/images/timeline-digital.jpg'
  },
  {
    year: '2021',
    title: 'Recognition & Growth',
    description: 'Received recognition for preserving traditional crafts and supporting artisan communities. Expanded our collection while maintaining quality and authenticity.',
    highlight: 'Heritage Craft Award',
    icon: Award,
    image: '/images/timeline-recognition.jpg'
  },
  {
    year: '2022',
    title: 'Sustainable Impact',
    description: 'Implemented sustainable practices and fair trade policies. Launched programs to support artisan families and preserve traditional knowledge for future generations.',
    highlight: 'Sustainability Initiative',
    icon: Star,
    image: '/images/timeline-sustainability.jpg'
  },
  {
    year: '2024',
    title: 'Modern Heritage',
    description: 'Today, we continue to honor our mission: creating a bridge between timeless craftsmanship and contemporary living, one handcrafted rug at a time.',
    highlight: '150+ Artisan Partners',
    icon: MapPin,
    image: '/images/timeline-today.jpg'
  }
];

const coreValues = [
  {
    title: 'Heritage Preservation',
    description: 'We are guardians of ancient techniques, ensuring traditional rug-making knowledge passes to future generations.',
    icon: Clock,
    color: '#98342d'
  },
  {
    title: 'Artisan Partnership',
    description: 'Fair trade relationships built on respect, transparency, and shared success with our master craftspeople.',
    icon: Users,
    color: '#98342d'
  },
  {
    title: 'Quality Excellence',
    description: 'Every rug meets the highest standards of craftsmanship, materials, and finishing that honor centuries of tradition.',
    icon: Award,
    color: '#98342d'
  },
  {
    title: 'Modern Relevance',
    description: 'Bridging timeless beauty with contemporary design needs, creating pieces that enhance modern living spaces.',
    icon: Heart,
    color: '#98342d'
  }
];

const founders = [
  {
    name: 'Priya Sharma',
    role: 'Co-Founder & Heritage Director',
    bio: 'With a background in textile history and a passion for preserving traditional crafts, Priya leads our artisan partnerships and ensures authentic techniques are maintained.',
    image: '/images/founder-priya.jpg'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Co-Founder & Operations Director', 
    bio: 'A third-generation textile merchant from Bhadohi, Rajesh brings deep industry knowledge and established relationships with master weavers across India.',
    image: '/images/founder-rajesh.jpg'
  }
];

function HeroSection() {
  return (
    <div className="relative min-h-[70vh] md:min-h-screen flex items-center" style={{backgroundColor: '#f1eee9'}}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="/images/our-story-hero.jpg" 
          alt="Traditional rug weaving with modern design elements"
          className="w-full h-full object-cover"
          style={{objectPosition: 'center 30%'}}
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
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">Our Story</h1>
          </SlideUp>
          
          <SlideUp delay={0.4}>
            <p className="text-white/90 mb-8 max-w-3xl text-lg leading-relaxed">
              From a passion for heritage crafts to becoming guardians of traditional artistry, 
              our journey is woven with threads of respect, authenticity, and timeless beauty.
            </p>
          </SlideUp>
          
          <SlideUp delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Our Journey
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                Meet Our Founders
              </Button>
            </div>
          </SlideUp>
        </div>
      </Container>
    </div>
  );
}

function MissionSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <SlideUp>
            <Typography variant="h2" className="mb-8 text-gray-900">
              Our Mission
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="lead" className="text-gray-600 mb-12 leading-relaxed">
              To preserve and celebrate the ancient art of handcrafted rug making while creating 
              meaningful connections between traditional artisans and contemporary homes worldwide.
            </Typography>
          </SlideUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <ScaleIn key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: '#98342d'}}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <Typography variant="h5" className="text-gray-900 mb-3">
                    {value.title}
                  </Typography>
                  <Typography variant="body" className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </Typography>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

function TimelineSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              Our Journey Through Time
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to becoming custodians of heritage craftsmanship, 
              every step of our journey has been guided by respect for tradition and vision for the future.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="relative">
          {/* Timeline Line */}
          <div 
            className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full hidden lg:block"
            style={{backgroundColor: '#98342d', opacity: 0.2}}
          ></div>
          
          <div className="space-y-16">
            {timelineEvents.map((event, index) => (
              <SlideUp key={index} delay={index * 0.1}>
                <div className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                  {/* Content */}
                  <div className="flex-1 lg:text-center">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <span 
                            className="text-2xl font-bold"
                            style={{color: '#98342d'}}
                          >
                            {event.year}
                          </span>
                          <event.icon className="w-6 h-6" style={{color: '#98342d'}} />
                        </div>
                        
                        <Typography variant="h4" className="text-gray-900 mb-3">
                          {event.title}
                        </Typography>
                        
                        <Typography variant="body" className="text-gray-600 mb-4 leading-relaxed">
                          {event.description}
                        </Typography>
                        
                        <div 
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{backgroundColor: '#98342d'}}
                        >
                          {event.highlight}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10 hidden lg:block">
                    <div 
                      className="w-6 h-6 rounded-full border-4 border-white shadow-lg"
                      style={{backgroundColor: '#98342d'}}
                    ></div>
                  </div>
                  
                  {/* Image */}
                  <div className="flex-1">
                    <div 
                      className="aspect-[4/3] rounded-lg bg-gray-200 shadow-lg"
                      style={{backgroundColor: '#98342d', opacity: 0.1}}
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">{event.year} Image</span>
                      </div>
                    </div>
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

function FoundersSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18 bg-white">
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              Meet Our Founders
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Passion for heritage and vision for the future brought our founders together 
              to create something meaningful and lasting.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <SlideUp key={index} delay={index * 0.2}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div 
                  className="aspect-[4/3] bg-gray-200"
                  style={{backgroundColor: '#98342d', opacity: 0.1}}
                >
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-sm">Founder Photo</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <Typography variant="h4" className="text-gray-900 mb-2">
                    {founder.name}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    className="mb-4"
                    style={{color: '#98342d'}}
                  >
                    {founder.role}
                  </Typography>
                  <Typography variant="body" className="text-gray-600 leading-relaxed">
                    {founder.bio}
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

function ImpactSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="text-center mb-16">
          <SlideUp>
            <Typography variant="h2" className="mb-4 text-gray-900">
              Our Impact Today
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
              Every rug tells a story of preserved heritage, supported communities, 
              and connections made between artisans and homes around the world.
            </Typography>
          </SlideUp>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { number: '150+', label: 'Artisan Partners', description: 'Skilled craftspeople in our network' },
            { number: '3', label: 'Heritage Cities', description: 'Traditional craft centers we work with' },
            { number: '500+', label: 'Rugs Crafted', description: 'Each piece telling a unique story' },
            { number: '25+', label: 'Countries', description: 'Where our rugs have found homes' }
          ].map((stat, index) => (
            <ScaleIn key={index} delay={index * 0.1}>
              <div className="text-center">
                <Typography variant="h1" className="text-4xl font-bold mb-2" style={{color: '#98342d'}}>
                  {stat.number}
                </Typography>
                <Typography variant="h5" className="text-gray-900 mb-2">
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

function CallToActionSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18 bg-white">
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <SlideUp>
            <Typography variant="h2" className="mb-6 text-gray-900">
              Be Part of Our Story
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 mb-8 leading-relaxed">
              When you choose an Equza rug, you become part of our mission to preserve heritage craftsmanship 
              and support artisan communities. Every purchase helps continue this timeless tradition.
            </Typography>
          </SlideUp>
          <SlideUp delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/collections">
                  Explore Our Heritage
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/craftsmanship">
                  Meet Our Artisans
                </Link>
              </Button>
            </div>
          </SlideUp>
        </div>
      </Container>
    </div>
  );
}

export default function OurStoryPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <section className="py-6 border-b border-gray-200" style={{backgroundColor: '#f1eee9'}}>
          <Container size="lg">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Our Story' }
            ]} />
          </Container>
        </section>
        {/* Hero Section */}
        <SectionErrorBoundary sectionName="our story hero">
          <HeroSection />
        </SectionErrorBoundary>

        {/* Mission & Values */}
        <SectionErrorBoundary sectionName="mission section">
          <MissionSection />
        </SectionErrorBoundary>

        {/* Timeline */}
        <SectionErrorBoundary sectionName="timeline section">
          <TimelineSection />
        </SectionErrorBoundary>

        {/* Founders */}
        <SectionErrorBoundary sectionName="founders section">
          <FoundersSection />
        </SectionErrorBoundary>

        {/* Impact */}
        <SectionErrorBoundary sectionName="impact section">
          <ImpactSection />
        </SectionErrorBoundary>

        {/* Call to Action */}
        <SectionErrorBoundary sectionName="cta section">
          <CallToActionSection />
        </SectionErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}