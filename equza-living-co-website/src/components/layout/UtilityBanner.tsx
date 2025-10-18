'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const CTAs = [
  {
    id: 'email',
    text: 'Questions? Email us',
    icon: Mail,
    action: () => window.open('mailto:info@equzalivingco.com', '_self'),
    href: 'mailto:info@equzalivingco.com',
  },
  {
    id: 'calendly',
    text: 'Book a consultation',
    icon: Calendar,
    action: () => window.open('https://calendly.com/equzalivingco', '_blank'),
    href: 'https://calendly.com/equzalivingco',
  },
  {
    id: 'phone',
    text: 'Call us: +1 (555) 123-4567',
    icon: Mail,
    action: () => window.open('tel:+15551234567', '_self'),
    href: 'tel:+15551234567',
  },
];

export function UtilityBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotation every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CTAs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentCTA = CTAs[currentIndex] || CTAs[0]!;
  const IconComponent = currentCTA.icon;

  return (
    <div
      className='bg-primary-600 text-cream-50 py-2 px-4 text-center relative overflow-hidden'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className='max-w-7xl mx-auto'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentCTA.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='flex items-center justify-center gap-2'
          >
            {/* Desktop layout */}
            <div className='hidden md:flex items-center gap-2'>
              <IconComponent className='w-4 h-4' />
              <a
                href={currentCTA.href}
                onClick={(e) => {
                  e.preventDefault();
                  currentCTA.action();
                }}
                className='text-sm font-medium hover:underline transition-all duration-200 cursor-pointer text-cream-50'
              >
                {currentCTA.text}
              </a>
            </div>

            {/* Mobile layout - vertical stack */}
            <div className='md:hidden flex flex-col items-center gap-1'>
              <IconComponent className='w-4 h-4' />
              <a
                href={currentCTA.href}
                onClick={(e) => {
                  e.preventDefault();
                  currentCTA.action();
                }}
                className='text-xs font-medium hover:underline transition-all duration-200 cursor-pointer text-cream-50'
              >
                {currentCTA.text}
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rotation indicators */}
        <div className='absolute right-4 top-1/2 transform -translate-y-1/2 hidden md:flex gap-1'>
          {CTAs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Switch to CTA ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className='absolute bottom-0 left-0 h-0.5 bg-cream-50/30 w-full'>
          <motion.div
            className='h-full bg-cream-50'
            initial={{ width: '0%' }}
            animate={{ width: isPaused ? '0%' : '100%' }}
            transition={{
              duration: isPaused ? 0 : 5,
              ease: 'linear',
              repeat: isPaused ? 0 : Infinity,
            }}
          />
        </div>
      </div>
    </div>
  );
}
