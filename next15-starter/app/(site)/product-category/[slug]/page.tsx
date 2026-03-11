import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import CtaBanner, { type CtaBannerData } from "@/components/blocks/CtaBanner";
import OtherCategories from "@/components/product/OtherCategories";
import ProductCategoryHero from "@/components/product/ProductCategoryHero";
import ProductGrid from "@/components/product/ProductGrid";
import { siteConfig } from "@/config/site";
import { WP_REVALIDATE_SECONDS, WP_TAGS } from "@/lib/wp/cache";
import { wpFetch } from "@/lib/wp/fetcher";
import {
  extractPreviewLookupFromSearchParams,
  getPreviewProductCategoryById,
  type RouteSearchParams,
} from "@/lib/wp/preview";
import {
  mapGlobalSettingsQuery,
  mapProductCategoriesQuery,
  mapProductCategoryBySlugQuery,
} from "@/lib/wp/mappers";
import {
  GET_GLOBAL_SETTINGS_QUERY,
  GET_PRODUCT_CATEGORIES_QUERY,
  GET_PRODUCT_CATEGORY_BY_SLUG_QUERY,
} from "@/lib/wp/queries";
import { buildSeoMetadata } from "@/lib/wp/seo";
import type {
  GetGlobalSettingsQuery,
  GetProductCategoriesQuery,
  GetProductCategoryBySlugQuery,
  GetProductCategoryBySlugVariables,
  WpGlobalSettingsData,
  WpLink,
  WpProductCategoryData,
  WpProductCategorySummaryData,
} from "@/types/wp";

type ProductCategoryRouteParams = {
  slug: string;
};

type ProductCategoryRouteProps = {
  params: Promise<ProductCategoryRouteParams>;
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

function doesCategoryMatchSlug(category: WpProductCategoryData, slug: string): boolean {
  const normalizedCategorySlug = normalizeSlug(category.slug);
  if (normalizedCategorySlug && normalizedCategorySlug === slug) {
    return true;
  }

  const uri = normalizeComparableUri(category.uri);
  return uri === `/product-category/${slug}`;
}

function normalizePhoneForTel(phone: string): string {
  return phone.replace(/[^+\d]/g, "");
}

function makeCtaLink(label: string, url: string): WpLink {
  return { label, url, target: null };
}

function createCategoryCta(
  category: WpProductCategoryData,
  globalSettings: WpGlobalSettingsData | null,
): CtaBannerData | null {
  const primaryFromCategory = category.cta;
  const phone = globalSettings?.contactPhone ?? "";
  const phoneHref = normalizePhoneForTel(phone);
  const fallbackPrimaryCta = phoneHref
    ? makeCtaLink("Call Us", `tel:${phoneHref}`)
    : globalSettings?.contactEmail?.trim()
      ? makeCtaLink("Email Us", `mailto:${globalSettings.contactEmail.trim()}`)
      : null;
  const primaryCta = primaryFromCategory ?? fallbackPrimaryCta;

  const secondaryCta =
    globalSettings?.contactEmail?.trim() && primaryCta?.url !== `mailto:${globalSettings.contactEmail.trim()}`
      ? makeCtaLink("Email Us", `mailto:${globalSettings.contactEmail.trim()}`)
      : null;

  if (!primaryCta) {
    return null;
  }

  const fallbackDescription =
    category.archiveIntro || category.shortDescription || category.description || siteConfig.description;

  return {
    title: `Need guidance for ${category.name}?`,
    description: fallbackDescription,
    primaryCta,
    secondaryCta,
    tone: "dark",
  };
}

function selectOtherCategories(
  allCategories: WpProductCategorySummaryData[],
  currentCategory: WpProductCategoryData,
): WpProductCategorySummaryData[] {
  const currentKey = currentCategory.id || currentCategory.slug || currentCategory.uri;
  const seen = new Set<string>();

  return allCategories
    .filter((category) => {
      const key = category.id || category.slug || category.uri;
      if (!key || key === currentKey || seen.has(key)) {
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
      debugLabel: "global-settings",
    });
    return mapGlobalSettingsQuery(data);
  } catch {
    return null;
  }
}

async function fetchProductCategoryBySlug(slug: string): Promise<WpProductCategoryData | null> {
  const data = await wpFetch<GetProductCategoryBySlugQuery, GetProductCategoryBySlugVariables>(
    GET_PRODUCT_CATEGORY_BY_SLUG_QUERY,
    {
      variables: { slug },
      tags: [WP_TAGS.productCategory(slug)],
      revalidate: WP_REVALIDATE_SECONDS.content,
      debugLabel: `product-category-by-slug:${slug}`,
    },
  );
  return mapProductCategoryBySlugQuery(data);
}

async function fetchPreviewProductCategory(
  slug: string,
  searchParams: RouteSearchParams,
): Promise<WpProductCategoryData | null> {
  const draft = await draftMode();
  if (!draft.isEnabled) {
    return null;
  }

  const previewLookup = extractPreviewLookupFromSearchParams(searchParams);
  if (!previewLookup) {
    return null;
  }

  const category = await getPreviewProductCategoryById(previewLookup.id, previewLookup.idType).catch(() => null);
  if (!category) {
    return null;
  }

  if (!doesCategoryMatchSlug(category, slug)) {
    return null;
  }

  return category;
}

async function fetchAllProductCategories(): Promise<WpProductCategorySummaryData[]> {
  try {
    const data = await wpFetch<GetProductCategoriesQuery>(GET_PRODUCT_CATEGORIES_QUERY, {
      tags: [WP_TAGS.productCategories],
      revalidate: WP_REVALIDATE_SECONDS.globals,
      debugLabel: "product-categories-list",
    });
    return mapProductCategoriesQuery(data);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params, searchParams }: ProductCategoryRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return buildSeoMetadata();
  }

  const resolvedSearchParams = await searchParams;
  const previewCategory = await fetchPreviewProductCategory(normalizedSlug, resolvedSearchParams);
  const [category, globalSettings] = await Promise.all([
    previewCategory
      ? Promise.resolve<WpProductCategoryData | null>(previewCategory)
      : fetchProductCategoryBySlug(normalizedSlug),
    fetchGlobalSettings(),
  ]);

  const fallbackTitle =
    category?.name || globalSettings?.siteTitle || globalSettings?.siteName || siteConfig.name;
  const fallbackDescription =
    category?.archiveIntro ||
    category?.shortDescription ||
    category?.description ||
    globalSettings?.siteDescription ||
    globalSettings?.siteTagline ||
    siteConfig.description;

  return buildSeoMetadata({
    seo: category?.seo ?? globalSettings?.defaultSeo ?? null,
    fallbackTitle,
    fallbackDescription,
    canonicalPath: category?.uri || `/product-category/${normalizedSlug}`,
    fallbackOpenGraphImageUrl:
      category?.archiveHeroImage?.url ?? category?.heroImage?.url ?? category?.cardImage?.url ?? null,
  });
}

export default async function ProductCategoryPage({ params, searchParams }: ProductCategoryRouteProps) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const previewCategory = await fetchPreviewProductCategory(normalizedSlug, resolvedSearchParams);
  const [category, globalSettings, allCategories] = await Promise.all([
    previewCategory
      ? Promise.resolve<WpProductCategoryData | null>(previewCategory)
      : fetchProductCategoryBySlug(normalizedSlug),
    fetchGlobalSettings(),
    fetchAllProductCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const otherCategories = selectOtherCategories(allCategories, category);
  const ctaData = createCategoryCta(category, globalSettings);
  const isServiceCategory = category.isServiceCategory;
  const emptyStateHeading = category.emptyStateHeading || "Service Category";
  const emptyStateText =
    category.emptyStateText ||
    "This category is configured as service-only and currently has no product entries.";
  const archiveIntro = category.archiveIntro || category.intro;
  const archiveHeroImage = category.archiveHeroImage ?? category.heroImage;
  const heroDescription = category.shortDescription || category.description;

  return (
    <>
      <ProductCategoryHero
        name={category.name}
        intro={archiveIntro}
        description={heroDescription}
        heroImage={archiveHeroImage}
        cta={category.cta}
        isServiceCategory={isServiceCategory}
      />

      {isServiceCategory ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{emptyStateHeading}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{emptyStateText}</p>
          </div>
        </section>
      ) : (
        <ProductGrid
          title={`${category.name} Products`}
          description={archiveIntro}
          products={category.products}
          emptyHeading={`No ${category.name} products yet`}
          emptyText="This category currently has no products assigned."
        />
      )}

      {category.blocks.length > 0 ? <BlockRenderer blocks={category.blocks} /> : null}

      <OtherCategories categories={otherCategories} />
      {ctaData ? <CtaBanner data={ctaData} blockId="category-cta-banner" /> : null}
    </>
  );
}
