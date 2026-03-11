import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { siteConfig } from "@/config/site";
import { WP_REVALIDATE_SECONDS, WP_TAGS } from "@/lib/wp/cache";
import { wpFetch } from "@/lib/wp/fetcher";
import {
  extractPreviewLookupFromSearchParams,
  getPreviewPageById,
  type RouteSearchParams,
} from "@/lib/wp/preview";
import { mapGlobalSettingsQuery, mapPageByUriQuery } from "@/lib/wp/mappers";
import { GET_GLOBAL_SETTINGS_QUERY, GET_PAGE_BY_URI_QUERY } from "@/lib/wp/queries";
import { buildSeoMetadata } from "@/lib/wp/seo";
import type { GetGlobalSettingsQuery, GetPageByUriQuery, GetPageByUriVariables, WpGlobalSettingsData, WpPageData } from "@/types/wp";

type CatchAllPageParams = {
  slug?: string[];
};

type CatchAllPageProps = {
  params: Promise<CatchAllPageParams>;
  searchParams: Promise<RouteSearchParams>;
};

function normalizePathSegment(segment: string): string {
  return segment.trim().replace(/^\/+|\/+$/g, "");
}

function getNormalizedSegments(slug: string[] | undefined): string[] {
  if (!slug?.length) {
    return [];
  }

  return slug
    .map((segment) => normalizePathSegment(segment))
    .filter((segment) => segment.length > 0);
}

function buildCandidateUris(slug: string[] | undefined): string[] {
  const segments = getNormalizedSegments(slug);
  if (segments.length === 0) {
    return ["/"];
  }

  const path = `/${segments.join("/")}`;
  const withTrailingSlash = `${path}/`;
  return [path, withTrailingSlash];
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

function doesPageUriMatchSlug(pageUri: string, slug: string[] | undefined): boolean {
  const pageComparable = normalizeComparableUri(pageUri);
  const candidates = buildCandidateUris(slug).map((candidate) => normalizeComparableUri(candidate));
  return candidates.includes(pageComparable);
}

async function fetchGlobalSeoDefaults(): Promise<WpGlobalSettingsData | null> {
  try {
    const data = await wpFetch<GetGlobalSettingsQuery>(GET_GLOBAL_SETTINGS_QUERY, {
      tags: [WP_TAGS.globalSettings],
      revalidate: WP_REVALIDATE_SECONDS.globals,
      debugLabel: "global-seo-defaults",
    });
    return mapGlobalSettingsQuery(data);
  } catch {
    return null;
  }
}

async function fetchPageByUri(slug: string[] | undefined): Promise<WpPageData | null> {
  const candidates = buildCandidateUris(slug);

  for (const uri of candidates) {
    const data = await wpFetch<GetPageByUriQuery, GetPageByUriVariables>(GET_PAGE_BY_URI_QUERY, {
      variables: { uri },
      tags: [WP_TAGS.page(uri)],
      revalidate: WP_REVALIDATE_SECONDS.content,
      debugLabel: `page-by-uri:${uri}`,
    });

    const page = mapPageByUriQuery(data);
    if (page) {
      return page;
    }
  }

  return null;
}

async function fetchPreviewPage(slug: string[] | undefined, searchParams: RouteSearchParams): Promise<WpPageData | null> {
  const draft = await draftMode();
  if (!draft.isEnabled) {
    return null;
  }

  const previewLookup = extractPreviewLookupFromSearchParams(searchParams);
  if (!previewLookup) {
    return null;
  }

  const page = await getPreviewPageById(previewLookup.id, previewLookup.idType).catch(() => null);
  if (!page) {
    return null;
  }

  if (!doesPageUriMatchSlug(page.uri, slug)) {
    return null;
  }

  return page;
}

function createMetadataFallbackPath(slug: string[] | undefined): string {
  const segments = getNormalizedSegments(slug);
  if (!segments.length) {
    return "/";
  }
  return `/${segments.join("/")}`;
}

export async function generateMetadata({ params, searchParams }: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const previewPage = await fetchPreviewPage(slug, resolvedSearchParams);
  const [publishedPage, globalSettings] = await Promise.all([
    previewPage ? Promise.resolve<WpPageData | null>(null) : fetchPageByUri(slug),
    fetchGlobalSeoDefaults(),
  ]);
  const page = previewPage ?? publishedPage;

  const fallbackTitle =
    page?.title || globalSettings?.siteTitle || globalSettings?.siteName || siteConfig.name;

  const fallbackDescription =
    page?.excerpt || globalSettings?.siteDescription || globalSettings?.siteTagline || siteConfig.description;

  return buildSeoMetadata({
    seo: page?.seo ?? globalSettings?.defaultSeo ?? null,
    fallbackTitle,
    fallbackDescription,
    canonicalPath: page?.uri || createMetadataFallbackPath(slug),
    fallbackOpenGraphImageUrl: page?.featuredImage?.url ?? null,
  });
}

function renderFallbackContent(page: WpPageData): ReactNode {
  const hasTitle = page.title.trim().length > 0;
  const hasContent = page.content.trim().length > 0;

  if (!hasTitle && !hasContent) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      {hasTitle ? <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{page.title}</h1> : null}
      {hasContent ? (
        <div
          className="prose prose-slate mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : null}
    </section>
  );
}

export default async function GenericPageRoute({ params, searchParams }: CatchAllPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const previewPage = await fetchPreviewPage(slug, resolvedSearchParams);
  const page = previewPage ?? (await fetchPageByUri(slug));

  if (!page) {
    notFound();
  }

  return (
    <>
      {page.blocks.length > 0 ? <BlockRenderer blocks={page.blocks} /> : renderFallbackContent(page)}
    </>
  );
}
