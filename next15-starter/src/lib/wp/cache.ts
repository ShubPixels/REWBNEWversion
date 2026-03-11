export const WP_REVALIDATE_SECONDS = {
  default: 60,
  content: 120,
  globals: 300,
  menus: 300,
  sitemap: 600,
} as const;

export const WP_CACHE_STRATEGY = {
  genericPages: "content",
  products: "content",
  productCategories: "content",
  globalSettings: "globals",
  menus: "menus",
  sitemap: "sitemap",
} as const;

export const WP_TAGS = {
  globalSettings: "wp:global-settings",
  menus: "wp:menus",
  productCategories: "wp:product-categories",
  sitemapPages: "wp:sitemap:pages",
  sitemapProducts: "wp:sitemap:products",
  sitemapProductCategories: "wp:sitemap:product-categories",
  page: (uri: string): string => `wp:page:${uri}`,
  product: (slug: string): string => `wp:product:${slug}`,
  productCategory: (slug: string): string => `wp:product-category:${slug}`,
  productRelatedOverride: (slug: string): string => `wp:product:${slug}:related-override`,
} as const;

export const WP_PREVIEW_FETCH_OPTIONS = {
  mode: "preview" as const,
  revalidate: false as const,
  cache: "no-store" as const,
};

export function buildWpTags(...tags: Array<string | null | undefined>): string[] {
  const normalized = tags
    .flatMap((tag) => (typeof tag === "string" ? [tag.trim()] : []))
    .filter((tag) => tag.length > 0);
  return [...new Set(normalized)];
}
