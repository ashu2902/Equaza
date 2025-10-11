'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Typography } from '@/components/ui/Typography';
import { updateHomeContent } from '@/lib/actions/admin/pages';
import { uploadFile, generatePaths } from '@/lib/firebase/storage';
import { deleteFileAction } from '@/lib/actions/files';

export interface AdminHeroSlide {
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  image: { src: string; alt: string; storageRef?: string }; // Added storageRef
}

interface HeroEditorProps {
  initialSlides: AdminHeroSlide[];
}

export function HeroEditor({ initialSlides }: HeroEditorProps) {
  const [slides, setSlides] = useState<AdminHeroSlide[]>(initialSlides || []);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ text: string | null; isError: boolean }>({ text: null, isError: false });
  const [uploadErrors, setUploadErrors] = useState<Record<number, string>>({});
  const [uploadPending, setUploadPending] = useState<Record<number, boolean>>({});

  const updateSlide = (index: number, next: Partial<AdminHeroSlide>) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...next } as AdminHeroSlide;
      return copy;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadPending(prev => ({ ...prev, [index]: true }));
    setUploadErrors(prev => ({ ...prev, [index]: '' }));

    try {
      const path = generatePaths.adminUpload(file.name, 'hero-banners');
      const url = await uploadFile({ path, file });
      
      updateSlide(index, { 
        image: { 
          src: url, 
          alt: slides[index]?.image?.alt || file.name, 
          storageRef: path 
        } 
      });
    } catch (err: any) {
      setUploadErrors(prev => ({ ...prev, [index]: err?.message || 'Upload failed' }));
    } finally {
      setUploadPending(prev => ({ ...prev, [index]: false }));
    }
  };

  const removeImage = async (index: number) => {
    const slide = slides[index];
    if (!slide?.image?.storageRef) {
      updateSlide(index, { image: { src: '', alt: '' } });
      return;
    }

    try {
      const result = await deleteFileAction(slide?.image?.storageRef);
      if (result.success) {
        updateSlide(index, { image: { src: '', alt: '', storageRef: undefined } });
      } else {
        setUploadErrors(prev => ({ ...prev, [index]: result.message }));
      }
    } catch (err: any) {
      setUploadErrors(prev => ({ ...prev, [index]: err?.message || 'Failed to remove image' }));
    }
  };

  const addSlide = () => {
    setSlides((prev) => [
      ...prev,
      { title: '', subtitle: '', cta: { label: 'Explore Now', href: '/collections' }, image: { src: '', alt: 'Hero background' } },
    ]);
  };

  const removeSlide = (index: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const onSave = async () => {
    setSaving(true);
    setStatus({ text: null, isError: false });
    try {
      const res = await updateHomeContent({ hero: slides } as any);
      if (res.success) {
        setStatus({ text: 'Homepage content updated successfully', isError: false });
      } else {
        setStatus({ text: res.message || 'Save failed', isError: true });
      }
    } catch (e: any) {
      setStatus({ text: e?.message || 'Save failed', isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage Hero Slides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {status.text && (
            <div 
              className={`text-sm rounded p-3 ${
                status.isError 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}
            >
              {status.text}
            </div>
          )}
          {slides.map((slide, idx) => (
            <div key={idx} className="rounded-md border border-warm-200 p-4 space-y-4">
              <Typography variant="overline">Slide {idx + 1}</Typography>
              <Grid cols={1} gap="sm">
                <div>
                  <Label htmlFor={`title-${idx}`}>Title</Label>
                  <Input id={`title-${idx}`} value={slide.title || ''} onChange={(e) => updateSlide(idx, { title: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor={`subtitle-${idx}`}>Subtitle</Label>
                  <Textarea id={`subtitle-${idx}`} rows={2} value={slide.subtitle || ''} onChange={(e) => updateSlide(idx, { subtitle: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`ctaLabel-${idx}`}>CTA Label</Label>
                    <Input id={`ctaLabel-${idx}`} value={slide.cta?.label || ''} onChange={(e) => updateSlide(idx, { cta: { ...(slide.cta || { label: '', href: '' }), label: e.target.value } })} />
                  </div>
                  <div>
                    <Label htmlFor={`ctaHref-${idx}`}>CTA Href</Label>
                    <Input id={`ctaHref-${idx}`} value={slide.cta?.href || ''} onChange={(e) => updateSlide(idx, { cta: { ...(slide.cta || { label: '', href: '' }), href: e.target.value } })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`imageSrc-${idx}`}>Image URL</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id={`imageSrc-${idx}`} 
                        value={slide.image?.src || ''} 
                        onChange={(e) => updateSlide(idx, { image: { ...(slide.image || { src: '', alt: '' }), src: e.target.value } })} 
                        placeholder="Enter URL or upload below"
                        disabled={uploadPending[idx]}
                      />
                      {slide.image?.src && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeImage(idx)}>
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpload(e, idx)}
                        disabled={uploadPending[idx]}
                      />
                      {uploadPending[idx] && <Typography variant="caption">Uploading...</Typography>}
                    </div>
                    {uploadErrors[idx] && <Typography variant="caption" className="text-red-600">{uploadErrors[idx]}</Typography>}
                  </div>
                  <div>
                    <Label htmlFor={`imageAlt-${idx}`}>Image Alt</Label>
                    <Input id={`imageAlt-${idx}`} value={slide.image?.alt || ''} onChange={(e) => updateSlide(idx, { image: { ...(slide.image || { src: '', alt: '' }), alt: e.target.value } })} />
                  </div>
                </div>
              </Grid>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => removeSlide(idx)}>Remove</Button>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3">
            <Button onClick={addSlide} variant="secondary">Add Slide</Button>
            <Button onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


