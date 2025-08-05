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

  return (
    <section className="py-20" style={{ backgroundColor: '#f1eee9' }}>
      <Container size="xl">
        <div className="space-y-16">
          
          {/* Section Header */}
          <FadeIn>
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-1" style={{ backgroundColor: '#98342d' }} />
                <Typography variant="overline" className="font-medium font-poppins" style={{ color: '#98342d' }}>
                  Get In Touch
                </Typography>
                <div className="w-8 h-1" style={{ backgroundColor: '#98342d' }} />
              </div>
              
              <Typography 
                variant="h2" 
                className="text-3xl md:text-4xl lg:text-5xl font-normal font-libre-baskerville"
                style={{ color: '#98342d' }}
              >
                Ready to Transform
                <br />
                <span style={{ color: '#98342d' }}>Your Space?</span>
              </Typography>
              
              <Typography 
                variant="subtitle1" 
                className="text-xl leading-relaxed font-poppins"
                style={{ color: '#4b5563' }}
              >
                Let's discuss your vision and create the perfect rug for your home. 
                Our design experts are here to help bring your ideas to life.
              </Typography>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column - Contact Methods & Info */}
            <div className="space-y-8">
              
              {/* Contact Methods */}
              <SlideUp delay={0.2}>
                <div className="space-y-6">
                  <Typography variant="h3" className="text-2xl font-medium font-libre-baskerville" style={{ color: '#98342d' }}>
                    Get in Touch
                  </Typography>
                  
                  <div className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <ScaleIn key={method.title} delay={0.3 + index * 0.1}>
                        <Link 
                          href={method.href}
                          className="group block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-stone-600 transition-all duration-300"
                          style={{
                            borderColor: '#e5e7eb'
                          }}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: '#98342d' }}>
                              <method.icon className="w-6 h-6 text-white" />
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <Typography variant="h4" className="font-medium font-libre-baskerville" style={{ color: '#1f2937' }}>
                                  {method.title}
                                </Typography>
                                <Typography variant="caption" className="font-medium group-hover:translate-x-1 transition-transform duration-300 font-poppins" style={{ color: '#98342d' }}>
                                  {method.action}
                                </Typography>
                              </div>
                              
                              <Typography variant="body" className="font-poppins" style={{ color: '#6b7280' }}>
                                {method.description}
                              </Typography>
                              
                              <Typography variant="caption" className="font-medium font-poppins" style={{ color: '#9ca3af' }}>
                                {method.value}
                              </Typography>
                            </div>
                          </div>
                        </Link>
                      </ScaleIn>
                    ))}
                  </div>
                </div>
              </SlideUp>

              {/* Business Hours */}
              <SlideUp delay={0.6}>
                <div className="p-6 bg-white rounded-xl border shadow-sm" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="w-6 h-6" style={{ color: '#98342d' }} />
                    <Typography variant="h4" className="font-medium font-libre-baskerville" style={{ color: '#1f2937' }}>
                      Business Hours
                    </Typography>
                  </div>
                  
                  <div className="space-y-2">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Typography variant="body" className="font-poppins" style={{ color: '#374151' }}>
                          {schedule.day}
                        </Typography>
                        <Typography variant="body" className="font-medium font-poppins" style={{ color: '#6b7280' }}>
                          {schedule.hours}
                        </Typography>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex items-center space-x-2" style={{ color: '#98342d' }}>
                      <MapPin className="w-4 h-4" />
                      <Typography variant="caption" className="font-poppins">
                        {CONTACT.address.country} • Worldwide shipping available
                      </Typography>
                    </div>
                  </div>
                </div>
              </SlideUp>
            </div>

            {/* Right Column - Contact Form */}
            <div className="relative">
              <SlideUp delay={0.4}>
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  
                  {/* Form Header */}
                  <div className="mb-8 space-y-3">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-6 h-6" style={{ color: '#98342d' }} />
                      <Typography variant="h3" className="text-xl font-medium font-libre-baskerville" style={{ color: '#1f2937' }}>
                        Send us a Message
                      </Typography>
                    </div>
                    
                    <Typography variant="body" className="font-poppins" style={{ color: '#6b7280' }}>
                      Tell us about your project and we'll get back to you within 24 hours.
                    </Typography>
                  </div>

                  {/* Success Message */}
                  {isFormSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Typography variant="body" className="text-green-800">
                        ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                      </Typography>
                    </div>
                  )}

                  {/* Contact Form */}
                  <ContactForm 
                    onSubmit={async (data) => {
                      // TODO: Implement contact form submission
                      try {
                        // This would call the contact form server action
                        console.log('Contact form data:', data);
                        handleFormSuccess();
                      } catch (error) {
                        console.error('Contact form error:', error);
                      }
                    }}
                    title=""
                    description=""
                    showCard={false}
                    className="space-y-6"
                  />

                  {/* Form Footer */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Typography variant="caption" className="text-gray-500 text-center block">
                      By submitting this form, you agree to our{' '}
                      <Link href="/privacy" className="text-primary-600 hover:underline">
                        Privacy Policy
                      </Link>
                      {' '}and{' '}
                      <Link href="/terms" className="text-primary-600 hover:underline">
                        Terms of Service
                      </Link>
                    </Typography>
                  </div>
                </div>
              </SlideUp>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-500 rounded-full opacity-60 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary-300 rounded-full opacity-40 animate-pulse delay-1000" />
            </div>
          </div>

          {/* Bottom CTA */}
          <SlideUp delay={0.8}>
            <div className="text-center space-y-6 p-8 rounded-2xl text-white" style={{ backgroundColor: '#98342d' }}>
              <Typography variant="h3" className="text-2xl font-light font-libre-baskerville">
                Need Immediate Assistance?
              </Typography>
              
              <Typography variant="body" className="max-w-2xl mx-auto font-poppins" style={{ color: '#f5f5f4' }}>
                Our design consultants are available to help you choose the perfect rug 
                or answer any questions about our collections and customization options.
              </Typography>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  variant="secondary"
                  size="lg" 
                  className="px-8 py-4 bg-white hover:bg-gray-50 font-poppins"
                  style={{ color: '#98342d' }}
                >
                  <Link href={`tel:${CONTACT.phone}`}>
                    <span className="flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span>Call {CONTACT.phone}</span>
                    </span>
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 border-white text-white hover:bg-white/10 font-poppins"
                >
                  <Link href={siteSettings?.calendlyUrl || '/book-consultation'}>
                    <span className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Book Consultation</span>
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </SlideUp>
        </div>
      </Container>
    </section>
  );
}