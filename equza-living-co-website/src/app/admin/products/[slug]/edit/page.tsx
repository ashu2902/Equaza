import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getSafeAdminProducts, getSafeCollections } from '@/lib/firebase/safe-firestore';
import { AddProductForm } from '@/components/admin/AddProductForm';
import type { Collection, CollectionImage } from '@/types';
import type { SafeCollection } from '@/types/safe';
import { Timestamp } from 'firebase/firestore';

export const metadata: Metadata = {
  title: 'Edit Product | Admin | Equza Living Co.',
  description: 'Edit product details',
  robots: 'noindex,nofollow',
};

export default async function AdminEditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const all = await getSafeAdminProducts();
  const product = all.data?.find((p: any) => p.slug === slug);
  if (!product) {
    notFound();
  }

  // Fetch collections data for form options (same as Add Product page)
  const collectionsResult = await getSafeCollections();
  const safeCollections = collectionsResult.data || [];
  const collections: Collection[] = safeCollections.map((c: SafeCollection) => ({
    ...c,
    heroImage: {
      url: c.heroImage.url,
      alt: c.heroImage.alt,
      storageRef: c.heroImage.storageRef || ''
    } as CollectionImage,
    createdAt: Timestamp.fromDate(new Date(c.createdAt)),
    updatedAt: Timestamp.fromDate(new Date(c.updatedAt)),
  }));

  return (
    <AdminPageTemplate title={`Edit Product: ${product.name}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
          </CardHeader>
          <CardContent>
            <AddProductForm 
              collections={collections}
              roomTypes={[
                'Living Room','Bedroom','Dining Room','Office','Hallway','Bathroom','Kitchen','Outdoor']}
              materials={['Wool','Cotton','Silk','Jute','Bamboo','Synthetic','Linen','Hemp']}
              styleCollections={[
                { id: 'modern', name: 'Modern', slug: 'modern' },
                { id: 'traditional', name: 'Traditional', slug: 'traditional' },
                { id: 'bohemian', name: 'Bohemian', slug: 'bohemian' },
                { id: 'minimalist', name: 'Minimalist', slug: 'minimalist' },
              ]}
              spaceCollections={[
                { id: 'living-room', name: 'Living Room', slug: 'living-room' },
                { id: 'bedroom', name: 'Bedroom', slug: 'bedroom' },
                { id: 'dining-room', name: 'Dining Room', slug: 'dining-room' },
                { id: 'office', name: 'Office', slug: 'office' },
              ]}
              mode="edit"
              initial={product}
            />
          </CardContent>
        </Card>
      </div>
    </AdminPageTemplate>
  );
}


