# Equza Living Co. Website Platform - Technical Design Document

**Implementation Status**: Phase 8 Complete (75% Total Progress)
**Last Updated**: January 2025

## Implementation Progress Summary

### ✅ Completed Phases (1-8):
- **Phase 1-2**: Complete Next.js 15 + TypeScript + Firebase infrastructure with Admin SDK
- **Phase 3**: UI component system with 30+ components (Button, Input, Card, Modal, Typography, etc.)
- **Phase 4**: Layout system (Header, Footer, Navigation, Admin layouts, Page templates)
- **Phase 5**: Business components (Product cards/grids, Collection components, Form components)
- **Phase 6**: Data layer with Firebase safe patterns and server actions
- **Phase 7**: Complete page implementation (Homepage, Collections, Products, Customize)
- **Phase 8**: Full admin panel with comprehensive product management

### 🎯 Current Status: 
**Ready for Phase 9** (Advanced Features) - Core platform complete with full admin functionality including comprehensive product management.

### 📁 Component Inventory (Implemented):
- **UI Components**: 15+ base components with TypeScript and accessibility
- **Layout Components**: Header, Footer, LeftNavigation, UtilityBanner, Admin layouts
- **Product Components**: ProductCard, ProductGrid, ProductDetail, ImageGallery, FilterSidebar, SearchBar
- **Collection Components**: CollectionCard, CollectionGrid, CollectionHero, CollectionTabs
- **Form Components**: ContactForm, CustomizeForm, EnquiryModal, TradeForm, FileUpload
- **Admin Components**: AdminAuthGuard, AdminHeader, AdminSidebar, **AddProductForm**
- **Homepage Components**: HeroSection, CollectionTiles, CustomRugBanner, OurStoryTeaser
- **Templates**: PublicPageTemplate, AdminPageTemplate, FormPageTemplate

### 🎯 **New: Comprehensive Add Product Form**
- **Full form state management** with React hooks and validation
- **Dynamic data loading** from Firestore (collections, room types, materials)
- **Multi-file image upload** with Firebase Storage integration
- **Real-time validation** with field-level error handling
- **Server action integration** with comprehensive error feedback
- **Brand-consistent UI** following UI_UX_Development_Guide.md
- **Auto-generation features** (slug from name, SEO from content)
- **Complete product specifications** (materials, weave type, origin, craft time, dimensions)
- **Advanced features** (draft/publish control, featured toggle, pricing management)

## 1. Architecture Overview

### 1.1 System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 App Router + React 18 + TypeScript             │
│  - Server Components (SSR/SSG)                             │
│  - Client Components (Interactive Elements)                │
│  - API Routes (Server Actions)                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Firebase Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Authentication  │  Firestore     │  Storage    │ Functions │
│  - Google OAuth  │  - Collections │  - Images   │ - API     │
│  - Email/Pass    │  - Products    │  - PDFs     │ - Email   │
│  - Admin Roles   │  - Leads       │  - Uploads  │ - CRM     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                External Integrations                        │
├─────────────────────────────────────────────────────────────┤
│   Calendly API   │   Email Service   │   Analytics         │
│   - Bookings     │   - Auto-replies  │   - GTM             │
│   - Scheduling   │   - Notifications │   - Performance     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

#### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with CSS-in-JS for complex components
- **UI Components**: Custom components following design system
- **State Management**: React Context + Zustand for complex state
- **Form Handling**: React Hook Form + Zod validation
- **Animation**: Framer Motion for micro-interactions

#### Backend Stack
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Functions**: Firebase Functions (Node.js)
- **API**: Next.js API Routes + Server Actions

#### Development & Deployment
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Build Tool**: Next.js built-in Webpack
- **Deployment**: Vercel (recommended) or Firebase Hosting
- **Environment**: Development, Staging, Production

## 2. Project Structure & File Organization

### 2.1 Folder Structure
```
equza-living-co-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin panel routes
│   │   │   ├── admin/
│   │   │   │   ├── collections/
│   │   │   │   ├── products/
│   │   │   │   ├── leads/
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   ├── collections/       # Collection pages
│   │   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   ├── product/           # Product detail pages
│   │   │   └── [slug]/
│   │   ├── spaces/            # Space-based pages
│   │   │   └── [room]/
│   │   ├── craftsmanship/     # Static pages
│   │   ├── our-story/
│   │   ├── trade/
│   │   ├── customize/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LeftNavigation.tsx
│   │   │   └── UtilityBanner.tsx
│   │   ├── forms/            # Form components
│   │   │   ├── ContactForm.tsx
│   │   │   ├── CustomizeForm.tsx
│   │   │   ├── EnquiryModal.tsx
│   │   │   └── TradeForm.tsx
│   │   ├── product/          # Product-related components
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   └── FilterSidebar.tsx
│   │   ├── collections/      # Collection components
│   │   │   ├── CollectionGrid.tsx
│   │   │   ├── CollectionTabs.tsx
│   │   │   └── CollectionHero.tsx
│   │   └── admin/            # Admin panel components
│   │       ├── AdminLayout.tsx
│   │       ├── DataTable.tsx
│   │       ├── FileUpload.tsx
│   │       └── forms/
│   ├── lib/                  # Utility functions
│   │   ├── firebase/         # Firebase configuration
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   ├── storage.ts
│   │   │   └── server-app.ts
│   │   ├── utils/            # General utilities
│   │   │   ├── cn.ts         # Class name utility
│   │   │   ├── format.ts     # Data formatting
│   │   │   ├── validation.ts # Validation schemas
│   │   │   └── constants.ts  # App constants
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useDebounce.ts
│   │   └── actions/          # Server actions
│   │       ├── contact.ts
│   │       ├── customize.ts
│   │       ├── enquiry.ts
│   │       └── admin/
│   ├── types/                # TypeScript definitions
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── collection.ts
│   │   ├── lead.ts
│   │   └── index.ts
│   └── styles/               # Additional styles
│       ├── globals.css
│       └── components.css
├── public/                   # Static assets
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── assets/
│       └── lookbook.pdf
├── docs/                     # Documentation
├── .env.local               # Environment variables
├── .env.example            # Environment template
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── storage.rules           # Storage security rules
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

### 2.2 Component Architecture Principles

#### Atomic Design Pattern
- **Atoms**: Basic UI elements (Button, Input, Typography)
- **Molecules**: Simple component combinations (SearchBox, ProductCard)
- **Organisms**: Complex UI sections (Header, ProductGrid, Footer)
- **Templates**: Page-level layouts
- **Pages**: Specific page implementations

#### Component Design Guidelines
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Use component composition patterns
- **Props Interface**: Well-defined TypeScript interfaces for all props
- **Safe Data Contracts**: Components receive guaranteed-safe data structures
- **No Defensive Coding**: Components trust their data contracts, no null checks needed
- **Error Boundaries**: All sections wrapped with error boundaries for graceful failure
- **Accessibility**: WCAG 2.1 AA compliance built-in
- **Performance**: Lazy loading and React.memo where appropriate

## 3. Database Design & Firebase Implementation

### 3.1 Firestore Database Structure

#### Collections Schema

```typescript
// collections/{collectionId}
interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'style' | 'space';
  heroImage: {
    url: string;
    alt: string;
    storageRef: string;
  };
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  productIds: string[];
}
```

#### Products Schema

```typescript
// products/{productId}
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  story: string;
  images: ProductImage[];
  specifications: {
    materials: string[];
    weaveType: string;
    availableSizes: ProductSize[];
    origin: string;
    craftTime: string;
  };
  collections: string[];
  roomTypes: string[];
  price: {
    isVisible: boolean;
    startingFrom: number;
    currency: string;
  };
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ProductImage {
  url: string;
  alt: string;
  storageRef: string;
  isMain: boolean;
  sortOrder: number;
}

interface ProductSize {
  dimensions: string;
  isCustom: boolean;
}
```

#### Leads Management

```typescript
// leads/{leadId}
interface Lead {
  id: string;
  type: 'contact' | 'trade' | 'customize' | 'product-enquiry';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
  productId?: string;
  customizationDetails?: CustomizationDetails;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  assignedTo?: string;
  notes: LeadNote[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface CustomizationDetails {
  preferredSize: string;
  preferredMaterials: string[];
  moodboardFiles: UploadedFile[];
}

interface LeadNote {
  content: string;
  createdBy: string;
  createdAt: Timestamp;
}
```

### 3.2 Firebase Security Rules

#### Firestore Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for all active content - NO AUTH REQUIRED
    match /collections/{document} {
      allow read: if resource.data.isActive == true;
      allow write: if isAdmin();
    }
    
    match /products/{document} {
      allow read: if resource.data.isActive == true;
      allow write: if isAdmin();
    }
    
    match /pages/{document} {
      allow read: if resource.data.isActive == true;
      allow write: if isAdmin();
    }
    
    match /settings/global {
      allow read: if true; // Public settings like contact email, social links
      allow write: if isAdmin();
    }
    
    match /lookbook/current {
      allow read: if true; // Public access to download lookbook
      allow write: if isAdmin();
    }
    
    // Lead submissions - ANONYMOUS USERS CAN CREATE LEADS
    match /leads/{document} {
      allow create: if true; // Allow anonymous lead creation from forms
      allow read, update, delete: if isAdmin();
    }
    
    // Admin-only collections
    match /adminUsers/{document} {
      allow read, write: if isAdmin() && resource.data.id == request.auth.uid;
    }
    
    // Helper function to check admin permissions
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.isActive == true;
    }
  }
}
```

#### Storage Rules
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access for images and lookbook - NO AUTH REQUIRED
    match /images/{allPaths=**} {
      allow read: if true; // Public access to product images
      allow write: if isAdmin();
    }
    
    match /lookbook/{allPaths=**} {
      allow read: if true; // Public access to download lookbook PDF
      allow write: if isAdmin();
    }
    
    // Anonymous uploads for customization forms (temp storage)
    match /uploads/temp/{sessionId}/{allPaths=**} {
      allow create: if true; // Allow anonymous uploads for customize form
      allow read: if true; // Allow reading uploaded files
    }
    
    // Admin uploads
    match /uploads/admin/{allPaths=**} {
      allow read, write: if isAdmin();
    }
    
    function isAdmin() {
      return request.auth != null; // Simplified for storage rules
    }
  }
}
```

### 3.3 Firebase Functions

#### Lead Processing Function
```typescript
// functions/src/leads.ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { sendEmail } from './email-service';
import { integrateCRM } from './crm-service';

export const processLead = onDocumentCreated(
  'leads/{leadId}',
  async (event) => {
    const leadData = event.data?.data();
    if (!leadData) return;

    try {
      // Send email notification to admin
      await sendEmail({
        to: 'admin@equzalivingco.com',
        subject: `New ${leadData.type} lead from ${leadData.name}`,
        template: 'lead-notification',
        data: leadData
      });

      // Send auto-reply to user
      await sendEmail({
        to: leadData.email,
        subject: 'Thank you for your interest in Equza Living Co.',
        template: 'lead-auto-reply',
        data: leadData
      });

      // Integrate with CRM
      await integrateCRM(leadData);

    } catch (error) {
      console.error('Error processing lead:', error);
    }
  }
);
```

#### Image Processing Function
```typescript
// functions/src/images.ts
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { getStorage } from 'firebase-admin/storage';
import sharp from 'sharp';

export const processImage = onObjectFinalized(async (event) => {
  const filePath = event.data.name;
  const contentType = event.data.contentType;

  // Only process images
  if (!contentType?.startsWith('image/')) return;

  const bucket = getStorage().bucket();
  const file = bucket.file(filePath);

  try {
    // Download the file
    const [imageBuffer] = await file.download();

    // Generate thumbnails
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(300, 300, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();

    // Upload thumbnail
    const thumbnailPath = filePath.replace(/\.[^.]+$/, '_thumb.webp');
    await bucket.file(thumbnailPath).save(thumbnailBuffer, {
      metadata: { contentType: 'image/webp' }
    });

    // Generate WebP version for modern browsers
    const webpBuffer = await sharp(imageBuffer)
      .webp({ quality: 85 })
      .toBuffer();

    const webpPath = filePath.replace(/\.[^.]+$/, '.webp');
    await bucket.file(webpPath).save(webpBuffer, {
      metadata: { contentType: 'image/webp' }
    });

  } catch (error) {
    console.error('Error processing image:', error);
  }
});
```

## 4. Frontend Implementation Strategy

### 4.1 Next.js App Router Implementation

#### Route Structure & Page Components
```typescript
// app/layout.tsx - Root Layout (NO AUTH REQUIRED)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* No AuthProvider needed for public site */}
        <UtilityBanner />
        <Header />
        <LeftNavigation />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

// app/(admin)/layout.tsx - Admin Layout (AUTH REQUIRED)
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminAuthGuard>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <AdminSidebar />
          <main className="ml-64 p-8">
            {children}
          </main>
        </div>
      </AdminAuthGuard>
    </AuthProvider>
  );
}

// app/page.tsx - Homepage
export default async function HomePage() {
  const collections = await getCollections();
  const featuredProducts = await getFeaturedProducts();
  
  return (
    <>
      <HeroSection />
      <CollectionsByStyle collections={collections} />
      <CollectionsBySpace />
      <CustomRugBanner />
      <OurStoryTeaser />
      <LookbookSection />
      <ContactSection />
    </>
  );
}

// app/collections/[slug]/page.tsx - Collection Page
export default async function CollectionPage({
  params: { slug }
}: {
  params: { slug: string };
}) {
  const collection = await getCollection(slug);
  const products = await getProductsByCollection(slug);
  
  if (!collection) notFound();
  
  return (
    <>
      <CollectionHero collection={collection} />
      <ProductGrid products={products} />
    </>
  );
}
```

### 4.2 Component Implementation Patterns

#### Server Components for Data Fetching
```typescript
// components/product/ProductGrid.tsx (Server Component)
import { getProducts } from '@/lib/firebase/firestore';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  collectionId?: string;
  roomType?: string;
  limit?: number;
}

export default async function ProductGrid({
  collectionId,
  roomType,
  limit = 12
}: ProductGridProps) {
  const products = await getProducts({
    collectionId,
    roomType,
    limit,
    isActive: true
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Client Components for Interactivity
```typescript
// components/product/ProductCard.tsx (Client Component)
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { EnquiryModal } from '@/components/forms/EnquiryModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.alt}
            fill
            className={`object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <span className="text-white font-medium">View Details</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.specifications.materials.join(', ')}</p>
        <button
          onClick={() => setIsEnquiryOpen(true)}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          Enquire Now
        </button>
      </div>
      
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        product={product}
      />
    </div>
  );
}
```

### 4.3 Form Implementation with React Hook Form + Zod

#### Form Schema Definition
```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

export const customizeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  preferredSize: z.string().min(1, 'Preferred size is required'),
  preferredMaterials: z.array(z.string()).optional(),
  moodboardFiles: z.array(z.instanceof(File)).optional(),
  message: z.string().optional(),
});

export const enquiryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Please provide more details about your enquiry'),
  productId: z.string().min(1, 'Product ID is required'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CustomizeFormData = z.infer<typeof customizeFormSchema>;
export type EnquiryFormData = z.infer<typeof enquiryFormSchema>;
```

#### Form Component Implementation
```typescript
// components/forms/ContactForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { contactFormSchema, ContactFormData } from '@/lib/validation/schemas';
import { submitContactForm } from '@/lib/actions/contact';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await submitContactForm(data);
      
      if (result.success) {
        toast.success('Thank you for your message. We\'ll get back to you soon!');
        reset();
      } else {
        toast.error(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
        />
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          rows={4}
          {...register('message')}
          className={errors.message ? 'border-red-500' : ''}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
```

### 4.4 Server Actions Implementation

#### Contact Form Server Action (Anonymous Submission)
```typescript
// lib/actions/contact.ts
'use server';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { contactFormSchema, ContactFormData } from '@/lib/validation/schemas';
import { checkRateLimit } from '@/lib/middleware/rateLimit';
import { headers } from 'next/headers';

export async function submitContactForm(data: ContactFormData) {
  try {
    // Rate limiting for anonymous submissions
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';
    
    if (!checkRateLimit(ip, 3, 3600000)) { // 3 submissions per hour
      return { 
        success: false, 
        error: 'Too many submissions. Please try again later.' 
      };
    }
    
    // Validate data on server side
    const validatedData = contactFormSchema.parse(data);
    
    // Create lead document (NO AUTH REQUIRED)
    const leadData = {
      type: 'contact' as const,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || null,
      message: validatedData.message,
      source: 'contact-form',
      status: 'new' as const,
      ipAddress: ip,
      userAgent: headersList.get('user-agent') || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Save to Firestore (anonymous write allowed by rules)
    await addDoc(collection(db, 'leads'), leadData);
    
    return { success: true };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return { 
      success: false, 
      error: 'Failed to submit form. Please try again.' 
    };
  }
}
```

## 5. UI/UX Implementation Strategy

### 5.1 Design System Implementation

#### Color Palette
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#98342d',
        background: '#f1eee9',
        accent: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f4f4f3',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        }
      },
      fontFamily: {
        'serif': ['Libre Baskerville', 'serif'],
        'sans': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
}
```

#### Typography System
```typescript
// components/ui/Typography.tsx
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn(
      'font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-gray-900',
      className
    )}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn(
      'font-serif text-3xl md:text-4xl font-normal tracking-tight text-gray-900',
      className
    )}>
      {children}
    </h2>
  );
}

export function Body({ children, className }: TypographyProps) {
  return (
    <p className={cn(
      'font-sans text-base leading-relaxed text-gray-700',
      className
    )}>
      {children}
    </p>
  );
}
```

### 5.2 Responsive Design Strategy

#### Breakpoint System
```typescript
// lib/utils/breakpoints.ts
export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large desktop
} as const;

// Mobile-first media queries
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;
```

#### Grid System Implementation
```typescript
// components/ui/Grid.tsx
interface GridProps {
  children: React.ReactNode;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function Grid({ 
  children, 
  cols = { default: 1 }, 
  gap = 4, 
  className 
}: GridProps) {
  const gridClasses = [
    `grid`,
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}
```

### 5.3 Animation & Micro-interactions

#### Framer Motion Implementation
```typescript
// components/ui/MotionWrapper.tsx
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export function MotionWrapper({ 
  children, 
  className,
  delay = 0,
  duration = 0.6,
  y = 20
}: MotionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1]
      }}
    >
      {children}
    </motion.div>
  );
}
```

#### Hover Effects for Product Cards
```typescript
// components/product/ProductCard.tsx (enhanced)
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm"
      whileHover={{ y: -4, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="aspect-square relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.alt}
            fill
            className="object-cover"
          />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            className="text-white font-medium"
            initial={{ y: 10, opacity: 0 }}
            animate={{ 
              y: isHovered ? 0 : 10, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            View Details
          </motion.span>
        </motion.div>
      </div>
      
      {/* Rest of component... */}
    </motion.div>
  );
}
```

## 6. Performance Optimization Strategy

### 6.1 Image Optimization

#### Next.js Image Component Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig;
```

#### Progressive Image Loading
```typescript
// components/ui/ProgressiveImage.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}
```

### 6.2 Code Splitting & Lazy Loading

#### Dynamic Imports for Heavy Components
```typescript
// app/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ContactForm = dynamic(() => import('@/components/forms/ContactForm'), {
  loading: () => <ContactFormSkeleton />,
  ssr: false // Only load on client if needed
});

const ProductGrid = dynamic(() => import('@/components/product/ProductGrid'), {
  loading: () => <ProductGridSkeleton />
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
      <Suspense fallback={<ContactFormSkeleton />}>
        <ContactForm />
      </Suspense>
    </>
  );
}
```

### 6.3 Caching Strategy

#### Firebase Data Caching
```typescript
// lib/firebase/cache.ts
import { unstable_cache } from 'next/cache';
import { getCollections as _getCollections } from './firestore';

export const getCollections = unstable_cache(
  async () => {
    return await _getCollections();
  },
  ['collections'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['collections']
  }
);

export const getProducts = unstable_cache(
  async (filters: ProductFilters) => {
    return await _getProducts(filters);
  },
  ['products'],
  {
    revalidate: 1800, // Cache for 30 minutes
    tags: ['products']
  }
);
```

## 7. SEO & Analytics Implementation

### 7.1 Metadata Generation

#### Dynamic Metadata for Product Pages
```typescript
// app/product/[slug]/page.tsx
import { Metadata } from 'next';
import { getProduct } from '@/lib/firebase/firestore';

export async function generateMetadata({
  params: { slug }
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.seoTitle || `${product.name} | Equza Living Co.`,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0]?.url || '',
          width: 1200,
          height: 630,
          alt: product.images[0]?.alt || product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.images[0]?.url || ''],
    },
    alternates: {
      canonical: `/product/${slug}`,
    },
  };
}
```

### 7.2 Structured Data Implementation

#### Product Schema
```typescript
// components/seo/ProductSchema.tsx
import { Product } from '@/types';

interface ProductSchemaProps {
  product: Product;
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images.map(img => img.url),
    "brand": {
      "@type": "Brand",
      "name": "Equza Living Co."
    },
    "category": product.collections.join(', '),
    "material": product.specifications.materials.join(', '),
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": product.price.currency,
      "price": product.price.startingFrom,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

### 7.3 Analytics Integration

#### Google Tag Manager Setup
```typescript
// components/analytics/GTM.tsx
import Script from 'next/script';

export function GTM() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  
  if (!GTM_ID) return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
```

## 8. Security Implementation

### 8.1 Environment Variables
```bash
# .env.local - All external service keys for easy ownership transfer

# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# Google Services
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# External Integrations
CALENDLY_API_TOKEN=your_calendly_api_token
CALENDLY_USER_URI=https://api.calendly.com/users/your_user_id

# Email Service (choose one)
RESEND_API_KEY=re_xxxxxxxxxx
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxx
# OR  
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587
NODEMAILER_USER=your_email@gmail.com
NODEMAILER_PASS=your_app_password

# Contact Information (can be changed easily)
NEXT_PUBLIC_CONTACT_EMAIL=info@equzalivingco.com
NEXT_PUBLIC_CONTACT_PHONE=+1234567890

# Social Media Links (can be updated easily)
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/equzalivingco
NEXT_PUBLIC_PINTEREST_URL=https://pinterest.com/equzalivingco
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/equzalivingco

# CRM Integration (optional)
CRM_API_KEY=your_crm_api_key
CRM_ENDPOINT=https://api.yourcrm.com

# Development/Production Environment
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://equzalivingco.com

# Security
NEXTAUTH_SECRET=your_nextauth_secret_for_admin_auth
NEXTAUTH_URL=https://equzalivingco.com

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

### 8.2 Input Sanitization
```typescript
// lib/utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: []
  });
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
```

### 8.3 Rate Limiting (For Anonymous Form Submissions)
```typescript
// lib/middleware/rateLimit.ts
const rateLimit = new Map();

export function checkRateLimit(
  identifier: string, 
  limit: number = 5, 
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const key = identifier;
  
  const requests = rateLimit.get(key) || [];
  const validRequests = requests.filter((time: number) => now - time < windowMs);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  rateLimit.set(key, validRequests);
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to cleanup
    for (const [key, requests] of rateLimit.entries()) {
      const validReqs = requests.filter((time: number) => now - time < windowMs);
      if (validReqs.length === 0) {
        rateLimit.delete(key);
      } else {
        rateLimit.set(key, validReqs);
      }
    }
  }
  
  return true;
}

// Rate limiting middleware for different form types
export const RATE_LIMITS = {
  contact: { limit: 3, window: 3600000 }, // 3 per hour
  customize: { limit: 2, window: 3600000 }, // 2 per hour  
  enquiry: { limit: 5, window: 3600000 }, // 5 per hour
  trade: { limit: 1, window: 86400000 }, // 1 per day
} as const;
```

## 9. Testing Strategy

### 9.1 Component Testing Setup
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProduct } from '@/lib/test-utils/mocks';

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.images[0].alt)).toBeInTheDocument();
    expect(screen.getByText('Enquire Now')).toBeInTheDocument();
  });

  it('opens enquiry modal when enquire button is clicked', () => {
    render(<ProductCard product={mockProduct} />);
    
    fireEvent.click(screen.getByText('Enquire Now'));
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

### 9.2 Integration Testing
```typescript
// __tests__/integration/contact-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/forms/ContactForm';

describe('Contact Form Integration', () => {
  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message content');
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });
  });
});
```

## 10. Deployment Strategy

### 10.1 Environment Setup
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          # ... other environment variables
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 10.2 Performance Monitoring
```typescript
// lib/monitoring/performance.ts
export function trackWebVitals(metric: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      custom_map: { metric_id: 'web_vitals' },
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

// app/layout.tsx
import { trackWebVitals } from '@/lib/monitoring/performance';

export function reportWebVitals(metric: any) {
  trackWebVitals(metric);
}
```

## 11. Implementation Status & Next Steps

### 11.1 Remaining Work (Phase 7-12)

#### Phase 7: Page Implementation (Next Priority)
The component foundation is complete. Remaining work focuses on creating page routes:

**Pending Page Routes:**
- `/collections` - Collections landing with tabs
- `/collections/[slug]` - Individual collection pages  
- `/product/[slug]` - Product detail pages
- `/spaces/[room]` - Space-based product pages
- `/craftsmanship` - Static content page
- `/our-story` - Brand story page
- `/trade` - Trade partnership page
- `/customize` - Custom rug form page

**Components Ready for Integration:**
All page components exist and are tested. Implementation requires:
1. Creating page route files in `src/app/`
2. Integrating existing components
3. Adding proper metadata and SEO
4. Connecting to Firebase data layer

#### Phase 8-12: Advanced Features
- Admin panel implementation
- SEO optimization  
- Performance tuning
- Testing suite
- Deployment automation

### 11.2 Architecture Decisions Made

#### Safe Data Patterns
Implemented comprehensive error boundary system with:
- `SafeCollection`, `SafeProduct` types
- Error boundaries for each page section
- Graceful fallbacks for missing data
- Loading states for all components

#### Component Organization
- Modular component architecture
- TypeScript-first approach
- Design system with consistent variants
- Accessible components (WCAG 2.1 AA)

#### Firebase Integration
- Client/server Firebase utilities
- Safe data fetching functions
- Server actions for form submissions
- Comprehensive error handling

This comprehensive design document provides the technical blueprint for implementing the Equza Living Co. website platform using modern web development best practices, ensuring scalability, performance, and maintainability. 