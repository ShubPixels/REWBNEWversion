# Content and Schema Conflicts

## High-Impact Conflicts

### 1) Contact pipeline conflict
- Observed:
  - `HomePage.jsx` and `ContactUs.jsx` submit with EmailJS.
  - Repo also contains `backend/app.py` Flask contact endpoint.
  - Repo also contains `api/contact.php` mail endpoint.
- Migration impact:
  - Three competing submission paths create inconsistent validation, storage, and deliverability.
- Migration decision needed:
  - Single source for contact submission in `app/api/contact/route.ts` and one outbound integration path.

### 2) Product model inconsistency in `ProductData.js`
- Observed:
  - `benifits` typo used instead of `benefits`.
  - `applications` is object for many products, array for some, empty for others.
  - `specifications` key/value schema differs per product (different columns).
  - Optional fields are uneven (`videoUrl`, `heading`, images count).
- Migration impact:
  - Hard to generate a stable strongly typed product model and reusable rendering blocks.
- Migration decision needed:
  - Canonical field names and normalized ACF field shapes with explicit optional fields.

### 3) Category mapping duplication
- Observed:
  - Category + product membership appears in both `Navbar.js` and `CategoriesPage.jsx`.
  - Product also stores category inside `ProductData.js`.
- Migration impact:
  - Drift risk between navigation, taxonomy archive, and product detail related-logic.
- Migration decision needed:
  - Make Product Category taxonomy authoritative, with products linked by taxonomy terms only.

### 4) Slug and label quality drift
- Observed:
  - Mixed capitalization and naming (`Bid breaking machine` vs title case elsewhere).
  - URL slug generation in Navbar from display names, while ProductData uses fixed keys.
  - Existing route uses `/category-page` while product route pattern is `/products/:productName`.
- Migration impact:
  - Broken links risk, inconsistent canonical URLs, and difficult redirects.
- Migration decision needed:
  - Canonical slug policy and redirect map from legacy routes.

### 5) Global contact data mismatch
- Observed:
  - Header and footer show different phone sets.
  - Contact details repeated across multiple files.
- Migration impact:
  - Content divergence and maintenance overhead.
- Migration decision needed:
  - Move all global contact/social/business data to ACF Options Pages.

## Medium-Impact Conflicts

### 6) Encoding/text quality issues
- Observed:
  - Replacement-character artifacts like `â€™`, `â€“`, etc. in multiple content strings.
- Migration impact:
  - Editorial cleanup required before publishing CMS content.

### 7) Mixed content ownership (page copy vs global copy)
- Observed:
  - Some sections embed business constants (phones, address, emails) directly in page components.
- Migration impact:
  - Reuse and localization become difficult.
- Migration decision needed:
  - Separate global options from page block content.

### 8) Related-products behavior
- Observed:
  - Product page uses random shuffle for related products.
- Migration impact:
  - Non-deterministic UX and caching complexity in server rendering.
- Migration decision needed:
  - Deterministic related-products strategy (taxonomy + explicit ordering).

## Low-Impact Conflicts

### 9) Legacy UI interaction coupling
- Observed:
  - Hover mega-menu and category modal are tightly coupled to local JS arrays.
- Migration impact:
  - Requires block/partials decomposition in server-first architecture.

### 10) In-file marketing copy duplication
- Observed:
  - Similar section content appears in home/about with different wording.
- Migration impact:
  - Requires content deduplication policy in CMS.

## Proposed Normalized Core Schemas (for next phase)
- `GlobalOptions`: headerNav, footerNav, socialLinks, contactInfo, legal, promoModal.
- `Page`: title, slug, seo, flexibleBlocks[]
- `Product`: slug, title, excerpt, media, categoryTerms[], benefits[], specsTable, applications, video
- `ProductCategory`: slug, name, description, media, seo, cta
- `SeoFields`: metaTitle, metaDescription, ogImage, canonicalUrl, noindex
