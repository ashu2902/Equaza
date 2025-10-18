/**
 * Lead Type Badge Component
 * 
 * Reusable component for displaying lead type with appropriate colors and icons
 */

import {
  MessageSquare,
  Tag,
  Eye,
  ArrowUpRight,
} from 'lucide-react';

interface LeadTypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LeadTypeBadge({ type, size = 'md' }: LeadTypeBadgeProps) {
  const typeConfig = {
    contact: {
      color: 'bg-blue-100 text-blue-800',
      label: 'Contact',
      icon: MessageSquare,
    },
    customize: {
      color: 'bg-purple-100 text-purple-800',
      label: 'Custom Rug',
      icon: Tag,
    },
    'product-enquiry': {
      color: 'bg-green-100 text-green-800',
      label: 'Product Enquiry',
      icon: Eye,
    },
    trade: {
      color: 'bg-orange-100 text-orange-800',
      label: 'Trade Partnership',
      icon: ArrowUpRight,
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig['contact'];
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.color} ${sizeClasses[size]}`}
    >
      <IconComponent className={`${iconSizes[size]} mr-1`} />
      {config.label}
    </span>
  );
}
