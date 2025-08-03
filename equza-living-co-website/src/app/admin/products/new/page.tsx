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
import { COLLECTIONS } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: 'Add Product | Admin | Equza Living Co.',
  description: 'Add a new product to the catalog',
  robots: 'noindex,nofollow',
};

/**
 * Get form data for the Add Product page
 */
async function getFormData() {
  try {
    // Get collections from database
    const collectionsResult = await getSafeCollections();
    const collections = collectionsResult.data || [];
    
    // Available room types from constants and existing data
    const roomTypes = [
      'Living Room',
      'Bedroom', 
      'Dining Room',
      'Office',
      'Hallway',
      'Bathroom',
      'Kitchen',
      'Outdoor'
    ];

    // Available materials for rugs
    const materials = [
      'Wool',
      'Cotton',
      'Silk',
      'Jute',
      'Bamboo',
      'Synthetic',
      'Linen',
      'Hemp'
    ];

    return {
      collections,
      roomTypes,
      materials,
      styleCollections: COLLECTIONS.styles,
      spaceCollections: COLLECTIONS.spaces,
    };
  } catch (error) {
    console.error('Error loading form data:', error);
    return {
      collections: [],
      roomTypes: [],
      materials: [],
      styleCollections: COLLECTIONS.styles,
      spaceCollections: COLLECTIONS.spaces,
    };
  }
}

export default async function AddProductPage() {
  const formData = await getFormData();

  return (
    <AdminPageTemplate title="Add Product">
      <AddProductForm {...formData} />
    </AdminPageTemplate>
  );
}