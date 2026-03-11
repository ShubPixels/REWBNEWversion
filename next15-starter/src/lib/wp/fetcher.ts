import { buildWordPressHeaders, getWordPressGraphqlEndpoint } from "@/lib/wp/client";
import { WP_REVALIDATE_SECONDS } from "@/lib/wp/cache";
import type { WpGraphQLError, WpGraphQLResponse } from "@/types/wp";

const DEFAULT_REVALIDATE_SECONDS = WP_REVALIDATE_SECONDS.default;

export type WpVariables = Record<string, unknown>;

export interface WpFetchOptions<TVariables> {
  variables?: TVariables;
  headers?: HeadersInit;
  tags?: string[];
  revalidate?: number | false;
  cache?: RequestCache;
  signal?: AbortSignal;
}

export class WpRequestError extends Error {
  public readonly status: number;
  public readonly errors: WpGraphQLError[];

  constructor(message: string, status: number, errors: WpGraphQLError[] = []) {
    super(message);
    this.name = "WpRequestError";
    this.status = status;
    this.errors = errors;
  }
}

function parseRevalidate(value: number | false | undefined): number | false {
  if (value === false) {
    return false;
  }

  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }

  return DEFAULT_REVALIDATE_SECONDS;
}

function createRequestInit<TVariables>(
  query: string,
  options: WpFetchOptions<TVariables>,
): RequestInit & { next?: { revalidate?: number; tags?: string[] } } {
  const revalidate = parseRevalidate(options.revalidate);
  const requestInit: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    method: "POST",
    headers: buildWordPressHeaders(options.headers),
    body: JSON.stringify({
      query,
      variables: options.variables ?? {},
    }),
    signal: options.signal,
  };

  if (options.cache) {
    requestInit.cache = options.cache;
  } else if (revalidate === false) {
    requestInit.cache = "no-store";
  }

  if (revalidate !== false) {
    requestInit.next = {
      revalidate,
      tags: options.tags,
    };
  } else if (options.tags?.length) {
    requestInit.next = { tags: options.tags };
  }

  return requestInit;
}

function formatErrors(errors: WpGraphQLError[]): string {
  return errors.map((error) => error.message).join(" | ");
}

export async function wpFetch<TData, TVariables = WpVariables>(
  query: string,
  options: WpFetchOptions<TVariables> = {},
): Promise<TData> {
  const endpoint = getWordPressGraphqlEndpoint();
  const response = await fetch(endpoint, createRequestInit(query, options));

  let payload: WpGraphQLResponse<TData>;
  try {
    payload = (await response.json()) as WpGraphQLResponse<TData>;
  } catch {
    throw new WpRequestError("WordPress GraphQL response was not valid JSON.", response.status);
  }

  if (!response.ok) {
    const errors = payload.errors ?? [];
    const reason = errors.length ? formatErrors(errors) : response.statusText;
    throw new WpRequestError(
      `WordPress GraphQL request failed (${response.status}): ${reason}`,
      response.status,
      errors,
    );
  }

  if (payload.errors?.length) {
    throw new WpRequestError(
      `WordPress GraphQL returned errors: ${formatErrors(payload.errors)}`,
      response.status,
      payload.errors,
    );
  }

  if (!payload.data) {
    throw new WpRequestError("WordPress GraphQL response contained no data.", response.status);
  }

  return payload.data;
}
