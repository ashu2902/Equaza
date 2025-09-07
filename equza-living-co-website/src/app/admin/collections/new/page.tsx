/**
 * Admin New Collection (Scaffold)
 */

import { Metadata } from 'next';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CollectionForm } from '@/components/admin/CollectionForm';

export const metadata: Metadata = {
  title: 'New Collection | Admin | Equza Living Co.',
  description: 'Create a new product collection',
  robots: 'noindex,nofollow',
};

export default async function AdminNewCollectionPage() {
  return (
    <AdminPageTemplate title="Create New Collection">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>New Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <CollectionForm mode="create" />
          </CardContent>
        </Card>
      </div>
    </AdminPageTemplate>
  );
}


