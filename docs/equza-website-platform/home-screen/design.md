# Home Screen (Equza) — Technical Design

Status: Draft for review

Sources: `docs/equza-website-platform/Equza_home_screen_updated.pdf`, `UI_UX_Development_Guide.md`, `TECHNICAL_PRD.md`

This document details how we will implement the home screen UI shown in the PDF using reusable components, Firestore‑driven content, and our existing Next.js + Firebase foundation. All imagery must be loaded from Firebase Storage/CDN, not hardcoded in `/public`.

> Brand rule references: images via Firebase Storage and adherence to `UI_UX_Development_Guide.md` [[memory:5043399]], [[memory:5043397]].

---

## 1. Goals & Non‑Goals

- Pixel‑faithful implementation across desktop, tablet, and mobile
- Reusable section components with clean prop contracts
- Data‑driven via Firestore `pages/home` document
- Excellent performance (LCP ≤ 2.0s), accessibility (WCAG 2.1 AA), and SEO
- Do NOT build new admin UIs now; we will leverage existing admin later

## 2. Page Structure (from top to bottom)

1. Header (logo, nav, CTA) — reuse existing `Header`
2. Hero Banner — `HeroSection`
3. Feature Strip — `FeatureStrip`
4. Rugs by Style — reuse `CollectionTilesSection`
5. Room Highlight — `DualCardHighlight`
6. Techniques Showcase (2 images) — `SideBySideShowcase`
7. Slim Primary CTA Band — `BandCTA`
8. Brand Story — reuse `OurStoryTeaser` (with props)
9. Craftsmanship Full‑bleed Banner — `ImageBannerCTA`
10. Lookbook Download — `LookbookSection` (wire to Storage PDF)
11. Contact Section + Form — reuse `ContactSection` + `ContactForm`
12. Footer — reuse existing `Footer`

All new components are generic and reusable outside the home page.

## 3. Design Tokens

Adopt and extend tokens from `UI_UX_Development_Guide.md`.

- Colors
  - primary: `#98342d`
  - background: `#f1eee9`
  - text.default: `#1c1917`
  - text.muted: `#57534e`
  - surface: `#ffffff`
  - overlay: rgba(0,0,0,0.35) for image legibility
- Typography
  - Headings: Libre Baskerville
  - Body: Poppins
  - H1: 48/56/64; H2: 32/40; H3: 20/24; Body: 16/24
- Radii: 12–16px for cards; 9999px for pill buttons
- Shadows: subtle 0 2px 8px rgba(0,0,0,0.06); hover 0 8px 28px rgba(0,0,0,0.10)
- Spacing scale (px): 8, 12, 16, 20, 24, 32, 40, 48, 64, 80
- Content width: max 1200–1280px; outer gutters 24px mobile, 40px tablet, 64px desktop
- Breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536

## 4. Component Contracts

TypeScript signatures below describe public props. All components accept `className?: string`.

### 4.1 HeroSection (server)
```ts
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  image: { src: string; alt: string; focal?: 'center'|'top'|'bottom'|'left'|'right' };
  height?: 'sm'|'md'|'lg'; // default 'lg' (e.g., 520/640/720)
  align?: 'center'|'left'; // text alignment & container placement
  overlay?: boolean; // default true for contrast
}
```
Behavior
- Uses `next/image` with `priority` for LCP
- Text sits within a centered container; overlay applied for contrast
- Small pill CTA; hover darkens ~8–10%

### 4.2 FeatureStrip (server)
```ts
interface FeatureStripProps {
  items: { icon: string; label: string }[]; // icon = storage URL or icon name
}
```
Behavior
- 3 columns on desktop; stack on mobile
- Each item has decorative icon (aria-hidden) and visible text label

### 4.3 CollectionTilesSection (server, reuse)
```ts
interface CollectionTileItem { name: string; image: { src: string; alt: string }; href: string }
interface CollectionTilesProps { title: string; items: CollectionTileItem[]; cta?: { label: string; href: string } }
```
Behavior
- 4 tiles desktop, 2 on tablet, 1 on mobile
- Hover zoom ≤1.05; accessible link wrapping tile

### 4.4 DualCardHighlight (server)
```ts
interface DualCardHighlightProps {
  copy: { title: string; description: string; cta: { label: string; href: string } };
  media: { image: { src: string; alt: string } };
}
```
Behavior
- Rounded container housing two cards; copy card left, media card right (stack on mobile)

### 4.5 SideBySideShowcase (server)
```ts
interface SideBySideShowcaseProps {
  items: { title: string; image: { src: string; alt: string }; href?: string }[]; // length 2
}
```
Behavior
- Two large images with bottom‑center overlay labels; labels meet AA contrast

### 4.6 BandCTA (server)
```ts
interface BandCTAProps { headline: string; cta: { label: string; href: string } }
```
Behavior
- Slim band with centered text and link; minimal decoration

### 4.7 ImageBannerCTA (server)
```ts
interface ImageBannerCTAProps {
  title: string;
  image: { src: string; alt: string };
  cta?: { label: string; href: string };
}
```
Behavior
- Full‑bleed image area; text overlay; optional CTA

### 4.8 LookbookSection (server)
```ts
interface LookbookSectionProps {
  thumbnail: { src: string; alt: string };
  caption?: string;
  pdfStorageRef: string; // e.g., lookbook/current.pdf
  ctaLabel?: string; // default: 'Download PDF'
}
```
Behavior
- Server resolves `pdfStorageRef` to signed or public URL using Firebase Admin/SDK (server only)
- Link opens in new tab with rel="noopener"

### 4.9 ContactSection + ContactForm (client)
- Reuse existing components; ensure fields: firstName, lastName, email, phone, message
- Validate with Zod; server action writes anonymous lead to `leads`

## 5. Firestore Content Model

Single document: `pages/home`.

```ts
export interface HomePageData {
  hero: { title: string; cta?: { label: string; href: string }; image: { src: string; alt: string } };
  features: { icon: string; label: string }[];
  styles: { name: string; image: { src: string; alt: string }; href: string; sortOrder: number }[];
  roomHighlight: { title: string; description: string; cta: { label: string; href: string }; image: { src: string; alt: string } };
  techniques: { title: string; image: { src: string; alt: string }; href?: string }[]; // len 2
  primaryCta: { headline: string; label: string; href: string };
  story: { title: string; body: string; ctaLabel: string; href: string };
  craftsmanship: { title: string; cta: { label: string; href: string }; image: { src: string; alt: string } };
  lookbook: { thumbnail: { src: string; alt: string }; pdfStorageRef: string; caption: string };
  contact: { heading: string; subcopy?: string };
  isActive: boolean;
  updatedAt: string;
}
```

Fetching pattern
- Use server components to fetch `pages/home` via existing safe Firestore utilities
- Cache with `unstable_cache` for 1h; tag invalidation on admin updates

## 6. Layout & Responsiveness

- Desktop (≥1024): multi‑column sections as specified above
- Tablet (768–1023): reduce columns (e.g., style tiles 2‑up)
- Mobile (<768): single column; hero crops to maintain readable text (9:16 safe area)
- Gaps: 40–64px between sections desktop; 24–32px mobile

## 7. Accessibility

- Semantic regions: `header`, `nav`, `main`, `section`, `footer`
- Headings are ordered (H1 at hero, H2 per section)
- Image overlays ensure contrast ≥ 4.5:1 (use semi‑transparent dark layer when needed)
- Interactive tiles are links with visible focus outlines
- Form labels and error text associated via `htmlFor` and `aria-describedby`
- Motion prefers‑reduced‑motion: animations disabled or minimized

## 8. Performance

- `next/image` with responsive `sizes`; hero `priority` and preloaded fonts
- Domain allowlist includes `firebasestorage.googleapis.com`
- Use WebP/AVIF; upload guidance: hero 2400×1350, tiles 800×800, banners 1920×1080
- Lazy load non‑critical images; defer client components
- Avoid layout shifts: fixed aspect ratios, reserved space for images

## 9. SEO & Analytics

- Metadata/OG for home; hero image used as OG where suitable
- Structured data: Organization (basic) and WebSite with SearchAction (optional)
- GTM events
  - `cta_click` with `{ id, label, href, position }`
  - `lookbook_download` with `{ href, version }`
  - `form_submit` with `{ form: 'contact', status }`

## 10. Error Handling & Empty States

- Wrap each section with an error boundary; render skeletons or hide section if data missing
- If `lookbook.pdfStorageRef` unresolved → disable CTA and show "Coming soon"

## 11. Implementation Plan (high‑level)

1. Define Firestore `pages/home` schema and seed sample content
2. Implement new components: `FeatureStrip`, `DualCardHighlight`, `SideBySideShowcase`, `BandCTA`, `ImageBannerCTA`, extend `LookbookSection`
3. Compose `app/page.tsx` using server components reading `pages/home`
4. Style per tokens and add light motion via `MotionWrapper`
5. QA: responsive checks, a11y scan, Lighthouse, Core Web Vitals

## 12. Open Questions

1. Final copy for all CTAs and section headings?
2. Feature strip icons source: custom SVGs (preferred) or Feather set?
3. Confirm routes for style tiles and banners (collections vs curated pages)
4. Lookbook Storage path format and filename convention (e.g., `lookbook/current.pdf`)

---

Upon approval, next step is to create `tasks.md` with an actionable checklist (with sub‑tasks and checkboxes) covering component builds, Firestore seeding, styling, QA, and analytics wiring.
