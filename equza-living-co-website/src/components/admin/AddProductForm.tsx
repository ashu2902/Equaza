/**
 * Add Product Form Component
 * 
 * Complete form for creating new products with:
 * - Form state management
 * - Validation 
 * - File upload
 * - Server action integration
 * - Error handling
 * - Success states
 */

'use client';

import { useState, useTransition, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Save, Loader2, X, ImageIcon } from 'lucide-react';

// Components
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { FadeIn, SlideUp } from '@/components/ui/MotionWrapper';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Typography } from '@/components/ui/Typography';

// Types and actions
import type { Collection, ProductImage, ProductSpecifications, ProductPrice, Product } from '@/types';
import { createAdminProduct, updateAdminProduct } from '@/lib/actions/admin/products';
import { uploadMultipleFileAction } from '@/lib/actions/files';

interface AddProductFormProps {
  collections: Collection[];
  roomTypes: string[];
  materials: string[];
  styleCollections: Array<{ id: string; name: string; slug: string }>;
  spaceCollections: Array<{ id: string; name: string; slug: string }>;
  mode?: 'create' | 'edit';
  initial?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    story: string;
    images: ProductImage[];
    specifications: ProductSpecifications;
    collections: string[];
    roomTypes: string[];
    price: ProductPrice;
    seoTitle: string;
    seoDescription: string;
    isActive: boolean;
    isFeatured: boolean;
  } | null;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  story: string;
  price: number;
  priceVisible: boolean;
  currency: string;
  materials: string[];
  weaveType: string;
  origin: string;
  craftTime: string;
  dimensions: string;
  collections: string[];
  roomTypes: string[];
  isActive: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  images: File[];
  existingImages: ProductImage[];
}

export function AddProductForm({ 
  collections, 
  roomTypes, 
  materials, 
  styleCollections, 
  spaceCollections,
  mode = 'create',
  initial = null,
}: AddProductFormProps) {
  console.log('🏗️ AddProductForm: Component initialized with props:', {
    collectionsCount: collections.length,
    roomTypesCount: roomTypes.length,
    materialsCount: materials.length,
    styleCollectionsCount: styleCollections.length,
    spaceCollectionsCount: spaceCollections.length
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [imageUploadPending, setImageUploadPending] = useState(false);

  // Form state
  const initialFormData: FormData = initial ? {
    name: initial.name || '',
    slug: initial.slug || '',
    description: initial.description || '',
    story: initial.story || '',
    price: initial.price?.startingFrom ?? 0,
    priceVisible: initial.price?.isVisible ?? true,
    currency: initial.price?.currency || 'INR',
    materials: initial.specifications?.materials || [],
    weaveType: initial.specifications?.weaveType || '',
    origin: initial.specifications?.origin || '',
    craftTime: initial.specifications?.craftTime || '',
    dimensions: initial.specifications?.availableSizes?.[0]?.dimensions || '',
    collections: initial.collections || [],
    roomTypes: initial.roomTypes || [],
    isActive: initial.isActive ?? false,
    isFeatured: initial.isFeatured ?? false,
    seoTitle: initial.seoTitle || initial.name || '',
    seoDescription: initial.seoDescription || initial.description || '',
    images: [],
    existingImages: initial.images || [],
  } : {
    name: '',
    slug: '',
    description: '',
    story: '',
    price: 0,
    priceVisible: true,
    currency: 'INR',
    materials: [],
    weaveType: '',
    origin: '',
    craftTime: '',
    dimensions: '',
    collections: [],
    roomTypes: [],
    isActive: false,
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    images: [],
    existingImages: [],
  };

  console.log('📝 AddProductForm: Initial form data:', initialFormData);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Component lifecycle logging
  useEffect(() => {
    console.log('🎬 AddProductForm: Component mounted');
    return () => {
      console.log('🎬 AddProductForm: Component unmounting');
    };
  }, []);

  // Form data change logging
  useEffect(() => {
    console.log('📊 AddProductForm: Form data changed:', {
      hasName: !!formData.name,
      hasDescription: !!formData.description,
      hasStory: !!formData.story,
      materialsCount: formData.materials.length,
      collectionsCount: formData.collections.length,
      roomTypesCount: formData.roomTypes.length,
      imagesCount: formData.images.length,
      priceVisible: formData.priceVisible,
      price: formData.price,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured
    });
  }, [formData]);

  // Auto-generate slug from name
  const generateSlug = useCallback((name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    console.log(`🔄 AddProductForm: Field "${field}" changed to:`, value);
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug when name changes
    if (field === 'name' && typeof value === 'string') {
      const generatedSlug = generateSlug(value);
      console.log(`🔗 AddProductForm: Auto-generated slug from "${value}":`, generatedSlug);
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }));
    }

    // Auto-generate SEO title from name
    if (field === 'name' && typeof value === 'string') {
      console.log(`📝 AddProductForm: Auto-generated SEO title:`, value);
      setFormData(prev => ({
        ...prev,
        seoTitle: value
      }));
    }

    // Clear errors when user starts typing
    if (errors[field]) {
      console.log(`✅ AddProductForm: Cleared error for field "${field}"`);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (field: 'materials' | 'collections' | 'roomTypes', value: string, checked: boolean) => {
    console.log(`📋 AddProductForm: Array field "${field}" - ${checked ? 'Adding' : 'Removing'} "${value}"`);
    
    setFormData(prev => {
      const newArray = checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value);
      
      console.log(`📋 AddProductForm: Updated ${field}:`, newArray);
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.log('📸 AddProductForm: No files provided for upload');
      return;
    }

    console.log(`📸 AddProductForm: Starting image upload for ${files.length} files`);
    setImageUploadPending(true);
    
    try {
      const fileArray = Array.from(files);
      console.log('📸 AddProductForm: Files to process:', fileArray.map(f => ({ name: f.name, type: f.type, size: f.size })));
      
      // Validate file types
      const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
      const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
      
      if (invalidFiles.length > 0) {
        console.warn('📸 AddProductForm: Invalid files detected:', invalidFiles.map(f => f.name));
        alert(`Only image files are allowed. Skipped: ${invalidFiles.map(f => f.name).join(', ')}`);
      }
      
      console.log(`📸 AddProductForm: Valid files for upload: ${validFiles.length}`);
      
      setFormData(prev => {
        const newImages = [...prev.images, ...validFiles];
        console.log(`📸 AddProductForm: Total images after upload: ${newImages.length}`);
        return {
          ...prev,
          images: newImages
        };
      });
      
      console.log('✅ AddProductForm: Image upload completed successfully');
    } catch (error) {
      console.error('❌ AddProductForm: Error handling image upload:', error);
    } finally {
      setImageUploadPending(false);
    }
  };

  // Drag and drop handlers
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('🫳 AddProductForm: Drag over detected');
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('🫴 AddProductForm: Drag leave detected');
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('📥 AddProductForm: Files dropped!');
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    console.log('📥 AddProductForm: Dropped files count:', files.length);
    handleImageUpload(files);
  };

  const removeImage = (index: number) => {
    const removedFile = formData.images[index];
    console.log(`🗑️ AddProductForm: Removing image at index ${index}:`, removedFile?.name);
    
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      console.log(`🗑️ AddProductForm: Remaining images: ${newImages.length}`);
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const validateForm = (): boolean => {
    console.log('🔍 AddProductForm: Starting form validation');
    console.log('🔍 AddProductForm: Current form data:', formData);
    
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
      console.log('❌ AddProductForm: Validation failed - Product name is required');
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      console.log('❌ AddProductForm: Validation failed - Description is required');
    }

    if (!formData.story.trim()) {
      newErrors.story = 'Product story is required';
      console.log('❌ AddProductForm: Validation failed - Product story is required');
    }

    if (formData.materials.length === 0) {
      newErrors.materials = 'At least one material is required';
      console.log('❌ AddProductForm: Validation failed - No materials selected');
    }

    if (!formData.weaveType.trim()) {
      newErrors.weaveType = 'Weave type is required';
      console.log('❌ AddProductForm: Validation failed - Weave type is required');
    }

    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required';
      console.log('❌ AddProductForm: Validation failed - Origin is required');
    }

    if (!formData.craftTime.trim()) {
      newErrors.craftTime = 'Craft time is required';
      console.log('❌ AddProductForm: Validation failed - Craft time is required');
    }

    if (!formData.dimensions.trim()) {
      newErrors.dimensions = 'Dimensions are required';
      console.log('❌ AddProductForm: Validation failed - Dimensions are required');
    }

    if (formData.collections.length === 0) {
      newErrors.collections = 'Product must belong to at least one collection';
      console.log('❌ AddProductForm: Validation failed - No collections selected');
    }

    if (formData.roomTypes.length === 0) {
      newErrors.roomTypes = 'Product must be assigned to at least one room type';
      console.log('❌ AddProductForm: Validation failed - No room types selected');
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one product image is required';
      console.log('❌ AddProductForm: Validation failed - No images uploaded');
    }

    if (formData.priceVisible && formData.price <= 0) {
      newErrors.price = 'Price is required when price visibility is enabled';
      console.log('❌ AddProductForm: Validation failed - Price is required when visible');
    }

    console.log('🔍 AddProductForm: Validation errors found:', Object.keys(newErrors));
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    console.log(`🔍 AddProductForm: Form validation ${isValid ? 'PASSED' : 'FAILED'}`);
    
    return isValid;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    console.log(`🚀 AddProductForm: Starting form submission (isDraft: ${isDraft})`);
    
    if (!validateForm() && !isDraft) {
      console.log('❌ AddProductForm: Form validation failed, aborting submission');
      return;
    }

    console.log('✅ AddProductForm: Form validation passed, proceeding with submission');
    setSubmitError('');
    
    startTransition(async () => {
      try {
        console.log('📸 AddProductForm: Starting image upload process');
        
        // Upload images first (CLIENT-SIDE upload)
        let uploadedImages: ProductImage[] = [];
        if (formData.images.length > 0) {
          console.log(`📸 AddProductForm: Uploading ${formData.images.length} images (CLIENT-SIDE)`);
          console.log(`📸 AddProductForm: Files to upload:`, formData.images.map(f => ({ name: f.name, size: f.size, type: f.type })));
          
          try {
            // Import upload function for client-side use
            const { uploadMultipleFiles } = await import('@/lib/firebase/storage');
            
            // Generate file paths on client side
            const timestamp = Date.now();
            const filePaths = formData.images.map((file, index) => 
              `images/products/${formData.slug}/${timestamp}-${index}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            );
            
            console.log('📸 AddProductForm: Generated file paths:', filePaths);
            
            // Upload files directly from client
            const uploadUrls = await uploadMultipleFiles(
              formData.images,
              (file, index) => filePaths[index] || `products/${Date.now()}-${index}-${file.name}`
            );
            
            console.log('📸 AddProductForm: Upload URLs received:', uploadUrls);
            
            // Process successful uploads
            uploadedImages = uploadUrls
              .map((url, index) => ({
                url: url,
                alt: `${formData.name} - Image ${index + 1}`,
                storageRef: filePaths[index] || `products/${Date.now()}-${index}`,
                isMain: index === 0, // First image is main
                sortOrder: index
              }))
              .filter(img => img.url); // Only include successfully uploaded images
              
            console.log('📸 AddProductForm: Processed uploaded images:', uploadedImages);
          } catch (uploadError) {
            console.error('❌ AddProductForm: Client-side image upload failed:', uploadError);
            setSubmitError('Image upload failed. Please try again.');
            return;
          }
        } else {
          console.log('📸 AddProductForm: No images to upload');
        }

        // Merge images: keep existing + any new uploads for edit; for create only new uploads
        const finalImages: ProductImage[] = (mode === 'edit')
          ? [...formData.existingImages, ...uploadedImages]
          : uploadedImages;

        // Prepare product data
        const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          story: formData.story,
          images: finalImages,
          specifications: {
            materials: formData.materials,
            weaveType: formData.weaveType,
            availableSizes: [{ dimensions: formData.dimensions, isCustom: false }],
            origin: formData.origin,
            craftTime: formData.craftTime,
          },
          collections: formData.collections,
          roomTypes: formData.roomTypes,
          price: {
            isVisible: formData.priceVisible,
            startingFrom: formData.price,
            currency: formData.currency,
          },
          seoTitle: formData.seoTitle || formData.name,
          seoDescription: formData.seoDescription || formData.description.substring(0, 160),
          isActive: isDraft ? false : formData.isActive,
          isFeatured: formData.isFeatured,
          sortOrder: 0,
        };

        console.log('📝 AddProductForm: Prepared product data:', productData);
        console.log(`🔄 AddProductForm: Calling ${mode === 'edit' ? 'updateAdminProduct' : 'createAdminProduct'} server action`);

        const result = mode === 'edit' && initial?.id
          ? await updateAdminProduct(initial.id, productData)
          : await createAdminProduct(productData);
        console.log('📝 AddProductForm: Server action result:', result);

        if (result.success) {
          console.log('✅ AddProductForm: Product created successfully! Redirecting...');
          router.push('/admin/products');
          router.refresh();
        } else {
          console.error('❌ AddProductForm: Server action failed:', result.message);
          setSubmitError(result.message);
          if (result.errors) {
            console.error('❌ AddProductForm: Validation errors from server:', result.errors);
            setErrors(result.errors);
          }
        }
      } catch (error) {
        console.error('❌ AddProductForm: Unexpected error during submission:', error);
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <div>
              <Typography variant="h3" className="text-[#98342d] mb-1">
                {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
              </Typography>
              <p className="text-[#98342d]/70">
                {mode === 'edit' ? 'Update product details' : 'Create a new product in your catalog'}
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Error Display */}
      {submitError && (
        <Card className="!border-red-200 !bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-700 text-sm">{submitError}</p>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Grid cols={3} gap="lg">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <SlideUp>
            <Card className="!bg-white !border-[#98342d]/20">
              <CardHeader>
                <CardTitle className="text-[#98342d]">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[#98342d]/80">Product Name *</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Persian Traditional Rug"
                    className={`border-[#98342d]/30 focus:border-[#98342d] ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <Label htmlFor="slug" className="text-[#98342d]/80">URL Slug *</Label>
                  <Input 
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="persian-traditional-rug"
                    className={`border-[#98342d]/30 focus:border-[#98342d] ${errors.slug ? 'border-red-500' : ''}`}
                  />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-[#98342d]/80">Description *</Label>
                  <Textarea 
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the product, its features, and craftsmanship..."
                    rows={4}
                    className={`border-[#98342d]/30 focus:border-[#98342d] ${errors.description ? 'border-red-500' : ''}`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                  <Label htmlFor="story" className="text-[#98342d]/80">Product Story *</Label>
                  <Textarea 
                    id="story"
                    value={formData.story}
                    onChange={(e) => handleInputChange('story', e.target.value)}
                    placeholder="Tell the story behind this product - its heritage, craftsmanship, inspiration..."
                    rows={4}
                    className={`border-[#98342d]/30 focus:border-[#98342d] ${errors.story ? 'border-red-500' : ''}`}
                  />
                  {errors.story && <p className="text-red-500 text-xs mt-1">{errors.story}</p>}
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* Pricing */}
          <SlideUp delay={0.1}>
            <Card className="!bg-white !border-[#98342d]/20">
              <CardHeader>
                <CardTitle className="text-[#98342d]">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input 
                    type="checkbox" 
                    id="priceVisible"
                    checked={formData.priceVisible}
                    onChange={(e) => handleInputChange('priceVisible', e.target.checked)}
                    className="rounded border-[#98342d]/30 text-[#98342d] focus:ring-[#98342d]"
                  />
                  <Label htmlFor="priceVisible" className="text-[#98342d]/80">Show price publicly</Label>
                </div>

                {formData.priceVisible && (
                  <Grid cols={2} gap="md">
                    <div>
                      <Label htmlFor="price" className="text-[#98342d]/80">Starting Price *</Label>
                      <Input 
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={`border-[#98342d]/30 focus:border-[#98342d] ${errors.price ? 'border-red-500' : ''}`}
                      />
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div>
                      <Label htmlFor="currency" className="text-[#98342d]/80">Currency</Label>
                      <select 
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-[#98342d]/30 rounded-md focus:border-[#98342d] focus:outline-none"
                      >
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </SlideUp>

          {/* Specifications */}
          <SlideUp delay={0.2}>
            <Card className="!bg-white !border-[#98342d]/20">
              <CardHeader>
                <CardTitle className="text-[#98342d]">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Materials */}
                <div>
                  <Label className="text-[#98342d]/80">Materials *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {materials.map(material => (
                      <div key={material} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={`material-${material}`}
                          checked={formData.materials.includes(material)}
                          onChange={(e) => handleArrayChange('materials', material, e.target.checked)}
                          className="rounded border-[#98342d]/30 text-[#98342d] focus:ring-[#98342d]"
                        />
                        <Label htmlFor={`material-${material}`} className="text-[#98342d]/80 text-sm">{material}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.materials && <p className="text-red-500 text-xs mt-1">{errors.materials}</p>}
                </div>

                <Grid cols={2} gap="md">
                  <div>
                    <Label htmlFor="weaveType" className="text-[#98342d]/80">Weave Type *</Label>
                    <Input 
                      id="weaveType"
                      value={formData.weaveType}
                      onChange={(e) => handleInputChange('weaveType', e.target.value)}
                      placeholder="e.g., Hand-knotted, Flat-weave"
                      className={`border-[#98342d]/30 focus:border-[#98342d] ${errors.weaveType ? 'border-red-500' : ''}`}
                    />
                    {errors.weaveType && <p className="text-red-500 text-xs mt-1">{errors.weaveType}</p>}
                  </div>
                  <div>
                    <Label htmlFor="origin" className="text-[#98342d]/80">Origin *</Label>
                    <Input 
                      id="origin"
                      value={formData.origin}
                      onChange={(e) => handleInputChange('origin', e.target.value)}
                      placeholder="e.g., Persia, Morocco"
                      className={`border-[#98342d]/30 focus:border-[#98342d] ${errors.origin ? 'border-red-500' : ''}`}
                    />
                    {errors.origin && <p className="text-red-500 text-xs mt-1">{errors.origin}</p>}
                  </div>
                  <div>
                    <Label htmlFor="dimensions" className="text-[#98342d]/80">Dimensions *</Label>
                    <Input 
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                      placeholder="e.g., 8' x 10'"
                      className={`border-[#98342d]/30 focus:border-[#98342d] ${errors.dimensions ? 'border-red-500' : ''}`}
                    />
                    {errors.dimensions && <p className="text-red-500 text-xs mt-1">{errors.dimensions}</p>}
                  </div>
                  <div>
                    <Label htmlFor="craftTime" className="text-[#98342d]/80">Craft Time *</Label>
                    <Input 
                      id="craftTime"
                      value={formData.craftTime}
                      onChange={(e) => handleInputChange('craftTime', e.target.value)}
                      placeholder="e.g., 6-8 months"
                      className={`border-[#98342d]/30 focus:border-[#98342d] ${errors.craftTime ? 'border-red-500' : ''}`}
                    />
                    {errors.craftTime && <p className="text-red-500 text-xs mt-1">{errors.craftTime}</p>}
                  </div>
                </Grid>
              </CardContent>
            </Card>
          </SlideUp>

          {/* SEO */}
          <SlideUp delay={0.3}>
            <Card className="!bg-white !border-[#98342d]/20">
              <CardHeader>
                <CardTitle className="text-[#98342d]">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle" className="text-[#98342d]/80">SEO Title</Label>
                  <Input 
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    placeholder="Leave empty to use product name"
                    className="border-[#98342d]/30 focus:border-[#98342d]"
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription" className="text-[#98342d]/80">SEO Description</Label>
                  <Textarea 
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    placeholder="Leave empty to use product description"
                    rows={3}
                    className="border-[#98342d]/30 focus:border-[#98342d]"
                  />
                </div>
              </CardContent>
            </Card>
          </SlideUp>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <SlideUp delay={0.4}>
            <Card className="!bg-white !border-[#98342d]/20">
              <CardHeader>
                <CardTitle className="text-[#98342d]">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-[#98342d]/30 text-[#98342d] focus:ring-[#98342d]"
                  />
                  <Label htmlFor="isActive" className="text-[#98342d]/80">Published</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="rounded border-[#98342d]/30 text-[#98342d] focus:ring-[#98342d]"
                  />
                  <Label htmlFor="isFeatured" className="text-[#98342d]/80">Featured Product</Label>
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* Images */}
          <SlideUp delay={0.5}>
            <Card className="!bg-white !border-[#98342d]/20">
              <CardHeader>
                <CardTitle className="text-[#98342d]">Product Images *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                      isDragOver 
                        ? 'border-[#98342d] bg-[#98342d]/5' 
                        : 'border-[#98342d]/30 hover:border-[#98342d]/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <ImageIcon className={`h-12 w-12 mx-auto mb-4 transition-colors ${
                      isDragOver ? 'text-[#98342d]' : 'text-[#98342d]/40'
                    }`} />
                    <p className={`mb-4 transition-colors ${
                      isDragOver ? 'text-[#98342d]' : 'text-[#98342d]/70'
                    }`}>
                      {isDragOver ? 'Drop images here!' : 'Drag and drop images here, or click to select'}
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button" 
                      disabled={imageUploadPending}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {imageUploadPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Choose Files
                    </Button>
                  </div>

                  {/* Preview Images */}
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-[#98342d]/80">Selected Images ({formData.images.length})</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative group bg-[#98342d]/5 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-[#98342d]/10 rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-[#98342d]/50" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#98342d] truncate">{file.name}</p>
                                <p className="text-xs text-[#98342d]/60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                {index === 0 && (
                                  <p className="text-xs text-green-600 font-medium">Main Image</p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-[#98342d]/60">
                        First image will be used as the main product image
                      </p>
                    </div>
                  )}
                  {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                </div>
              </CardContent>
            </Card>
          </SlideUp>

          {/* Collections */}
          <SlideUp delay={0.6}>
            <Card className="!bg-white !border-[#98342d]/20">
              <CardHeader>
                <CardTitle className="text-[#98342d]">Collections *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[#98342d]/80">Style Collections</Label>
                  <div className="space-y-2 mt-2">
                    {styleCollections.map(collection => (
                      <div key={collection.id} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={`style-${collection.id}`}
                          checked={formData.collections.includes(collection.id)}
                          onChange={(e) => handleArrayChange('collections', collection.id, e.target.checked)}
                          className="rounded border-[#98342d]/30 text-[#98342d] focus:ring-[#98342d]"
                        />
                        <Label htmlFor={`style-${collection.id}`} className="text-[#98342d]/80 text-sm">{collection.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-[#98342d]/80">Space Collections</Label>
                  <div className="space-y-2 mt-2">
                    {spaceCollections.map(collection => (
                      <div key={collection.id} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={`space-${collection.id}`}
                          checked={formData.collections.includes(collection.id)}
                          onChange={(e) => handleArrayChange('collections', collection.id, e.target.checked)}
                          className="rounded border-[#98342d]/30 text-[#98342d] focus:ring-[#98342d]"
                        />
                        <Label htmlFor={`space-${collection.id}`} className="text-[#98342d]/80 text-sm">{collection.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                {errors.collections && <p className="text-red-500 text-xs mt-1">{errors.collections}</p>}
              </CardContent>
            </Card>
          </SlideUp>

          {/* Room Types */}
          <SlideUp delay={0.7}>
            <Card className="!bg-white !border-[#98342d]/20">
              <CardHeader>
                <CardTitle className="text-[#98342d]">Room Types *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roomTypes.map(roomType => (
                    <div key={roomType} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`room-${roomType}`}
                        checked={formData.roomTypes.includes(roomType)}
                        onChange={(e) => handleArrayChange('roomTypes', roomType, e.target.checked)}
                        className="rounded border-[#98342d]/30 text-[#98342d] focus:ring-[#98342d]"
                      />
                      <Label htmlFor={`room-${roomType}`} className="text-[#98342d]/80 text-sm">{roomType}</Label>
                    </div>
                  ))}
                </div>
                {errors.roomTypes && <p className="text-red-500 text-xs mt-1">{errors.roomTypes}</p>}
              </CardContent>
            </Card>
          </SlideUp>
        </div>
      </Grid>

      {/* Action Buttons */}
      <FadeIn delay={0.8}>
        <div className="flex items-center justify-between pt-6 border-t border-[#98342d]/20">
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              Cancel
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(true)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {mode === 'edit' ? 'Save as Draft' : 'Save as Draft'}
            </Button>
            <Button 
              onClick={() => handleSubmit(false)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {mode === 'edit' ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}