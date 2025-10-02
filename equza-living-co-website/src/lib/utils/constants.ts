/**
 * Application constants and configuration values
 */

import { env } from './env';

// Brand Information
export const BRAND = {
  name: 'Equza Living Co.',
  tagline: 'Crafted Calm for Modern Spaces',
  description: 'Premium handcrafted rugs that bring crafted calm to modern spaces',
} as const;

// Contact Information
export const CONTACT = {
  email: env.contact.email,
  phone: env.contact.phone,
  address: {
    street: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
  },
} as const;

// Social Media Links
export const SOCIAL_LINKS = env.social;

// File Upload Constraints
export const FILE_UPLOAD = {
  maxSize: env.app.maxFileSize, // 10MB default
  allowedTypes: env.app.allowedFileTypes,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf'],
} as const;

// Collections Configuration
export const COLLECTIONS = {
  styles: [
    { id: 'botanica', name: 'Botanica', slug: 'botanica' },
    { id: 'avant', name: 'Avant', slug: 'avant' },
    { id: 'graphika', name: 'Graphika', slug: 'graphika' },
    { id: 'heirloom', name: 'Heirloom', slug: 'heirloom' },
    { id: 'lumiere', name: 'Lumière', slug: 'lumiere' },
    { id: 'terra', name: 'Terra', slug: 'terra' },
  ],
  spaces: [
    { id: 'living-room', name: 'Living Room', slug: 'living-room' },
    { id: 'bedroom', name: 'Bedroom', slug: 'bedroom' },
    { id: 'hallway', name: 'Hallway', slug: 'hallway' },
  ],
} as const;

// Navigation Links
export const NAVIGATION = {
  main: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Craftsmanship', href: '/craftsmanship' },
    { name: 'Our Story', href: '/our-story' },
    { name: 'Trade', href: '/trade' },
    { name: 'Collections', href: '/collections' },
  ],
  collections: [
    { name: 'Rugs by Style', href: '/collections?type=style' },
    { name: 'Rugs by Space', href: '/collections?type=space' },
  ],
  footer: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Sitemap', href: '/sitemap' },
  ],
} as const;

// Form Configuration
export const FORMS = {
  contact: {
    maxMessageLength: 1000,
    requiredFields: ['name', 'email', 'message'],
  },
  customize: {
    maxMessageLength: 1000,
    requiredFields: ['name', 'email', 'preferredSize'],
    sizeOptions: [
      '2x3 ft',
      '3x5 ft',
      '4x6 ft',
      '5x8 ft',
      '6x9 ft',
      '8x10 ft',
      '9x12 ft',
      '10x14 ft',
      'Custom Size',
    ],
    materialOptions: [
      'Wool',
      'Silk',
      'Cotton',
      'Jute',
      'Bamboo Silk',
      'Mixed Fiber',
    ],
  },
  enquiry: {
    maxMessageLength: 500,
    requiredFields: ['name', 'email', 'message'],
  },
  trade: {
    maxMessageLength: 1000,
    requiredFields: ['name', 'email', 'message'],
  },
} as const;

// SEO Configuration
export const SEO = {
  defaultTitle: 'Equza Living Co. - Premium Handcrafted Rugs',
  defaultDescription: 'Discover premium handcrafted rugs that bring crafted calm to modern spaces. Explore our collections of artisan-made rugs from India.',
  defaultOgImage: '/images/og-default.jpg',
  twitterHandle: '@equzalivingco',
  siteUrl: env.app.siteUrl,
} as const;

// API Configuration
export const API = {
  endpoints: {
    contact: '/api/contact',
    customize: '/api/customize',
    enquiry: '/api/enquiry',
    trade: '/api/trade',
    lookbook: '/api/lookbook',
  },
  timeout: 10000, // 10 seconds
  retries: 3,
} as const;

// Animation Configuration
export const ANIMATIONS = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },
  easing: {
    default: [0.25, 0.25, 0, 1],
    spring: { type: 'spring', stiffness: 300, damping: 30 },
  },
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  },
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
  minLength: (min: number) => `Minimum ${min} characters required`,
  fileSize: `File size must be less than ${FILE_UPLOAD.maxSize / 1024 / 1024}MB`,
  fileType: `Only ${FILE_UPLOAD.allowedTypes.join(', ')} files are allowed`,
  network: 'Network error. Please check your connection and try again.',
  server: 'Server error. Please try again later.',
  unknown: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  contact: 'Thank you for your message. We\'ll get back to you soon!',
  customize: 'Your customization request has been submitted. We\'ll contact you shortly.',
  enquiry: 'Your enquiry has been submitted. We\'ll respond within 24 hours.',
  trade: 'Your trade partnership request has been received. We\'ll be in touch soon.',
  lookbook: 'Lookbook download started successfully.',
} as const;

// Feature Flags
export const FEATURES = {
  analytics: env.services.gtmId || env.services.analyticsId,
  calendly: env.services.calendlyToken && env.services.calendlyUserUri,
  customization: true,
  lookbook: true,
  tradePartnership: true,
  adminPanel: false, // Will be enabled in future phases
} as const;
