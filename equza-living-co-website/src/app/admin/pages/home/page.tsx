/**
 * Admin Home Page Editor (Scaffold)
 * Minimal placeholder to begin Phase 1 implementation
 */

import { Metadata } from 'next';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'Edit Homepage | Admin | Equza Living Co.',
  description: 'Edit homepage content',
  robots: 'noindex,nofollow',
};

export default async function AdminHomeEditorPage() {
  return (
    <AdminPageTemplate title="Homepage Editor">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="body" className="text-gray-600">
              The homepage editor UI will be implemented here as per the approved design.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </AdminPageTemplate>
  );
}


