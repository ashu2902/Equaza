'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  Grid,
  Palette,
  Users,
  BookOpen,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigationItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home
  },
  {
    href: '/collections',
    label: 'Collections',
    icon: Grid
  },
  {
    href: '/craftsmanship',
    label: 'Craftsmanship',
    icon: Palette
  },
  {
    href: '/our-story',
    label: 'Our Story',
    icon: BookOpen
  },
  {
    href: '/trade',
    label: 'Trade',
    icon: Users
  },
  {
    href: '#contact',
    label: 'Contact Us',
    icon: Mail,
    isScroll: true
  }
];

export function LeftNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const handleNavClick = (href: string, isScroll?: boolean) => {
    if (isScroll && href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Desktop Left Navigation */}
      <motion.nav
        animate={{ width: isCollapsed ? '80px' : '280px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:bg-cream-50 lg:border-r lg:border-warm-200 lg:pt-20 lg:z-40"
      >
        {/* Collapse toggle */}
        <div className="absolute -right-3 top-8 z-50">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-cream-100 border border-warm-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-shadow"
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-warm-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-warm-600" />
            )}
          </button>
        </div>

        {/* Navigation content */}
        <div className="flex-1 flex flex-col px-6 py-8 overflow-hidden">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (item.isScroll) {
                      e.preventDefault();
                      handleNavClick(item.href, item.isScroll);
                    }
                  }}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'text-warm-700 hover:bg-cream-100 hover:text-primary-600'
                  }`}
                >
                  <IconComponent 
                    className={`flex-shrink-0 w-5 h-5 ${
                      isActive ? 'text-primary-700' : 'text-warm-500 group-hover:text-primary-600'
                    }`} 
                  />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-3 truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>

          {/* Bottom section with contact info */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="mt-auto pt-8 border-t border-warm-200"
              >
                <div className="space-y-3">
                  <div className="text-xs font-medium text-warm-500 uppercase tracking-wider">
                    Get in Touch
                  </div>
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
                  
                  {/* Social links */}
                  <div className="flex space-x-3 pt-3">
                    <a
                      href="https://instagram.com/equzalivingco"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-400 hover:text-primary-600 transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.391 14.42c.639.639 1.518 1.036 2.498 1.036 1.958 0 3.545-1.587 3.545-3.545S10.847 8.366 8.889 8.366s-3.545 1.587-3.545 3.545c0 .98.397 1.859 1.036 2.498l-1.271 1.27c-.807-.88-1.297-2.031-1.297-3.328 0-2.706 2.194-4.9 4.9-4.9s4.9 2.194 4.9 4.9-2.194 4.9-4.9 4.9zm7.138-9.418c-.51 0-.924-.414-.924-.924s.414-.924.924-.924.924.414.924.924-.414.924-.924.924z"/>
                      </svg>
                    </a>
                    <a
                      href="https://pinterest.com/equzalivingco"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-400 hover:text-primary-600 transition-colors"
                      aria-label="Pinterest"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.956 1.404-5.956s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Spacer for desktop layout */}
      <div 
        className={`hidden lg:block transition-all duration-300 ${
          isCollapsed ? 'lg:w-20' : 'lg:w-70'
        }`} 
      />
    </>
  );
} 