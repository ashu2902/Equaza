/**
 * Environment validation utility
 * Ensures all required environment variables are properly configured
 */

export interface EnvironmentConfig {
  // Firebase Configuration
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    clientEmail?: string;
    privateKey?: string;
  };
  
  // Contact Information
  contact: {
    email: string;
    phone: string;
  };
  
  // Social Media
  social: {
    instagram?: string;
    pinterest?: string;
    facebook?: string;
  };
  
  // External Services
  services: {
    gtmId?: string;
    analyticsId?: string;
    calendlyToken?: string;
    calendlyUserUri?: string;
    resendApiKey?: string;
    sendgridApiKey?: string;
    nodemailerHost?: string;
    nodemailerPort?: string;
    nodemailerUser?: string;
    nodemailerPass?: string;
  };
  
  // Application Settings
  app: {
    nodeEnv: string;
    siteUrl: string;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}

/**
 * Required environment variables for the application to function
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_CONTACT_EMAIL',
  'NEXT_PUBLIC_CONTACT_PHONE',
  'NEXT_PUBLIC_SITE_URL',
] as const;

/**
 * Validates that all required environment variables are set
 */
export function validateEnvironment(): { isValid: boolean; missingVars: string[] } {
  const missingVars: string[] = [];
  
  // Direct references work with Webpack/Turbopack, dynamic access doesn't
  const envValues = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };
  
  // Check each required variable using direct references
  for (const envVar of REQUIRED_ENV_VARS) {
    const value = envValues[envVar as keyof typeof envValues];
    if (!value) {
      missingVars.push(envVar);
    }
  }
  
  // Debug: Log validation results in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔥 Environment Validation Results:', {
      missingCount: missingVars.length,
      missing: missingVars,
      allVariablesValid: missingVars.length === 0,
    });
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

/**
 * Gets a parsed and validated environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const validation = validateEnvironment();
  
  if (!validation.isValid && process.env.NODE_ENV === 'production') {
    throw new Error(
      `Missing required environment variables: ${validation.missingVars.join(', ')}`
    );
  }
  
  if (!validation.isValid && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      `Warning: Missing environment variables: ${validation.missingVars.join(', ')}`
    );
  }
  
  // Build firebase config
  const firebase: EnvironmentConfig['firebase'] = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };
  
  if (process.env.FIREBASE_CLIENT_EMAIL) {
    firebase.clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  }
  
  if (process.env.FIREBASE_PRIVATE_KEY) {
    firebase.privateKey = process.env.FIREBASE_PRIVATE_KEY;
  }
  
  // Build social config
  const social: EnvironmentConfig['social'] = {};
  
  if (process.env.NEXT_PUBLIC_INSTAGRAM_URL) {
    social.instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  }
  
  if (process.env.NEXT_PUBLIC_PINTEREST_URL) {
    social.pinterest = process.env.NEXT_PUBLIC_PINTEREST_URL;
  }
  
  if (process.env.NEXT_PUBLIC_FACEBOOK_URL) {
    social.facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  }
  
  // Build services config
  const services: EnvironmentConfig['services'] = {};
  
  if (process.env.NEXT_PUBLIC_GTM_ID) {
    services.gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  }
  
  if (process.env.GOOGLE_ANALYTICS_ID) {
    services.analyticsId = process.env.GOOGLE_ANALYTICS_ID;
  }
  
  if (process.env.CALENDLY_API_TOKEN) {
    services.calendlyToken = process.env.CALENDLY_API_TOKEN;
  }
  
  if (process.env.CALENDLY_USER_URI) {
    services.calendlyUserUri = process.env.CALENDLY_USER_URI;
  }
  
  if (process.env.RESEND_API_KEY) {
    services.resendApiKey = process.env.RESEND_API_KEY;
  }
  
  if (process.env.SENDGRID_API_KEY) {
    services.sendgridApiKey = process.env.SENDGRID_API_KEY;
  }
  
  if (process.env.NODEMAILER_HOST) {
    services.nodemailerHost = process.env.NODEMAILER_HOST;
  }
  
  if (process.env.NODEMAILER_PORT) {
    services.nodemailerPort = process.env.NODEMAILER_PORT;
  }
  
  if (process.env.NODEMAILER_USER) {
    services.nodemailerUser = process.env.NODEMAILER_USER;
  }
  
  if (process.env.NODEMAILER_PASS) {
    services.nodemailerPass = process.env.NODEMAILER_PASS;
  }
  
  return {
    firebase,
    
    contact: {
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@equzalivingco.com',
      phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1234567890',
    },
    
    social,
    
    services,
    
    app: {
      nodeEnv: process.env.NODE_ENV || 'development',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
      allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(','),
    },
  };
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get the site URL with proper protocol
 */
export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Ensure URL has protocol
  if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    return `https://${siteUrl}`;
  }
  
  return siteUrl;
}

/**
 * Get contact information
 */
export function getContactInfo() {
  return {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@equzalivingco.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1234567890',
  };
}

/**
 * Get social media links (only returns links that are configured)
 */
export function getSocialLinks() {
  const links: Record<string, string> = {};
  
  if (process.env.NEXT_PUBLIC_INSTAGRAM_URL) {
    links.instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  }
  
  if (process.env.NEXT_PUBLIC_PINTEREST_URL) {
    links.pinterest = process.env.NEXT_PUBLIC_PINTEREST_URL;
  }
  
  if (process.env.NEXT_PUBLIC_FACEBOOK_URL) {
    links.facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  }
  
  return links;
}

/**
 * Check if analytics is configured
 */
export function isAnalyticsConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_GTM_ID || process.env.GOOGLE_ANALYTICS_ID);
}

/**
 * Check if Calendly is configured
 */
export function isCalendlyConfigured(): boolean {
  return !!(process.env.CALENDLY_API_TOKEN && process.env.CALENDLY_USER_URI);
}

/**
 * Check if any email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY ||
    process.env.SENDGRID_API_KEY ||
    (process.env.NODEMAILER_HOST && process.env.NODEMAILER_USER && process.env.NODEMAILER_PASS)
  );
}

// Export the validated environment config as a singleton
export const env = getEnvironmentConfig(); 