/**
 * Reusable Weave Type Form (Create/Edit)
 */

'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Typography } from '@/components/ui/Typography';
import { ImageIcon } from 'lucide-react';
import type { WeaveType } from '@/types';
import { createAdminWeaveType, updateAdminWeaveType } from '@/lib/actions/admin'; // Import from index
import { uploadFile, generatePaths } from '@/lib/firebase/storage'; // Assuming these exist
import { deleteFileAction } from '@/lib/actions/files'; // Assuming this exists

interface Props {
  mode: 'create' | 'edit';
  initial?: Partial<WeaveType> & { id?: string };
}

export function WeaveTypeForm({ mode, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder || 0);
  const [imageUrl, setImageUrl] = useState(initial?.image?.url || '');
  const [imageAlt, setImageAlt] = useState(initial?.image?.alt || '');
  const [imageStorageRef, setImageStorageRef] = useState(initial?.image?.storageRef || '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [imageUploadPending, setImageUploadPending] = useState(false);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  useEffect(() => {
    if (mode === 'create') {
      setSlug(slugify(name));
    }
  }, [name]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadPending(true);
    try {
      // Use a dedicated path for weave type images
      const path = generatePaths.weaveTypeImage(file.name);
      const url = await uploadFile({ path, file });
      setImageUrl(url);
      setImageStorageRef(path);
      // Clear any previous errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    } catch (err: any) {
      setErrors(prev => ({ ...prev, image: err?.message || 'Upload failed' }));
    } finally {
      setImageUploadPending(false);
    }
  }

  async function removeImage() {
    if (!imageStorageRef) return;

    try {
      const result = await deleteFileAction(imageStorageRef);
      if (result.success) {
        setImageUrl('');
        setImageStorageRef('');
        setImageAlt('');
      } else {
        setErrors(prev => ({ ...prev, image: result.message }));
      }
    } catch (err: any) {
      setErrors(prev => ({ ...prev, image: err?.message || 'Failed to remove image' }));
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
    startTransition(async () => {
      const weaveTypeData = {
        name,
        slug,
        sortOrder,
        isActive,
        image: { 
          url: imageUrl, 
          alt: imageAlt, 
          storageRef: imageStorageRef,
          isMain: true, // Default to true for simplicity
          sortOrder: 0,
        },
      } as Omit<WeaveType, 'id' | 'createdAt' | 'updatedAt'>;

      if (mode === 'create') {
        const res = await createAdminWeaveType(weaveTypeData);
        if (res.success) {
          setSubmitSuccess('Weave type created successfully. Redirecting...');
          router.push('/admin/weave-types');
          router.refresh();
        } else if (res.errors) {
          setErrors(res.errors);
          setSubmitError(res.message || 'Failed to create weave type');
        } else {
          setSubmitError(res.message || 'Failed to create weave type');
        }
      } else if (mode === 'edit' && initial?.id) {
        const res = await updateAdminWeaveType(initial.id, weaveTypeData);
        if (res.success) {
          setSubmitSuccess('Changes saved. Redirecting...');
          router.push('/admin/weave-types');
          router.refresh();
        } else if (res.errors) {
          setErrors(res.errors);
          setSubmitError(res.message || 'Failed to save changes');
        } else {
          setSubmitError(res.message || 'Failed to save changes');
        }
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {submitError && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-green-700 text-sm">
          {submitSuccess}
        </div>
      )}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <Typography variant="caption" className="text-red-600">{errors.name}</Typography>}
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            {errors.slug && <Typography variant="caption" className="text-red-600">{errors.slug}</Typography>}
          </div>

          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input 
              id="sortOrder" 
              type="number"
              value={sortOrder} 
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} 
            />
            {errors.sortOrder && <Typography variant="caption" className="text-red-600">{errors.sortOrder}</Typography>}
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="isActive" 
              checked={isActive} 
              onChange={(e) => setIsActive(e.target.checked)} 
              className="h-4 w-4 text-[#98342d] border-gray-300 rounded focus:ring-[#98342d]"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Dedicated Image</Label>

              {/* Existing Image Preview */}
              {imageUrl && (
                <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={imageAlt || 'Weave Type Image'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement!;
                            parent.innerHTML = '<svg class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">Image</p>
                      <p className="text-xs text-gray-500">{imageAlt || 'No alt text'}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="text-red-600 hover:text-red-800 px-2 py-1 text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Removing the image will permanently delete it from storage.
                  </p>
                </div>
              )}

              {/* Upload New Image */}
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={imageUploadPending}
                />
                {imageUploadPending && (
                  <p className="text-sm text-gray-600">Uploading image...</p>
                )}
                {errors.image && <Typography variant="caption" className="text-red-600">{errors.image}</Typography>}
              </div>
            </div>

            <div>
              <Label htmlFor="imageAlt">Alt Text</Label>
              <Input
                id="imageAlt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Describe the image for accessibility"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (mode === 'create' ? 'Creating…' : 'Saving…') : (mode === 'create' ? 'Create Weave Type' : 'Save Changes')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}