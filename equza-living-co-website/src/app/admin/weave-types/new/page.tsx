/**
 * Admin Weave Type Create Page
 */

import { Metadata } from 'next';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { WeaveTypeForm } from '@/components/admin/WeaveTypeForm';
import { Typography } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'New Weave Type | Admin',
};

export default function AdminNewWeaveTypePage() {
  return (
    <AdminPageTemplate title="Create New Weave Type">
      <div className="max-w-3xl mx-auto">
        <Typography variant="h3" className="mb-6">
          Weave Type Details
        </Typography>
        <WeaveTypeForm mode="create" />
      </div>
    </AdminPageTemplate>
  );
}