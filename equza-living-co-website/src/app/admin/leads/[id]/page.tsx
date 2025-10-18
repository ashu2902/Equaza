/**
 * Admin Lead Details Page
 *
 * Detailed view for individual lead management
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Copy, Edit, Trash2 } from 'lucide-react';

// Components
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FadeIn } from '@/components/ui/MotionWrapper';

// Lead Components
import {
  LeadHeader,
  LeadContactInfo,
  LeadDetails,
  LeadStatusManager,
  LeadNotesSection,
  LeadQuickActions,
} from '@/components/admin/leads';

// Firebase
import { getSafeLeadById } from '@/lib/firebase/safe-firestore';
import { verifyServerAdminAuth } from '@/lib/firebase/auth';
import { isDataResult } from '@/types/safe';

export const metadata: Metadata = {
  title: 'Lead Details | Admin | Equza Living Co.',
  description: 'View and manage lead details for Equza Living Co.',
  robots: 'noindex,nofollow',
};

interface LeadDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Get Lead Data
 */
async function getLeadData(leadId: string) {
  try {
    // Check admin authentication
    const auth = await verifyServerAdminAuth();
    if (!auth.isAdmin) {
      notFound();
    }

    const result = await getSafeLeadById(leadId);
    
    if (!isDataResult(result) || !result.data) {
      notFound();
    }

    return { lead: result.data, error: null };
  } catch (error) {
    console.error('Lead details fetch error:', error);
    return {
      lead: null,
      error: 'Failed to load lead details',
    };
  }
}

/**
 * Admin Lead Details Page
 */
export default async function AdminLeadDetailsPage({ params }: LeadDetailsPageProps) {
  const { id } = await params;
  const { lead, error } = await getLeadData(id);

  if (error || !lead) {
    return (
      <AdminPageTemplate title='Lead Details'>
        <div className='space-y-8'>
          <FadeIn>
            <Card className='border-red-200 bg-red-50'>
              <CardContent className='p-6'>
                <div className='flex items-center text-red-700'>
                  <div className='flex-shrink-0 mr-3'>
                    <svg
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm font-medium'>{error || 'Lead not found'}</p>
                    <p className='text-sm mt-1'>
                      The lead you're looking for doesn't exist or you don't have permission to view it.
                    </p>
                  </div>
                </div>
                <div className='mt-4'>
                  <Button asChild variant='outline'>
                    <Link href='/admin/leads'>
                      <ArrowLeft className='h-4 w-4 mr-2' />
                      Back to Leads
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </AdminPageTemplate>
    );
  }

  return (
    <AdminPageTemplate title='Lead Details'>
      <div className='space-y-6'>
        {/* Header with Back Button */}
        <FadeIn>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Button asChild variant='outline' size='sm'>
                <Link href='/admin/leads'>
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Back to Leads
                </Link>
              </Button>
              <div>
                <Typography variant='h3' className='text-gray-900'>
                  Lead Details
                </Typography>
                <p className='text-sm text-gray-600 mt-1'>
                  Lead ID: {lead.id}
                </p>
              </div>
            </div>
            <LeadQuickActions lead={lead} />
          </div>
        </FadeIn>

        {/* Lead Header */}
        <FadeIn delay={0.1}>
          <LeadHeader lead={lead} />
        </FadeIn>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Lead Information */}
          <div className='lg:col-span-2 space-y-6'>
            <FadeIn delay={0.2}>
              <LeadContactInfo lead={lead} />
            </FadeIn>

            <FadeIn delay={0.3}>
              <LeadDetails lead={lead} />
            </FadeIn>
          </div>

          {/* Right Column - Management Tools */}
          <div className='space-y-6'>
            <FadeIn delay={0.4}>
              <LeadStatusManager lead={lead} />
            </FadeIn>

            <FadeIn delay={0.5}>
              <LeadNotesSection lead={lead} />
            </FadeIn>
          </div>
        </div>
      </div>
    </AdminPageTemplate>
  );
}
