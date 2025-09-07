/**
 * Admin Content Page Editor (Scaffold)
 * Placeholder for `our-story`, `craftsmanship`, `trade`
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: 'Edit Page | Admin | Equza Living Co.',
  description: 'Edit content page',
  robots: 'noindex,nofollow',
};

export default async function AdminContentEditorPage({ params }: { params: { type: string } }) {
  const allowed = ['our-story', 'craftsmanship', 'trade'];
  if (!allowed.includes(params.type)) {
    notFound();
  }

  return (
    <AdminPageTemplate title={`Edit: ${params.type}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="body" className="text-gray-600">
              The {params.type} editor UI will be implemented here as per the approved design.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </AdminPageTemplate>
  );
}


