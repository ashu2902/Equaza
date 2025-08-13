# Project Structure Documentation

## Overview

This document outlines the complete folder structure and organization of the Equza Living Co. website platform. The project follows a modular, scalable architecture with clear separation of concerns.

## Directory Structure

```
equza-living-co-website/
├── .cursor/                    # Cursor IDE configuration
├── .next/                      # Next.js build output (auto-generated)
├── docs/                       # Project documentation
├── node_modules/               # Dependencies (auto-generated)
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   ├── icons/                  # Icon assets
│   ├── fonts/                  # Font files
│   └── assets/                 # Other static assets
│       └── lookbook.pdf        # Downloadable lookbook
├── src/                        # Source code
│   ├── app/                    # Next.js App Router pages
│   │   ├── (admin)/           # Admin panel route group
│   │   │   ├── admin/         # Admin pages
│   │   │   │   ├── collections/
│   │   │   │   ├── products/
│   │   │   │   ├── leads/
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   ├── collections/       # Collection pages
│   │   │   ├── [slug]/        # Dynamic collection routes
│   │   │   └── page.tsx       # Collections landing page
│   │   ├── product/           # Product detail pages
│   │   │   └── [slug]/        # Dynamic product routes
│   │   ├── spaces/            # Space-based pages
│   │   │   └── [room]/        # Dynamic room routes
│   │   ├── craftsmanship/     # Static page
│   │   ├── our-story/         # Static page
│   │   ├── trade/             # Static page
│   │   ├── customize/         # Customization form page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── loading.tsx        # Loading UI
│   │   ├── error.tsx          # Error UI
│   │   └── not-found.tsx      # 404 page
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   │   ├── Button.tsx     # (Phase 3)
│   │   │   ├── Card.tsx       # (Phase 3)
│   │   │   ├── Input.tsx      # (Phase 3)
│   │   │   ├── Modal.tsx      # (Phase 3)
│   │   │   └── index.ts       # Export index
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx     # (Phase 4)
│   │   │   ├── Footer.tsx     # (Phase 4)
│   │   │   ├── LeftNavigation.tsx  # (Phase 4)
│   │   │   ├── UtilityBanner.tsx   # (Phase 4)
│   │   │   └── index.ts       # Export index
│   │   ├── forms/             # Form components
│   │   │   ├── ContactForm.tsx     # (Phase 5)
│   │   │   ├── CustomizeForm.tsx   # (Phase 5)
│   │   │   ├── EnquiryModal.tsx    # (Phase 5)
│   │   │   ├── TradeForm.tsx       # (Phase 5)
│   │   │   └── index.ts       # Export index
│   │   ├── product/           # Product components
│   │   │   ├── ProductGrid.tsx     # (Phase 5)
│   │   │   ├── ProductCard.tsx     # (Phase 5)
│   │   │   ├── ProductDetail.tsx   # (Phase 5)
│   │   │   ├── ImageGallery.tsx    # (Phase 5)
│   │   │   └── index.ts       # Export index
│   │   ├── collections/       # Collection components
│   │   │   ├── CollectionGrid.tsx  # (Phase 5)
│   │   │   ├── CollectionCard.tsx  # (Phase 5)
│   │   │   ├── CollectionTabs.tsx  # (Phase 5)
│   │   │   └── index.ts       # Export index
│   │   ├── admin/             # Admin components
│   │   │   ├── AdminLayout.tsx     # (Phase 8)
│   │   │   ├── AdminHeader.tsx     # (Phase 8)
│   │   │   ├── DataTable.tsx       # (Phase 8)
│   │   │   └── index.ts       # Export index
│   │   ├── seo/               # SEO components
│   │   │   ├── MetaTags.tsx        # (Phase 4)
│   │   │   ├── StructuredData.tsx  # (Phase 4)
│   │   │   └── index.ts       # Export index
│   │   └── index.ts           # Main components export
│   ├── lib/                   # Utility libraries
│   │   ├── firebase/          # Firebase configuration
│   │   │   ├── config.ts      # ✅ Firebase setup
│   │   │   ├── firestore.ts   # ✅ Database operations
│   │   │   ├── storage.ts     # (Phase 2)
│   │   │   ├── auth.ts        # (Phase 2)
│   │   │   ├── server-app.ts  # (Phase 2)
│   │   │   └── index.ts       # ✅ Export index
│   │   ├── utils/             # Utility functions
│   │   │   ├── cn.ts          # ✅ Class name utility
│   │   │   ├── env.ts         # ✅ Environment validation
│   │   │   ├── constants.ts   # ✅ App constants
│   │   │   ├── validation.ts  # ✅ Zod schemas
│   │   │   ├── format.ts      # (Phase 2)
│   │   │   └── index.ts       # ✅ Export index
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAuth.ts          # (Phase 2)
│   │   │   ├── useLocalStorage.ts  # (Phase 2)
│   │   │   ├── useDebounce.ts      # (Phase 2)
│   │   │   └── index.ts       # Export index
│   │   └── actions/           # Server actions
│   │       ├── contact.ts          # (Phase 6)
│   │       ├── customize.ts        # (Phase 6)
│   │       ├── enquiry.ts          # (Phase 6)
│   │       ├── admin/              # (Phase 8)
│   │       └── index.ts       # Export index
│   ├── types/                 # TypeScript definitions
│   │   ├── index.ts           # ✅ Main type definitions
│   │   ├── auth.ts            # (Phase 2)
│   │   ├── product.ts         # (Phase 2)
│   │   ├── collection.ts      # (Phase 2)
│   │   └── lead.ts            # (Phase 2)
│   └── styles/                # Additional styles
│       ├── globals.css        # Global CSS
│       └── components.css     # Component-specific styles
├── .env.local                 # Environment variables (not in repo)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── .prettierrc               # ✅ Prettier configuration
├── .prettierignore           # ✅ Prettier ignore rules
├── eslint.config.mjs         # ✅ ESLint configuration
├── firebase.json             # ✅ Firebase configuration
├── firestore.rules           # ✅ Firestore security rules
├── storage.rules             # ✅ Storage security rules
├── firestore.indexes.json    # ✅ Firestore indexes
├── next.config.ts            # ✅ Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # ✅ TypeScript configuration
├── package.json              # ✅ Dependencies and scripts
├── README.md                 # ✅ Project documentation
├── ENVIRONMENT_SETUP.md      # ✅ Environment setup guide
└── PROJECT_STRUCTURE.md      # This file
```

## Implementation Status

### ✅ Completed (Phase 1)
- **Project Setup**: Next.js 15 with TypeScript
- **Firebase Integration**: Configuration, rules, and utilities
- **Environment Management**: Validation and configuration
- **Project Structure**: Organized folders and index files
- **Development Tools**: ESLint, Prettier, and scripts

### 🚧 In Progress (Current Phase)
- **Project Structure Setup**: Creating organized component structure

### 📋 Planned Implementation

#### Phase 2: Core Infrastructure & Utilities
- Authentication utilities
- Custom React hooks
- Data formatting utilities
- Additional Firebase services

#### Phase 3: UI Foundation & Design System
- Base UI components (Button, Card, Input, etc.)
- Typography system
- Animation components
- Design system setup

#### Phase 4: Layout Components
- Header and navigation
- Footer
- Utility banner
- SEO components

#### Phase 5: Core Business Components
- Product components
- Collection components
- Form components
- Interactive features

#### Phase 6: Data Layer & Server Actions
- Form submission handlers
- File upload functionality
- Email integration
- CRUD operations

#### Phase 7: Page Implementation
- Homepage sections
- Collection pages
- Product detail pages
- Static content pages

#### Phase 8: Admin Panel
- Authentication and guards
- Content management
- Lead management
- File management

## Architecture Principles

### 1. Modular Organization
- Components are organized by functionality
- Each module has its own index file for clean imports
- Clear separation between UI, business logic, and utilities

### 2. Scalable Structure
- Easy to add new components and features
- Consistent naming conventions
- Future-proof organization

### 3. Import Strategy
```typescript
// Clean imports from organized modules
import { Button, Card } from '@/components/ui';
import { ContactForm } from '@/components/forms';
import { cn, validateEmail } from '@/lib/utils';
import { getProducts } from '@/lib/firebase';
```

### 4. TypeScript Integration
- Comprehensive type definitions
- Strict type checking enabled
- Type-safe imports and exports

### 5. Development Experience
- Clear folder structure
- Helpful documentation
- Consistent patterns
- Easy navigation

## Usage Guidelines

### Adding New Components
1. Create the component in the appropriate directory
2. Add export to the relevant index.ts file
3. Update component imports in main index files
4. Document the component purpose and usage

### Import Conventions
```typescript
// ✅ Preferred: Use organized imports
import { Button } from '@/components/ui';
import { ContactForm } from '@/components/forms';

// ❌ Avoid: Direct file imports when index exists
import { Button } from '@/components/ui/Button';
```

### File Naming
- **Components**: PascalCase (e.g., `ContactForm.tsx`)
- **Utilities**: camelCase (e.g., `validateEmail.ts`)
- **Constants**: camelCase (e.g., `constants.ts`)
- **Types**: camelCase (e.g., `index.ts`)

## Future Considerations

### Potential Additions
- `src/contexts/` - React context providers
- `src/middleware/` - Next.js middleware
- `src/tests/` - Test files (if not co-located)
- `src/workers/` - Web workers
- `src/stores/` - State management (if using Zustand)

### Scalability
The current structure supports:
- Multiple team members working simultaneously
- Easy feature additions
- Clear code organization
- Efficient build processes
- Maintainable codebase

This structure provides a solid foundation for the Equza Living Co. platform and can easily accommodate future growth and feature additions. 