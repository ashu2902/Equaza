/**
 * Admin Weave Types Management Page
 * 
 * CRUD interface for managing weave types
 */

'use client';

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
  Image as ImageIcon,
  Calendar,
  MoveHorizontal, // Using MoveHorizontal for weave types
} from 'lucide-react';

// Components
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';

// Firebase
import { getSafeWeaveTypes } from '@/lib/firebase/safe-firestore';
import { isDataResult, SafeWeaveType } from '@/types/safe';

// Actions
import { deleteAdminWeaveType } from '@/lib/actions/admin/weave-types';

/**
 * Get Weave Types Data
 */
async function getWeaveTypesData() {
  try {
    const result = await getSafeWeaveTypes();
    
    return {
      weaveTypes: isDataResult(result) ? result.data : [],
      error: result.error
    };
  } catch (error) {
    console.error('Weave Types data fetch error:', error);
    return {
      weaveTypes: [],
      error: 'Failed to load weave types'
    };
  }
}

/**
 * Weave Type Card Component
 */
function WeaveTypeCard({ 
  weaveType, 
  onDelete 
}: { 
  weaveType: SafeWeaveType; 
  onDelete: (weaveType: SafeWeaveType) => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        {weaveType?.image?.url ? (
          <img
            src={weaveType.image.url}
            alt={weaveType?.image?.alt || weaveType.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button size="sm" variant="outline" className="bg-white/90" asChild>
              <Link href={`/collections?weave=${weaveType.slug}`}>
                <Eye className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {weaveType.name}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              Sort Order: {weaveType.sortOrder}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/weave-types/${weaveType.id}/edit`}>
                <Edit3 className="h-3 w-3" />
              </Link>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(weaveType)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <MoveHorizontal className="h-3 w-3 mr-1" />
            {weaveType.isActive ? 'Active' : 'Inactive'}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {weaveType.updatedAt ? new Date(weaveType.updatedAt).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Weave Types List Component
 */
function WeaveTypesList({ 
  weaveTypes, 
  onDelete
}: { 
  weaveTypes: SafeWeaveType[]; 
  onDelete: (weaveType: SafeWeaveType) => void;
}) {
  if (weaveTypes.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MoveHorizontal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Typography variant="h4" className="text-gray-600 mb-2">
            No Weave Types Yet
          </Typography>
          <p className="text-gray-500 mb-6">
            Create your first weave type entry to manage dedicated images
          </p>
          <Button asChild>
            <Link href={`/admin/weave-types/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Create Weave Type
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid cols={4} gap="lg">
      {weaveTypes.map((weaveType, index) => (
        <SlideUp key={weaveType.id} delay={index * 0.1}>
          <WeaveTypeCard weaveType={weaveType} onDelete={onDelete} />
        </SlideUp>
      ))}
    </Grid>
  );
}

/**
 * Admin Weave Types Page
 */
export default function AdminWeaveTypesPage() {
  const [weaveTypes, setWeaveTypes] = useState<SafeWeaveType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    weaveType: SafeWeaveType | null;
  }>({ isOpen: false, weaveType: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Load weave types data
  React.useEffect(() => {
    async function loadWeaveTypes() {
      try {
        const data = await getWeaveTypesData();
        if (data.error) {
          setError(data.error);
        } else {
          setWeaveTypes(data.weaveTypes || []);
        }
      } catch (err) {
        setError('Failed to load weave types');
        console.error('Error loading weave types:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWeaveTypes();
  }, []);

  // Handle delete weave type
  const handleDeleteWeaveType = (weaveType: SafeWeaveType) => {
    setDeleteDialog({ isOpen: true, weaveType });
  };

  const confirmDeleteWeaveType = async () => {
    if (!deleteDialog.weaveType) return;

    startTransition(async () => {
      try {
        const result = await deleteAdminWeaveType(deleteDialog.weaveType!.id);
        
        if (result.success) {
          // Remove from local state
          setWeaveTypes(prev => 
            prev.filter(wt => wt.id !== deleteDialog.weaveType!.id)
          );
          
          // Close dialog
          setDeleteDialog({ isOpen: false, weaveType: null });
          
          // Refresh the page to ensure data consistency
          router.refresh();
        } else {
          console.error('Delete failed:', result.message);
          alert(`Delete failed: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting weave type:', error);
        alert(`Error deleting weave type: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, weaveType: null });
  };

  if (isLoading) {
    return (
      <AdminPageTemplate title="Weave Types Management">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weave types...</p>
          </div>
        </div>
      </AdminPageTemplate>
    );
  }

  return (
    <AdminPageTemplate title="Weave Types Management">
      <div className="space-y-8">
        {/* Header Actions */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Typography variant="h3" className="text-gray-900 mb-2">
                Weave Types
              </Typography>
              <p className="text-gray-600">
                Manage dedicated images and metadata for each weave type
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild>
                <Link href="/admin/weave-types/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Weave Type
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Search and Filters */}
        <FadeIn delay={0.1}>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search weave types..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center text-red-700">
                <div className="flex-shrink-0 mr-3">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">
                  {error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weave Types List */}
        <Suspense fallback={<div>Loading weave types...</div>}>
          <WeaveTypesList 
            weaveTypes={weaveTypes} 
            onDelete={handleDeleteWeaveType}
          />
        </Suspense>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteWeaveType}
        title="Delete Weave Type"
        description="Are you sure you want to delete this weave type? This action cannot be undone. Note: Products using this weave type will lose their associated image on the homepage."
        itemName={deleteDialog.weaveType?.name || ''}
        isLoading={isPending}
      />
    </AdminPageTemplate>
  );
}