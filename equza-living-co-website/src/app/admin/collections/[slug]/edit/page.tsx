/**
 * Admin Edit Collection (Scaffold)
 * Reads slug and will render an edit form (to be wired)
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CollectionForm } from '@/components/admin/CollectionForm';
import { getSafeAdminCollections } from '@/lib/firebase/safe-firestore';

export const metadata: Metadata = {
  title: 'Edit Collection | Admin | Equza Living Co.',
  description: 'Edit product collection',
  robots: 'noindex,nofollow',
};

export default async function AdminEditCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  // Fetch the specific collection by slug for admin (without active filter)
  const all = await getSafeAdminCollections();
  const collection = all.data?.find((c: any) => c.slug === slug);
  if (!collection) {
    notFound();
  }

  return (
    <AdminPageTemplate title={`Edit Collection: ${slug}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <CollectionForm mode="edit" initial={{
              id: collection.id,
              name: collection.name,
              slug: collection.slug,
              description: collection.description,
              type: collection.type,
              heroImage: { 
                url: collection.heroImage?.url || '', 
                alt: collection.heroImage?.alt || '',
                storageRef: collection.heroImage?.storageRef || ''
              },
              isActive: collection.isActive !== false,
            }} />
          </CardContent>
        </Card>
      </div>
    </AdminPageTemplate>
  );
}


