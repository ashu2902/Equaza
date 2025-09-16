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

export interface AdminHeroSlide {
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  image: { src: string; alt: string };
}

interface HeroEditorProps {
  initialSlides: AdminHeroSlide[];
}

export function HeroEditor({ initialSlides }: HeroEditorProps) {
  const [slides, setSlides] = useState<AdminHeroSlide[]>(initialSlides || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const updateSlide = (index: number, next: Partial<AdminHeroSlide>) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...next } as AdminHeroSlide;
      return copy;
    });
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
    setMessage(null);
    try {
      const res = await updateHomeContent({ hero: slides } as any);
      setMessage(res.success ? 'Saved successfully' : res.message || 'Save failed');
    } catch (e: any) {
      setMessage(e?.message || 'Save failed');
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
          {message && (
            <div className="text-sm text-warm-900 bg-cream-100 border border-warm-200 rounded p-3">{message}</div>
          )}
          {slides.map((slide, idx) => (
            <div key={idx} className="rounded-md border border-warm-200 p-4 space-y-4">
              <Typography variant="overline">Slide {idx + 1}</Typography>
              <Grid cols={1} gap={4}>
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
                  <div>
                    <Label htmlFor={`imageSrc-${idx}`}>Image URL</Label>
                    <Input id={`imageSrc-${idx}`} value={slide.image?.src || ''} onChange={(e) => updateSlide(idx, { image: { ...(slide.image || { src: '', alt: '' }), src: e.target.value } })} />
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


