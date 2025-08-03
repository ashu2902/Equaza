# Equza Living Co. — Technical Product Requirements Document (PRD)

## 1. Product Overview

### Vision
Build a scalable, elegant, and responsive web platform for Equza Living Co. that conveys the brand's premium handcrafted-rug positioning, guides users from discovery to purchase/enquiry, and supports seamless content management and future growth.

### Goals
- Showcase Equza Living Co.'s collections and craftsmanship.
- Enable users to explore, enquire, and download resources (lookbook).
- Support direct outreach (email), booking (Calendly), and lead capture.
- Provide an admin interface for content management (future-proof).

### Target Audience
- Interior designers, homeowners, and trade partners seeking premium rugs.
- Users on desktop, tablet, and mobile devices.

## 2. User Personas
- **Homeowner:** Browses collections, downloads lookbook, submits enquiries.
- **Designer:** Explores by style/space, requests custom rugs, downloads assets.
- **Trade Partner:** Accesses trade page, submits partnership interest.
- **Admin:** (Future) Manages content, products, and leads via /admin panel.

## 3. Features & Functional Requirements

### Global UI Components
- **Utility Banner:** Sliding CTAs (email, Calendly), responsive, clickable.
- **Logo:** SVG, center-top, links to Home.
- **Left Vertical Menu:** Persistent/collapsible nav, responsive.
- **Footer:** Sitemap, social icons, copyright, theme support.

### Pages & Components
- **Home:** Hero, Rugs by Style, Rugs by Space, Custom Banner, Our Story Teaser, Lookbook Download, Contact Form.
- **Collections Landing:** Tabs (by Style/Space), dynamic tiles.
- **Collection Page:** Banner, product grid.
- **Product Detail:** Gallery, specs, enquiry modal.
- **Space Page:** Curated SKUs grid.
- **Static Pages:** Craftsmanship, Our Story, Trade (with contact form).
- **Customize Form:** Multi-field, file upload, validation, auto-reply.
- **Admin Panel (/admin):** Auth-protected, CRUD for collections, products, pages, lookbook, leads, file uploads.

### Integrations
- **Calendly:** Book consultation.
- **Mailto:** Direct email link.
- **Google Tag Manager:** Analytics.
- **SEO:** Semantic HTML5, metadata, OG tags.

### Accessibility & Performance
- **Accessibility:** WCAG 2.1 AA (focus states, alt text, ARIA).
- **Performance:** Lazy-load images, WebP, fast load times.

## 4. Technical Requirements

### Tech Stack
- **Frontend:** Next.js (React, TypeScript), Tailwind CSS or Styled Components.
- **Backend:** Firebase (Firestore, Auth, Storage, Functions).
- **State Management:** React Context or Zustand.
- **Form Handling:** React Hook Form or Formik.
- **Deployment:** Vercel, Netlify, or Firebase Hosting.

### System Architecture
- **SSR/SSG:** Next.js for SEO and performance.
- **API Routes:** Next.js API for custom endpoints.
- **Data Storage:** Firestore for collections, products, pages, leads.
- **File Storage:** Firebase Storage for images, PDFs, uploads.
- **Authentication:** Firebase Auth (admin panel, role-based access).
- **Serverless Functions:** For form handling, email/CRM integration.

### Scalability
- Component-driven, modular design ([Scalable Design principles](https://medium.com/pixelmatters/scalable-design-7adbaafa5086)).
- Data-driven rendering (collections, products, etc. from Firestore).
- Easy to add new content types, collections, or features.

### Responsiveness
- Mobile-first, fluid grids, media queries ([Responsive Web Design](https://alistapart.com/article/responsive-web-design/)).
- Test across breakpoints (≤768px, ≤1024px, desktop).

## 5. Data Model (Draft)

- **collections**: id, name, description, heroImage, type (style/space), products[]
- **products**: id, name, images[], price, specs, collectionId, roomType, etc.
- **pages**: id, type (our-story, craftsmanship, trade), content (rich text, images)
- **leads**: id, name, email, phone, message, source (contact, trade, customize)
- **lookbook**: url, version, uploadedAt
- **adminUsers**: id, email, role

## 6. Admin Panel (/admin)
- **Authentication:** Firebase Auth (email/password, Google, etc.)
- **CRUD:** Collections, products, static pages, lookbook, leads.
- **File Uploads:** Images, PDFs.
- **User Management:** (future)

## 7. Testing & QA
- **Unit Testing:** Components, functions.
- **Integration Testing:** Data flows, forms, API routes.
- **User Acceptance Testing:** Flows for all personas.
- **Accessibility Testing:** Keyboard, screen reader, color contrast.

## 8. Roadmap & Milestones
- **Phase 1:** Project setup, global layout, Firebase integration.
- **Phase 2:** Core features (Home, Collections, Product, Forms).
- **Phase 3:** Admin panel, CRUD, file uploads.
- **Phase 4:** SEO, analytics, accessibility, performance.
- **Phase 5:** Testing, deployment, launch.

## 9. Success Metrics
- Fast load times (<2s), 99.9% uptime.
- High Lighthouse scores (performance, accessibility, SEO).
- Lead capture and form submission rates.
- Admin usability and content update speed.

## 10. References
- [Scalable Design](https://medium.com/pixelmatters/scalable-design-7adbaafa5086)
- [Responsive Web Design](https://alistapart.com/article/responsive-web-design/)
- [Best Practices for PRDs](https://simran-pm.medium.com/the-ultimate-guide-to-product-requirements-documents-prd-for-product-managers-31149f36a936) 