/**
 * Admin Collections Management Page
 *
 * CRUD interface for managing product collections
 * Following UI_UX_Development_Guide.md brand guidelines
 */

'use client';

// Metadata import removed - not needed for client components
import React, { Suspense, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Grid3X3,
  Image as ImageIcon,
  Calendar,
  Package,
} from 'lucide-react';

// Components
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';

// Firebase - using API routes instead of direct imports

// Actions
import { deleteAdminCollection } from '@/lib/actions/admin/collections';

// Metadata removed - not needed for client components

/**
 * Get Collections Data
 */
async function getCollectionsData() {
  try {
    const response = await fetch('/api/admin/collections');
    const result = await response.json();

    if (result.success) {
      return {
        styleCollections: result.data.style || [],
        spaceCollections: result.data.space || [],
        error: null,
      };
    } else {
      return {
        styleCollections: [],
        spaceCollections: [],
        error: 'Failed to fetch collections',
      };
    }
  } catch (error) {
    console.error('Collections data fetch error:', error);
    return {
      styleCollections: [],
      spaceCollections: [],
      error: 'Failed to load collections',
    };
  }
}

/**
 * Collection Card Component
 */
function CollectionCard({
  collection,
  type,
  onDelete,
}: {
  collection: any;
  type: 'style' | 'space';
  onDelete: (collection: any) => void;
}) {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <div className='aspect-video relative overflow-hidden rounded-t-lg'>
        {collection?.heroImage?.url ? (
          <img
            src={collection.heroImage.url}
            alt={collection?.heroImage?.alt || collection.name}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
            <ImageIcon className='h-12 w-12 text-gray-400' />
          </div>
        )}
        <div className='absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity'>
          <div className='absolute top-2 right-2 flex space-x-1'>
            <Button size='sm' variant='outline' className='bg-white/90' asChild>
              <Link href={`/collections/${collection.slug}`}>
                <Eye className='h-3 w-3' />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <CardContent className='p-4'>
        <div className='flex items-start justify-between mb-3'>
          <div>
            <h3 className='font-semibold text-gray-900 mb-1'>
              {collection.name}
            </h3>
            <p className='text-sm text-gray-600 capitalize'>
              {type} Collection
            </p>
          </div>
          <div className='flex items-center space-x-1'>
            <Button size='sm' variant='outline' asChild>
              <Link href={`/admin/collections/${collection.slug}/edit`}>
                <Edit3 className='h-3 w-3' />
              </Link>
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='text-red-600 hover:text-red-700 hover:bg-red-50'
              onClick={() => onDelete(collection)}
            >
              <Trash2 className='h-3 w-3' />
            </Button>
          </div>
        </div>

        <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
          {collection.description}
        </p>

        <div className='flex items-center justify-between text-xs text-gray-500'>
          <div className='flex items-center'>
            <Package className='h-3 w-3 mr-1' />
            {collection.productIds?.length || 0} products
          </div>
          <div className='flex items-center'>
            <Calendar className='h-3 w-3 mr-1' />
            {collection.updatedAt
              ? new Date(collection.updatedAt).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Collections List Component
 */
function CollectionsList({
  collections,
  type,
  title,
  onDelete,
}: {
  collections: any[];
  type: 'style' | 'space';
  title: string;
  onDelete: (collection: any) => void;
}) {
  if (collections.length === 0) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <Grid3X3 className='h-12 w-12 text-gray-400 mx-auto mb-4' />
          <Typography variant='h4' className='text-gray-600 mb-2'>
            No {title} Yet
          </Typography>
          <p className='text-gray-500 mb-6'>
            Create your first {type} collection to get started
          </p>
          <Button asChild>
            <Link href={`/admin/collections/new?type=${type}`}>
              <Plus className='h-4 w-4 mr-2' />
              Create {title.slice(0, -1)}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid cols={3} gap='lg'>
      {collections.map((collection, index) => (
        <SlideUp key={collection.id} delay={index * 0.1}>
          <CollectionCard
            collection={collection}
            type={type}
            onDelete={onDelete}
          />
        </SlideUp>
      ))}
    </Grid>
  );
}

/**
 * Admin Collections Page
 */
export default function AdminCollectionsPage() {
  const [styleCollections, setStyleCollections] = useState<any[]>([]);
  const [spaceCollections, setSpaceCollections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    collection: any | null;
  }>({ isOpen: false, collection: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Load collections data
  React.useEffect(() => {
    async function loadCollections() {
      try {
        const data = await getCollectionsData();
        if (data.error) {
          setError(data.error);
        } else {
          setStyleCollections(data.styleCollections || []);
          setSpaceCollections(data.spaceCollections || []);
        }
      } catch (err) {
        setError('Failed to load collections');
        console.error('Error loading collections:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCollections();
  }, []);

  // Handle delete collection
  const handleDeleteCollection = (collection: any) => {
    console.log('Delete button clicked for collection:', collection);
    setDeleteDialog({ isOpen: true, collection });
  };

  const confirmDeleteCollection = async () => {
    if (!deleteDialog.collection) return;

    console.log('Attempting to delete collection:', {
      collection: deleteDialog.collection,
      collectionId: deleteDialog.collection.id,
      collectionSlug: deleteDialog.collection.slug,
    });

    startTransition(async () => {
      try {
        const result = await deleteAdminCollection(deleteDialog.collection.id);

        console.log('Delete result:', result);

        if (result.success) {
          // Remove from local state
          // Check both the collection type and which list it's in
          const isInStyleCollections = styleCollections.some(
            (c) => c.id === deleteDialog.collection.id
          );
          const isInSpaceCollections = spaceCollections.some(
            (c) => c.id === deleteDialog.collection.id
          );

          if (isInStyleCollections) {
            setStyleCollections((prev) =>
              prev.filter((c) => c.id !== deleteDialog.collection.id)
            );
          }
          if (isInSpaceCollections) {
            setSpaceCollections((prev) =>
              prev.filter((c) => c.id !== deleteDialog.collection.id)
            );
          }

          // Close dialog
          setDeleteDialog({ isOpen: false, collection: null });

          // Refresh the page to ensure data consistency
          router.refresh();
        } else {
          console.error('Delete failed:', result.message);
          alert(`Delete failed: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting collection:', error);
        alert(
          `Error deleting collection: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, collection: null });
  };

  if (isLoading) {
    return (
      <AdminPageTemplate title='Collections Management'>
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading collections...</p>
          </div>
        </div>
      </AdminPageTemplate>
    );
  }

  if (error) {
    return (
      <AdminPageTemplate title='Collections Management'>
        <div className='text-center py-12'>
          <p className='text-red-600 mb-4'>{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </AdminPageTemplate>
    );
  }

  return (
    <AdminPageTemplate title='Collections Management'>
      <div className='space-y-8'>
        {/* Header Actions */}
        <FadeIn>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <Typography variant='h3' className='text-gray-900 mb-2'>
                Collections
              </Typography>
              <p className='text-gray-600'>
                Manage your product collections and organize your catalog
              </p>
            </div>
            <div className='flex items-center space-x-3'>
              <Button variant='outline' asChild>
                <Link href='/admin/collections/bulk'>
                  <Grid3X3 className='h-4 w-4 mr-2' />
                  Bulk Actions
                </Link>
              </Button>
              <Button asChild>
                <Link href='/admin/collections/new'>
                  <Plus className='h-4 w-4 mr-2' />
                  New Collection
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Search and Filters */}
        <FadeIn delay={0.1}>
          <Card>
            <CardContent className='p-4'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <Input
                      placeholder='Search collections...'
                      className='pl-10'
                    />
                  </div>
                </div>
                <Button variant='outline'>
                  <Filter className='h-4 w-4 mr-2' />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Error State */}
        {error && (
          <Card className='border-red-200 bg-red-50'>
            <CardContent className='p-4'>
              <div className='flex items-center text-red-700'>
                <div className='flex-shrink-0 mr-3'>
                  <svg
                    className='h-5 w-5'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <p className='text-sm'>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Style Collections */}
        <div>
          <div className='flex items-center justify-between mb-6'>
            <Typography variant='h4' className='text-gray-900'>
              Style Collections
            </Typography>
            <Button variant='outline' size='sm' asChild>
              <Link href='/admin/collections/new?type=style'>
                <Plus className='h-4 w-4 mr-2' />
                Add Style Collection
              </Link>
            </Button>
          </div>
          <Suspense fallback={<div>Loading style collections...</div>}>
            <CollectionsList
              collections={styleCollections}
              type='style'
              title='Style Collections'
              onDelete={handleDeleteCollection}
            />
          </Suspense>
        </div>

        {/* Space Collections */}
        <div>
          <div className='flex items-center justify-between mb-6'>
            <Typography variant='h4' className='text-gray-900'>
              Space Collections
            </Typography>
            <Button variant='outline' size='sm' asChild>
              <Link href='/admin/collections/new?type=space'>
                <Plus className='h-4 w-4 mr-2' />
                Add Space Collection
              </Link>
            </Button>
          </div>
          <Suspense fallback={<div>Loading space collections...</div>}>
            <CollectionsList
              collections={spaceCollections}
              type='space'
              title='Space Collections'
              onDelete={handleDeleteCollection}
            />
          </Suspense>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteCollection}
        title='Delete Collection'
        description='Are you sure you want to delete this collection? This action cannot be undone.'
        itemName={deleteDialog.collection?.name || ''}
        isLoading={isPending}
      />
    </AdminPageTemplate>
  );
}
