/**
 * Utilities Index
 * Central export file for all utility functions
 */

// Core utilities
export { cn } from './cn';

// Environment and configuration
export {
  env,
  validateEnvironment,
  getEnvironmentConfig,
  isDevelopment,
  isProduction,
  getSiteUrl,
  getContactInfo,
  getSocialLinks,
  isAnalyticsConfigured,
  isCalendlyConfigured,
  isEmailConfigured,
} from './env';

// Constants
export * from './constants';

// Validation utilities
export {
  contactFormSchema,
  customizeFormSchema,
  enquiryFormSchema,
  tradeFormSchema,
  newsletterSchema,
  productFiltersSchema,
  collectionFiltersSchema,
  leadFiltersSchema,
  validateEmail,
  validatePhone,
  validateFile,
  sanitizeInput,
  slugify,
} from './validation';

// Formatting utilities
export {
  formatDate,
  formatRelativeTime,
  formatPrice,
  formatNumber,
  formatFileSize,
  formatPercentage,
  truncateText,
  titleCase,
  camelCaseToText,
  formatPhoneNumber,
  formatEmailForDisplay,
  formatLeadStatus,
  formatLeadType,
  formatDimensions,
  formatMaterials,
  formatURLForDisplay,
  formatSearchHighlight,
  formatJSON,
  formatList,
  formatSlug,
  formatBreadcrumb,
} from './format';

// Type exports
export type {
  ContactFormData,
  CustomizeFormData,
  EnquiryFormData,
  TradeFormData,
  NewsletterData,
  ProductFilters,
  CollectionFilters,
  LeadFilters,
  ApiResponse,
  SearchData,
} from './validation'; 