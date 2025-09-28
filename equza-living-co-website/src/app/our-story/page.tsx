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
import { HeroSection } from '@/components/ui/HeroSection';
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

function OurStoryHeroSection() {
  return (
    <HeroSection
      pageType="our-story"
      title="Our Story"
      subtitle="From a passion for heritage crafts to becoming guardians of traditional artistry, our journey is woven with threads of respect, authenticity, and timeless beauty."
      textAlignment="left"
      overlayOpacity={0.4}
      className="min-h-[70vh] md:min-h-screen flex items-center"
    />
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

function ContentSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <SlideUp>
            <Typography variant="h2" className="mb-8 text-gray-900">
              Origins
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="lead" className="text-gray-600 mb-12 leading-relaxed">
              Discover the world behind every thread, where craft becomes living art.
            </Typography>
          </SlideUp>
          
          <div className="space-y-12">
            <SlideUp delay={0.3}>
              <div>
                <Typography variant="h3" className="mb-6 text-gray-900">
                  Our Mission
                </Typography>
                <Typography variant="body" className="text-gray-600 leading-relaxed mb-8">
                  To craft rugs where every hand-knotted or hand-tufted fiber carries the legacy of master artisans, yet speaks in the refined language of contemporary design. By seamlessly blending heritage craftsmanship with modern aesthetics, we create pieces that infuse warmth, artistry, and enduring luxury into every home.
                </Typography>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.4}>
              <div>
                <Typography variant="h4" className="mb-4 text-gray-900" style={{color: '#98342d'}}>
                  Icon - Timeless Craft
                </Typography>
                <Typography variant="body" className="text-gray-600 leading-relaxed mb-8">
                  We safeguard centuries-old weaving traditions, ensuring the art of handwoven rugs thrives for generations to come.
                </Typography>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.5}>
              <div>
                <Typography variant="h4" className="mb-4 text-gray-900" style={{color: '#98342d'}}>
                  Icon - Artisan Alliances
                </Typography>
                <Typography variant="body" className="text-gray-600 leading-relaxed mb-8">
                  Building enduring relationships with skilled artisans based on respect, fairness, and shared dedication to craft.
                </Typography>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.6}>
              <div>
                <Typography variant="h4" className="mb-4 text-gray-900" style={{color: '#98342d'}}>
                  Icon - Unmatched Craftsmanship
                </Typography>
                <Typography variant="body" className="text-gray-600 leading-relaxed mb-8">
                  Every rug reflects the pinnacle of skill, materials, and finishing—honoring generations of mastery.
                </Typography>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.7}>
              <div>
                <Typography variant="h4" className="mb-4 text-gray-900" style={{color: '#98342d'}}>
                  Icon - Contemporary Elegance
                </Typography>
                <Typography variant="body" className="text-gray-600 leading-relaxed">
                  Blending heritage techniques with modern aesthetics, creating rugs that enrich today's living spaces.
                </Typography>
              </div>
            </SlideUp>
          </div>
        </div>
      </Container>
    </div>
  );
}



function StoryContentSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <SlideUp>
            <Typography variant="h3" className="mb-6 text-gray-900 font-bold">
              We didn't invent this art. We simply curate its finest expressions.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              At Equza Living Co., we collaborate with master weavers from Bhadohi, Jaipur, and Kashmir—the heartlands of Indian rug-making—** to present a carefully curated collection of hand-knotted, hand-tufted, and natural-fibre rugs. Many of our partners began with a single loom over fifty years ago; today, they employ thousands of artisans, each bringing a human cadence to every strand.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.3}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              Every rug is both canvas and craft: a space where visionary design meets generational skill. Wool, cotton, and bamboo-silk transform into living artworks, warming a bedroom floor, anchoring a living-room conversation, or daring to ascend a wall like a modern fresco. Geometric serenity, abstract spontaneity, or subtle figurative motifs—each piece is timeless by intention and tactile by soul, ready to turn a hallway into a gallery or spark quiet delight beneath a lacquered table.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.4}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              Our name, Equza, evokes refinement and balance—a commitment to curated excellence. Each rug <span className="underline decoration-[#98342d]">carries this ethos</span> <span className="underline decoration-[#98342d]">forward</span>, inviting you to live <span className="underline decoration-[#98342d]">slower</span>, <span className="underline decoration-[#98342d]">softer</span>, and with intention.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.5}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              Integrity shapes every step. Our weaving partners hold GoodWeave and Care & Fair certifications, practice closed-loop dyeing, and repurpose off-cuts into new yarns. A single rug may pass through up to ninety pairs of hands: the dyer who reads color by sunlight, the knitter who counts knots like prayer beads, the washer who finishes wool under monsoon skies. In those hands lie desert dawns, valley mists, and decades of quiet devotion.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.6}>
            <Typography variant="body" className="text-gray-600 leading-relaxed">
              We don't sell trends. We offer permanence—woven stories that inhabit your space and endure as living art.
            </Typography>
          </SlideUp>
        </div>
      </Container>
    </div>
  );
}

function CallToActionSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <SlideUp>
            <Typography variant="h2" className="mb-6 text-gray-900">
              Be Part of Our Story
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 mb-8 leading-relaxed">
              Choosing an Equza rug means embracing heritage, sustaining the art of handwoven craftsmanship, and bringing a legacy of elegance into your home.
            </Typography>
          </SlideUp>
          <SlideUp delay={0.4}>
            <div className="flex justify-center">
              <Button asChild size="lg">
                <Link href="/collections">
                  Explore Collections
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
          <OurStoryHeroSection />
        </SectionErrorBoundary>

        {/* Mission & Values */}
        <SectionErrorBoundary sectionName="mission section">
          <MissionSection />
        </SectionErrorBoundary>

        {/* Content */}
        <SectionErrorBoundary sectionName="content section">
          <ContentSection />
        </SectionErrorBoundary>

        {/* Story Content */}
        <SectionErrorBoundary sectionName="story content section">
          <StoryContentSection />
        </SectionErrorBoundary>

        {/* Call to Action */}
        <SectionErrorBoundary sectionName="cta section">
          <CallToActionSection />
        </SectionErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}