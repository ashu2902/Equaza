# Admin CMS Enhancements — PRD/Spec

Context
- Based on `docs/equza-website-platform/admin/ADMIN_CAPABILITIES_STATUS.md`, several admin capabilities are partially implemented. This PRD scopes the work required to complete those.
- Adhere to `UI_UX_Development_Guide.md` for all UI and interaction details.

Objectives
- Deliver a lightweight CMS for homepage and content pages so admins can:
  1) Manage banners on home and content pages
  2) Edit text content on home and content pages
  3) Update button/link URLs where applicable
- Complete lead export capability (download/view)
- Maintain existing safe data patterns and Firebase alignment
- Support image upload to Firebase Storage and selection when editing image fields.

In Scope
- Homepage (`pages/home`) content editing for: features, roomHighlight, techniques, primaryCta, story, craftsmanship (banner), lookbook, contact.
- Content pages: minimum viable text/CTA editing for `our-story`, `craftsmanship`, `trade` page types (existing `PageType`).
- Button/CTA link editing wherever defined in the above.
- Lead export to CSV from Admin Leads.

Out of Scope (future)
- Component-level layout composition (add/remove/reorder sections across the site).
- Advanced workflow (draft/publish/versioning), full WYSIWYG, media library management.

Stakeholders
- Admin users (content editors), Business team, Engineering, QA.

Assumptions
- Authenticated admin users are identified via custom claims and/or presence in `adminUsers` as implemented.
- Firestore is the system of record for `pages` and `leads`.
- Cache tags and safe data access patterns must remain intact.

Success Metrics
- Admins can update homepage text, banners, and CTA links without code changes.
- Admins can export leads (CSV) with basic filters.
- No regressions in site rendering or SEO metadata.

User Stories and Acceptance Criteria

1) Homepage Banners Management (Craftsmanship banner and similar banner-like sections)
- As an admin, I can edit the banner title, image (Storage URL/reference), alt text, and CTA (label + href) for the craftsmanship section.
- As an admin, I can preview changes before saving.
- As an admin, I see validation errors for missing/invalid fields.
Acceptance Criteria
- Provide a form under Admin > Pages > Home with inputs for title, image, alt text, CTA label, CTA href. The image input MUST support file upload to Firebase Storage and selection of uploaded images; URL entry is allowed as a fallback.
- Reuse the existing upload action (e.g., `uploadMultipleFileAction`) or an equivalent single-file variant; accept jpeg/png/webp; validate max size; store Storage path and/or download URL in Firestore.
- Save writes to Firestore `pages/home` in a typed-safe structure compatible with current `getHomePageData()` reads.
- Cache revalidation occurs after successful save.
- Images must be stored in Firebase Storage; no hardcoded local paths.

2) Homepage Text Content Management
- As an admin, I can edit homepage sections: features (list), roomHighlight (title/description/image/CTA), techniques (array of two), primaryCta (headline/label/href), story (title/body/ctaLabel/href), lookbook (thumbnail/caption/pdfStorageRef), contact (heading/subcopy).
- As an admin, I can preview and save.
Acceptance Criteria
- Provide forms to edit the above fields in Admin > Pages > Home.
- Validate structure and link formats; prevent empty critical fields (e.g., primary headline, CTA labels if href provided).
- Persist to Firestore `pages/home` and revalidate affected tags.
- UI adheres to `UI_UX_Development_Guide.md`.
- All image fields in these sections support upload to Firebase Storage and selection flow as described above.

3) Content Pages Text Management (our-story, craftsmanship, trade)
- As an admin, I can update basic text blocks and CTAs for each page type.
Acceptance Criteria
- Provide Admin > Pages for each type with minimal text/CTA editing (scoped to existing `PageType`).
- Validate and persist to Firestore under `pages/{type}` respecting existing schemas; revalidate tags.

4) Button Link Controls
- As an admin, I can update CTA href/label for homepage and supported content pages.
Acceptance Criteria
- All CTA fields mentioned above are editable and validated (http(s) URLs or internal paths starting with `/`).
- Prevent unsafe protocols; warn if external links.

5) Lead Export (CSV)
- As an admin, I can export leads to CSV with optional filters (type, status, date range).
Acceptance Criteria
- Add an Export button on Admin > Leads that triggers server action to produce CSV.
- Server action supports filters and returns a downloadable CSV.
- File includes: id, type, name, email, phone, message, status, assignedTo, createdAt (ISO), source.

Non-Functional Requirements
- Access control: only admins can access these forms/actions; redirect non-admins to admin login.
- Validation: use shared schemas where possible; provide field-level errors.
- Performance: keep forms responsive; use Suspense/loading states and optimistic UI where appropriate.
- Accessibility: label inputs, ensure keyboard navigation, and contrast per design guide.
- Observability: log admin actions (update page, export leads) with adminId and timestamps.

Data Model Notes
- `pages/home`: extend or align with current `HomePageData` interface to ensure parity with UI consumption.
- For content pages, use `PageType` and a minimal `content` structure that maps cleanly to current renderers.

Dependencies
- Firebase Firestore and Storage access
- Existing safe-firestore wrappers and cache tags
- UI components (form inputs, file/image pickers, validation messaging)
- Firebase Storage upload actions (reuse `uploadMultipleFileAction` or equivalent single-file upload)

Risks
- Schema drift between admin edit forms and frontend readers causing runtime UI fallbacks.
- Link validation edge cases and external link policies.
- Large lead exports; may need pagination or streaming in future.

Rollout Plan
- Phase 1: Implement admin UI and actions for homepage fields + craftsmanship banner; add lead CSV export.
- Phase 2: Implement content page text/CTA editing for `our-story`, `craftsmanship`, and `trade`.
- Phase 3: Usability refinements and additional validation.

Open Questions
- Are there constraints for CTA destinations (internal only vs external allowed)?
- Is audit logging required in Firestore for content changes?
- Resolved: Image selection will support upload + Storage path selection.
