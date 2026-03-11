# Content Import Checklist (CRA Reference -> Headless WordPress)

## Purpose
- Define a reusable import layer for migrating legacy CRA content into:
  - WordPress Pages + ACF Flexible Content
  - WordPress Options Pages (global shell and promo)
  - Product CPT
  - Product Category taxonomy
  - Custom ACF SEO fields
- Keep mapping typed and repeatable (not one-off hardcoded scripts).

## Source References Used
- `src/pages/HomePage.jsx` arrays and section patterns
- `src/pages/AboutUs.jsx` section patterns
- `src/pages/ContactUs.jsx` form fields + copy
- `src/pages/CategoriesPage.jsx` `CATEGORY_LIST`
- `src/pages/ProductData.js` product map objects
- `src/Components/Navbar.js` global shell content
- `src/App.js` popup timing + slide pattern

## Canonical Import Models
- Type definitions: `next15-starter/src/types/import.ts`
- Transform helpers: `next15-starter/scripts/import/transformers.ts`

## Migration Checklist
1. Extract and normalize categories.
- Source: `CATEGORY_LIST` + `ProductData.js.category`.
- Normalize to taxonomy term slug (`toSlug(categoryName)`).
- Mark service-style categories (`serviceMode: true`) when no products are attached.

2. Normalize product records.
- Source: `ProductData.js`.
- Canonicalize:
  - `benifits` -> `benefits`
  - `applications` array -> `{ materials: [...], industries: [] }`
  - `applications` object -> split `materials` + `industries`
  - heterogeneous `specifications` rows -> `[{ label, value }]`
- Keep `videoUrl`, gallery, tagline, summary optional.

3. Build global options payload.
- Source: `Navbar.js` + shared contact copy + `App.js` popup behavior.
- Populate options:
  - contact, social, links
  - promo modal timing (`delayMs`, `autoRotateMs`) and slides
  - default SEO

4. Build page + flexible block payloads.
- Source: Home/About/Contact section composition.
- Use flexible block registry keys (e.g. `hero_showcase`, `stats_band`, `contact_form_split`, `cta_banner`).
- Keep block content in ACF fields (labels/copy/options editable in WP).

5. Apply SEO fields for every importable entity.
- Pages, products, taxonomy terms, and global defaults.
- Use custom ACF SEO fields with fallback to options-level defaults.

6. Validate before write.
- Ensure each product has:
  - stable slug
  - non-empty title
  - at least one category slug
- Record warnings for legacy field drift.

7. Import order.
- Import global options + menus.
- Import product categories.
- Import products (assign term slugs).
- Import pages + flexible blocks.
- Import/update SEO fields last if importer splits core/meta writes.

## Content Inconsistencies To Handle During Import
- Typo field: `benifits` in `ProductData.js`.
- `applications` shape differs by product (object vs array vs empty).
- `specifications` rows use dynamic keys per product.
- Slug/text drift for one key: `'sheet-plate-bending-machine'` uses single quotes and some names differ in casing.
- Popup/modal content is behavior-driven in `App.js`; convert to options + slide list.

## Import-Ready JSON Shapes

### 1) Global Options
```json
{
  "siteName": "Rangani Engineering Pvt Ltd",
  "siteTagline": "Engineering sustainable industrial solutions",
  "contactEmail": "mail@ranganiindia.com",
  "contactPhone": "+91 8000920222",
  "contactAddress": "Survey No. 258, Plot No. 5 To 11, NH-8B, Shapar, Rajkot, Gujarat, India",
  "headerPrimaryLinks": [
    { "label": "Home", "url": "/" },
    { "label": "Our Products", "url": "/category-page" },
    { "label": "About Us", "url": "/about" },
    { "label": "Contact", "url": "/contact" }
  ],
  "footerLinks": [],
  "socialLinks": [
    { "label": "YouTube", "url": "https://www.youtube.com/@RanganiEngineeringPvtLtd" },
    { "label": "Instagram", "url": "https://www.instagram.com/rangani_engineering_pvt_ltd" },
    { "label": "Facebook", "url": "https://www.facebook.com/people/Rangani-Engineering-Pvt-Ltd/100063895899990/" }
  ],
  "promoModal": {
    "enabled": true,
    "delayMs": 5000,
    "autoRotateMs": 3000,
    "slides": [
      { "heading": "Promo Slide 1", "image": { "sourceUrl": "https://cdn.example.com/promo1.jpg" } },
      { "heading": "Promo Slide 2", "image": { "sourceUrl": "https://cdn.example.com/promo2.jpg" } }
    ]
  },
  "defaultSeo": {
    "metaTitle": "Rangani Engineering",
    "metaDescription": "Industrial machines and recycling solutions."
  }
}
```

### 2) Page With Flexible Blocks
```json
{
  "externalId": "legacy-page:home",
  "slug": "home",
  "uri": "/",
  "title": "Home",
  "status": "publish",
  "seo": {
    "metaTitle": "Home | Rangani Engineering",
    "metaDescription": "Reimagining waste, reengineering the future."
  },
  "blocks": [
    {
      "layout": "hero_showcase",
      "data": {
        "title": "REIMAGINING WASTE, REENGINEERING THE FUTURE",
        "description": "Empowering industries with advanced engineering solutions."
      }
    },
    {
      "layout": "stats_band",
      "data": {
        "stats": [
          { "label": "Unique Clients", "value": 6000, "suffix": "+" },
          { "label": "Countries Served", "value": 15, "suffix": "+" },
          { "label": "Years of Experience", "value": 30, "suffix": "+" }
        ]
      }
    },
    {
      "layout": "contact_form_split",
      "data": {
        "formTitle": "Connect With Us",
        "submitLabel": "Submit Now",
        "categories": ["General Inquiry", "Support", "Feedback"],
        "termsLabel": "I agree to the terms and conditions"
      }
    }
  ]
}
```

### 3) Product Category Term
```json
{
  "externalId": "legacy-category:waste-management",
  "slug": "waste-management",
  "name": "Waste Management",
  "description": "High-pressure balers, shredders and cutting systems.",
  "intro": "Waste processing machinery and recycling systems.",
  "serviceMode": false,
  "seo": {
    "metaTitle": "Waste Management Machines",
    "metaDescription": "Explore waste management product range."
  }
}
```

### 4) Product CPT Entry
```json
{
  "externalId": "legacy-product:triple-action-scrap-baling-press",
  "slug": "triple-action-scrap-baling-press",
  "title": "Triple Action Scrap Baling Press",
  "status": "publish",
  "summary": "High-output scrap processing baling press.",
  "tagline": "The Ultimate Solution for Metal Scrap Management",
  "benefits": [
    "Higher Scrap Selling Price",
    "Efficient Recycling"
  ],
  "videoUrl": "https://www.youtube.com/watch?v=i6Kmm21FPZs",
  "specifications": [
    { "label": "Size", "value": "8\" x 8\"" },
    { "label": "Bale Weight", "value": "25 Kg" }
  ],
  "applications": {
    "materials": ["Mild Steel", "Stainless Steel"],
    "industries": []
  },
  "gallery": [
    { "sourceUrl": "https://cdn.example.com/triple-action-1.jpg" }
  ],
  "featuredImage": { "sourceUrl": "https://cdn.example.com/triple-action-1.jpg" },
  "categorySlugs": ["waste-management"],
  "relatedProductSlugs": ["double-action-scrap-baling-press"],
  "seo": {
    "metaTitle": "Triple Action Scrap Baling Press",
    "metaDescription": "Industrial baling press for scrap management."
  }
}
```

### 5) SEO Fields Reused Across Entities
```json
{
  "metaTitle": "Entity Title",
  "metaDescription": "Entity description for search snippets.",
  "canonicalUrl": "https://example.com/entity",
  "noindex": false,
  "nofollow": false,
  "openGraphTitle": "Entity OG Title",
  "openGraphDescription": "Entity OG Description",
  "openGraphImage": { "sourceUrl": "https://cdn.example.com/og-image.jpg" }
}
```

## Recommended Workflow
- Parse CRA references into normalized JSON payloads using typed helpers from `scripts/import/transformers.ts`.
- Validate payload against `src/types/import.ts` shapes in CI before WordPress write/import.
- Store final payload in versioned JSON files (for audit + repeatable imports).
