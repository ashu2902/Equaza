/**
 * Contact Section
 * Homepage contact form integration
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Calendar, MapPin, Clock } from 'lucide-react';
import type { SiteSettings } from '@/types';
import { CONTACT } from '@/lib/utils/constants';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/MotionWrapper';
import { ContactForm } from '@/components/forms';
import { submitContactForm } from '@/lib/actions/contact';

interface ContactSectionProps {
  siteSettings: SiteSettings | null;
}

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak directly with our design consultants',
    action: 'Call Now',
    href: `tel:${CONTACT.phone}`,
    value: CONTACT.phone
  },
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Get detailed responses to your inquiries',
    action: 'Send Email',
    href: `mailto:${CONTACT.email}`,
    value: CONTACT.email
  },
  {
    icon: Calendar,
    title: 'Book Consultation',
    description: 'Schedule a personalized design session',
    action: 'Book Now',
    href: '/book-consultation',
    value: 'Free 30-min session'
  }
];

const businessHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
  { day: 'Sunday', hours: 'Closed' }
];

export function ContactSection({ siteSettings }: ContactSectionProps) {
  const [isFormSuccess, setIsFormSuccess] = useState(false);

  const handleFormSuccess = () => {
    setIsFormSuccess(true);
    setTimeout(() => setIsFormSuccess(false), 5000);
  };

  // Compact PDF variant: concise header + form only
  return (
    <section className="py-16" style={{ backgroundColor: '#f1eee9' }}>
      <Container size="xl">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Typography variant="h2" className="text-3xl md:text-4xl font-libre-baskerville" style={{ color: '#98342d' }}>
            Let’s Begin a Conversation
          </Typography>
          <Typography variant="body" className="text-neutral-700 mt-3">
            Whether you’re designing a space or sourcing at scale, we’d love to hear from you.
          </Typography>
        </div>
        <div className="mx-auto max-w-3xl bg-white rounded-2xl border border-neutral-200 p-6 md:p-8">
          <ContactForm
            onSubmit={async (data) => {
              try {
                console.log('Contact form data:', data);
                console.log('Attempting to submit to Firebase...');
                
                // Actually submit to Firebase
                const result = await submitContactForm(data, 'homepage-contact');
                
                console.log('Submit result:', result);
                
                if (!result.success) {
                  console.error('Submission failed with result:', result);
                  throw new Error(result.message || 'Failed to submit form');
                }
                
                console.log('✅ Contact form successfully submitted to Firebase! Lead ID:', result.leadId);
                handleFormSuccess();
              } catch (error) {
                console.error('❌ Contact form error details:', {
                  message: error instanceof Error ? error.message : 'Unknown error',
                  stack: error instanceof Error ? error.stack : undefined,
                  fullError: error
                });
                throw error; // Re-throw so the form shows error state
              }
            }}
            title=""
            description=""
            showCard={false}
            splitName
            className="space-y-6"
          />
        </div>
      </Container>
    </section>
  );
}