'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-cream-50 border-b border-warm-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-warm-600 hover:text-warm-900 hover:bg-cream-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo - centered */}
          <div className="flex-1 flex justify-center lg:justify-center">
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              {/* Logo placeholder - replace with actual logo image */}
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-cream-50 font-bold text-lg">E</span>
                </div>
                <span className="font-display text-2xl lg:text-3xl text-warm-900 tracking-wide">
                  Equza Living Co.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation - hidden by default since we have left navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/collections" 
              className="text-warm-700 hover:text-primary-600 transition-colors font-medium"
            >
              Collections
            </Link>
            <Link 
              href="/customize" 
              className="bg-primary-600 text-cream-50 px-6 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              Customize
            </Link>
          </div>

          {/* Mobile placeholder to balance logo centering */}
          <div className="lg:hidden w-10"></div>
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
                  href="/collections"
                  className="block text-lg font-medium text-warm-900 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Collections
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
                  href="/customize"
                  className="block text-lg font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Customize
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
    </header>
  );
} 