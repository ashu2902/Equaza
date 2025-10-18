/**
 * Lead Header Component
 * 
 * Displays lead name, type, status, priority, and timestamps
 */

import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadTypeBadge } from './LeadTypeBadge';

interface LeadHeaderProps {
  lead: any;
}

export function LeadHeader({ lead }: LeadHeaderProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex-1 min-w-0'>
            {/* Lead Name and Badges */}
            <div className='flex items-center gap-3 mb-3'>
              <h1 className='text-2xl font-bold text-gray-900 truncate'>
                {lead.name || 'Unknown Contact'}
              </h1>
              {lead.priority && (
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                  <AlertTriangle className='h-3 w-3 mr-1' />
                  High Priority
                </span>
              )}
            </div>

            {/* Type and Status Badges */}
            <div className='flex items-center gap-2 mb-4'>
              <LeadTypeBadge type={lead.type || 'contact'} />
              <LeadStatusBadge status={lead.status || 'new'} />
            </div>

            {/* Timestamps */}
            <div className='flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600'>
              <div className='flex items-center'>
                <Calendar className='h-4 w-4 mr-2 flex-shrink-0' />
                <span>Created: {formatDate(lead.createdAt)}</span>
              </div>
              <div className='flex items-center'>
                <Clock className='h-4 w-4 mr-2 flex-shrink-0' />
                <span>Updated: {formatDate(lead.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
