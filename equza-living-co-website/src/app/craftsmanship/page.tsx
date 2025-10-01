/**
 * Craftsmanship Page - "Hands of Heritage"
 * 
 * Editorial layout showcasing our artisan heritage and craftsmanship
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Components
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { HeroSection } from '@/components/ui/HeroSection';
import { ErrorBoundary, SectionErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';

export const metadata: Metadata = {
  title: 'Craftsmanship | Equza Living Co. - Heritage of Handcrafted Excellence',
  description: 'Discover the ancient art of rug weaving through our skilled artisans in Bhadohi, Kashmir, and Jaipur. Each rug tells a story of heritage, patience, and masterful craftsmanship.',
  openGraph: {
    title: 'Craftsmanship | Equza Living Co.',
    description: 'Heritage of Handcrafted Excellence - Meet our artisans',
    images: ['/images/og-craftsmanship.jpg'],
  },
};




function CraftsmanshipHeroSection() {
  return (
    <HeroSection
      pageType="craftsmanship"
      title="Hands of Heritage"
      subtitle="Every rug tells a story of ancient techniques, patient hands, and timeless traditions. Journey with us through the sacred art of handcrafted excellence."
      textAlignment="left"
      overlayOpacity={0.3}
      className="min-h-[70vh] md:min-h-screen flex items-center"
    />
  );
}

function CraftingOverviewSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <SlideUp>
            <Typography variant="h2" className="mb-8 text-gray-900">
              From Loom to Life
            </Typography>
          </SlideUp>
          <SlideUp delay={0.2}>
            <Typography variant="lead" className="text-gray-600 mb-12 leading-relaxed">
              Exploring the journey of handwoven artistry, from its storied origins to its evolution in contemporary design.
            </Typography>
          </SlideUp>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <SlideUp delay={0.3}>
              <div className="text-center">
                <Typography variant="h2" className="mb-4 font-bold" style={{color: '#98342d'}}>
                  150+
                </Typography>
                <Typography variant="h4" className="mb-3 text-gray-900 font-semibold">
                  Master Artisans
                </Typography>
                <Typography variant="body" className="text-gray-600 leading-relaxed">
                  Skilled Craftspeople across our weaving partner houses
                </Typography>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.4}>
              <div className="text-center">
                <Typography variant="h2" className="mb-4 font-bold" style={{color: '#98342d'}}>
                  25+
                </Typography>
                <Typography variant="h4" className="mb-3 text-gray-900 font-semibold">
                  Average Years
                </Typography>
                <Typography variant="body" className="text-gray-600 leading-relaxed">
                  of experience per master weaver
                </Typography>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.5}>
              <div className="text-center">
                <Typography variant="h2" className="mb-4 font-bold" style={{color: '#98342d'}}>
                  3
                </Typography>
                <Typography variant="h4" className="mb-3 text-gray-900 font-semibold">
                  Generations
                </Typography>
                <Typography variant="body" className="text-gray-600 leading-relaxed">
                  Average family legacy in the Rug
                </Typography>
              </div>
            </SlideUp>
          </div>
        </div>
      </Container>
    </div>
  );
}

function TheCraftSection() {
  return (
    <div className="py-10 md:py-14 lg:py-18" style={{backgroundColor: '#f1eee9'}}>
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          <SlideUp>
            <Typography variant="h2" className="mb-8 text-gray-900">
              The Craft of Equza
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.2}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              Behind every Equza rug lies a heritage measured not in seasons, but in centuries of dedication and skill.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.3}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              In Bhadohi—India's renowned <em>Carpet City</em>—families gather at handlooms where weaving is second nature. Designs are drawn square by square on graph paper; each mark a knot to be tied with quiet precision. A single misstep means hundreds patiently undone. In these workshops, the loom itself becomes language, knowledge passed from parent to child by touch and rhythm.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.4}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              In Jaipur, natural dyes simmer in copper vats, their formulas guarded through generations. Pomegranate rind, indigo, turmeric, and madder root yield hues that are sun-dried across rooftops—wind-worn and sky-cured. No two dye lots are ever identical, and that individuality is the signature of the hand.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.5}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              Far to the north, Kashmir's artisans spin silk so fine it seems to float. Here, weaving becomes sculpture: sharp shears carve floral and paisley motifs with the precision of calligraphy. Some pieces require six to eight months of continuous work, every fiber holding the imprint of patient craftsmanship.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.6}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              These are not factories. They are ateliers where heritage and artistry endure.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.7}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              Equza partners exclusively with weaving houses that are GoodWeave-certified, uphold zero child labour, and practise closed-loop dyeing to preserve groundwater. Off-cuts are recycled into new yarns, and every artisan is paid above fair trade standards, often with education support for their children.
            </Typography>
          </SlideUp>
          
          <SlideUp delay={0.8}>
            <Typography variant="body" className="text-gray-600 leading-relaxed mb-6">
              From shearing to spinning, knotting to carving, washing to finishing, a single rug passes through over ninety pairs of skilled hands. Each touch adds something intangible—an instinct, a rhythm, a soul.
            </Typography>
          </SlideUp>
          
          <div className="border-t border-gray-200 pt-8 mt-12">
            <SlideUp delay={0.9}>
              <Typography variant="body" className="text-gray-600 leading-relaxed">
                What arrives in your home is more than a rug. It is a living archive of human craft, refined over generations and designed to bring lasting beauty to modern life.
              </Typography>
            </SlideUp>
          </div>
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
        <section className="py-6 border-b border-gray-200" style={{backgroundColor: '#f1eee9'}}>
          <Container size="lg">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Craftsmanship' }
            ]} />
          </Container>
        </section>
        {/* Hero Section */}
        <SectionErrorBoundary sectionName="craftsmanship hero">
          <CraftsmanshipHeroSection />
        </SectionErrorBoundary>

        {/* Crafting Overview */}
        <SectionErrorBoundary sectionName="crafting overview">
          <CraftingOverviewSection />
        </SectionErrorBoundary>

        {/* The Craft */}
        <SectionErrorBoundary sectionName="the craft">
          <TheCraftSection />
        </SectionErrorBoundary>


        {/* Call to Action */}
        <SectionErrorBoundary sectionName="cta section">
          <CallToActionSection />
        </SectionErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}