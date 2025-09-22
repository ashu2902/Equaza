# Admin Capabilities Status

This document summarizes current admin capabilities versus requested requirements. Items marked with ✅ are already implemented in the codebase; ⚠️ indicates partial support or stubs; ❌ indicates not present.

## Capability Matrix

- **Banners Management (home and content pages)**: ⚠️ Partial
  - Homepage supports banner-like sections via `homeCms` content used by components such as `ImageBannerCTA`, `CustomRugBanner`, `BandCTA`, `BrandStoryBlock` in `src/app/page.tsx` (driven by `getHomePageData()` from Firestore `pages/home`).
  - No dedicated admin UI found for creating/editing banners; server action stubs exist for pages (`src/lib/actions/admin/pages.ts`) but CRUD is TODO.

- **Text Content Management (home and content pages)**: ⚠️ Partial
  - Homepage text/CTA fields read from Firestore `pages/home` via `getHomePageData()`.
  - Admin actions for updating page content exist as stubs (`updatePageContent`) but actual page CRUD/UI not implemented.

- **Collections Management (add/remove)**: ✅ Implemented
  - Admin pages: `src/app/admin/collections/page.tsx` with lists for style/space collections.
  - Server actions: `createAdminCollection`, `updateAdminCollection`, `deleteAdminCollection` in `src/lib/actions/admin/collections.ts` with validation and cache revalidation.
  - Firestore helpers in `src/lib/firebase/collections.ts`.

- **Products Management (add/remove)**: ✅ Implemented
  - Admin pages: `src/app/admin/products/page.tsx` with stats and navigation to create/import/bulk.
  - Add product form: `src/components/admin/AddProductForm.tsx` integrates file uploads and validation.
  - Server actions: `createAdminProduct`, `updateAdminProduct`, `deleteAdminProduct` in `src/lib/actions/admin/products.ts` with cache revalidation.

- **Product Detail Page Content (text/images per product)**: ✅ Implemented
  - Product model includes rich fields: description, story, images, specifications, price, SEO, flags.
  - Add form handles multiple images and fields; update action exists. Admin edit UI page not explicitly found, but update action supports edits.

- **Lead Capture Forms (view/download/manage)**: ⚠️ Partial
  - Capture: Enquiry and other forms submit leads to Firestore (`submitEnquiryForm`, `submitCustomizeForm`, `submitTradeForm`).
  - View/manage: Admin page at `src/app/admin/leads/page.tsx` lists leads and shows stats.
  - Export/download: `exportLeads` action exists as a placeholder (returns empty data, TODO); no CSV export wired in UI yet.

- **Button Link Controls (update URLs sitewide)**: ⚠️ Partial
  - Many homepage buttons/CTAs read from `homeCms` (e.g., `primaryCta`, `story.href`, `craftsmanship.cta.href`).
  - No dedicated admin UI to edit global button links; would rely on page content admin which is currently a stub.

- **Component Control (add/remove components on pages)**: ❌ Not present
  - Homepage sections are composed statically in `src/app/page.tsx` with safe guards; no admin-controlled component toggles/order found.

## Notes and References

- Admin Dashboard and Navigation
  - `src/app/admin/page.tsx` (dashboard with quick links to Products, Collections, Leads)
  - `src/components/admin/AdminSidebar.tsx` (navigation items)

- Pages/Home CMS
  - Data fetch: `src/lib/firebase/pages.ts#getHomePageData()` from `pages/home`
  - Admin actions (stubs): `src/lib/actions/admin/pages.ts` (`updatePageContent`, `updateAdminSiteSettings` with TODO markers)

- Leads
  - Admin: `src/app/admin/leads/page.tsx`
  - Actions: `src/lib/actions/admin/leads.ts` (export placeholder, bulk ops)
  - Data: `src/lib/firebase/leads.ts`, safe admin queries in `src/lib/firebase/safe-firestore.ts#getSafeLeads`

- Products
  - Admin page: `src/app/admin/products/page.tsx`
  - Form: `src/components/admin/AddProductForm.tsx`
  - Actions: `src/lib/actions/admin/products.ts`
  - Data: `src/lib/firebase/products.ts`

- Collections
  - Admin page: `src/app/admin/collections/page.tsx`
  - Actions: `src/lib/actions/admin/collections.ts`
  - Data: `src/lib/firebase/collections.ts`

## Summary

- Implemented: Collections CRUD, Products CRUD, Product content editing, Leads listing and capture.
- Partial: Homepage/content text and banners (data model present, admin CRUD/UI missing), leads export, global button link controls.
- Missing: Component-level layout control from admin, full pages CMS UI for content editors.
