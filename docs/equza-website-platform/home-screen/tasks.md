# Home Screen (Equza) — Tasks Checklist

Status: Draft for approval

This checklist implements the design in `design.md` and spec in `spec.md`. All images must load from Firebase Storage and styles must follow `UI_UX_Development_Guide.md` [[Use brand rules]].

## 0) Prerequisites
- [ ] Confirm final copy and links for all CTAs
- [ ] Confirm feature-strip icon source (custom SVGs vs icon set)
- [ ] Confirm lookbook Storage path (e.g., `lookbook/current.pdf`)
- [ ] Confirm routes for style tiles and banners (`collections/[slug]` vs curated)

## 1) Content Model & Seeding (Firestore)
- [x] Define `pages/home` fetch util `getHomePageData` and TS interface
  - [x] Fields: `hero`, `features`, `styles`, `roomHighlight`, `techniques`, `primaryCta`, `story`, `craftsmanship`, `lookbook`, `contact`
- [ ] Seed initial content for local/dev (script: `scripts/seed-homepage.mjs`)
- [ ] Add content validation in fetch util (assert required fields)
- [ ] Cache with `unstable_cache` (1h) and add tag for invalidation

## 2) Image & Asset Pipeline (Firebase Storage)
- [x] Verify Next.js image domains include `firebasestorage.googleapis.com`
- [ ] Prepare upload guidelines (hero 2400×1350, tiles 800×800, banners 1920×1080)
- [x] Ensure all new sections use `SafeImage`/`next/image` with Storage URLs
- [ ] Optional: add low‑quality placeholder/thumbnails if available

## 3) New Reusable Components

### 3.1 FeatureStrip (server)
- [x] Implement `FeatureStrip` with props `{ items: { icon, label }[] }`
- [x] Responsive: 3 columns → stack on mobile
- [x] A11y: decorative icons `aria-hidden`, text labels visible
- [ ] Unit test: renders items and labels

### 3.2 DualCardHighlight (server)
- [x] Implement with props `{ copy, media }`
- [x] Layout: rounded container; stack on mobile
- [x] Hover: subtle zoom on media (≤1.05)
- [x] A11y: alt text; links/CTA focusable

### 3.3 SideBySideShowcase (server)
- [x] Implement with props `{ items[2] }`
- [x] Overlay labels with AA contrast
- [x] Optional link wrappers for each item

### 3.4 BandCTA (server)
- [x] Implement with props `{ headline, cta }`
- [x] Centered layout; slim spacing

### 3.5 ImageBannerCTA (server)
- [x] Implement with props `{ title, image, cta? }`
- [x] Full‑bleed image; text overlay with contrast layer

## 4) Reuse/Integrate Existing Components
- [ ] `HeroSection`: ensure prop contract supports overlay and focal; set `priority`
- [x] `CollectionTilesSection`: map to Styles array from Firestore
- [ ] `OurStoryTeaser`: accept content from `story`
- [ ] `LookbookSection`: accept `thumbnail/pdfUrl/caption` props and wire to `homeCms.lookbook`
- [ ] `ContactSection` + `ContactForm`: ensure fields match PDF (First, Last, Email, Phone, Message)

## 5) Page Composition (`app/page.tsx`)
- [x] Fetch `pages/home` in a server component
- [x] Compose sections in order per design
- [x] Pass data props to each new section component (fallbacks when missing)
- [x] Guard: if section data missing, skip or render fallback

## 6) Styling & Tokens
- [ ] Apply tokens: colors, type, spacing, radii, shadows from `UI_UX_Development_Guide.md`
- [ ] Ensure content width max 1200–1280px; outer gutters per breakpoint
- [ ] Buttons: pill style; hover darken by ~8–10%

## 7) Accessibility
- [ ] Semantic structure (`header`, `nav`, `main`, `section`, `footer`)
- [ ] Headings order (H1 hero, H2 sections)
- [ ] Color contrast AA (overlay where needed)
- [ ] Keyboard focus outlines on interactive tiles/links
- [ ] prefers‑reduced‑motion support

## 8) Performance
- [ ] `next/image` responsive sizes; hero `priority`
- [ ] Preload fonts (Libre Baskerville, Poppins)
- [x] Lazy‑load non‑critical images and client components (where present)
- [x] Avoid CLS via fixed aspect ratios and reserved space
- [ ] Lighthouse ≥ 90; LCP ≤ 2.0s target on 4G

## 9) SEO & Analytics
- [ ] Home metadata + OG via existing SEO utilities
- [ ] Optional structured data: Organization / WebSite
- [ ] GTM events
  - [ ] `cta_click` with `{ id, label, href, position }`
  - [ ] `lookbook_download` with `{ href, version }`
  - [ ] `form_submit` with `{ form: 'contact', status }`

## 10) Error Handling & Empty States
- [ ] Error boundaries for each section
- [ ] Graceful fallback if section data missing
- [ ] Disable lookbook CTA if URL resolution fails; show hint text

## 11) Testing & QA
- [ ] Unit tests for new components
- [ ] Integration test: home composition renders with seeded data
- [ ] Accessibility scan (axe) + manual keyboard testing
- [ ] Visual QA at 3 breakpoints (mobile, tablet, desktop)

## 13) Follow-ups (soon after MVP)
- [ ] Implement `unstable_cache` wrappers for `getHomePageData` and invalidate on admin updates
- [ ] Seed script for `pages/home` with sample Storage URLs
- [ ] Add skeleton states and analytics wiring

## 12) Deployment Readiness
- [ ] Ensure env vars and image domains configured
- [ ] Staging deploy for UAT
- [ ] Monitor Web Vitals; fix regressions

---

When approved, we will start with sections 1–3 (content model, images, components), then wire page composition and proceed to QA. No code changes beyond docs will be made until you confirm this checklist.
