# Home Screen (Equza) — Feature Spec / PRD

Status: Draft for review

References: `TECHNICAL_PRD.md`, `UI_UX_Development_Guide.md`, `docs/equza-website-platform/Equza_home_screen_updated.pdf`

## 1. Objective

Recreate the Equza home screen shown in the PDF with pixel-faithful, responsive UI using reusable, CMS-driven sections. All imagery must load from Firebase Storage (not hardcoded) and styling must follow the brand guide.

## 2. Success Criteria

- Visual parity with the PDF at desktop/tablet/mobile breakpoints
- Lighthouse ≥ 90 across Performance/Accessibility/Best Practices/SEO
- LCP ≤ 2.0s on 4G for first view; CLS ≤ 0.1
- AA color contrast; keyboard and screen‑reader friendly
- CMS-driven content from Firestore; zero code changes required for copy/images/links

## 3. Scope (Sections)

1. Header with nav and right‑aligned CTA
2. Hero banner: image background, headline, small pill CTA
3. Feature strip: three icon+label items
4. Rugs by Style: four tiles + “View all”
5. Room highlight: two‑card container (copy card + image card)
6. Featured techniques: two large images with overlay labels
7. Primary CTA band: “You Imagine It, We Weave It.” + link
8. Brand story block with “Know More”
9. Craftsmanship banner: full‑bleed image + CTA
10. Lookbook: thumbnail card + “Download PDF”
11. Contact form: First/Last Name, Email, Phone (with country code), Message
12. Footer with columns, social icons, legal

Out of scope (now): New Admin CRUD UIs; we will rely on existing admin where applicable.

## 4. Design Guardrails

- Follow `UI_UX_Development_Guide.md` tokens and patterns
- Color palette centered on primary `#98342d` and background `#f1eee9`
- Headings: serif (Libre Baskerville); body: sans (Poppins)
- Rounded cards (12–16px radius), subtle shadows, ample whitespace
- Soft entrance animations, conservative hover zoom on images (≤1.05)

## 5. Data Model (Firestore)

Home content is driven by a single document `pages/home` with referenced collections and storage assets.

```ts
// pages/home
export interface HomePageData {
  hero: { title: string; cta: { label: string; href: string }; image: { src: string; alt: string } };
  features: { icon: string; label: string }[]; // icon = storageRef or name from icon set
  styles: { name: string; image: { src: string; alt: string }; href: string; sortOrder: number }[];
  roomHighlight: { title: string; description: string; cta: { label: string; href: string }; image: { src: string; alt: string } };
  techniques: { title: string; image: { src: string; alt: string }; href: string }[];
  primaryCta: { headline: string; label: string; href: string };
  story: { title: string; body: string; ctaLabel: string; href: string };
  craftsmanship: { title: string; cta: { label: string; href: string }; image: { src: string; alt: string } };
  lookbook: { thumbnail: { src: string; alt: string }; pdfStorageRef: string; caption: string };
  contact: { heading: string; subcopy?: string };
  isActive: boolean;
  updatedAt: string; // ISO
}
```

Notes:
- All `image.src` values are Firebase Storage public URLs or signed URLs stored in Firestore. No local `/public` images.
- `styles` may map to existing `collections` slugs of type `style`.

## 6. Reusable Component Inventory (to be implemented/reused in design)

- Layout: `Header`, `Footer`, `UtilityBanner` (reuse)
- Homepage sections:
  - `HeroSection` (reuse, with strict prop contract)
  - `FeatureStrip` (new, generic icon+label list)
  - `CollectionTilesSection` (reuse for “Rugs by Style”)
  - `DualCardHighlight` (new: copy card + media card)
  - `SideBySideShowcase` (new: two large media panels with overlay labels)
  - `BandCTA` (new: slim centered CTA band)
  - `OurStoryTeaser` (reuse)
  - `ImageBannerCTA` (new: full‑bleed banner with overlay CTA)
  - `LookbookSection` (reuse; wire to Storage PDF)
  - `ContactSection` + `ContactForm` (reuse; Zod validation)
  - Utility: `SafeImage`, `MotionWrapper`

All new components must be generic, prop‑driven, and reusable across pages.

## 7. User Stories & Acceptance Criteria

### US1: View hero and primary CTA
- As a visitor, I see a hero image with a headline and a CTA.
- Acceptance:
  - Server-rendered hero; hero image uses `next/image` with `priority`
  - CTA navigates via link; keyboard focusable; hover/active states present

### US2: Discover brand features
- As a visitor, I see three feature items below the hero.
- Acceptance:
  - Features load from Firestore; icons have accessible labels

### US3: Explore “Rugs by Style”
- As a visitor, I can scan style tiles and open their pages.
- Acceptance:
  - Four tiles at desktop; responsive stack on mobile
  - Tiles link to collection or curated routes; lazy-loaded images

### US4: Room highlight block
- As a visitor, I can read the room copy and open “Check out designs”.
- Acceptance:
  - Two-card layout; copy card contains title/description/CTA
  - Image card supports alt text and subtle hover zoom

### US5: Techniques showcase
- As a visitor, I see two large images labeled (e.g., Hand‑knotted, Hand‑tufted).
- Acceptance:
  - Overlay labels meet contrast AA; hover zoom ≤1.05

### US6: Primary CTA band
- As a visitor, I can open “Customize Now”.
- Acceptance:
  - Slim band centered; keyboard navigable link

### US7: Brand story teaser
- As a visitor, I read a short story and can “Know More”.
- Acceptance:
  - Copy length constrained for readability; link navigates

### US8: Craftsmanship banner
- As a visitor, I see a full‑bleed banner and can “Explore the Craft”.
- Acceptance:
  - Image uses art‑direction per breakpoint; heading readable over image

### US9: Lookbook download
- As a visitor, I can download the lookbook PDF.
- Acceptance:
  - Link points to Firebase Storage `lookbook/current.pdf` (or provided ref)
  - File type/size hinted; opens in new tab; tracked event

### US10: Contact form submission
- As a visitor, I can submit a message without logging in.
- Acceptance:
  - Client validation (Zod); server action writes to `leads`
  - Success toast; error handling; rate limiting per IP
  - Required fields: First Name, Last Name, Email, Message
  - Optional: Phone with country code

## 8. Non‑Functional Requirements

- Accessibility: WCAG 2.1 AA; semantic regions; visible focus
- Performance: image optimization, lazy loading, minimal client JS
- SEO: metadata per page, OG tags, canonical; structured data where relevant
- Analytics: events for CTAs, lookbook download, form submit (GTM)
- Observability: console warnings for missing CMS content; error boundaries per section

## 9. Risks & Mitigations

- Risk: Missing final assets from PDF → Use placeholders from Storage; replace later
- Risk: Hardcoded images regress brand rule → Enforce `SafeImage` and Storage URLs only
- Risk: LCP regression due to large hero → Use responsive sizes and compressed WebP/AVIF

## 10. Open Questions

1. Final copy for all CTAs and section headings?
2. Exact links (routes) for each tile/banner CTA?
3. Confirm icon set for feature strip (custom SVG vs Feather)?
4. Lookbook Storage path to use by default?

---

If approved, the next step is to produce the detailed design doc with component props, layout tokens, data fetching patterns, and responsive rules, followed by a task breakdown.


