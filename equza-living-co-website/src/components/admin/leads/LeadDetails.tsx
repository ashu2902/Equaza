/**
 * Lead Details Component
 * 
 * Displays lead message and related information
 */

import { MessageSquare, Package, Folder } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface LeadDetailsProps {
  lead: any;
}

export function LeadDetails({ lead }: LeadDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <MessageSquare className='h-5 w-5 mr-2' />
          Lead Details
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Message */}
        {lead.message && (
          <div>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>Message</h4>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-700 whitespace-pre-wrap'>
                {lead.message}
              </p>
            </div>
          </div>
        )}

        {/* Product Reference */}
        {lead.productId && (
          <div>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>Related Product</h4>
            <div className='flex items-center p-3 bg-blue-50 rounded-lg'>
              <Package className='h-4 w-4 mr-3 text-blue-600' />
              <div>
                <p className='text-sm font-medium text-blue-900'>
                  Product ID: {lead.productId}
                </p>
                {lead.productRef && (
                  <p className='text-sm text-blue-700'>{lead.productRef}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Collection Reference */}
        {lead.collectionId && (
          <div>
            <h4 className='text-sm font-medium text-gray-900 mb-2'>Related Collection</h4>
            <div className='flex items-center p-3 bg-green-50 rounded-lg'>
              <Folder className='h-4 w-4 mr-3 text-green-600' />
              <div>
                <p className='text-sm font-medium text-green-900'>
                  Collection ID: {lead.collectionId}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Response Time */}
        <div>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>Response Tracking</h4>
          <div className='p-3 bg-gray-50 rounded-lg'>
            <p className='text-sm text-gray-700'>
              <span className='font-medium'>Response Time:</span>{' '}
              {lead.responseTime || 'No response yet'}
            </p>
            {lead.lastContactedAt && (
              <p className='text-sm text-gray-700 mt-1'>
                <span className='font-medium'>Last Contacted:</span>{' '}
                {new Date(lead.lastContactedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>

        {/* No message fallback */}
        {!lead.message && !lead.productId && !lead.collectionId && (
          <div className='text-center py-8 text-gray-500'>
            <MessageSquare className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <p className='text-sm'>No additional details available for this lead.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
