import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getSafeAdminProducts, getSafeCollections } from '@/lib/firebase/safe-firestore';
import { AddProductForm } from '@/components/admin/AddProductForm';
import type { Collection } from '@/types';
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
  const collections = safeCollections.map((c: SafeCollection) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    type: c.type,
  } as Pick<Collection, 'id' | 'name' | 'slug' | 'type'>));

  // Separate style and space collections
  const styleCollections = collections.filter(c => c.type === 'style');
  const spaceCollections = collections.filter(c => c.type === 'space');
  
  // Materials now entered as free text in the form

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
              styleCollections={styleCollections}
              spaceCollections={spaceCollections}
              mode="edit"
              initial={product}
            />
          </CardContent>
        </Card>
      </div>
    </AdminPageTemplate>
  );
}


