# Equza Living Co. Website Platform - Product Requirements Document (PRD)

## 1. Project Overview

### Vision
Build a scalable, elegant, and responsive web platform for Equza Living Co. that showcases premium handcrafted rugs, enables seamless customer journey from discovery to enquiry/purchase, and supports future growth through content management capabilities.

### Current Implementation Status (Updated Jan 2025)
**Phase Progress: 8 of 12 phases completed (75%)**

#### ✅ Completed (Phases 1-8):
- **Foundation & Infrastructure**: Complete Next.js 15 + TypeScript + Firebase setup with admin SDK
- **UI Component System**: 30+ reusable components with comprehensive design system
- **Layout Components**: Header, footer, navigation, admin layouts with responsive design
- **Core Business Components**: Product cards/grids, collection components, comprehensive form components
- **Data Layer**: Firebase integration with safe data patterns and server actions
- **Page Implementation**: Homepage, collections, products, customize pages with full functionality
- **Admin Panel**: Complete admin authentication, dashboard, and management interfaces
- **Product Management**: Comprehensive Add Product form with validation, file upload, and data integration

#### 🔄 Next Phase (Phase 9-12):
- Advanced features (search, filtering, analytics)
- Testing and optimization
- Deployment and production setup
- Documentation and maintenance

### Business Goals
- Establish Equza Living Co. as a premium handcrafted rug brand online
- Generate qualified leads through enquiries and consultations
- Showcase craftsmanship and heritage storytelling
- Enable trade partnerships and custom rug orders
- Provide foundation for future e-commerce expansion

### Success Metrics
- Lead conversion rate: Target 5-8% of visitors submitting enquiries
- Engagement: Average session duration >3 minutes
- Performance: <2s page load times, 95+ Lighthouse scores
- Business: 20% increase in trade partnership inquiries

## 2. Target Audience

### Primary Users
1. **Homeowners** (40% of traffic)
   - Seeking premium rugs for personal spaces
   - Budget: $500-5000+
   - Behavior: Browse by style/space, download lookbook

2. **Interior Designers** (35% of traffic)
   - Professional purchasers for client projects
   - Budget: $1000-10000+
   - Behavior: Explore collections, request custom designs

3. **Trade Partners** (15% of traffic)
   - Retailers, wholesalers, design firms
   - Seeking partnership opportunities
   - Behavior: Access trade page, submit partnership interest

4. **Admin Users** (10% of traffic)
   - Internal team managing content and leads
   - Need efficient content management tools

## 3. Feature Requirements & User Stories

### 3.1 Global UI Components

#### User Story 1: Utility Banner
**As a** visitor  
**I want** to see prominent contact options  
**So that** I can easily reach out via email or book a consultation

**Acceptance Criteria:**
- [x] Banner displays rotating CTAs every 5 seconds
- [x] Pauses rotation on hover, resumes on mouse leave
- [x] Email CTA opens mailto:info@equzalivingco.com
- [x] Consultation CTA opens Calendly in new tab
- [x] Responsive: stacks vertically on ≤768px screens
- [x] Full-width with minimal height design

#### User Story 2: Navigation
**As a** visitor  
**I want** consistent navigation across all pages  
**So that** I can easily explore the website

**Acceptance Criteria:**
- [x] Logo centered at top, clicking returns to homepage
- [x] Left vertical menu with: Contact Us, Craftsmanship, Our Story, Trade, Collections
- [x] Fixed positioning on desktop, collapsible hamburger on ≤1024px screens
- [x] Footer with sitemap links, social icons, copyright
- [x] Theme support (light/dark as per brand guidelines)

### 3.2 Homepage

#### User Story 3: Hero Section
**As a** visitor  
**I want** to immediately understand what Equza Living Co. offers  
**So that** I can decide if I want to explore further

**Acceptance Criteria:**
- [x] Full-width hero image with subtle animation
- [x] Heading: "Crafted Calm for Modern Spaces"
- [x] CTA button "Explore Now" routes to /collections
- [x] Responsive across all devices
- [x] Loads in <2 seconds

#### User Story 4: Collection Discovery
**As a** homeowner/designer  
**I want** to browse rugs by style and space  
**So that** I can find rugs that match my needs

**Acceptance Criteria:**
- [x] Rugs by Style: 6 tiles (Botanica, Avant, Graphika, Heirloom, Lumière, Terra)
- [x] Rugs by Space: 3 mega tiles (Living Room, Bedroom, Hallway)
- [x] Hover effects: zoom + label overlay
- [ ] Click navigation to respective collection/space pages (Pending - Page routes not implemented)
- [x] Grid layout responsive across devices

#### User Story 5: Custom Rug Promotion
**As a** designer  
**I want** to know about custom rug options  
**So that** I can create unique pieces for my clients

**Acceptance Criteria:**
- [x] Banner with text: "You Imagine It. We Weave It."
- [ ] CTA "Customize Now" routes to /customize form (Form implemented, route pending)
- [x] Visually prominent placement on homepage
- [x] Responsive design

#### User Story 6: Brand Storytelling
**As a** visitor  
**I want** to learn about Equza Living Co.'s heritage  
**So that** I can connect with the brand values

**Acceptance Criteria:**
- [x] Our Story teaser with 2-3 lines summary
- [ ] "Read More" CTA routes to /our-story (Component ready, route pending)
- [x] Lookbook section with thumbnail and PDF download
- [x] Download links to /assets/lookbook.pdf

#### User Story 7: Contact & Lead Capture
**As a** potential customer  
**I want** to easily contact Equza Living Co.  
**So that** I can get information or request assistance

**Acceptance Criteria:**
- [x] Contact form with fields: Name, Email, Phone, Message
- [x] Form validation (required fields, email format)
- [x] Submit to /api/contact endpoint
- [x] Success toast/alert on submission
- [x] Error handling for failed submissions

### 3.3 Collections & Products

#### User Story 8: Collection Browsing
**As a** shopper  
**I want** to browse collections in an organized way  
**So that** I can find rugs that match my style preferences

**Acceptance Criteria:**
- [x] Collections components with tabs: "Rugs by Style", "Rugs by Space" (Components ready)
- [x] Style tab shows all 6 style collections
- [x] Space tab shows 3 room categories
- [x] Collection hero banner with image + description (Component ready)
- [x] Product grid with image, name, material display (Components ready)
- [x] Hover effects and quick-view options (Components ready)
- [ ] Full page routes implementation pending

#### User Story 9: Product Detail Experience
**As a** shopper  
**I want** detailed product information  
**So that** I can make informed enquiry decisions

**Acceptance Criteria:**
- [x] High-resolution image gallery with zoom functionality (Component ready)
- [x] Product specifications: sizes, materials, weave type (Component ready)
- [x] "The Story Behind This Rug" section (100-200 words) (Component ready)
- [x] Enquiry modal with pre-filled product name (Component ready)
- [x] Modal form: Name, Email, Message fields (Component ready)
- [x] Submit to /api/enquire with success feedback (Component ready)
- [ ] Full product page routes implementation pending

#### User Story 10: Space-Based Shopping
**As a** homeowner  
**I want** to see rugs curated for specific rooms  
**So that** I can find pieces that fit my space

**Acceptance Criteria:**
- [x] Space components for Living Room, Bedroom, Hallway (Components ready)
- [x] Curated product grids for each space type (Components ready)
- [x] Product cards show: Image, Name, Material (Components ready)
- [x] Consistent layout with other product pages (Components ready)
- [ ] Full space page routes implementation pending

### 3.4 Static Content Pages

#### User Story 11: Craftsmanship Showcase
**As a** quality-conscious customer  
**I want** to understand Equza Living Co.'s craftsmanship  
**So that** I can appreciate the value and quality

**Acceptance Criteria:**
- [ ] Editorial-style layout with text/image interspersed
- [ ] "Hands of Heritage" section with artisan portraits/close-ups
- [ ] Optional parallax effects for visual appeal
- [ ] Rich text content management capability
- [ ] Location highlights (Bhadohi, Kashmir, Jaipur)

#### User Story 12: Brand Story
**As a** visitor  
**I want** to learn about Equza Living Co.'s history and values  
**So that** I can connect emotionally with the brand

**Acceptance Criteria:**
- [ ] Storytelling-driven layout
- [ ] Vertical scroll timeline with high-quality imagery
- [ ] Brand vision and heritage content
- [ ] Location and craftsmanship highlights
- [ ] Responsive design for all devices

#### User Story 13: Trade Partnership
**As a** trade partner  
**I want** to understand partnership benefits  
**So that** I can evaluate working with Equza Living Co.

**Acceptance Criteria:**
- [ ] Benefits section for trade partners
- [ ] Partnership contact form (same fields as homepage)
- [ ] Testimonials or brand trust indicators
- [ ] Submit to /api/trade endpoint
- [ ] Success confirmation and follow-up process

### 3.5 Custom Rug Order System

#### User Story 14: Custom Rug Request
**As a** designer  
**I want** to request custom rug designs  
**So that** I can offer unique pieces to my clients

**Acceptance Criteria:**
- [x] Form fields: Name (required), Email (required), Phone (optional)
- [x] Preferred Size: Dropdown with preset options + "Other" (required)
- [x] Preferred Material: Multiselect (optional)
- [x] Inspiration/Moodboard: File upload (jpg/png/pdf, ≤10MB) (optional)
- [x] Message: Textarea (optional)
- [x] Form validation and error handling
- [x] Submit triggers auto-reply email confirmation
- [x] CRM integration for lead management
- [ ] Custom rug page route implementation pending

### 3.6 Admin Panel ✅ **IMPLEMENTED**

#### User Story 15: Content Management ✅ **COMPLETE**
**As an** admin user  
**I want** to manage website content  
**So that** I can keep information current without developer help

**Acceptance Criteria:** ✅ **ALL IMPLEMENTED**
- [X] Firebase Auth-protected admin panel at /admin with JWT custom claims
- [X] CRUD operations for: Collections, Products, Static Pages
- [X] **Comprehensive Add Product Form** with:
  - [X] Complete form validation and error handling
  - [X] Multi-file image upload with Firebase Storage integration
  - [X] Dynamic collections and room types loading from Firestore
  - [X] Product specifications management (materials, weave type, origin, craft time)
  - [X] Pricing and currency management
  - [X] SEO metadata fields (title, description)
  - [X] Draft/publish status control and featured product toggle
  - [X] Auto-slug generation from product name
  - [X] Real-time form state management with React hooks
  - [X] Server action integration with comprehensive error handling
  - [X] Brand-consistent UI following UI_UX_Development_Guide.md
- [X] File upload management for images and PDFs
- [X] Lead management and export capabilities
- [X] User role management with Firebase custom claims
- [X] Admin dashboard with statistics and quick actions

## 4. Technical Requirements

### Database Structure & Firebase Setup

#### 4.1 Firebase Project Configuration
**Acceptance Criteria:**
- [ ] Firebase project created with appropriate name and region
- [ ] Firestore database initialized in production mode
- [ ] Firebase Authentication enabled with email/password and Google providers
- [ ] Firebase Storage bucket configured for file uploads
- [ ] Firebase Functions deployed for server-side logic
- [ ] Security rules configured for all Firebase services

#### 4.2 Firestore Database Schema

##### Collections Collection
```
collections/ {
  [collectionId]: {
    id: string,
    name: string,
    slug: string, // URL-friendly version
    description: string,
    type: 'style' | 'space', // style: Botanica, Avant, etc. | space: living-room, bedroom, etc.
    heroImage: {
      url: string,
      alt: string,
      storageRef: string
    },
    seoTitle: string,
    seoDescription: string,
    isActive: boolean,
    sortOrder: number,
    createdAt: timestamp,
    updatedAt: timestamp,
    productIds: string[] // References to products in this collection
  }
}
```

##### Products Collection
```
products/ {
  [productId]: {
    id: string,
    name: string,
    slug: string,
    description: string,
    story: string, // "The Story Behind This Rug" content
    images: [
      {
        url: string,
        alt: string,
        storageRef: string,
        isMain: boolean,
        sortOrder: number
      }
    ],
    specifications: {
      materials: string[], // e.g., ["Wool", "Silk"]
      weaveType: string, // e.g., "Hand-Knotted"
      availableSizes: [
        {
          dimensions: string, // e.g., "8x10 ft"
          isCustom: boolean
        }
      ],
      origin: string, // e.g., "Bhadohi"
      craftTime: string // e.g., "6-8 months"
    },
    collections: string[], // Array of collection IDs
    roomTypes: string[], // e.g., ["living-room", "bedroom"]
    price: {
      isVisible: boolean,
      startingFrom: number,
      currency: string
    },
    seoTitle: string,
    seoDescription: string,
    isActive: boolean,
    isFeatured: boolean,
    sortOrder: number,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```

##### Static Pages Collection
```
pages/ {
  [pageId]: {
    id: string,
    type: 'our-story' | 'craftsmanship' | 'trade',
    title: string,
    slug: string,
    content: {
      sections: [
        {
          type: 'text' | 'image' | 'quote' | 'timeline',
          content: string,
          image?: {
            url: string,
            alt: string,
            storageRef: string
          },
          order: number
        }
      ]
    },
    seoTitle: string,
    seoDescription: string,
    isActive: boolean,
    updatedAt: timestamp,
    updatedBy: string // Admin user ID
  }
}
```

##### Leads Collection
```
leads/ {
  [leadId]: {
    id: string,
    type: 'contact' | 'trade' | 'customize' | 'product-enquiry',
    name: string,
    email: string,
    phone?: string,
    message?: string,
    source: string, // Page/form where lead was generated
    productId?: string, // For product enquiries
    customizationDetails?: {
      preferredSize: string,
      preferredMaterials: string[],
      moodboardFiles: [
        {
          filename: string,
          url: string,
          storageRef: string
        }
      ]
    },
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed',
    assignedTo?: string, // Admin user ID
    notes: [
      {
        content: string,
        createdBy: string,
        createdAt: timestamp
      }
    ],
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```

##### Lookbook Collection
```
lookbook/ {
  current: {
    version: string,
    filename: string,
    url: string,
    storageRef: string,
    uploadedAt: timestamp,
    uploadedBy: string,
    isActive: boolean
  }
}
```

##### Admin Users Collection
```
adminUsers/ {
  [userId]: {
    id: string, // Matches Firebase Auth UID
    email: string,
    name: string,
    role: 'admin' | 'editor' | 'viewer',
    permissions: {
      canManageProducts: boolean,
      canManageCollections: boolean,
      canManagePages: boolean,
      canManageLeads: boolean,
      canManageUsers: boolean
    },
    isActive: boolean,
    lastLogin: timestamp,
    createdAt: timestamp
  }
}
```

##### Site Settings Collection
```
settings/ {
  global: {
    siteName: string,
    siteDescription: string,
    contactEmail: string,
    calendlyUrl: string,
    socialLinks: {
      instagram?: string,
      pinterest?: string,
      facebook?: string
    },
    seoDefaults: {
      defaultTitle: string,
      defaultDescription: string,
      ogImage: string
    },
    updatedAt: timestamp,
    updatedBy: string
  }
}
```

#### 4.3 Firebase Security Rules

##### Firestore Security Rules
**Acceptance Criteria:**
- [ ] Public read access for active collections, products, pages
- [ ] Admin-only write access for all collections
- [ ] Lead submissions allowed for authenticated/anonymous users
- [ ] User-specific data protection for admin users

##### Storage Security Rules  
**Acceptance Criteria:**
- [ ] Public read access for product images and lookbook
- [ ] Admin-only write access for uploads
- [ ] File size and type restrictions (images: 5MB, PDFs: 10MB)
- [ ] Automatic virus scanning for uploads

#### 4.4 Firebase Functions

##### Lead Processing Function
```javascript
// Triggered on lead creation
exports.processLead = functions.firestore
  .document('leads/{leadId}')
  .onCreate(async (snap, context) => {
    // Send email notification to admin
    // Send auto-reply to user
    // Integrate with CRM
  });
```

##### Image Processing Function
```javascript
// Triggered on image upload
exports.processImage = functions.storage
  .object()
  .onFinalize(async (object) => {
    // Generate thumbnails
    // Optimize images (WebP conversion)
    // Update Firestore with image URLs
  });
```

##### SEO Sitemap Generation
```javascript
// HTTP function to generate XML sitemap
exports.generateSitemap = functions.https
  .onRequest(async (req, res) => {
    // Query all active collections and products
    // Generate XML sitemap
    // Return with proper content-type
  });
```

#### 4.5 Data Migration & Seeding

**Acceptance Criteria:**
- [ ] Migration scripts for initial data setup
- [ ] Sample collections and products for development
- [ ] Static page content migration
- [ ] Admin user creation script

### Performance
- Page load times <2 seconds
- Lighthouse scores: Performance >90, Accessibility >95, SEO >90
- Mobile-first responsive design
- Progressive image loading

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast CTAs
- Alt text for all images

### SEO
- Semantic HTML5 structure
- Open Graph meta tags
- Structured data markup
- XML sitemap
- Optimized page titles and descriptions

### Integrations
- Google Tag Manager for analytics
- Calendly booking integration
- Email service for form submissions
- CRM integration for lead management

## 5. Content Requirements

### Brand Assets
- High-resolution rug photography
- Artisan/craftsmanship imagery
- Lookbook PDF (downloadable)
- Logo variations (light/dark themes)

### Copy Requirements
- Collection descriptions
- Product specifications and stories
- Static page content (Craftsmanship, Our Story)
- Microcopy for empty states and error messages

## 6. Future Enhancements

### Phase 2 Features
- E-commerce functionality (pricing, cart, checkout)
- User accounts and order history
- Advanced filtering and search
- Wishlist and favorites
- Live chat integration

### Phase 3 Features
- Augmented Reality rug placement
- 3D room visualization
- Advanced customization tools
- Multi-language support
- International shipping calculator

## 7. Assumptions & Dependencies

### Assumptions
- Content will be provided by Equza Living Co. team
- Calendly account exists for booking integration
- Email service will be configured for form submissions
- Firebase project will be set up for backend services

### Dependencies
- Brand guidelines and color palette finalization
- High-quality product photography
- Content creation (copy, descriptions, stories)
- Domain name and hosting setup
- Analytics and tracking setup

---

**Next Steps:** Please review this specification document. Once confirmed, I'll proceed to create the detailed design document. 