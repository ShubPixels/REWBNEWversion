# Import Matrix (Legacy CRA -> New Next.js 15 Starter)

## Purpose
This matrix maps existing CRA sources to reusable starter domains for Next.js App Router + WPGraphQL + ACF Pro.

## Data Domains
| Legacy Source | Legacy Role | New Starter Domain | Target Location (Starter) |
|---|---|---|---|
| `src/pages/ProductData.js` | In-code product catalog | Product CPT data (WordPress) | `lib/cms/queries/products.ts`, `lib/cms/mappers/product.ts`, `types/product.ts` |
| `src/pages/CategoriesPage.jsx` `CATEGORY_LIST` | In-code category metadata + product slug grouping | Product Category taxonomy + optional term ACF | `lib/cms/queries/taxonomies.ts`, `types/taxonomy.ts` |
| `src/Components/Navbar.js` | Header nav, contact/social, mega-menu data | Global options content | `lib/cms/queries/globals.ts`, `types/global.ts` |
| `src/Components/Footer.jsx` | Footer links and contact | Global options content | `lib/cms/queries/globals.ts`, `types/global.ts` |
| `src/App.js` popup image state | App-level promotional modal | Flexible global promo block (optional) | `lib/cms/queries/globals.ts`, `components/blocks/global/PromoModal.tsx` |

## Page Composition Domains
| Legacy Page | Primary Content Pattern | ACF / GraphQL Target | App Router Target |
|---|---|---|---|
| `HomePage.jsx` | Multi-section marketing page | Page + Flexible Content blocks | `app/page.tsx` |
| `AboutUs.jsx` | Story + values + awards + CTA | Page + Flexible Content blocks | `app/about/page.tsx` |
| `ContactUs.jsx` | Form + static contact panel | Page blocks + global contact options | `app/contact/page.tsx` + `app/api/contact/route.ts` |
| `CategoriesPage.jsx` | Category browse + product preview | Product category archive + term fields | `app/products/page.tsx` |
| `ProductPage.jsx` | Product detail + related | Product CPT single | `app/products/[slug]/page.tsx` |

## Runtime Integration Matrix
| Legacy Behavior | Current Implementation | New Implementation |
|---|---|---|
| Client-side route rendering | `react-router-dom` in `App.js` | Server-first App Router files |
| Contact submission | EmailJS in client (`HomePage`, `ContactUs`) | Next route handler proxying to WP/SMTP/service (`app/api/contact/route.ts`) |
| Preview flow | Not formalized | Next preview route handler (`app/api/preview/route.ts`) + draft mode |
| SEO fields | Mostly hardcoded page text | ACF SEO field group + typed mapper + metadata helpers |

## Component/Block Extraction Map
| Legacy UI Section | Target Block Type |
|---|---|
| Home hero | `HeroBlock` |
| Stats CTA | `StatsCtaBlock` |
| Services grid | `ServiceCardsBlock` |
| Awards grid | `AwardsBlock` |
| Testimonials | `TestimonialsBlock` |
| Contact panel/form | `ContactBlock` |
| About story | `StoryBlock` |
| Vision/Mission/Quality | `ValuePropsBlock` |
| Category listing grid | `TaxonomyGridBlock` |
| Product detail tabs | Product template section (non-flex core product fields) |

## Strong Typing Targets
- Global options: header, footer, social links, contact details, promo settings.
- Flexible blocks: discriminated union by `blockType`.
- Product entity: normalized product model with consistent specs and applications structures.
- Taxonomy entity: category slug, name, description, optional media and CTA fields.
- SEO entity: page/product/taxonomy SEO group from custom ACF fields.
