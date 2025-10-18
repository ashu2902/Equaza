/**
 * Lead Status Badge Component
 * 
 * Reusable component for displaying lead status with appropriate colors
 */

interface LeadStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LeadStatusBadge({ status, size = 'md' }: LeadStatusBadgeProps) {
  const statusConfig = {
    new: { 
      color: 'bg-blue-100 text-blue-800', 
      label: 'New' 
    },
    contacted: { 
      color: 'bg-yellow-100 text-yellow-800', 
      label: 'Contacted' 
    },
    qualified: { 
      color: 'bg-green-100 text-green-800', 
      label: 'Qualified' 
    },
    converted: { 
      color: 'bg-emerald-100 text-emerald-800', 
      label: 'Converted' 
    },
    closed: { 
      color: 'bg-gray-100 text-gray-800', 
      label: 'Closed' 
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['new'];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.color} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
}
