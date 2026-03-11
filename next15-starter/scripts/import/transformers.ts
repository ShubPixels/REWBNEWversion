import type {
  ImportBundle,
  ImportProductApplications,
  ImportProductCategorySeed,
  ImportProductSeed,
  ImportProductSpecificationRow,
  ImportTransformIssue,
  ImportTransformResult,
  LegacyCraProductRecord,
  LegacyCraProductMap,
} from "@/types/import";

export interface LegacyCategoryListItem {
  name: string;
  description?: string;
  productSlugs?: string[];
}

export interface LegacyCategoryList extends Array<LegacyCategoryListItem> {}

export interface MediaResolverContext {
  productSlug: string;
  productTitle: string;
  index: number;
}

export interface BuildImportBundleInput {
  generatedAt?: string;
  products: LegacyCraProductMap;
  categories?: LegacyCategoryList;
}

export interface BuildImportBundleOptions {
  mediaResolver?: (value: unknown, context: MediaResolverContext) => string | null;
}

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => asString(item)).filter((item) => item.length > 0);
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}

function normalizeSpecifications(rows: unknown): ImportProductSpecificationRow[] {
  if (!Array.isArray(rows)) {
    return [];
  }

  const normalized: ImportProductSpecificationRow[] = [];

  rows.forEach((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return;
    }

    const record = row as Record<string, unknown>;
    const explicitLabel = asString(record.label);
    const explicitValue = asString(record.value);

    if (explicitLabel || explicitValue) {
      normalized.push({ label: explicitLabel, value: explicitValue });
      return;
    }

    Object.entries(record).forEach(([key, rawValue]) => {
      const label = asString(key);
      const value = asString(rawValue);
      if (label && value) {
        normalized.push({ label, value });
      }
    });
  });

  return normalized;
}

function normalizeApplications(value: unknown): ImportProductApplications {
  if (Array.isArray(value)) {
    return {
      materials: uniqueStrings(asStringArray(value)),
      industries: [],
    };
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    return {
      materials: uniqueStrings(asStringArray(record.materials)),
      industries: uniqueStrings(asStringArray(record.industries)),
    };
  }

  return { materials: [], industries: [] };
}

function resolveProductImages(
  productSlug: string,
  productTitle: string,
  images: unknown,
  mediaResolver?: BuildImportBundleOptions["mediaResolver"],
): string[] {
  if (!Array.isArray(images)) {
    return [];
  }

  const urls = images
    .map((item, index) => {
      if (typeof item === "string" && item.trim()) {
        return item.trim();
      }

      if (!mediaResolver) {
        return null;
      }

      return mediaResolver(item, { productSlug, productTitle, index });
    })
    .filter((url): url is string => typeof url === "string" && url.trim().length > 0);

  return uniqueStrings(urls);
}

function normalizeProduct(
  slug: string,
  rawProduct: LegacyCraProductRecord,
  options: BuildImportBundleOptions,
  issues: ImportTransformIssue[],
): ImportProductSeed {
  const title = asString(rawProduct.name);
  const categoryName = asString(rawProduct.category);
  const categorySlug = categoryName ? toSlug(categoryName) : "";
  const primaryBenefits = uniqueStrings(asStringArray(rawProduct.benefits));
  const fallbackBenefits = uniqueStrings(asStringArray(rawProduct.benifits));
  const benefits = primaryBenefits.length > 0 ? primaryBenefits : fallbackBenefits;

  if (primaryBenefits.length === 0 && fallbackBenefits.length > 0) {
    issues.push({
      level: "warning",
      field: "benefits",
      message: "Mapped legacy field `benifits` to canonical `benefits`.",
      externalId: slug,
    });
  }

  const galleryUrls = resolveProductImages(slug, title, rawProduct.image, options.mediaResolver);
  const firstGalleryUrl = galleryUrls[0] ?? null;
  const specifications = normalizeSpecifications(rawProduct.specifications);
  const applications = normalizeApplications(rawProduct.applications);

  if (!title) {
    issues.push({
      level: "error",
      field: "title",
      message: "Missing product title.",
      externalId: slug,
    });
  }

  if (!categorySlug) {
    issues.push({
      level: "warning",
      field: "category",
      message: "Missing category mapping for product.",
      externalId: slug,
    });
  }

  return {
    externalId: `legacy-product:${slug}`,
    slug,
    title,
    status: "publish",
    summary: asString(rawProduct.description),
    tagline: asString(rawProduct.tagline),
    benefits,
    videoUrl: asString(rawProduct.videoUrl) || null,
    specifications,
    applications,
    gallery: galleryUrls.map((sourceUrl) => ({ sourceUrl })),
    featuredImage: firstGalleryUrl ? { sourceUrl: firstGalleryUrl } : null,
    categorySlugs: categorySlug ? [categorySlug] : [],
    relatedProductSlugs: [],
    seo: {},
  };
}

function buildCategorySeeds(
  products: ImportProductSeed[],
  categories: LegacyCategoryList | undefined,
): ImportProductCategorySeed[] {
  const fromCategoriesList = (categories ?? []).map((item) => {
    const slug = toSlug(item.name);
    const hasProducts = (item.productSlugs ?? []).length > 0;

    return {
      externalId: `legacy-category:${slug}`,
      slug,
      name: item.name.trim(),
      description: asString(item.description),
      intro: "",
      heroImage: null,
      serviceMode: !hasProducts,
      seo: {},
      blocks: [],
    } satisfies ImportProductCategorySeed;
  });

  const categoryMap = new Map<string, ImportProductCategorySeed>();
  fromCategoriesList.forEach((category) => {
    categoryMap.set(category.slug, category);
  });

  products.forEach((product) => {
    product.categorySlugs.forEach((categorySlug) => {
      if (categoryMap.has(categorySlug)) {
        return;
      }

      categoryMap.set(categorySlug, {
        externalId: `legacy-category:${categorySlug}`,
        slug: categorySlug,
        name: categorySlug
          .split("-")
          .filter((part) => part.length > 0)
          .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
          .join(" "),
        description: "",
        intro: "",
        heroImage: null,
        serviceMode: false,
        seo: {},
        blocks: [],
      });
    });
  });

  return [...categoryMap.values()];
}

export function buildImportBundle(
  input: BuildImportBundleInput,
  options: BuildImportBundleOptions = {},
): ImportTransformResult {
  const issues: ImportTransformIssue[] = [];

  const products = Object.entries(input.products)
    .map(([slug, rawProduct]) => normalizeProduct(slug, rawProduct, options, issues))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const productCategories = buildCategorySeeds(products, input.categories).sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );

  const bundle: ImportBundle = {
    schemaVersion: "1.0.0",
    source: "cra-reference",
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    globals: {
      options: {
        siteName: "",
        siteTagline: "",
        brandLogo: null,
        contactEmail: "",
        contactPhone: "",
        contactAddress: "",
        whatsappPhone: "",
        whatsappDefaultMessage: "",
        enableBackToTop: true,
        headerPrimaryLinks: [],
        footerLinks: [],
        socialLinks: [],
        footerText: "",
        promoModal: {
          enabled: false,
          delayMs: 5000,
          autoRotateMs: 3000,
          slides: [],
        },
        defaultSeo: {},
        options: {},
      },
      menus: [],
    },
    pages: [],
    productCategories,
    products,
  };

  return {
    bundle,
    issues,
  };
}
