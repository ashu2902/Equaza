/**
 * Delete Confirmation Dialog
 * Reusable component for confirming delete operations
 */

'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  itemName: string;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Delete confirmation error:', error);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50' onClick={onClose} />

      {/* Dialog */}
      <div className='relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        <div className='p-6'>
          {/* Icon */}
          <div className='flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full'>
            <AlertTriangle className='w-6 h-6 text-red-600' />
          </div>

          {/* Content */}
          <div className='text-center mb-6'>
            <Typography
              variant='h3'
              className='text-lg font-semibold text-gray-900 mb-2'
            >
              {title}
            </Typography>
            <Typography variant='body' className='text-gray-600'>
              {description}
            </Typography>
            <div className='mt-3 p-3 bg-gray-50 rounded-md'>
              <Typography variant='body' className='font-medium text-gray-900'>
                "{itemName}"
              </Typography>
            </div>
          </div>

          {/* Actions */}
          <div className='flex space-x-3'>
            <Button
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className='flex-1 bg-red-600 hover:bg-red-700 text-white'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
