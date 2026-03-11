# Migration Notes: CRA Reference to Reusable Next.js 15 Starter

## Scope
This document maps the legacy CRA structure to a new reusable starter architecture (not a direct in-place migration).

## Target Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- WPGraphQL
- ACF Pro (Flexible Content, Options Pages, Product CPT, Product Category taxonomy)
- Custom ACF SEO fields
- Next.js route handlers for contact and preview

## Legacy to Starter Mapping

### 1) Routing
- Legacy `react-router-dom` routes in `src/App.js` map to file-based App Router routes:
  - `/` -> `app/page.tsx`
  - `/about` -> `app/about/page.tsx`
  - `/contact` -> `app/contact/page.tsx`
  - `/category-page` -> `app/products/page.tsx`
  - `/products/:productName` -> `app/products/[slug]/page.tsx`

### 2) Global Shell
- Legacy `Navbar.js`, `Footer.jsx`, popup logic in `App.js` become global starter domains:
  - `header`, `footer`, `contact info`, `social links`, optional `promo modal`
  - all sourced from ACF Options via WPGraphQL

### 3) Page Sections -> Block-Oriented Flexible Content
- `HomePage.jsx`, `AboutUs.jsx`, `ContactUs.jsx`, `CategoriesPage.jsx` sections become reusable blocks rendered by a typed block renderer.
- Blocks are reusable and site-agnostic (starter-friendly), with content coming from WordPress.

### 4) Product Domain
- Legacy `ProductData.js` static object migrates to Product CPT entries.
- Category membership migrates to Product Category taxonomy terms.
- Product detail template becomes a typed server-rendered product page.

### 5) SEO Domain
- Replace ad-hoc page metadata with custom ACF SEO field group:
  - page SEO
  - product SEO
  - taxonomy SEO
- Map into Next metadata generation.

### 6) Integration Endpoints
- Replace client EmailJS calls with server route handler:
  - `app/api/contact/route.ts`
- Add preview support route handler:
  - `app/api/preview/route.ts`

## Suggested Starter Domain Boundaries
- `globals`: header/footer/social/contact/promo options
- `pages`: generic page entities with flexible blocks
- `products`: product CPT typed model + product template
- `taxonomies`: product category typed model + archive rendering
- `seo`: shared SEO type + metadata mappers
- `api`: route handlers (`contact`, `preview`)

## Migration Risks to Track Early
- Product field shape inconsistency in legacy data (`benifits`, variable `applications`, variable specs schema)
- Multiple contact pipelines (EmailJS + Flask + PHP)
- Category membership duplicated in multiple frontend files
- Slug quality mismatch between generated links and explicit product keys
- Global contact content duplicated and inconsistent across header/footer/pages
- Encoding artifacts in content strings

## Definition of Done for this Discovery Stage
- Route inventory captured
- Section inventory captured
- Import matrix captured
- Content/schema conflicts captured
- No UI implementation started in Next.js yet
