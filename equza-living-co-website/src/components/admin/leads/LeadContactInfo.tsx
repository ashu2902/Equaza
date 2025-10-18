/**
 * Lead Contact Information Component
 * 
 * Displays contact details with clickable actions
 */

'use client';

import { Mail, Phone, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface LeadContactInfoProps {
  lead: any;
}

export function LeadContactInfo({ lead }: LeadContactInfoProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const CopyButton = ({ text, field, label }: { text: string; field: string; label: string }) => (
    <Button
      size='sm'
      variant='ghost'
      onClick={() => copyToClipboard(text, field)}
      className='h-8 w-8 p-0'
      title={`Copy ${label}`}
    >
      {copiedField === field ? (
        <Check className='h-4 w-4 text-green-600' />
      ) : (
        <Copy className='h-4 w-4' />
      )}
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <User className='h-5 w-5 mr-2' />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Email */}
        {lead.email && (
          <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
            <div className='flex items-center flex-1 min-w-0'>
              <Mail className='h-4 w-4 mr-3 flex-shrink-0 text-gray-500' />
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium text-gray-900'>Email</p>
                <a
                  href={`mailto:${lead.email}`}
                  className='text-sm text-blue-600 hover:text-blue-800 truncate block'
                >
                  {lead.email}
                </a>
              </div>
            </div>
            <CopyButton text={lead.email} field='email' label='email' />
          </div>
        )}

        {/* Phone */}
        {lead.phone && (
          <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
            <div className='flex items-center flex-1 min-w-0'>
              <Phone className='h-4 w-4 mr-3 flex-shrink-0 text-gray-500' />
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium text-gray-900'>Phone</p>
                <a
                  href={`tel:${lead.phone}`}
                  className='text-sm text-blue-600 hover:text-blue-800'
                >
                  {lead.phone}
                </a>
              </div>
            </div>
            <CopyButton text={lead.phone} field='phone' label='phone' />
          </div>
        )}

        {/* Company */}
        {lead.company && (
          <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
            <div className='flex items-center flex-1 min-w-0'>
              <User className='h-4 w-4 mr-3 flex-shrink-0 text-gray-500' />
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium text-gray-900'>Company</p>
                <p className='text-sm text-gray-700 truncate'>{lead.company}</p>
              </div>
            </div>
            <CopyButton text={lead.company} field='company' label='company' />
          </div>
        )}

        {/* Source */}
        <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
          <div className='flex items-center flex-1 min-w-0'>
            <div className='h-4 w-4 mr-3 flex-shrink-0 bg-gray-300 rounded-full' />
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-medium text-gray-900'>Source</p>
              <p className='text-sm text-gray-700 capitalize'>
                {lead.source?.replace(/-/g, ' ') || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
