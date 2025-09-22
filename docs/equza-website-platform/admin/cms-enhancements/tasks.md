# Admin CMS Enhancements — Tasks

Note: Follow `UI_UX_Development_Guide.md` and Firebase image usage guidance throughout.

## Phase 1 — Homepage editor + image upload + leads CSV export

- [ ] Create admin routes and shells
  - [ ] Add `/admin/pages/home` route and page scaffold
  - [ ] Add `/admin/pages/[type]` dynamic route shell (for future phases)
- [ ] Implement homepage editor UI
  - [ ] Section: Hero (title, image upload/select, CTA)
  - [ ] Section: Feature Strip (list editor)
  - [ ] Section: Room Highlight (title, description, image upload/select, CTA)
  - [ ] Section: Techniques (two items with image upload/select)
  - [ ] Section: Primary CTA Band (headline, CTA)
  - [ ] Section: Brand Story (title, body, CTA)
  - [ ] Section: Craftsmanship Banner (title, image upload/select, CTA)
  - [ ] Section: Lookbook (thumbnail upload/select, caption, pdf storage ref)
  - [ ] Section: Contact (heading, subcopy)
  - [ ] Client-side validation and field-level errors
- [ ] Server actions and validation
  - [ ] Add/extend Zod schemas for `HomePageData`
  - [ ] Implement `updatePageContent('home')` with auth + validation + Firestore write
  - [ ] Revalidate appropriate cache tags after save
- [ ] Image upload integration
  - [ ] Implement single-file upload server action using Firebase Storage
  - [ ] Validate mime/size and return `{ url, storagePath }`
  - [ ] Integrate uploader into homepage editor sections
- [ ] Leads export (CSV)
  - [ ] Implement `exportLeads(filters)` to fetch data and generate CSV
  - [ ] Add Export button and filter UI on `/admin/leads`
  - [ ] Trigger file download with appropriate headers
- [ ] QA and accessibility
  - [ ] Verify keyboard navigation and labels
  - [ ] Validate fields and error states
  - [ ] Confirm images load from Firebase and not local paths

## Phase 2 — Content pages editors (`our-story`, `craftsmanship`, `trade`)

- [ ] UI pages
  - [ ] `/admin/pages/our-story` editor (text + CTA)
  - [ ] `/admin/pages/craftsmanship` editor (text + CTA)
  - [ ] `/admin/pages/trade` editor (text + CTA)
- [ ] Validation and actions
  - [ ] Extend/confirm `pageSchema` for minimal structures
  - [ ] Implement `updatePageContent(type)` with auth + validation + Firestore write
  - [ ] Revalidate `page-{type}` tags on save
- [ ] QA and accessibility
  - [ ] Verify inputs and error handling
  - [ ] Confirm updates reflect on public pages

## Phase 3 — Polishing and enhancements

- [ ] Add basic live preview pane to homepage editor
- [ ] Improve error summaries and toast notifications
- [ ] Strengthen URL validation and warn on external links
- [ ] Add logging of admin actions with `adminId`, page type, and changed fields
- [ ] Performance pass (suspense states, memoization where needed)

## Deployment/Verification

- [ ] Smoke test admin auth flows
- [ ] Verify Firestore rules guard writes to `pages/*`
- [ ] Confirm cache tags revalidate updated areas
- [ ] Validate CSV contents and filters
