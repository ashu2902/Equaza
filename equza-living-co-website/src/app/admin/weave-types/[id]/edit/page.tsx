/**
 * Admin Weave Type Edit Page
 */

import { Metadata } from 'next';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { WeaveTypeForm } from '@/components/admin/WeaveTypeForm';
import { Typography } from '@/components/ui/Typography';
import { getWeaveTypeById } from '@/lib/firebase/weave-types';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const weaveType = await getWeaveTypeById(id);
  
  return {
    title: weaveType ? `Edit ${weaveType.name} | Admin` : 'Edit Weave Type | Admin',
  };
}

export default async function AdminEditWeaveTypePage({ params }: Props) {
  const { id } = await params;
  const weaveType = await getWeaveTypeById(id);

  if (!weaveType) {
    notFound();
  }

  return (
    <AdminPageTemplate title={`Edit Weave Type: ${weaveType.name}`}>
      <div className="max-w-3xl mx-auto">
        <Typography variant="h3" className="mb-6">
          Weave Type Details
        </Typography>
        <WeaveTypeForm mode="edit" initial={weaveType} />
      </div>
    </AdminPageTemplate>
  );
}