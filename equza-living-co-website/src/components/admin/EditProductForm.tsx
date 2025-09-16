'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Grid } from '@/components/ui/Grid';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import type { Product } from '@/types';
import { updateAdminProduct } from '@/lib/actions/admin/products';

interface EditProductFormProps {
  initial: any; // SafeProduct shape; minimal fields mapped below
}

export function EditProductForm({ initial }: EditProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState<string>(initial?.name || '');
  const [slug, setSlug] = useState<string>(initial?.slug || '');
  const [description, setDescription] = useState<string>(initial?.description || '');
  const [story, setStory] = useState<string>(initial?.story || '');
  const [seoTitle, setSeoTitle] = useState<string>(initial?.seoTitle || initial?.name || '');
  const [seoDescription, setSeoDescription] = useState<string>(initial?.seoDescription || initial?.description || '');
  const [submitError, setSubmitError] = useState<string>('');

  const productId: string | undefined = initial?.id;

  const handleSave = () => {
    if (!productId) return;
    setSubmitError('');
    startTransition(async () => {
      const updates: Partial<Omit<Product, 'id' | 'createdAt'>> = {
        name,
        slug,
        description,
        story,
        seoTitle,
        seoDescription,
      };
      const res = await updateAdminProduct(productId, updates);
      if (res.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setSubmitError(res.message || 'Failed to update');
      }
    });
  };

  return (
    <div className="space-y-6">
      {submitError && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{submitError}</div>
      )}

      <Grid cols={1} gap={6}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="kashmir-wool-classic" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div>
            <Label htmlFor="story">Story</Label>
            <Textarea id="story" value={story} onChange={(e) => setStory(e.target.value)} rows={6} />
          </div>
          <div>
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input id="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea id="seoDescription" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} />
          </div>
        </div>
      </Grid>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving…' : 'Save changes'}
        </Button>
        <Button variant="ghost" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
      </div>
    </div>
  );
}


