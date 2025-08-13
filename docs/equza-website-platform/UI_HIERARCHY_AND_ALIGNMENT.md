# Equza Website — UI Hierarchy, Alignment, and Typographic System

Status: Draft v1 (for implementation alignment)

This document standardizes the visual hierarchy (headings, subheads, body), alignments, paddings, and per‑screen section order so that all pages look consistent and match the PDF direction and `UI_UX_Development_Guide.md`.

## 1) Global tokens and rules

- **Max content width**: 1200–1280px
- **Gutters**: `px-6` (mobile), `px-10` (tablet), `px-16` (desktop)
- **Section vertical rhythm** (top and bottom): 40px mobile, 56px tablet, 72px desktop
- **Card radius**: 12–16px; **Border**: `#E7E5E4`; **Shadow** only where needed
- **Brand colors**: primary `#98342d`, background `#f1eee9`, body `#1c1917`, muted `#57534e`
- **Typefaces**: Headings = Libre Baskerville; Body = Poppins
- **Typography scale (Tailwind)**
  - H1: `text-4xl md:text-5xl lg:text-6xl` serif
  - H2: `text-3xl md:text-4xl` serif
  - H3: `text-2xl` serif (or `text-xl` for compact labels)
  - Body: `text-base leading-relaxed` sans
  - Caption/Overline: `text-xs tracking-wider`
- **Buttons**: pills; primary maroon; tertiary underlined link; hover darken ~8–10%
- **Images**: fixed aspect (avoid CLS), `next/image` with sizes; overlays only when text sits on images
- **Alignment rule**: Headings align to the content column left edge. Center headings only in hero/brand‑story/CTA bands.

## 2) Heading map

- **H1**: exactly one per page (hero or topmost heading)
- **H2**: each major section
- **Subheads/Intros**: body text (not larger than H3), muted color
- Avoid mixed casing/weights for equivalent sections across pages

## 3) Spacing system (examples)

- Section wrapper: `py-10 md:py-14 lg:py-18`
- Grid gaps: 24px (`gap-6`) default; 32px (`gap-8`) for large tile grids
- Band/strip components: 12–16px internal padding; max width 960px when narrow and centered

## 4) Screen-by-screen hierarchy and alignment

### 4.1 Home

1. Hero (H1 centered)
   - Overline (caps small), H1 serif, small pill CTA
   - Background image with 30–50% overlay for contrast
2. Feature chips (below hero)
   - 3 chips, centered row; height ~44px; `gap-4`
3. Rugs by Style (H2 left)
   - Intro/body aligns left with heading (max‑width 60ch)
   - 4 compact square tiles, titles below; `grid-cols-2 md:grid-cols-4`
4. Room highlight (two‑card)
   - Left copy card with small CTA; right image; container radius 16px; inner padding 24–32px; `gap-6`
5. Techniques (two images)
   - Side‑by‑side with bottom‑center mini labels
6. Slim CTA band (centered)
   - Max width 960px, 12–16px padding, 12px radius
7. Brand story (centered narrow)
   - Overline, short paragraph, small “Know More” link
8. Hands of Heritage banner (H2 centered)
   - Full‑bleed within gutters; dark overlay for text
9. Lookbook (compact)
   - Thumbnail + short copy + one primary “Download PDF”
10. Contact (compact)
   - Title, 2x2 fields (First/Last/Email/Phone) + Message; one submit button

Notes: “Rugs by Space” appears later or on the collections page, not in the main home flow per PDF. Remove badges/counters from compact style tiles.

### 4.2 Collections Landing (`/collections`)

- H1: “Collections” (left)
- Tabs centered under intro: “Rugs by Style” / “Rugs by Space”
- Section “Rugs by Style” (H2 left), short intro (left)
- Grid can use overlay cards (landing variant), not the compact home tiles
- Top/bottom spacing mirrors home sections

### 4.3 Collection Detail (`/collections/[slug]`)

- H1: collection name (left)
- Optional hero/cover image strip
- Intro paragraph (max‑width 60ch)
- Product grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, `gap-6`
- Filters/search (if shown) align to grid left edge

### 4.4 Product Detail (`/product/[slug]`)

- H1: product name (left)
- Gallery left, info right on desktop; stacked on mobile
- Subheads: “Specifications”, “Story”, “Enquire” as H3
- Enquiry CTA styled as primary pill

### 4.5 Craftsmanship (`/craftsmanship`)

- H1: “Craftsmanship” (left)
- Editorial blocks full‑bleed within gutters
- “Hands of Heritage” can appear as hero or mid‑page banner

### 4.6 Our Story (`/our-story`)

- H1: “Our Story” (left)
- Timeline blocks with H3 subheads; alternating image alignment
- Overlines for meta labels (e.g., “Est. 1985”)

### 4.7 Trade (`/trade`)

- H1: “Trade” (left)
- Benefits cards `grid-cols-1 md:grid-cols-2`
- Compact contact form near top

### 4.8 Customize (`/customize`)

- H1: “Customize a Rug” (left)
- Short explainer band; optional stats
- Form blocks stacked; H3 subheads per step

### 4.9 Admin (overview)

- Follow same type scale and spacing rhythm; utilitarian layouts allowed

## 5) Current inconsistencies and fixes

- Mixed heading alignment (center vs left):
  - Rule: H1 centered only in hero; H2 left everywhere else; intros align left with H2
- Home “Rugs by Style” used large gradient cards:
  - Fix: compact 4‑up square tiles, titles below, no badges/counters
- Feature chips floated over hero:
  - Fix: place in a strip directly under hero
- Missing brand story:
  - Fix: insert compact block between slim CTA and heritage
- Lookbook oversized editorial block:
  - Fix: compact variant (thumb + single CTA)
- Contact oversized with extra cards/banners:
  - Fix: compact 2x2 fields + message on home
- Placeholder images and misaligned technique labels:
  - Fix: use Storage images; bottom‑center labels; overlays for contrast

## 6) Tailwind snippets

- Containers
  - Wrapper: `mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16`
  - Narrow band: `mx-auto max-w-[960px]`
- Headings
  - H1: `font-serif text-4xl md:text-5xl lg:text-6xl`
  - H2: `font-serif text-3xl md:text-4xl`
  - Overline: `text-xs tracking-wider`
- Section spacing: `py-10 md:py-14 lg:py-18`
- Grids: compact tiles `grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8`

## 7) QA checklist (per page)

- Exactly one H1 present
- H2s left aligned and consistent size/weight
- Intros align left with H2
- Section spacing follows rhythm (40/56/72)
- Images maintain fixed aspect; no CLS
- Buttons use correct variants and consistent padding/radius
- Chips/pills consistent sizes and spacing
- Focus styles visible; color contrast ≥ AA

## 8) Implementation plan

1. Apply compact variants on home (style tiles done; lookbook/contact pending)
2. Normalize heading sizes and alignment across components
3. Replace placeholders with Storage images (room/techniques/heritage)
4. Update collections landing alignment and intros
5. Visual QA at mobile/tablet/desktop; fix spacing/alignment deltas
