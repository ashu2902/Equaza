/**
 * Lead Status Manager Component
 * 
 * Handles status updates with confirmation dialog
 */

'use client';

import { useState, useTransition } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeadStatusBadge } from './LeadStatusBadge';
import { updateAdminLeadStatus } from '@/lib/actions/admin/leads';
import { useRouter } from 'next/navigation';

interface LeadStatusManagerProps {
  lead: any;
}

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'qualified', label: 'Qualified', color: 'bg-green-100 text-green-800' },
  { value: 'converted', label: 'Converted', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800' },
];

export function LeadStatusManager({ lead }: LeadStatusManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === lead.status) return;
    
    setSelectedStatus(newStatus);
    setShowConfirm(true);
  };

  const confirmStatusChange = () => {
    if (!selectedStatus) return;

    startTransition(async () => {
      try {
        const result = await updateAdminLeadStatus(lead.id, selectedStatus as any);
        
        if (result.success) {
          setMessage({ type: 'success', text: result.message });
          setShowConfirm(false);
          setSelectedStatus(null);
          // Refresh the page to show updated data
          router.refresh();
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } catch (error) {
        setMessage({ 
          type: 'error', 
          text: 'Failed to update status. Please try again.' 
        });
      }
    });
  };

  const cancelStatusChange = () => {
    setShowConfirm(false);
    setSelectedStatus(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <CheckCircle className='h-5 w-5 mr-2' />
          Status Management
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Current Status */}
        <div>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>Current Status</h4>
          <LeadStatusBadge status={lead.status || 'new'} size='lg' />
        </div>

        {/* Status Options */}
        <div>
          <h4 className='text-sm font-medium text-gray-900 mb-3'>Change Status</h4>
          <div className='space-y-2'>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={isPending || option.value === lead.status}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  option.value === lead.status
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-900'>
                    {option.label}
                  </span>
                  {option.value === lead.status && (
                    <CheckCircle className='h-4 w-4 text-green-600' />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && selectedStatus && (
          <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
            <div className='flex items-start'>
              <AlertCircle className='h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0' />
              <div className='flex-1'>
                <h4 className='text-sm font-medium text-yellow-800 mb-1'>
                  Confirm Status Change
                </h4>
                <p className='text-sm text-yellow-700 mb-3'>
                  Are you sure you want to change the status from{' '}
                  <span className='font-medium'>{lead.status}</span> to{' '}
                  <span className='font-medium'>{selectedStatus}</span>?
                </p>
                <div className='flex space-x-2'>
                  <Button
                    size='sm'
                    onClick={confirmStatusChange}
                    disabled={isPending}
                    className='bg-yellow-600 hover:bg-yellow-700'
                  >
                    {isPending ? (
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    ) : null}
                    Confirm
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={cancelStatusChange}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success/Error Message */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className='flex items-center'>
              {message.type === 'success' ? (
                <CheckCircle className='h-4 w-4 text-green-600 mr-2' />
              ) : (
                <AlertCircle className='h-4 w-4 text-red-600 mr-2' />
              )}
              <p className={`text-sm ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
