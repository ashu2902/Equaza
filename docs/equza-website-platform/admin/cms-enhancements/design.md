# Admin CMS Enhancements — Design

This design details how to complete partially implemented admin capabilities while adhering to existing patterns (Next.js App Router, Firebase Firestore/Storage, safe data access, cache tags) and the UI/UX guidelines.

Scope (per PRD)
- Homepage and content pages CMS: banners, text content, button/link controls, with image upload + Storage selection.
- Leads export (CSV) with filters.
- No component layout composition in this phase.

Guiding Principles
- Follow `UI_UX_Development_Guide.md` for layout, typography, and interactions.
- Keep reads safe and typed; prefer existing `safe-firestore` helpers and cache tagging.
- Validate on both client and server via Zod; produce field-level errors.
- Use Firebase Storage for all images, never hardcoded local paths.

Architecture Overview
- Next.js App Router admin pages for content editing under `/admin/pages/*`.
- Server actions to validate, persist to Firestore, and revalidate tags.
- Client forms (React server components with client subcomponents) for editing; reuse existing UI primitives.
- Image upload via Firebase Storage using an existing action pattern (`uploadMultipleFileAction`) or a single-file equivalent.
- CSV export for leads via server action returning a generated CSV with correct headers and content-disposition.

Data Model
1) Homepage (`pages/home`)
- Reuse `HomePageData` structure from `src/lib/firebase/pages.ts`:
  - hero?: { title: string; cta?: { label: string; href: string }; image: { src: string; alt: string } }
  - features?: { icon: string; label: string }[]
  - roomHighlight?: { title: string; description: string; cta: { label: string; href: string }; image: { src: string; alt: string } }
  - techniques?: { title: string; image: { src: string; alt: string }; href?: string }[]
  - primaryCta?: { headline: string; label: string; href: string }
  - story?: { title: string; body: string; ctaLabel: string; href: string }
  - craftsmanship?: { title: string; cta: { label: string; href: string }; image: { src: string; alt: string } }
  - lookbook?: { thumbnail: { src: string; alt: string }; pdfStorageRef: string; caption?: string }
  - contact?: { heading: string; subcopy?: string }
  - isActive?: boolean; updatedAt?: any
- Image fields will store Storage-backed URLs/paths in `image.src` and `thumbnail.src`.

2) Content Pages (`pages/{type}`)
- Reuse `PageType = 'our-story' | 'craftsmanship' | 'trade'` and `Page` interface. Start with a minimal `content` sub-structure for text blocks + CTAs.

Validation
- Extend or add Zod schemas in `src/lib/utils/validation.ts`:
  - Define a `homePageSchema` mirroring `HomePageData`, with URL validation for hrefs and optional fields accepted.
  - Keep `pageSchema` for content pages minimal (text + CTA) and aligned with renderers.
- Client: basic constraints and inline messages.
- Server: strict schema parse with error mapping to field names.

Admin UI
- New routes (design-time; implementation will follow these):
  - `/admin/pages/home`: homepage editor
  - `/admin/pages/[type]`: content page editor for `our-story`, `craftsmanship`, `trade`
- Structure
  - Use `AdminPageTemplate`, `Typography`, `Card`, `Grid`, `Input`, `Textarea`, `Button`, and validation UI.
  - Break the home editor into sections: Hero, Feature Strip, Room Highlight, Techniques (2 items), Primary CTA Band, Brand Story, Craftsmanship Banner, Lookbook, Contact.
  - Provide a simple live preview pane when feasible (non-blocking; can be Phase 3 polish).
- Image Upload Component
  - Reuse the pattern from `AddProductForm` that integrates with a server action like `uploadMultipleFileAction`.
  - For single uploads: introduce a single-file action (conceptually `uploadFileAction`) that returns `{ url, storagePath }`.
  - Accept jpeg/png/webp, validate max size (e.g., 5–10 MB), show upload progress, and write the returned URL into the image field.
  - All images stored in Firebase Storage; URL persisted in Firestore.

Server Actions
1) Page Content
- File: `src/lib/actions/admin/pages.ts`
  - Implement `updatePageContent(pageType: PageType, pageData: Page)`:
    - `verifyAdminAuth()`; reject unauthenticated users.
    - Zod-validate `pageData` (`homePageSchema` when `pageType === 'home'`, else `pageSchema`).
    - Write to `pages/{pageType}` document.
    - `revalidateTag('page-home')` or `revalidateTag('page-{type}')` as applicable.
    - Return `{ success, message }` with field errors if any.
  - Implement `updateAdminSiteSettings(settings)` if needed in future (stub remains acceptable for this phase).

2) File Uploads
- File: `src/lib/actions/files.ts` (or reuse existing)
  - Add a single-file upload action mirroring `uploadMultipleFileAction` API and security.
  - Sanitize filenames, enforce type/size limits, return URL + storage path.

3) Leads Export (CSV)
- File: `src/lib/actions/admin/leads.ts`
  - Implement `exportLeads(filters)` by:
    - `verifyAdminAuth()`.
    - Fetching via `getLeads(filters)` from `src/lib/firebase/leads.ts`.
    - Mapping to a CSV string with header row: id,type,name,email,phone,message,status,assignedTo,createdAt,source.
    - Return a downloadable response (Next.js App Router pattern: set `Content-Type: text/csv` and `Content-Disposition: attachment; filename="leads.csv"`). If using server actions, return data + have the client trigger a file download.
  - Support date range filtering using existing query constraints (start/end timestamps).

Caching & Revalidation
- Use existing tag patterns (examples):
  - `revalidateTag('page-home')`
  - `revalidateTag('page-our-story')`, `revalidateTag('page-craftsmanship')`, `revalidateTag('page-trade')`
- Revalidate on each successful save.

Security
- AuthZ: Use `verifyAdminAuth()` in all admin actions; redirect or error on unauthenticated access.
- Firestore rules: Writes to `pages/*` by admins only; anonymous create permitted for `leads/*` per current rules.
- Input sanitization: Strip scripts in any rich text area (though current scope prefers plain text/limited fields).
- File uploads: Validate mime types and size, generate non-guessable Storage paths.

Accessibility & UX
- Label all inputs; include help text for required formats (URLs, image types).
- Provide field-level error summaries and validation states.
- Respect motion and color contrast per `UI_UX_Development_Guide.md`.

Backward Compatibility
- Maintain default fallbacks in render paths (already present in `src/app/page.tsx`).
- Avoid removing fields; add optional fields only.

Observability
- Log admin actions with `{ adminId, target: pageType, fieldsChanged, timestamp }`.
- Consider a basic audit log in Firestore `adminLogs` in future phases.

Milestones
- Phase 1: Home editor UI + server action + image upload integration; implement leads CSV export.
- Phase 2: Content pages editors (`our-story`, `craftsmanship`, `trade`).
- Phase 3: Preview improvements, polish, and extended validation.

Risks & Mitigations
- Schema drift: Centralize Zod schemas and export types to both server actions and forms.
- Large CSV: Add limits and pagination in UI; stream or chunk in future if needed.
- Storage costs: Encourage web-optimized formats; optionally auto-generate resized variants later.

References (codebase)
- `src/app/page.tsx` (consumers of `HomePageData` via `getHomePageData()`)
- `src/lib/firebase/pages.ts` (homepage data fetch)
- `src/lib/utils/validation.ts` (Zod schemas; extend here)
- `src/lib/actions/admin/pages.ts` (stubs to be implemented)
- `src/components/admin/AddProductForm.tsx` (upload pattern and form composition)
- `src/lib/actions/admin/leads.ts`, `src/lib/firebase/leads.ts` (export and queries)
