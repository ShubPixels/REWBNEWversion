# Legacy Content Import Tooling

This folder contains migration tooling that reads legacy CRA content as reference input and transforms it into import-ready JSON payloads for the headless WordPress starter.

## Legacy files read (reference only)

- `../src/pages/HomePage.jsx`
- `../src/pages/AboutUs.jsx`
- `../src/pages/ContactUs.jsx`
- `../src/pages/CategoriesPage.jsx`
- `../src/pages/ProductData.js`
- `../src/Components/Navbar.js`
- `../src/App.js`

No legacy files are modified by these scripts.

## Commands

- `npm run import:extract`
  - Extracts structured legacy content and writes a snapshot to `scripts/import/output/legacy-extracted.json`.
- `npm run import:build`
  - Builds normalized import payloads and writes required JSON outputs.

## Generated output files

- `scripts/import/output/pages-home.json`
- `scripts/import/output/pages-about.json`
- `scripts/import/output/pages-contact.json`
- `scripts/import/output/global-options.json`
- `scripts/import/output/product-categories.json`
- `scripts/import/output/products.json`
- `scripts/import/output/content-conflicts.json`

## Automatic normalization

- Legacy `benifits` is normalized to `benefits`.
- Product specification rows are normalized to:
  - `{ "spec_label": "...", "spec_value": "..." }`
- Application materials and industries are normalized into string arrays.
- Category slugs are normalized consistently with one slugifier.
- Page-owned flexible content is separated from global options data.
- Missing or unknown values are marked explicitly as `__MISSING__`.

The product/category/global JSON payloads use import-friendly `snake_case` keys.

## Manual review required

Check `content-conflicts.json` before import. It flags migration blockers and review items, including:

- About page founding year conflict.
- Category structure mismatch between pages and product data.
- Legacy malformed product fields.
- Missing footer source detail in approved input scope.
- Duplicated contact form logic across Home and Contact.
- Additional field-level placeholders that must be filled before WordPress import.
