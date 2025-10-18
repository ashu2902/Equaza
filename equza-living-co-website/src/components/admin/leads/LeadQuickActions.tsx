/**
 * Lead Quick Actions Component
 * 
 * Provides quick action buttons for lead management
 */

'use client';

import { useState, useTransition } from 'react';
import { Mail, Phone, Edit, Trash2, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { updateAdminLead, deleteAdminLead } from '@/lib/actions/admin/leads';
import { useRouter } from 'next/navigation';

interface LeadQuickActionsProps {
  lead: any;
}

export function LeadQuickActions({ lead }: LeadQuickActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const copyLeadInfo = async () => {
    const leadInfo = `Lead: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || 'N/A'}
Company: ${lead.company || 'N/A'}
Type: ${lead.type}
Status: ${lead.status}
Message: ${lead.message || 'N/A'}
Created: ${new Date(lead.createdAt).toLocaleDateString()}`;

    try {
      await navigator.clipboard.writeText(leadInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy lead info:', error);
    }
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteAdminLead(lead.id);
        
        if (result.success) {
          // Redirect to leads list after successful deletion
          router.push('/admin/leads');
        } else {
          alert(`Failed to delete lead: ${result.message}`);
        }
      } catch (error) {
        alert('Failed to delete lead. Please try again.');
      }
    });
  };

  return (
    <div className='flex items-center space-x-2'>
      {/* Email Action */}
      {lead.email && (
        <Button
          size='sm'
          variant='outline'
          asChild
          title='Send Email'
        >
          <a href={`mailto:${lead.email}?subject=Re: Your inquiry from Equza Living Co.`}>
            <Mail className='h-4 w-4' />
          </a>
        </Button>
      )}

      {/* Phone Action */}
      {lead.phone && (
        <Button
          size='sm'
          variant='outline'
          asChild
          title='Call'
        >
          <a href={`tel:${lead.phone}`}>
            <Phone className='h-4 w-4' />
          </a>
        </Button>
      )}

      {/* Copy Lead Info */}
      <Button
        size='sm'
        variant='outline'
        onClick={copyLeadInfo}
        title='Copy Lead Information'
      >
        {copied ? (
          <Check className='h-4 w-4 text-green-600' />
        ) : (
          <Copy className='h-4 w-4' />
        )}
      </Button>

      {/* Edit Action */}
      <Button
        size='sm'
        variant='outline'
        title='Edit Lead'
        onClick={() => {
          // TODO: Implement edit modal or redirect to edit page
          alert('Edit functionality coming soon!');
        }}
      >
        <Edit className='h-4 w-4' />
      </Button>

      {/* Delete Action */}
      <Button
        size='sm'
        variant='outline'
        onClick={() => setShowDeleteConfirm(true)}
        disabled={isPending}
        className='text-red-600 hover:text-red-700 hover:bg-red-50'
        title='Delete Lead'
      >
        {isPending ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <Trash2 className='h-4 w-4' />
        )}
      </Button>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Delete Lead
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className='flex space-x-3'>
              <Button
                onClick={handleDelete}
                disabled={isPending}
                className='bg-red-600 hover:bg-red-700'
              >
                {isPending ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : null}
                Delete
              </Button>
              <Button
                variant='outline'
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
