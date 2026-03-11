import { timingSafeEqual } from "node:crypto";
import { getWordPressPreviewSecret } from "@/lib/wp/client";
import { WP_PREVIEW_FETCH_OPTIONS } from "@/lib/wp/cache";
import { wpFetch } from "@/lib/wp/fetcher";
import { mapPreviewNodeQuery, mapWpPage, mapWpProduct, mapWpProductCategory } from "@/lib/wp/mappers";
import { GET_PREVIEW_NODE_QUERY } from "@/lib/wp/queries";
import type {
  ContentNodeIdTypeEnum,
  GetPreviewNodeQuery,
  GetPreviewNodeVariables,
  WpPageData,
  WpPreviewNodeData,
  WpProductCategoryData,
  WpProductData,
} from "@/types/wp";

export type RouteSearchParams = Record<string, string | string[] | undefined>;

export interface PreviewLookup {
  id: string;
  idType: ContentNodeIdTypeEnum;
}

const PREVIEW_ID_PARAM_KEYS = ["previewId", "id", "p", "postId", "post_id"] as const;
const PREVIEW_ID_TYPE_PARAM_KEYS = ["previewType", "idType", "previewIdType"] as const;

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return "/";
  }

  if (!trimmed.startsWith("/")) {
    return `/${trimmed}`;
  }

  return trimmed;
}

function firstStringValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    const first = value.find((entry) => typeof entry === "string" && entry.trim().length > 0);
    return first ? first.trim() : null;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return null;
}

function readSearchParam(searchParams: RouteSearchParams, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = firstStringValue(searchParams[key]);
    if (value) {
      return value;
    }
  }
  return null;
}

function normalizePreviewIdType(value: string | null): ContentNodeIdTypeEnum {
  if (!value) {
    return "DATABASE_ID";
  }

  const normalized = value.toUpperCase();
  if (normalized === "DATABASE_ID" || normalized === "ID" || normalized === "SLUG" || normalized === "URI") {
    return normalized;
  }

  return "DATABASE_ID";
}

function secureCompare(valueA: string, valueB: string): boolean {
  const bufferA = Buffer.from(valueA);
  const bufferB = Buffer.from(valueB);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}

function isAbsoluteOrProtocolRelative(value: string): boolean {
  if (value.startsWith("//")) {
    return true;
  }

  return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);
}

export function normalizeInternalRedirectPath(value: string | null | undefined): string {
  if (!value) {
    return "/";
  }

  const trimmed = value.trim();
  if (!trimmed || isAbsoluteOrProtocolRelative(trimmed)) {
    return "/";
  }

  try {
    const url = new URL(trimmed, "http://localhost");
    const normalized = `${url.pathname}${url.search}${url.hash}`;
    return normalizePath(normalized);
  } catch {
    return "/";
  }
}

export function extractPreviewLookupFromSearchParams(searchParams: RouteSearchParams): PreviewLookup | null {
  const id = readSearchParam(searchParams, PREVIEW_ID_PARAM_KEYS);
  if (!id) {
    return null;
  }

  const idTypeRaw = readSearchParam(searchParams, PREVIEW_ID_TYPE_PARAM_KEYS);
  return {
    id,
    idType: normalizePreviewIdType(idTypeRaw),
  };
}

async function fetchPreviewNode(
  id: string,
  idType: ContentNodeIdTypeEnum = "DATABASE_ID",
): Promise<GetPreviewNodeQuery> {
  return wpFetch<GetPreviewNodeQuery, GetPreviewNodeVariables>(GET_PREVIEW_NODE_QUERY, {
    variables: { id, idType },
    ...WP_PREVIEW_FETCH_OPTIONS,
  });
}

export function isValidPreviewSecret(secret: string | null | undefined): boolean {
  const configuredSecret = getWordPressPreviewSecret();
  const candidateSecret = secret?.trim();
  if (!configuredSecret || !candidateSecret) {
    return false;
  }
  return secureCompare(configuredSecret, candidateSecret);
}

export async function getPreviewNodeById(
  id: string,
  idType: ContentNodeIdTypeEnum = "DATABASE_ID",
): Promise<WpPreviewNodeData | null> {
  const data = await fetchPreviewNode(id, idType);
  return mapPreviewNodeQuery(data);
}

export async function getPreviewPageById(
  id: string,
  idType: ContentNodeIdTypeEnum = "DATABASE_ID",
): Promise<WpPageData | null> {
  const data = await fetchPreviewNode(id, idType);
  const node = data.contentNode;
  if (!node || node.__typename !== "Page") {
    return null;
  }
  return mapWpPage(node);
}

export async function getPreviewProductById(
  id: string,
  idType: ContentNodeIdTypeEnum = "DATABASE_ID",
): Promise<WpProductData | null> {
  const data = await fetchPreviewNode(id, idType);
  const node = data.contentNode;
  if (!node || node.__typename !== "Product") {
    return null;
  }
  return mapWpProduct(node);
}

export async function getPreviewProductCategoryById(
  id: string,
  idType: ContentNodeIdTypeEnum = "DATABASE_ID",
): Promise<WpProductCategoryData | null> {
  const data = await fetchPreviewNode(id, idType);
  const node = data.contentNode;
  if (!node || node.__typename !== "ProductCategory") {
    return null;
  }
  return mapWpProductCategory(node);
}

export function resolvePreviewRedirectPath(node: WpPreviewNodeData | null): string {
  if (!node) {
    return "/";
  }

  if (node.nodeType === "product" && node.slug) {
    return normalizeInternalRedirectPath(`/products/${node.slug}`);
  }

  if (node.nodeType === "productCategory" && node.slug) {
    return normalizeInternalRedirectPath(`/product-category/${node.slug}`);
  }

  if (node.uri) {
    return normalizeInternalRedirectPath(node.uri);
  }

  return "/";
}
