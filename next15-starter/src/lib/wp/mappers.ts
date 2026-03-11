import type {
  GetMenusQuery,
  GetGlobalSettingsQuery,
  GetHomepageQuery,
  GetPageByUriQuery,
  GetPreviewNodeQuery,
  GetProductCategoriesQuery,
  GetProductBySlugQuery,
  GetProductCategoryBySlugQuery,
  GetProductRelatedOverrideQuery,
  Maybe,
  WpGlobalSettingsData,
  WpLink,
  WpMenuData,
  WpMenuItemData,
  WpMedia,
  WpPageBlock,
  WpPageData,
  WpPromoModalData,
  WpPromoSlideData,
  WpPreviewNodeData,
  WpPreviewNodeType,
  WpProductCardData,
  WpProductCategoryData,
  WpProductCategorySummaryData,
  WpProductData,
  WpProductApplicationsData,
  WpProductSpecification,
  WpRawFlexibleBlock,
  WpRawGlobalOptions,
  WpRawLinkField,
  WpRawMenu,
  WpRawMenuItem,
  WpRawMediaItem,
  WpRawPage,
  WpRawPromoModalOptions,
  WpRawPromoSlide,
  WpRawProduct,
  WpRawProductFields,
  WpRawProductCategory,
  WpRawProductCategorySummary,
  WpRawSeoFields,
  WpSeo,
} from "@/types/wp";

function stringOrEmpty(value: Maybe<string>): string {
  return typeof value === "string" ? value : "";
}

function nullableString(value: Maybe<string>): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function numberOrNull(value: Maybe<number>): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function boolOrFalse(value: Maybe<boolean>): boolean {
  return value === true;
}

function numberWithDefault(value: Maybe<number>, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }
  return fallback;
}

function makeFallbackId(prefix: string, slugOrUri: string): string {
  return `${prefix}:${slugOrUri || "unknown"}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function dedupeStringList(values: string[]): string[] {
  return [...new Set(values)];
}

export function mapWpMedia(node: Maybe<WpRawMediaItem>): WpMedia | null {
  if (!node?.sourceUrl) {
    return null;
  }

  return {
    id: node.id ?? makeFallbackId("media", node.sourceUrl),
    databaseId: numberOrNull(node.databaseId),
    url: node.sourceUrl,
    alt: stringOrEmpty(node.altText),
    title: nullableString(node.title),
    caption: nullableString(node.caption),
    width: numberOrNull(node.mediaDetails?.width),
    height: numberOrNull(node.mediaDetails?.height),
  };
}

export function mapWpLink(link: Maybe<WpRawLinkField>): WpLink | null {
  const url = stringOrEmpty(link?.url);
  if (!url) {
    return null;
  }

  const label = stringOrEmpty(link?.title) || url;
  const target = nullableString(link?.target);

  return { label, url, target };
}

export function mapWpSeo(seo: Maybe<WpRawSeoFields>): WpSeo | null {
  if (!seo) {
    return null;
  }

  return {
    title: nullableString(seo.metaTitle),
    description: nullableString(seo.metaDescription),
    canonicalUrl: nullableString(seo.canonicalUrl),
    noindex: boolOrFalse(seo.noindex),
    nofollow: boolOrFalse(seo.nofollow),
    openGraphTitle: nullableString(seo.openGraphTitle),
    openGraphDescription: nullableString(seo.openGraphDescription),
    openGraphImage: mapWpMedia(seo.openGraphImage),
  };
}

function mapWpBlocks(blocks: Maybe<Array<Maybe<WpRawFlexibleBlock>>>): WpPageBlock[] {
  if (!blocks?.length) {
    return [];
  }

  return blocks
    .filter((block): block is WpRawFlexibleBlock => Boolean(block))
    .map((block, index) => {
      const rawBlock: Record<string, unknown> = {};
      Object.entries(block).forEach(([key, value]) => {
        if (key === "__typename" || key === "fieldGroupName") {
          return;
        }
        rawBlock[key] = value;
      });

      return {
        type: block.__typename ?? `UnknownBlock_${index}`,
        fieldGroupName: nullableString(block.fieldGroupName),
        raw: rawBlock,
      };
    });
}

export function mapWpPage(page: Maybe<WpRawPage>): WpPageData | null {
  if (!page?.id) {
    return null;
  }

  const uri = stringOrEmpty(page.uri);
  const slug = stringOrEmpty(page.slug);

  return {
    id: page.id,
    databaseId: numberOrNull(page.databaseId),
    uri,
    slug,
    title: stringOrEmpty(page.title),
    excerpt: stringOrEmpty(page.excerpt),
    content: stringOrEmpty(page.content),
    featuredImage: mapWpMedia(page.featuredImage?.node),
    seo: mapWpSeo(page.seoFields),
    blocks: mapWpBlocks(page.pageBuilder?.blocks),
  };
}

function mapWpProductCategorySummary(
  raw: Maybe<WpRawProductCategorySummary>,
): WpProductCategorySummaryData | null {
  if (!raw) {
    return null;
  }

  const slug = stringOrEmpty(raw.slug);
  const uri = stringOrEmpty(raw.uri);
  const id = raw.id ?? (slug || uri ? makeFallbackId("product-category", slug || uri) : "");
  if (!id) {
    return null;
  }

  return {
    id,
    databaseId: numberOrNull(raw.databaseId),
    slug,
    uri,
    name: stringOrEmpty(raw.name),
  };
}

function mapWpProductCard(raw: Maybe<WpRawProduct>): WpProductCardData | null {
  if (!raw) {
    return null;
  }

  const slug = stringOrEmpty(raw.slug);
  const uri = stringOrEmpty(raw.uri);
  const id = raw.id ?? (slug || uri ? makeFallbackId("product-card", slug || uri) : "");
  if (!id) {
    return null;
  }

  return {
    id,
    slug,
    uri,
    title: stringOrEmpty(raw.title),
    excerpt: stringOrEmpty(raw.excerpt),
    featuredImage: mapWpMedia(raw.featuredImage?.node),
  };
}

function mapSpecifications(
  rows: Maybe<
    Array<
      Maybe<{
        label?: Maybe<string>;
        value?: Maybe<string>;
        [key: string]: Maybe<string>;
      }>
    >
  >,
): WpProductSpecification[] {
  if (!rows?.length) {
    return [];
  }

  return rows.flatMap((row) => {
    if (!row) {
      return [];
    }

    const label = stringOrEmpty(row.label);
    const value = stringOrEmpty(row.value);
    if (label || value) {
      return [{ label, value }];
    }

    const fallbackEntries = Object.entries(row)
      .flatMap(([key, rawValue]) => {
        if (key === "label" || key === "value") {
          return [];
        }

        const normalizedLabel = stringOrEmpty(key).trim();
        const normalizedValue = stringOrEmpty(rawValue).trim();
        if (!normalizedLabel || !normalizedValue) {
          return [];
        }

        return [{ label: normalizedLabel, value: normalizedValue }];
      })
      .filter((entry) => entry.label.length > 0 && entry.value.length > 0);

    if (!fallbackEntries.length) {
      return [];
    }

    return fallbackEntries;
  });
}

function mapStringList(values: Maybe<Array<Maybe<string>>>): string[] {
  if (!values?.length) {
    return [];
  }

  return values
    .map((value) => stringOrEmpty(value).trim())
    .filter((value) => value.length > 0);
}

function mapUnknownStringList(value: unknown): string[] {
  return asArray(value)
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

function mapApplications(rawFields: Maybe<WpRawProductFields>): WpProductApplicationsData {
  const explicitMaterials = mapStringList(rawFields?.applicationMaterials);
  const explicitIndustries = mapStringList(rawFields?.applicationIndustries);

  const rawApplications = rawFields?.applications;
  const fallbackMaterials = mapStringList(Array.isArray(rawApplications) ? rawApplications : null);

  const applicationRecord = asRecord(rawApplications);
  const nestedMaterials = mapUnknownStringList(applicationRecord?.materials);
  const nestedIndustries = mapUnknownStringList(applicationRecord?.industries);

  return {
    materials: dedupeStringList([...explicitMaterials, ...fallbackMaterials, ...nestedMaterials]),
    industries: dedupeStringList([...explicitIndustries, ...nestedIndustries]),
  };
}

function dedupeProductCards(cards: WpProductCardData[]): WpProductCardData[] {
  const seen = new Set<string>();
  return cards.filter((card) => {
    const key = card.id || card.slug || card.uri;
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function mapRelatedProductsOverride(rawFields: Maybe<WpRawProductFields>): WpProductCardData[] {
  const nodes = rawFields?.relatedProducts?.nodes ?? [];
  const cards = nodes.map((item) => mapWpProductCard(item)).filter((item): item is WpProductCardData => item !== null);
  return dedupeProductCards(cards);
}

export function mapWpProduct(product: Maybe<WpRawProduct>): WpProductData | null {
  const page = mapWpPage(product);
  if (!page) {
    return null;
  }

  const rawFields = product?.productFields;
  const rawGallery = rawFields?.gallery?.nodes ?? [];
  const gallery = rawGallery
    .map((item) => mapWpMedia(item))
    .filter((item): item is WpMedia => item !== null);

  const categories = (product?.productCategories?.nodes ?? [])
    .map((category) => mapWpProductCategorySummary(category))
    .filter((category): category is WpProductCategorySummaryData => category !== null);

  const productData: WpProductData = {
    ...page,
    categories,
    product: {
      summary: stringOrEmpty(rawFields?.summary),
      tagline: stringOrEmpty(rawFields?.tagline),
      benefits: mapStringList(rawFields?.benefits),
      videoUrl: nullableString(rawFields?.videoUrl),
      specifications: mapSpecifications(rawFields?.specifications),
      applications: mapApplications(rawFields),
      relatedProductsOverride: mapRelatedProductsOverride(rawFields),
      gallery,
      raw: rawFields ? { ...rawFields } : {},
    },
  };

  return productData;
}

export function mapWpProductCategory(category: Maybe<WpRawProductCategory>): WpProductCategoryData | null {
  if (!category?.id) {
    return null;
  }

  const products = (category.products?.nodes ?? [])
    .map((item) => mapWpProductCard(item))
    .filter((item): item is WpProductCardData => item !== null);

  return {
    id: category.id,
    databaseId: numberOrNull(category.databaseId),
    slug: stringOrEmpty(category.slug),
    uri: stringOrEmpty(category.uri),
    name: stringOrEmpty(category.name),
    description: stringOrEmpty(category.description),
    seo: mapWpSeo(category.seoFields),
    intro: stringOrEmpty(category.taxonomyFields?.intro),
    heroImage: mapWpMedia(category.taxonomyFields?.heroImage),
    blocks: mapWpBlocks(category.taxonomyFields?.blocks),
    products,
  };
}

function mapPromoSlides(slides: Maybe<Array<Maybe<WpRawPromoSlide>>>): WpPromoSlideData[] {
  if (!slides?.length) {
    return [];
  }

  return slides.flatMap((slide, index) => {
    if (!slide) {
      return [];
    }

    const heading = stringOrEmpty(slide.heading);
    const description = stringOrEmpty(slide.description);
    const image = mapWpMedia(slide.image);
    const cta = mapWpLink(slide.cta);

    if (!heading && !description && !image && !cta) {
      return [];
    }

    return [
      {
        id: `promo-${index + 1}`,
        heading,
        description,
        image,
        cta,
      },
    ];
  });
}

function mapPromoModal(options: Maybe<WpRawPromoModalOptions>): WpPromoModalData {
  return {
    enabled: boolOrFalse(options?.enabled),
    delayMs: numberWithDefault(options?.delayMs, 5000),
    autoRotateMs: numberWithDefault(options?.autoRotateMs, 4000),
    slides: mapPromoSlides(options?.slides),
  };
}

function mapMenuItem(raw: Maybe<WpRawMenuItem>): Omit<WpMenuItemData, "children"> | null {
  if (!raw?.id) {
    return null;
  }

  const url = stringOrEmpty(raw.path) || stringOrEmpty(raw.url);
  if (!url) {
    return null;
  }

  return {
    id: raw.id,
    databaseId: numberOrNull(raw.databaseId),
    parentDatabaseId: numberOrNull(raw.parentDatabaseId),
    label: stringOrEmpty(raw.label) || url,
    url,
    target: nullableString(raw.target),
    cssClasses: (raw.cssClasses ?? [])
      .map((className) => stringOrEmpty(className).trim())
      .filter((className) => className.length > 0),
  };
}

function buildMenuTree(items: Array<Omit<WpMenuItemData, "children">>): WpMenuItemData[] {
  const byDatabaseId = new Map<number, WpMenuItemData>();
  const byFallbackId = new Map<string, WpMenuItemData>();
  const roots: WpMenuItemData[] = [];

  items.forEach((item) => {
    const enriched: WpMenuItemData = { ...item, children: [] };
    if (item.databaseId !== null) {
      byDatabaseId.set(item.databaseId, enriched);
    }
    byFallbackId.set(item.id, enriched);
  });

  items.forEach((item) => {
    const current = item.databaseId !== null ? byDatabaseId.get(item.databaseId) : byFallbackId.get(item.id);
    if (!current) {
      return;
    }

    if (item.parentDatabaseId === null) {
      roots.push(current);
      return;
    }

    const parent = byDatabaseId.get(item.parentDatabaseId);
    if (!parent) {
      roots.push(current);
      return;
    }

    parent.children.push(current);
  });

  return roots;
}

function mapMenu(rawMenu: Maybe<WpRawMenu>): WpMenuData | null {
  if (!rawMenu?.id) {
    return null;
  }

  const flatItems = (rawMenu.menuItems?.nodes ?? [])
    .map((rawItem) => mapMenuItem(rawItem))
    .filter((item): item is Omit<WpMenuItemData, "children"> => item !== null);

  return {
    id: rawMenu.id,
    databaseId: numberOrNull(rawMenu.databaseId),
    name: stringOrEmpty(rawMenu.name),
    slug: stringOrEmpty(rawMenu.slug),
    items: buildMenuTree(flatItems),
  };
}

export function mapMenusQuery(data: GetMenusQuery): WpMenuData[] {
  const rawMenus = data.menus?.nodes ?? [];
  return rawMenus.map((menu) => mapMenu(menu)).filter((menu): menu is WpMenuData => menu !== null);
}

export function mapGlobalSettingsQuery(data: GetGlobalSettingsQuery): WpGlobalSettingsData {
  const options: Maybe<WpRawGlobalOptions> = data.globalSettings?.globalOptions;

  const headerPrimaryLinks = (options?.headerPrimaryLinks ?? [])
    .map((link) => mapWpLink(link))
    .filter((link): link is WpLink => link !== null);

  const footerLinks = (options?.footerLinks ?? [])
    .map((link) => mapWpLink(link))
    .filter((link): link is WpLink => link !== null);

  const socialLinks = (options?.socialLinks ?? [])
    .map((link) => mapWpLink(link))
    .filter((link): link is WpLink => link !== null);

  return {
    siteTitle: stringOrEmpty(data.generalSettings?.title),
    siteDescription: stringOrEmpty(data.generalSettings?.description),
    siteUrl: stringOrEmpty(data.generalSettings?.url),
    siteName: stringOrEmpty(options?.siteName),
    siteTagline: stringOrEmpty(options?.siteTagline),
    brandLogo: mapWpMedia(options?.brandLogo),
    contactEmail: stringOrEmpty(options?.contactEmail),
    contactPhone: stringOrEmpty(options?.contactPhone),
    contactAddress: stringOrEmpty(options?.contactAddress),
    whatsappPhone: stringOrEmpty(options?.whatsappPhone),
    whatsappDefaultMessage: stringOrEmpty(options?.whatsappDefaultMessage),
    enableBackToTop: boolOrFalse(options?.enableBackToTop),
    footerText: stringOrEmpty(options?.footerText),
    headerPrimaryLinks,
    footerLinks,
    socialLinks,
    promoModal: mapPromoModal(options?.promoModal),
    menus: [],
    defaultSeo: mapWpSeo(options?.defaultSeo),
    options: options ? { ...options } : {},
  };
}

export function mapPageByUriQuery(data: GetPageByUriQuery): WpPageData | null {
  const node = data.nodeByUri;
  if (!node || node.__typename !== "Page") {
    return null;
  }
  return mapWpPage(node);
}

export function mapHomepageQuery(data: GetHomepageQuery): WpPageData | null {
  return mapWpPage(data.homepage);
}

export function mapProductBySlugQuery(data: GetProductBySlugQuery): WpProductData | null {
  return mapWpProduct(data.product);
}

export function mapProductCategoryBySlugQuery(
  data: GetProductCategoryBySlugQuery,
): WpProductCategoryData | null {
  return mapWpProductCategory(data.productCategory);
}

export function mapProductCategoriesQuery(data: GetProductCategoriesQuery): WpProductCategorySummaryData[] {
  const categories = (data.productCategories?.nodes ?? [])
    .map((category) => mapWpProductCategorySummary(category))
    .filter((category): category is WpProductCategorySummaryData => category !== null);

  const seen = new Set<string>();
  return categories.filter((category) => {
    const key = category.id || category.slug || category.uri;
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function mapProductRelatedOverrideQuery(data: GetProductRelatedOverrideQuery): WpProductCardData[] {
  const related = data.product?.productFields?.relatedProducts?.nodes ?? [];
  const cards = related.map((item) => mapWpProductCard(item)).filter((item): item is WpProductCardData => item !== null);
  return dedupeProductCards(cards);
}

function mapPreviewNodeType(typeName: string): WpPreviewNodeType {
  if (typeName === "Page") {
    return "page";
  }
  if (typeName === "Product") {
    return "product";
  }
  if (typeName === "ProductCategory") {
    return "productCategory";
  }
  return "unknown";
}

export function mapPreviewNodeQuery(data: GetPreviewNodeQuery): WpPreviewNodeData | null {
  const node = data.contentNode;
  if (!node?.id) {
    return null;
  }

  const typeName = stringOrEmpty(node.__typename);

  return {
    nodeType: mapPreviewNodeType(typeName),
    typeName,
    id: node.id,
    databaseId: numberOrNull(node.databaseId),
    slug: stringOrEmpty(node.slug),
    uri: stringOrEmpty(node.uri),
    status: nullableString(node.status),
  };
}
