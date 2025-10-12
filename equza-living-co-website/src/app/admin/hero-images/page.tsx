/**
 * Admin Hero Images Management Page
 * Interface for managing hero images across all pages
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';
import { useAllHeroImages, type PageType } from '@/lib/hooks/useHeroImage';
import { updatePageHeroImage } from '@/lib/firebase/hero-images';
import { uploadFile, generatePaths } from '@/lib/firebase/storage';
import { Upload, Save, RefreshCw, CheckCircle, AlertCircle, Eye, Trash2, Plus, ImageIcon, X } from 'lucide-react';
import { InitializeButton } from './InitializeButton';

interface HeroImageForm {
  imageUrl: string;
  altText: string;
  file: File | null;
  isEditing: boolean;
  isDragOver: boolean;
}

export default function AdminHeroImagesPage() {
  const { heroImages, isLoading, error, refetch } = useAllHeroImages();
  const [saving, setSaving] = useState<Record<PageType, boolean>>({
    'our-story': false,
    'craftsmanship': false,
    'trade': false,
    'customize': false,
  });
  const [success, setSuccess] = useState<Record<PageType, boolean>>({
    'our-story': false,
    'craftsmanship': false,
    'trade': false,
    'customize': false,
  });
  const [forms, setForms] = useState<Record<PageType, HeroImageForm>>({
    'our-story': { imageUrl: '', altText: '', file: null, isEditing: false, isDragOver: false },
    'craftsmanship': { imageUrl: '', altText: '', file: null, isEditing: false, isDragOver: false },
    'trade': { imageUrl: '', altText: '', file: null, isEditing: false, isDragOver: false },
    'customize': { imageUrl: '', altText: '', file: null, isEditing: false, isDragOver: false },
  });

  // Initialize forms when hero images load
  useEffect(() => {
    if (heroImages) {
      const newForms = {} as Record<PageType, HeroImageForm>;
      Object.keys(heroImages).forEach(pageType => {
        const heroImage = heroImages[pageType as PageType];
        newForms[pageType as PageType] = {
          imageUrl: heroImage?.imageUrl || '',
          altText: heroImage?.altText || '',
          file: null,
          isEditing: false,
          isDragOver: false,
        };
      });
      setForms(newForms);
    }
  }, [heroImages]);

  const updateForm = useCallback((pageType: PageType, field: keyof HeroImageForm, value: any) => {
    setForms(prev => ({
      ...prev,
      [pageType]: {
        ...prev[pageType],
        [field]: value,
      },
    }));
  }, []);

  const handleFileChange = useCallback((pageType: PageType, file: File | null) => {
    updateForm(pageType, 'file', file);
    
    // If a file is selected, preview it
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      updateForm(pageType, 'imageUrl', previewUrl);
      updateForm(pageType, 'isEditing', true);
    }
  }, [updateForm]);

  const handleDragOver = useCallback((pageType: PageType, e: React.DragEvent) => {
    e.preventDefault();
    updateForm(pageType, 'isDragOver', true);
  }, [updateForm]);

  const handleDragLeave = useCallback((pageType: PageType, e: React.DragEvent) => {
    e.preventDefault();
    updateForm(pageType, 'isDragOver', false);
  }, [updateForm]);

  const handleDrop = useCallback((pageType: PageType, e: React.DragEvent) => {
    e.preventDefault();
    updateForm(pageType, 'isDragOver', false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      handleFileChange(pageType, files[0]);
    }
  }, [updateForm, handleFileChange]);

  const toggleEditMode = useCallback((pageType: PageType) => {
    updateForm(pageType, 'isEditing', !forms[pageType].isEditing);
  }, [updateForm, forms]);

  const cancelEdit = useCallback((pageType: PageType) => {
    const heroImage = heroImages[pageType];
    setForms(prev => ({
      ...prev,
      [pageType]: {
        imageUrl: heroImage?.imageUrl || '',
        altText: heroImage?.altText || '',
        file: null,
        isEditing: false,
        isDragOver: false,
      },
    }));
  }, [heroImages]);

  const deleteImage = useCallback(async (pageType: PageType) => {
    if (!confirm(`Are you sure you want to remove the hero image for ${pageTypeLabels[pageType]}?`)) {
      return;
    }

    setSaving(prev => ({ ...prev, [pageType]: true }));

    try {
      await updatePageHeroImage(pageType, {
        imageUrl: '',
        altText: '',
        isActive: false,
      }, 'admin');

      setSuccess(prev => ({ ...prev, [pageType]: true }));
      
      // Reset form
      setForms(prev => ({
        ...prev,
        [pageType]: {
          imageUrl: '',
          altText: '',
          file: null,
          isEditing: false,
          isDragOver: false,
        },
      }));
      
      setTimeout(() => {
        refetch();
        setSuccess(prev => ({ ...prev, [pageType]: false }));
      }, 2000);

    } catch (error) {
      console.error(`Error deleting hero image for ${pageType}:`, error);
      alert(`Failed to delete hero image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(prev => ({ ...prev, [pageType]: false }));
    }
  }, [refetch]);

  const handleSave = useCallback(async (pageType: PageType) => {
    const form = forms[pageType];
    
    if (!form.imageUrl || !form.altText) {
      alert('Please provide both image and alt text');
      return;
    }

    setSaving(prev => ({ ...prev, [pageType]: true }));
    setSuccess(prev => ({ ...prev, [pageType]: false }));

    try {
      let finalImageUrl = form.imageUrl;

      // If a new file was uploaded, upload it to Firebase Storage
      if (form.file) {
        const uploadPath = generatePaths.adminUpload(form.file.name, 'hero-images');
        
        finalImageUrl = await uploadFile({
          path: uploadPath,
          file: form.file,
        });
      }

      // Update hero image in Firestore
      await updatePageHeroImage(pageType, {
        imageUrl: finalImageUrl,
        altText: form.altText,
        isActive: true,
      }, 'admin');

      setSuccess(prev => ({ ...prev, [pageType]: true }));
      
      // Clear file selection
      updateForm(pageType, 'file', null);
      
      // Refresh data
      setTimeout(() => {
        refetch();
        setSuccess(prev => ({ ...prev, [pageType]: false }));
      }, 2000);

    } catch (error) {
      console.error(`Error updating hero image for ${pageType}:`, error);
      alert(`Failed to update hero image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(prev => ({ ...prev, [pageType]: false }));
    }
  }, [forms, refetch, updateForm]);

  const pageTypeLabels: Record<PageType, string> = {
    'our-story': 'Our Story',
    'craftsmanship': 'Craftsmanship',
    'trade': 'Trade',
    'customize': 'Customize',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Container>
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading hero images...</span>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Container>
          <div className="flex items-center justify-center h-64">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <span className="ml-2 text-red-600">Error loading hero images: {error}</span>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <Container>
          <FadeIn>
            <div className="mb-8">
              <Typography variant="h1" className="text-3xl font-bold text-gray-900 mb-2">
                Hero Images Management
              </Typography>
              <Typography variant="body" className="text-gray-600 mb-6">
                Manage hero background images for all pages. Upload new images or update existing ones.
              </Typography>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
                <InitializeButton onSuccess={refetch} />
                <Button
                  variant="outline"
                  onClick={() => {
                    const pageTypes: PageType[] = ['our-story', 'craftsmanship', 'trade', 'customize'];
                    pageTypes.forEach(pageType => {
                      const heroImage = heroImages[pageType];
                      if (!heroImage?.imageUrl) {
                        updateForm(pageType, 'isEditing', true);
                      }
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Missing Images
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open('/our-story', '_blank');
                    window.open('/craftsmanship', '_blank');
                    window.open('/trade', '_blank');
                    window.open('/customize', '_blank');
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview All Pages
                </Button>
                <Button
                  variant="outline"
                  onClick={refetch}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {(Object.keys(pageTypeLabels) as PageType[]).map((pageType, index) => {
              const heroImage = heroImages[pageType];
              const form = forms[pageType];
              const isSaving = saving[pageType];
              const isSuccess = success[pageType];

              return (
                <SlideUp key={pageType} delay={index * 0.1}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-2">
                              {pageTypeLabels[pageType]} Page
                            </Typography>
                            <Typography variant="small" className="text-gray-500">
                              {heroImage?.uploadedAt ? `Updated: ${new Date(heroImage.uploadedAt).toLocaleDateString()}` : 'No image set'}
                            </Typography>
                          </div>
                          <div className="flex space-x-2">
                            {heroImage?.imageUrl && !form.isEditing && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleEditMode(pageType)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteImage(pageType)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {form.isEditing && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelEdit(pageType)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Current Image Preview */}
                      {heroImage?.imageUrl && (
                        <div className="mb-4">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Current Image
                          </Label>
                          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={heroImage.imageUrl}
                              alt={heroImage.altText || 'Hero image'}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <Typography variant="small" className="text-white bg-black/50 px-2 py-1 rounded">
                                {heroImage.altText}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Upload Section */}
                      {(!heroImage?.imageUrl || form.isEditing) && (
                        <div className="space-y-4">
                          {/* Drag and Drop Upload Area */}
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              {heroImage?.imageUrl ? 'Replace Image' : 'Add Hero Image'}
                            </Label>
                            <div
                              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                form.isDragOver
                                  ? 'border-[#98342d] bg-[#98342d]/5'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onDragOver={(e) => handleDragOver(pageType, e)}
                              onDragLeave={(e) => handleDragLeave(pageType, e)}
                              onDrop={(e) => handleDrop(pageType, e)}
                            >
                              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <Typography variant="body" className="text-gray-600 mb-2">
                                Drag and drop an image here, or{' '}
                                <label
                                  htmlFor={`file-${pageType}`}
                                  className="text-[#98342d] hover:text-[#98342d]/80 cursor-pointer underline"
                                >
                                  browse
                                </label>
                              </Typography>
                              <Typography variant="small" className="text-gray-500">
                                Supports JPG, PNG, WebP up to 10MB
                              </Typography>
                              <Input
                                id={`file-${pageType}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(pageType, e.target.files?.[0] || null)}
                                className="hidden"
                              />
                            </div>
                          </div>

                          {/* Preview if file selected */}
                          {form.file && (
                            <div className="relative">
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Preview
                              </Label>
                              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={form.imageUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="absolute top-2 right-2 bg-white/90"
                                  onClick={() => window.open(form.imageUrl, '_blank')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <div className="absolute bottom-2 left-2 right-2">
                                  <Typography variant="small" className="text-white bg-black/50 px-2 py-1 rounded">
                                    File: {form.file.name} ({(form.file.size / 1024 / 1024).toFixed(2)}MB)
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Form Fields */}
                      {(!heroImage?.imageUrl || form.isEditing) && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`url-${pageType}`} className="text-sm font-medium text-gray-700 mb-2 block">
                              Or use Image URL
                            </Label>
                            <Input
                              id={`url-${pageType}`}
                              type="url"
                              value={form.file ? '' : form.imageUrl}
                              onChange={(e) => {
                                updateForm(pageType, 'imageUrl', e.target.value);
                                updateForm(pageType, 'file', null);
                              }}
                              placeholder="https://example.com/image.jpg"
                              disabled={!!form.file}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`alt-${pageType}`} className="text-sm font-medium text-gray-700 mb-2 block">
                              Alt Text *
                            </Label>
                            <Textarea
                              id={`alt-${pageType}`}
                              value={form.altText}
                              onChange={(e) => updateForm(pageType, 'altText', e.target.value)}
                              placeholder="Describe the image for accessibility (required)"
                              rows={2}
                              required
                            />
                          </div>

                          <div className="flex space-x-3">
                            <Button
                              onClick={() => handleSave(pageType)}
                              disabled={isSaving || !form.imageUrl || !form.altText}
                              className="flex-1"
                            >
                              {isSaving ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : isSuccess ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Saved!
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  {heroImage?.imageUrl ? 'Update' : 'Add'} Image
                                </>
                              )}
                            </Button>
                            
                            {form.isEditing && (
                              <Button
                                variant="outline"
                                onClick={() => cancelEdit(pageType)}
                                disabled={isSaving}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Add Button for empty states */}
                      {!heroImage?.imageUrl && !form.isEditing && (
                        <Button
                          onClick={() => toggleEditMode(pageType)}
                          variant="outline"
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Hero Image
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </SlideUp>
              );
            })}
          </div>

        </Container>
      </div>
    </ErrorBoundary>
  );
}
