# Page Inventory (CRA Reference -> Next.js Starter)

## Migration Target
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- WordPress as headless CMS
- ACF Pro: Flexible Content, Options Pages, Product CPT, Product Category taxonomy
- WPGraphQL for all content fetching
- Custom ACF SEO fields
- Next.js route handlers: contact and preview

## Route Inventory from `src/App.js`
| Legacy Route | Legacy Component | Next.js App Router Target |
|---|---|---|
| `/` | `HomePage` | `app/page.tsx` |
| `/category-page` | `CategoriesPage` | `app/products/page.tsx` (category index / browsing) |
| `/products/:productName` | `ProductPage` | `app/products/[slug]/page.tsx` |
| `/about` | `AboutUs` | `app/about/page.tsx` |
| `/contact` | `ContactUs` | `app/contact/page.tsx` |

## Global Shell Inventory (`src/App.js`, `src/Components/Navbar.js`, `src/Components/Footer.jsx`)
- Shared shell wrappers:
  - `Navbar`
  - `Footer`
  - `Buttons` (floating actions)
  - `ScrollToTop`
- App-level promotional popup (timed image modal in `App.js`)
- Header content domains currently hardcoded:
  - Logo and brand text
  - contact phones/email
  - social links
  - brochure link
  - mega menu category + product list
- Footer content domains currently hardcoded:
  - company blurb
  - nav links
  - contact numbers, email, address

## Section Inventory by Page

### Home (`src/pages/HomePage.jsx`)
1. Hero (headline, CTA buttons, hero slider)
2. Partner logo banner
3. Stats + conversion CTA section
4. Category/service cards
5. Image carousel block
6. Awards showcase
7. Testimonials slider
8. Contact form + business contact panel

### About (`src/pages/AboutUs.jsx`)
1. Hero banner
2. Our Story (text + image)
3. Vision / Mission / Quality / Why Choose Us grid
4. What We Do service rows
5. Awards grid
6. Bottom CTA banner

### Contact (`src/pages/ContactUs.jsx`)
1. Contact form (EmailJS submit)
2. Right-side company contact block (email, phone, address, maps link)

### Categories (`src/pages/CategoriesPage.jsx`)
1. Category listing hero
2. Category card grid
3. Category modal with product gallery
4. Service-only card path to contact

### Product Detail (`src/pages/ProductPage.jsx`)
1. Product hero/title
2. Product media + detail tabs (description, specifications, applications, video)
3. Related products grid (same category)
4. Other categories grid
5. Inline contact CTA card

## Product Data Inventory (`src/pages/ProductData.js`)
- Single in-repo JS object used as source of truth for:
  - product slug key
  - category
  - name/tagline
  - benefits
  - description
  - image array
  - specifications array (shape varies)
  - applications (shape varies)
  - optional `videoUrl`
- This maps directly to target WordPress Product CPT + ACF field groups.
