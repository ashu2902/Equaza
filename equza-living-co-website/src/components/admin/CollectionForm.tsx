/**
 * Reusable Collection Form (Create/Edit)
 */

'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Typography } from '@/components/ui/Typography';
import type { Collection } from '@/types';
import { createAdminCollection, updateAdminCollection } from '@/lib/actions/admin/collections';
import { uploadFile, generatePaths } from '@/lib/firebase/storage';

interface Props {
  mode: 'create' | 'edit';
  initial?: Partial<Collection> & { id?: string };
}

export function CollectionForm({ mode, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [type, setType] = useState<'style' | 'space'>(initial?.type || 'style');
  const [heroUrl, setHeroUrl] = useState(initial?.heroImage?.url || '');
  const [heroAlt, setHeroAlt] = useState(initial?.heroImage?.alt || '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

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
    try {
      const path = generatePaths.collectionImage(file.name);
      const url = await uploadFile({ path, file });
      setHeroUrl(url);
    } catch (err: any) {
      setErrors(prev => ({ ...prev, heroImage: err?.message || 'Upload failed' }));
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
    startTransition(async () => {
      if (mode === 'create') {
        const res = await createAdminCollection({
          name,
          slug,
          description,
          type,
          heroImage: { url: heroUrl, alt: heroAlt, storageRef: '' },
          seoTitle: name,
          seoDescription: description.slice(0, 160),
          isActive,
          sortOrder: 0,
          productIds: [],
        } as any);
        if (res.success) {
          setSubmitSuccess('Collection created successfully. Redirecting...');
          router.push('/admin/collections');
          router.refresh();
        } else if (res.errors) {
          setErrors(res.errors);
          setSubmitError(res.message || 'Failed to create collection');
        } else {
          setSubmitError(res.message || 'Failed to create collection');
        }
      } else if (mode === 'edit' && initial?.id) {
        const res = await updateAdminCollection(initial.id, {
          name,
          slug,
          description,
          type,
          heroImage: { url: heroUrl, alt: heroAlt, storageRef: '' },
          seoTitle: name,
          seoDescription: description.slice(0, 160),
          isActive,
        } as any);
        if (res.success) {
          setSubmitSuccess('Changes saved. Redirecting...');
          router.push('/admin/collections');
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
            <Label htmlFor="type">Type</Label>
            <select id="type" className="w-full border rounded px-3 py-2" value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="style">Style</option>
              <option value="space">Space</option>
            </select>
            {errors.type && <Typography variant="caption" className="text-red-600">{errors.type}</Typography>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            {errors.description && <Typography variant="caption" className="text-red-600">{errors.description}</Typography>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Hero Image</Label>
              <Input type="file" accept="image/*" onChange={handleUpload} />
              {errors.heroImage && <Typography variant="caption" className="text-red-600">{errors.heroImage}</Typography>}
            </div>
            <div>
              <Label htmlFor="heroAlt">Alt Text</Label>
              <Input id="heroAlt" value={heroAlt} onChange={(e) => setHeroAlt(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (mode === 'create' ? 'Creating…' : 'Saving…') : (mode === 'create' ? 'Create Collection' : 'Save Changes')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}


