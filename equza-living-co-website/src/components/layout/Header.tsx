'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : undefined;
  const nextPathname = (() => {
    try {
      // Prefer Next.js pathname in client where available
      // usePathname is a client hook but we can't call conditionally; fallback to window
      // We'll safely call it in a try/catch in case of rendering constraints
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const p = usePathname?.();
      return p || pathname || '';
    } catch {
      return pathname || '';
    }
  })();
  const isAdminRoute = typeof nextPathname === 'string' && nextPathname.startsWith('/admin');
  const isHomePage = nextPathname === '/';

  const handleLogoClick = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Don't process header logic for admin routes
    if (isAdminRoute) {
      return;
    }
    // Prefer hero visibility via IntersectionObserver; fallback to scroll threshold
    const findHero = () => {
      return (
        document.querySelector('#hero') ||
        document.querySelector('[data-hero]') ||
        document.querySelector('#site-hero') ||
        document.querySelector('[data-section="hero"]')
      );
    };

    const heroEl = findHero();
    if (heroEl && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          // Show header as soon as hero top crosses out of view (even slightly)
          const intersecting = entry.isIntersecting;
          const hasScrolled = window.scrollY > 120; // safety fallback
          setShowHeader(!intersecting || hasScrolled);
        },
        {
          root: null,
          // Trigger when hero's top moves past the top by ~64-80px
          rootMargin: '-80px 0px 0px 0px',
          threshold: 0,
        }
      );
      observer.observe(heroEl);
      // Initialize state based on current visibility using getBoundingClientRect
      const rect = heroEl.getBoundingClientRect();
      const heroInView = rect.top < window.innerHeight && rect.bottom > 0;
      const hasScrolled = window.scrollY > 120;
      setShowHeader(!heroInView || hasScrolled);
      // Also add a lightweight scroll sync to hide again when user scrolls back up
      const onScrollSync = () => {
        const r = heroEl.getBoundingClientRect();
        const inView = r.top < window.innerHeight && r.bottom > 0;
        const scrolled = window.scrollY > 120;
        setShowHeader(!inView || scrolled);
      };
      window.addEventListener('scroll', onScrollSync, { passive: true });
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', onScrollSync);
      };
    }

    // Fallback: simple scroll position
    const onScroll = () => setShowHeader(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAdminRoute, isHomePage]);

  // Don't render header for admin routes
  if (isAdminRoute) {
    return null;
  }

  return (
    <>
    {/* Centered logo overlay with top black gradient when header is hidden (only on home page) */}
    {isHomePage && !isAdminRoute && !showHeader && (
      <>
        {/* Full-width black gradient to improve logo contrast over imagery */}
        <div className="fixed top-0 left-0 right-0 z-30 h-50 bg-gradient-to-b from-black/95 via-black/65 via-black/55 via-black/25  to-transparent pointer-events-none" />
        {/* Logo overlay */}
        <div className="fixed top-2 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <Link href="/" className="pointer-events-auto" aria-label="Equza Living Co. Home">
            <Image src="/equza_-_logo__3_-removebg-preview.svg" alt="Equza Living Co. logo" width={140} height={40} priority />
          </Link>
        </div>
      </>
    )}

    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-colors ${
        showHeader ? 'bg-[#D8BF9F] text-warm-900 shadow-sm' : 'bg-transparent text-warm-900 pointer-events-none'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: showHeader ? 0 : -80, opacity: showHeader ? 1 : 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" onClick={handleLogoClick} className="flex items-center hover:opacity-90 transition-opacity" aria-label="Equza Living Co. Home">
              <div className="relative h-20 w-[100px]">
                <Image src="/equaza_logo.svg" alt="Equza Living Co. logo" fill sizes="100px" priority style={{ objectFit: 'contain' }} />
              </div>
            </Link>
          </div>

          {/* Center: Desktop navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className={`transition-colors font-medium ${showHeader ? 'text-warm-900 hover:text-warm-900/80' : 'text-warm-700 hover:text-primary-600'}`}>Home</Link>
            <Link href="/our-story" className={`transition-colors font-medium ${showHeader ? 'text-warm-900 hover:text-warm-900/80' : 'text-warm-700 hover:text-primary-600'}`}>Our Story</Link>
            <Link href="/craftsmanship" className={`transition-colors font-medium ${showHeader ? 'text-warm-900 hover:text-warm-900/80' : 'text-warm-700 hover:text-primary-600'}`}>Craftsmanship</Link>
            <Link href="/trade" className={`transition-colors font-medium ${showHeader ? 'text-warm-900 hover:text-warm-900/80' : 'text-warm-700 hover:text-primary-600'}`}>Trade</Link>
          </nav>

          {/* Right: CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            <Link 
              href="https://calendar.app.google/Ph8XoPBvjmKGzbTC6" 
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex px-6 py-2 rounded-md transition-colors font-medium shadow-sm"
              style={{ 
                backgroundColor: '#98342d', 
                color: '#FEFDFB',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7a2822';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#98342d';
              }}
            >
              Book a Call
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-md transition-colors ${showHeader ? 'text-warm-900 hover:text-warm-900 hover:bg-black/5' : 'text-warm-600 hover:text-warm-900 hover:bg-cream-100'}`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-cream-50 border-t border-warm-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-4">
                <Link
                  href="/"
                  className="block text-lg font-medium text-warm-900 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/craftsmanship"
                  className="block text-lg font-medium text-warm-900 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Craftsmanship
                </Link>
                <Link
                  href="/our-story"
                  className="block text-lg font-medium text-warm-900 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Story
                </Link>
                <Link
                  href="/trade"
                  className="block text-lg font-medium text-warm-900 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trade
                </Link>
                <hr className="border-warm-200" />
                <Link
                  href="https://calendar.app.google/Ph8XoPBvjmKGzbTC6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-lg font-medium px-6 py-3 rounded-md transition-colors text-center shadow-sm"
                  style={{ 
                    backgroundColor: '#98342d', 
                    color: '#FEFDFB',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7a2822';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#98342d';
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book a Call
                </Link>
              </div>

              {/* Contact info in mobile menu */}
              <div className="pt-4 border-t border-warm-200">
                <div className="space-y-2">
                  <a
                    href="mailto:info@equzalivingco.com"
                    className="block text-sm text-warm-600 hover:text-primary-600 transition-colors"
                  >
                    info@equzalivingco.com
                  </a>
                  <a
                    href="tel:+15551234567"
                    className="block text-sm text-warm-600 hover:text-primary-600 transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    </>
  );
} 