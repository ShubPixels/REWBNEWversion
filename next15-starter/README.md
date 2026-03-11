# Next.js 15 Headless WordPress Starter

Production-ready starter for a server-first Next.js App Router project using:
- WordPress (headless CMS)
- WPGraphQL + ACF Pro fields
- Typed data mapping
- Draft mode preview
- Contact API route (Resend)

## Requirements
- Node.js 20+
- npm 10+
- WordPress with:
  - WPGraphQL
  - WPGraphQL for ACF
  - ACF Pro field groups used by this starter

## Environment Variables
Copy `.env.example` to `.env.local` and set real values.

Runtime env parsing is centralized in `src/lib/env.ts`.
- Public and server variables are validated with strict schemas.
- Core site + WordPress misconfiguration fails fast at startup.
- Contact-delivery env vars are validated when `/api/contact` is invoked.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL used for canonical/OG metadata and robots/sitemap host |
| `NEXT_PUBLIC_WORDPRESS_URL` | Yes (or endpoint) | WordPress base URL fallback for GraphQL endpoint |
| `WORDPRESS_GRAPHQL_ENDPOINT` | Yes (or base URL) | Explicit WPGraphQL endpoint |
| `NEXT_PUBLIC_WORDPRESS_HOSTNAME` | Recommended | Primary image hostname for `next/image` |
| `NEXT_PUBLIC_IMAGE_HOSTNAMES` | Recommended | Comma-separated additional image/CDN hostnames for `next/image` |
| `WORDPRESS_AUTH_TOKEN` | Optional | Bearer token for protected WPGraphQL |
| `WORDPRESS_REVALIDATION_SECRET` | Optional | Secret for on-demand revalidation endpoints (if enabled) |
| `WORDPRESS_PREVIEW_SECRET` | Yes | Secret for `/api/draft` and `/api/exit-draft` |
| `CONTACT_TO_EMAIL` | Yes for `/api/contact` | Inbox recipient for contact submissions |
| `CONTACT_FROM_EMAIL` | Yes for `/api/contact` | Sender address for Resend |
| `CONTACT_REPLY_TO_EMAIL` | Optional | Static reply-to override |
| `CONTACT_SUBJECT_PREFIX` | Optional | Subject prefix for contact emails |
| `RESEND_API_KEY` | Yes for `/api/contact` | Resend API key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | Turnstile site key for frontend widget integration |
| `TURNSTILE_SECRET_KEY` | Optional | Enables Turnstile verification if set |

## Local Development
```bash
npm install
npm run dev
```

## Build and Type Validation
```bash
npm run typecheck
npm run build
```

## Cache Strategy
WordPress fetch caching is centralized in [`src/lib/wp/cache.ts`](./src/lib/wp/cache.ts):
- `WP_REVALIDATE_SECONDS`
  - `content`: 120s (pages/products/categories)
  - `globals`: 300s (global options + product category list)
  - `menus`: 300s
  - `sitemap`: 600s
- `WP_TAGS`
  - stable cache tags for global settings, menus, pages, products, categories, sitemap groups
- `WP_PREVIEW_FETCH_OPTIONS`
  - forced `mode: preview` + `no-store` + `revalidate: false` for preview GraphQL requests

This keeps ISR behavior consistent across route files and sitemap generation.

Route policy:
- Generic pages: `content` revalidation + page-specific tags
- Products: `content` revalidation + product slug tags
- Product categories: `content` revalidation + category slug tags
- Global settings / menu trees: `globals` / `menus`
- Sitemap: `sitemap`
- Preview requests: always `no-store`

## Image Domain Strategy
`next/image` allowlist is built from env variables in [`next.config.ts`](./next.config.ts):
- `NEXT_PUBLIC_WORDPRESS_HOSTNAME`
- hostname parsed from `NEXT_PUBLIC_WORDPRESS_URL`
- `NEXT_PUBLIC_IMAGE_HOSTNAMES` (comma-separated)

If all are empty, it falls back to `example.com`.

## Preview Mode
- Enter draft mode: `/api/draft?secret=...&id=...&idType=...` (or `previewId`/`previewType`)
- Exit draft mode: `/api/exit-draft?secret=...&redirect=/...`

Guardrails:
- Secret validated before enabling/disabling draft mode
- Constant-time secret comparison
- Internal redirect sanitization (no open redirects)
- Preview id format and idType are normalized/validated before lookup
- Draft fetches use WPGraphQL `asPreview` request path (`no-store`)
- Invalid preview lookup params fail with clear 4xx responses

## Generic Page Rendering
- Route: [`app/(site)/[[...slug]]/page.tsx`](./app/(site)/[[...slug]]/page.tsx)
- The catch-all route resolves a URI from slug segments (`/` for homepage, `/about`, `/contact`, etc.) and queries `nodeByUri` through WPGraphQL.
- When draft mode is enabled and preview params are present, the route fetches `asPreview` content and matches preview URI before rendering.
- Flexible content is rendered through [`src/components/blocks/BlockRenderer.tsx`](./src/components/blocks/BlockRenderer.tsx), which uses [`src/components/blocks/registry.ts`](./src/components/blocks/registry.ts) to map ACF layout keys to typed block components.
- Editors manage page sections in WordPress using ACF Flexible Content (`pageBuilder.blocks`); each layout key (for example `hero_showcase`, `stats_band`, `contact_form_split`) maps to one reusable Next.js block component.
- Expected initial editor compositions:
  - Home: `hero_showcase`, `stats_band`, `logo_marquee`, `category_cards_grid`, `awards_grid`, `testimonials_slider`, `contact_form_split`
  - About: `page_intro` or `hero_showcase`, `split_content_media`, `feature_cards_grid`, `service_rows_alternating`, `awards_grid`, `cta_banner`
  - Contact: `page_intro`, `contact_form_split`
- Unknown or unmapped flexible layouts do not crash the page; they render a safe fallback notice.

## Product System
- Product CPT route: [`app/(site)/products/[slug]/page.tsx`](./app/(site)/products/[slug]/page.tsx)
  - Fetches product by slug from WPGraphQL, supports draft preview, renders hero/overview/tabs/related/other-categories, and builds metadata from product SEO with global SEO fallback.
- Product Category route: [`app/(site)/product-category/[slug]/page.tsx`](./app/(site)/product-category/[slug]/page.tsx)
  - Fetches taxonomy term by slug, renders archive hero + product grid, and switches to service-only empty state when `isServiceCategory` is enabled.
- Related products behavior:
  - Priority 1: manual `relatedProducts` override in product ACF.
  - Priority 2: fallback query for related override.
  - Priority 3: same-category products (excluding current product).
- Expected ACF/WPGraphQL product fields (`productFields`):
  - `tagline`, `introDescription`/`summary`, `videoUrl`, `gallery`, `benefits`, `specifications`, `applicationMaterials`, `applicationIndustries`, `cta`, `ctaLabel`, `ctaUrl`, `relatedProducts`.
- Expected ACF/WPGraphQL product category fields (`taxonomyFields`):
  - `cardImage`, `archiveHeroImage`/`heroImage`, `shortDescription`, `archiveIntro`/`intro`, `cta`, `ctaLabel`, `ctaUrl`, `isServiceCategory`, `emptyStateHeading`, `emptyStateText`.

## Contact Route Behavior
Endpoint: `POST /api/contact`

Validation/security:
- Zod payload validation
- strict payload shape (unknown keys rejected)
- `Content-Type: application/json` enforcement
- request size guard
- honeypot trap support
- Turnstile verification hook
- Resend delivery via service abstraction

Error contract:
- `invalid_json` (400)
- `invalid_content_type` (415)
- `payload_too_large` (413)
- `validation_error` (400 with `fieldErrors`)
- `turnstile_failed` (400)
- `delivery_failed` (500)
- `method_not_allowed` (405)

All responses include a `requestId`.

## Launch Checklist
1. Set all required env vars in Vercel Project Settings.
2. Confirm `NEXT_PUBLIC_SITE_URL` matches production domain.
3. Confirm `WORDPRESS_GRAPHQL_ENDPOINT` resolves from Vercel runtime.
4. Confirm `next/image` hostnames cover WordPress media and CDN domains.
5. Verify `/api/draft` and `/api/exit-draft` with valid and invalid secrets.
6. Verify `/api/contact` success and failure paths (invalid payload, Turnstile fail, delivery fail).
7. Verify page/product/category metadata reflects custom SEO with global fallback.
8. Verify `/sitemap.xml` and `/robots.txt` are reachable in production.
9. Run `npm run typecheck` and `npm run build` before final deployment.

## Deployment Notes
- Set all required env vars in your target environment before first start.
- Keep `NEXT_PUBLIC_SITE_URL` aligned with the deployed primary domain.
- Confirm WordPress media hostnames are present in `NEXT_PUBLIC_IMAGE_HOSTNAMES` (or derived host envs).
- If Turnstile is enabled (`TURNSTILE_SECRET_KEY`), ensure frontend token wiring is present in your chosen contact UI implementation.
- Use strong random secrets for `WORDPRESS_PREVIEW_SECRET` and `WORDPRESS_REVALIDATION_SECRET`.

## Failure Modes / Troubleshooting
- App fails to start with env error:
  - Check validation output from `src/lib/env.ts` and fill missing/invalid variables.
- Draft mode route returns 401/400:
  - Verify `secret`, `id`, and `idType` values from WordPress preview links.
- Content unexpectedly 404s:
  - Confirm slug/URI exists in WPGraphQL and that the node is published (or draft mode is enabled).
- GraphQL fetch failures:
  - In development, inspect server logs for `[wpFetch] request_failed` diagnostics.
- Contact submissions fail with `delivery_failed`:
  - Re-check `RESEND_API_KEY`, sender/recipient envs, and Resend domain/sender verification.

## Editor Checklist
1. Populate global options (header/footer/contact/social/default SEO/promo).
2. Ensure every page/product/category has SEO fields (or rely on global defaults intentionally).
3. Confirm product categories and product slugs are final before launch.
4. Validate contact form labels/options/sidebar copy in ACF fields.
5. Verify promo modal slides and links if promo is enabled.
6. Check media assets are uploaded to allowed domains.

## Developer Checklist
1. Keep new WP fetches aligned with `WP_REVALIDATE_SECONDS` and `WP_TAGS`.
2. Use server components by default; only add client components for real interaction.
3. Keep preview-safe logic (`draftMode` + preview lookup) in route files.
4. Update `.env.example` whenever new env vars are introduced.
5. Keep `next.config.ts` image domain allowlist in sync with media infrastructure.
6. Preserve JSON API contracts for `/api/contact` consumers.
7. Re-run `npm run typecheck` and `npm run build` after data-layer changes.
