/**
 * Admin Add Product Page
 *
 * Complete form for creating new products with validation, file upload, and server actions
 * Following UI_UX_Development_Guide.md brand guidelines
 */

import { Metadata } from 'next';

// Components
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { AddProductForm } from '@/components/admin/AddProductForm';

// Data
import { getSafeCollections } from '@/lib/firebase/safe-firestore';
import { Timestamp } from 'firebase/firestore';

// Types
import type { Collection } from '@/types';
import type { SafeCollection } from '@/types/safe';

export const metadata: Metadata = {
  title: 'Add Product | Admin | Equza Living Co.',
  description: 'Add a new product to the catalog',
  robots: 'noindex,nofollow',
};

/**
 * Convert SafeCollection to Collection
 */
function toPlainClientCollection(safeCollection: SafeCollection) {
  // Only pass serializable fields used by the client form
  return {
    id: safeCollection.id,
    name: safeCollection.name,
    slug: safeCollection.slug,
    type: safeCollection.type,
  } as Pick<Collection, 'id' | 'name' | 'slug' | 'type'>;
}

/**
 * Get form data for the Add Product page
 */
async function getFormData() {
  try {
    // Get collections from database
    const collectionsResult = await getSafeCollections();
    const safeCollections = collectionsResult.data || [];

    // Convert to minimal, serializable client shape
    const collections = safeCollections.map(toPlainClientCollection);

    // Separate style and space collections
    const styleCollections = collections.filter((c) => c.type === 'style');
    const spaceCollections = collections.filter((c) => c.type === 'space');

    return {
      collections,
      styleCollections,
      spaceCollections,
    };
  } catch (error) {
    console.error('Error loading form data:', error);
    return {
      collections: [] as Collection[],
      styleCollections: [],
      spaceCollections: [],
    };
  }
}

export default async function AddProductPage() {
  const formData = await getFormData();

  return (
    <AdminPageTemplate title='Add Product'>
      <AddProductForm {...formData} />
    </AdminPageTemplate>
  );
}
