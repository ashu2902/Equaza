/**
 * Data Formatting Utilities
 * Functions for formatting dates, numbers, text, and other data types
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date | string | number,
  formatString = 'MMM dd, yyyy'
): string {
  try {
    let dateObj: Date;

    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (!isValid(dateObj)) {
      return 'Invalid date';
    }

    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date to show relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  try {
    let dateObj: Date;

    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (!isValid(dateObj)) {
      return 'Invalid date';
    }

    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
}

/**
 * Format a price with currency
 */
export function formatPrice(
  amount: number,
  currency = 'INR',
  locale = 'en-IN'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting price:', error);
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(
  number: number,
  locale = 'en-US',
  options?: Intl.NumberFormatOptions
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  decimals = 0,
  locale = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value}%`;
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert camelCase to readable text
 */
export function camelCaseToText(text: string): string {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Check if it's a US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Check if it's a US number with country code
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // For international numbers, just add country code if it starts with +
  if (phone.startsWith('+')) {
    return phone;
  }

  return `+${cleaned}`;
}

/**
 * Format email for display (mask middle part)
 */
export function formatEmailForDisplay(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;

  const [username, domain] = parts;
  if (!username || !domain || username.length <= 2) {
    return email;
  }

  const maskedUsername =
    username.charAt(0) + '*'.repeat(username.length - 2) + username.slice(-1);
  return `${maskedUsername}@${domain}`;
}

/**
 * Format lead status for display
 */
export function formatLeadStatus(status: string): string {
  const statusMap: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    converted: 'Converted',
    closed: 'Closed',
  };

  return statusMap[status] || titleCase(status);
}

/**
 * Format lead type for display
 */
export function formatLeadType(type: string): string {
  const typeMap: Record<string, string> = {
    contact: 'Contact',
    trade: 'Trade',
    customize: 'Customize',
    'product-enquiry': 'Product Enquiry',
  };

  return typeMap[type] || titleCase(type);
}

/**
 * Format dimensions (e.g., "200x300" to "200cm × 300cm")
 */
export function formatDimensions(dimensions: string, unit = 'cm'): string {
  return dimensions.replace(/x/gi, ' × ').replace(/(\d+)/g, `$1${unit}`);
}

/**
 * Format materials list for display
 */
export function formatMaterials(materials: string[]): string {
  if (materials.length === 0) return '';
  if (materials.length === 1) return materials[0] || '';
  if (materials.length === 2) return materials.join(' and ');

  const lastItem = materials[materials.length - 1];
  return `${materials.slice(0, -1).join(', ')}, and ${lastItem || ''}`;
}

/**
 * Format URL for display (remove protocol and www)
 */
export function formatURLForDisplay(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

/**
 * Format search query for highlighting
 */
export function formatSearchHighlight(
  text: string,
  searchQuery: string,
  highlightClass = 'bg-yellow-200'
): string {
  if (!searchQuery.trim()) return text;

  const regex = new RegExp(
    `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  );
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}

/**
 * Format JSON for display with proper indentation
 */
export function formatJSON(obj: any, indent = 2): string {
  try {
    return JSON.stringify(obj, null, indent);
  } catch (error) {
    console.error('Error formatting JSON:', error);
    return String(obj);
  }
}

/**
 * Format array as a comma-separated list with proper grammar
 */
export function formatList(items: string[], conjunction = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0] || '';
  if (items.length === 2)
    return `${items[0] || ''} ${conjunction} ${items[1] || ''}`;

  const lastItem = items[items.length - 1];
  return `${items.slice(0, -1).join(', ')}, ${conjunction} ${lastItem || ''}`;
}

/**
 * Format text for SEO-friendly URLs
 */
export function formatSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Format breadcrumb path
 */
export function formatBreadcrumb(path: string): string[] {
  return path
    .split('/')
    .filter(Boolean)
    .map((segment) => titleCase(segment.replace(/-/g, ' ')));
}
