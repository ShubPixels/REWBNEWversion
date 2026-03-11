import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import CtaBanner, { type CtaBannerData } from "@/components/blocks/CtaBanner";
import OtherCategories from "@/components/product/OtherCategories";
import ProductHero from "@/components/product/ProductHero";
import ProductOverview from "@/components/product/ProductOverview";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import { siteConfig } from "@/config/site";
import { WP_REVALIDATE_SECONDS, WP_TAGS } from "@/lib/wp/cache";
import { wpFetch } from "@/lib/wp/fetcher";
import {
  extractPreviewLookupFromSearchParams,
  getPreviewProductById,
  type RouteSearchParams,
} from "@/lib/wp/preview";
import {
  mapGlobalSettingsQuery,
  mapProductBySlugQuery,
  mapProductCategoriesQuery,
  mapProductCategoryBySlugQuery,
  mapProductRelatedOverrideQuery,
} from "@/lib/wp/mappers";
import {
  GET_GLOBAL_SETTINGS_QUERY,
  GET_PRODUCT_BY_SLUG_QUERY,
  GET_PRODUCT_CATEGORIES_QUERY,
  GET_PRODUCT_CATEGORY_BY_SLUG_QUERY,
  GET_PRODUCT_RELATED_OVERRIDE_QUERY,
} from "@/lib/wp/queries";
import { buildSeoMetadata } from "@/lib/wp/seo";
import type {
  GetGlobalSettingsQuery,
  GetProductBySlugQuery,
  GetProductBySlugVariables,
  GetProductCategoriesQuery,
  GetProductCategoryBySlugQuery,
  GetProductCategoryBySlugVariables,
  GetProductRelatedOverrideQuery,
  GetProductRelatedOverrideVariables,
  WpGlobalSettingsData,
  WpLink,
  WpProductCardData,
  WpProductCategorySummaryData,
  WpProductData,
} from "@/types/wp";

type ProductRouteParams = {
  slug: string;
};

type ProductRouteProps = {
  params: Promise<ProductRouteParams>;
  searchParams: Promise<RouteSearchParams>;
};

function normalizeSlug(slug: string): string {
  return slug.trim().replace(/^\/+|\/+$/g, "");
}

function normalizeComparableUri(uri: string): string {
  const trimmed = uri.trim();
  if (!trimmed) {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withLeadingSlash === "/") {
    return "/";
  }

  return withLeadingSlash.replace(/\/+$/, "");
}

function doesProductMatchSlug(product: WpProductData, slug: string): boolean {
  const normalizedProductSlug = normalizeSlug(product.slug);
  if (normalizedProductSlug && normalizedProductSlug === slug) {
    return true;
  }

  const uri = normalizeComparableUri(product.uri);
  return uri === `/products/${slug}`;
}

function normalizePhoneForTel(phone: string): string {
  return phone.replace(/[^+\d]/g, "");
}

function makeCtaLink(label: string, url: string): WpLink {
  return { label, url, target: null };
}

function createProductCta(product: WpProductData, globalSettings: WpGlobalSettingsData | null): CtaBannerData | null {
  const primaryFromProduct = product.product.cta;
  const phone = globalSettings?.contactPhone ?? "";
  const phoneHref = normalizePhoneForTel(phone);
  const fallbackPrimaryCta = phoneHref
    ? makeCtaLink("Call Us", `tel:${phoneHref}`)
    : globalSettings?.contactEmail?.trim()
      ? makeCtaLink("Email Us", `mailto:${globalSettings.contactEmail.trim()}`)
      : null;
  const primaryCta = primaryFromProduct ?? fallbackPrimaryCta;

  const secondaryCta =
    globalSettings?.contactEmail?.trim() && primaryCta?.url !== `mailto:${globalSettings.contactEmail.trim()}`
      ? makeCtaLink("Email Us", `mailto:${globalSettings.contactEmail.trim()}`)
      : null;

  if (!primaryCta) {
    return null;
  }

  const fallbackDescription =
    product.product.introDescription || product.product.summary || product.excerpt || siteConfig.description;

  return {
    title: `Discuss your ${product.title} requirements`,
    description: fallbackDescription,
    primaryCta,
    secondaryCta,
    tone: "accent",
  };
}

function dedupeProductCards(products: WpProductCardData[], currentSlug: string): WpProductCardData[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (product.slug === currentSlug) {
      return false;
    }

    const key = product.id || product.slug || product.uri;
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function selectOtherCategories(
  allCategories: WpProductCategorySummaryData[],
  currentCategories: WpProductCategorySummaryData[],
): WpProductCategorySummaryData[] {
  const currentKeys = new Set(
    currentCategories
      .map((category) => category.id || category.slug || category.uri)
      .filter((key): key is string => key.length > 0),
  );

  const seen = new Set<string>();
  return allCategories
    .filter((category) => {
      const key = category.id || category.slug || category.uri;
      if (!key || currentKeys.has(key) || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

async function fetchGlobalSettings(): Promise<WpGlobalSettingsData | null> {
  try {
    const data = await wpFetch<GetGlobalSettingsQuery>(GET_GLOBAL_SETTINGS_QUERY, {
      tags: [WP_TAGS.globalSettings],
      revalidate: WP_REVALIDATE_SECONDS.globals,
    });
    return mapGlobalSettingsQuery(data);
  } catch {
    return null;
  }
}

async function fetchProductBySlug(slug: string): Promise<WpProductData | null> {
  try {
    const data = await wpFetch<GetProductBySlugQuery, GetProductBySlugVariables>(GET_PRODUCT_BY_SLUG_QUERY, {
      variables: { slug },
      tags: [WP_TAGS.product(slug)],
      revalidate: WP_REVALIDATE_SECONDS.content,
    });
    return mapProductBySlugQuery(data);
  } catch {
    return null;
  }
}

async function fetchPreviewProduct(slug: string, searchParams: RouteSearchParams): Promise<WpProductData | null> {
  const draft = await draftMode();
  if (!draft.isEnabled) {
    return null;
  }

  const previewLookup = extractPreviewLookupFromSearchParams(searchParams);
  if (!previewLookup) {
    return null;
  }

  const product = await getPreviewProductById(previewLookup.id, previewLookup.idType).catch(() => null);
  if (!product) {
    return null;
  }

  if (!doesProductMatchSlug(product, slug)) {
    return null;
  }

  return product;
}

async function fetchProductCategoryBySlug(slug: string) {
  try {
    const data = await wpFetch<GetProductCategoryBySlugQuery, GetProductCategoryBySlugVariables>(
      GET_PRODUCT_CATEGORY_BY_SLUG_QUERY,
      {
        variables: { slug },
        tags: [WP_TAGS.productCategory(slug)],
        revalidate: WP_REVALIDATE_SECONDS.content,
      },
    );
    return mapProductCategoryBySlugQuery(data);
  } catch {
    return null;
  }
}

async function fetchAllProductCategories(): Promise<WpProductCategorySummaryData[]> {
  try {
    const data = await wpFetch<GetProductCategoriesQuery>(GET_PRODUCT_CATEGORIES_QUERY, {
      tags: [WP_TAGS.productCategories],
      revalidate: WP_REVALIDATE_SECONDS.globals,
    });
    return mapProductCategoriesQuery(data);
  } catch {
    return [];
  }
}

async function fetchRelatedOverride(slug: string): Promise<WpProductCardData[]> {
  try {
    const data = await wpFetch<GetProductRelatedOverrideQuery, GetProductRelatedOverrideVariables>(
      GET_PRODUCT_RELATED_OVERRIDE_QUERY,
      {
        variables: { slug },
        tags: [WP_TAGS.productRelatedOverride(slug)],
        revalidate: WP_REVALIDATE_SECONDS.content,
      },
    );
    return mapProductRelatedOverrideQuery(data);
  } catch {
    return [];
  }
}

async function resolveRelatedProducts(product: WpProductData): Promise<WpProductCardData[]> {
  const explicitFromMainQuery = dedupeProductCards(product.product.relatedProductsOverride, product.slug).slice(0, 6);
  if (explicitFromMainQuery.length > 0) {
    return explicitFromMainQuery;
  }

  const explicitOverride = dedupeProductCards(await fetchRelatedOverride(product.slug), product.slug).slice(0, 6);
  if (explicitOverride.length > 0) {
    return explicitOverride;
  }

  const primaryCategory = product.categories.find((category) => category.slug.trim().length > 0);
  if (!primaryCategory) {
    return [];
  }

  const sameCategoryData = await fetchProductCategoryBySlug(primaryCategory.slug);
  if (!sameCategoryData) {
    return [];
  }

  return dedupeProductCards(sameCategoryData.products, product.slug).slice(0, 6);
}

export async function generateMetadata({ params, searchParams }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return buildSeoMetadata();
  }

  const resolvedSearchParams = await searchParams;
  const previewProduct = await fetchPreviewProduct(normalizedSlug, resolvedSearchParams);
  const [product, globalSettings] = await Promise.all([
    previewProduct ? Promise.resolve<WpProductData | null>(previewProduct) : fetchProductBySlug(normalizedSlug),
    fetchGlobalSettings(),
  ]);

  const fallbackTitle = product?.title || globalSettings?.siteTitle || globalSettings?.siteName || siteConfig.name;
  const fallbackDescription =
    product?.product.introDescription ||
    product?.product.summary ||
    product?.excerpt ||
    globalSettings?.siteDescription ||
    globalSettings?.siteTagline ||
    siteConfig.description;

  return buildSeoMetadata({
    seo: product?.seo ?? globalSettings?.defaultSeo ?? null,
    fallbackTitle,
    fallbackDescription,
    canonicalPath: product?.uri || `/products/${normalizedSlug}`,
  });
}

export default async function ProductPage({ params, searchParams }: ProductRouteProps) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const previewProduct = await fetchPreviewProduct(normalizedSlug, resolvedSearchParams);
  const [product, globalSettings, allCategories] = await Promise.all([
    previewProduct ? Promise.resolve<WpProductData | null>(previewProduct) : fetchProductBySlug(normalizedSlug),
    fetchGlobalSettings(),
    fetchAllProductCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const [relatedProducts] = await Promise.all([resolveRelatedProducts(product)]);
  const otherCategories = selectOtherCategories(allCategories, product.categories);
  const heroImage = product.featuredImage ?? product.product.gallery[0] ?? null;
  const productSummary = product.product.introDescription || product.product.summary || product.excerpt;
  const ctaData = createProductCta(product, globalSettings);

  return (
    <>
      <ProductHero
        title={product.title}
        tagline={product.product.tagline}
        summary={productSummary}
        featuredImage={heroImage}
        categories={product.categories}
      />

      <ProductOverview
        introDescription={productSummary}
        videoUrl={product.product.videoUrl}
        gallery={product.product.gallery}
      />

      <ProductTabs
        benefits={product.product.benefits}
        specifications={product.product.specifications}
        applications={product.product.applications}
      />

      <RelatedProducts products={relatedProducts} />
      <OtherCategories categories={otherCategories} />
      {ctaData ? <CtaBanner data={ctaData} blockId="product-cta-banner" /> : null}
    </>
  );
}
