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

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL used for canonical/OG metadata and robots/sitemap host |
| `NEXT_PUBLIC_WORDPRESS_URL` | Yes (or endpoint) | WordPress base URL fallback for GraphQL endpoint |
| `WORDPRESS_GRAPHQL_ENDPOINT` | Yes (or base URL) | Explicit WPGraphQL endpoint |
| `NEXT_PUBLIC_WORDPRESS_HOSTNAME` | Recommended | Primary image hostname for `next/image` |
| `NEXT_PUBLIC_IMAGE_HOSTNAMES` | Recommended | Comma-separated additional image/CDN hostnames for `next/image` |
| `WORDPRESS_AUTH_TOKEN` | Optional | Bearer token for protected WPGraphQL |
| `WORDPRESS_PREVIEW_SECRET` | Yes | Secret for `/api/draft` and `/api/exit-draft` |
| `CONTACT_TO_EMAIL` | Yes | Inbox recipient for contact submissions |
| `CONTACT_FROM_EMAIL` | Yes | Sender address for Resend |
| `CONTACT_REPLY_TO_EMAIL` | Optional | Static reply-to override |
| `CONTACT_SUBJECT_PREFIX` | Optional | Subject prefix for contact emails |
| `RESEND_API_KEY` | Yes | Resend API key |
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
  - forced `no-store` + `revalidate: false` for preview GraphQL requests

This keeps ISR behavior consistent across route files and sitemap generation.

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
- Draft fetches use WPGraphQL `asPreview` request path (`no-store`)

## Contact Route Behavior
Endpoint: `POST /api/contact`

Validation/security:
- Zod payload validation
- honeypot trap support
- Turnstile verification hook
- Resend delivery via service abstraction

Error contract:
- `invalid_json` (400)
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
