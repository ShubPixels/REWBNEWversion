import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { WP_REVALIDATE_SECONDS, WP_TAGS } from "@/lib/wp/cache";
import { wpFetch } from "@/lib/wp/fetcher";

const PAGE_SIZE = 100;

type Maybe<T> = T | null | undefined;

interface ConnectionPageInfo {
  hasNextPage?: Maybe<boolean>;
  endCursor?: Maybe<string>;
}

interface UriNode {
  uri?: Maybe<string>;
  modifiedGmt?: Maybe<string>;
}

interface UriConnection {
  pageInfo?: Maybe<ConnectionPageInfo>;
  nodes?: Maybe<Array<Maybe<UriNode>>>;
}

interface SitemapPagesQuery {
  pages?: Maybe<UriConnection>;
}

interface SitemapProductsQuery {
  products?: Maybe<UriConnection>;
}

interface SitemapProductCategoriesQuery {
  productCategories?: Maybe<UriConnection>;
}

interface PaginationVariables {
  first: number;
  after?: string | null;
}

const SITEMAP_PAGES_QUERY = /* GraphQL */ `
query SitemapPages($first: Int!, $after: String) {
  pages(first: $first, after: $after, where: { status: PUBLISH }) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      uri
      modifiedGmt
    }
  }
}
`;

const SITEMAP_PRODUCTS_QUERY = /* GraphQL */ `
query SitemapProducts($first: Int!, $after: String) {
  products(first: $first, after: $after, where: { status: PUBLISH }) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      uri
      modifiedGmt
    }
  }
}
`;

const SITEMAP_PRODUCT_CATEGORIES_QUERY = /* GraphQL */ `
query SitemapProductCategories($first: Int!, $after: String) {
  productCategories(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      uri
    }
  }
}
`;

function normalizeUri(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed, siteConfig.url);
    if (!url.pathname.startsWith("/")) {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function parseLastModified(value: string | null | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toAbsoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

async function fetchAllUris<TQuery>(
  query: string,
  selectConnection: (data: TQuery) => UriConnection | null | undefined,
  tag: string,
): Promise<UriNode[]> {
  const nodes: UriNode[] = [];
  let after: string | null = null;

  while (true) {
    const data = await wpFetch<TQuery, PaginationVariables>(query, {
      variables: { first: PAGE_SIZE, after },
      tags: [tag],
      revalidate: WP_REVALIDATE_SECONDS.sitemap,
    });

    const connection = selectConnection(data);
    const batchNodes = connection?.nodes ?? [];

    batchNodes.forEach((node) => {
      if (node) {
        nodes.push(node);
      }
    });

    const hasNext = connection?.pageInfo?.hasNextPage === true;
    const endCursor = connection?.pageInfo?.endCursor ?? null;
    if (!hasNext || !endCursor) {
      break;
    }

    after = endCursor;
  }

  return nodes;
}

function mergeEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();

  entries.forEach((entry) => {
    const existing = byUrl.get(entry.url);
    if (!existing) {
      byUrl.set(entry.url, entry);
      return;
    }

    const existingModified =
      existing.lastModified instanceof Date ? existing.lastModified.getTime() : Date.parse(String(existing.lastModified));
    const incomingModified =
      entry.lastModified instanceof Date ? entry.lastModified.getTime() : Date.parse(String(entry.lastModified));

    if (Number.isFinite(incomingModified) && (!Number.isFinite(existingModified) || incomingModified > existingModified)) {
      byUrl.set(entry.url, entry);
    }
  });

  return [...byUrl.values()];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  try {
    const [pages, products, categories] = await Promise.all([
      fetchAllUris<SitemapPagesQuery>(SITEMAP_PAGES_QUERY, (data) => data.pages, WP_TAGS.sitemapPages),
      fetchAllUris<SitemapProductsQuery>(SITEMAP_PRODUCTS_QUERY, (data) => data.products, WP_TAGS.sitemapProducts),
      fetchAllUris<SitemapProductCategoriesQuery>(
        SITEMAP_PRODUCT_CATEGORIES_QUERY,
        (data) => data.productCategories,
        WP_TAGS.sitemapProductCategories,
      ),
    ]);

    const pageEntries: MetadataRoute.Sitemap = pages.flatMap((node) => {
      const uri = normalizeUri(node.uri ?? "");
      if (!uri) {
        return [];
      }

      return [
        {
          url: toAbsoluteUrl(uri),
          lastModified: parseLastModified(node.modifiedGmt),
          changeFrequency: "weekly",
          priority: uri === "/" ? 1 : 0.8,
        },
      ];
    });

    const productEntries: MetadataRoute.Sitemap = products.flatMap((node) => {
      const uri = normalizeUri(node.uri ?? "");
      if (!uri) {
        return [];
      }

      return [
        {
          url: toAbsoluteUrl(uri),
          lastModified: parseLastModified(node.modifiedGmt),
          changeFrequency: "weekly",
          priority: 0.7,
        },
      ];
    });

    const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((node) => {
      const uri = normalizeUri(node.uri ?? "");
      if (!uri) {
        return [];
      }

      return [
        {
          url: toAbsoluteUrl(uri),
          changeFrequency: "weekly",
          priority: 0.6,
        },
      ];
    });

    return mergeEntries([...baseEntries, ...pageEntries, ...productEntries, ...categoryEntries]);
  } catch {
    return baseEntries;
  }
}
