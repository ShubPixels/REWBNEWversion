import {
  buildWordPressHeaders,
  getWordPressGraphqlEndpoint,
  type WordPressRequestMode,
} from "@/lib/wp/client";
import { WP_REVALIDATE_SECONDS } from "@/lib/wp/cache";
import type { WpGraphQLError, WpGraphQLResponse } from "@/types/wp";

const DEFAULT_REVALIDATE_SECONDS = WP_REVALIDATE_SECONDS.default;
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

export type WpVariables = Record<string, unknown>;

export type WpRequestErrorCode =
  | "network_error"
  | "invalid_json"
  | "http_error"
  | "graphql_error"
  | "empty_data";

export interface WpFetchOptions<TVariables> {
  variables?: TVariables;
  headers?: HeadersInit;
  tags?: string[];
  revalidate?: number | false;
  cache?: RequestCache;
  signal?: AbortSignal;
  mode?: WordPressRequestMode;
  debugLabel?: string;
}

export interface WpFetchRequestInit extends RequestInit {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

export class WpRequestError extends Error {
  public readonly code: WpRequestErrorCode;
  public readonly status: number;
  public readonly errors: WpGraphQLError[];
  public readonly endpoint: string;
  public readonly queryName: string;
  public readonly debugLabel: string | null;

  constructor(params: {
    code: WpRequestErrorCode;
    message: string;
    status: number;
    errors?: WpGraphQLError[];
    endpoint: string;
    queryName: string;
    debugLabel?: string | null;
    cause?: unknown;
  }) {
    super(params.message, { cause: params.cause });
    this.name = "WpRequestError";
    this.code = params.code;
    this.status = params.status;
    this.errors = params.errors ?? [];
    this.endpoint = params.endpoint;
    this.queryName = params.queryName;
    this.debugLabel = params.debugLabel ?? null;
  }
}

export function isWpRequestError(value: unknown): value is WpRequestError {
  return value instanceof WpRequestError;
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

function parseQueryName(query: string): string {
  const match = query.match(/\b(?:query|mutation)\s+([A-Za-z_][A-Za-z0-9_]*)/);
  return match?.[1] ?? "AnonymousQuery";
}

function parseErrorPath(rawPath: unknown): Array<string | number> | undefined {
  if (!Array.isArray(rawPath)) {
    return undefined;
  }

  const path = rawPath.filter(
    (segment): segment is string | number => typeof segment === "string" || typeof segment === "number",
  );

  return path.length > 0 ? path : undefined;
}

function parseGraphQLError(rawError: unknown): WpGraphQLError | null {
  if (!rawError || typeof rawError !== "object") {
    return null;
  }

  const record = rawError as Record<string, unknown>;
  const message = typeof record.message === "string" ? record.message : null;
  if (!message || message.trim().length === 0) {
    return null;
  }

  const path = parseErrorPath(record.path);
  const extensions =
    record.extensions && typeof record.extensions === "object" && !Array.isArray(record.extensions)
      ? (record.extensions as Record<string, unknown>)
      : undefined;

  return {
    message: message.trim(),
    path,
    extensions,
  };
}

function parseGraphQLResponse<TData>(rawPayload: unknown): WpGraphQLResponse<TData> {
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
    return {};
  }

  const payload = rawPayload as Record<string, unknown>;
  const errors = Array.isArray(payload.errors)
    ? payload.errors
        .map((error) => parseGraphQLError(error))
        .filter((error): error is WpGraphQLError => error !== null)
    : undefined;

  return {
    data: payload.data as TData | undefined,
    errors,
  };
}

function formatGraphQLErrors(errors: WpGraphQLError[]): string {
  return errors.map((error) => error.message).join(" | ");
}

function createErrorMessage(
  code: WpRequestErrorCode,
  status: number,
  queryName: string,
  errors: WpGraphQLError[] = [],
): string {
  if (code === "network_error") {
    return `WordPress GraphQL network request failed for ${queryName}.`;
  }

  if (code === "invalid_json") {
    return `WordPress GraphQL returned invalid JSON for ${queryName}.`;
  }

  if (code === "http_error") {
    return `WordPress GraphQL request failed with HTTP ${status} for ${queryName}.`;
  }

  if (code === "graphql_error") {
    const suffix = errors.length > 0 ? ` (${formatGraphQLErrors(errors)})` : "";
    return `WordPress GraphQL returned query errors for ${queryName}${suffix}.`;
  }

  return `WordPress GraphQL response contained no data for ${queryName}.`;
}

function logWpFetchDebug(error: WpRequestError, responseSnippet: string | null = null): void {
  if (!IS_DEVELOPMENT) {
    return;
  }

  console.error("[wpFetch] request_failed", {
    code: error.code,
    status: error.status,
    endpoint: error.endpoint,
    queryName: error.queryName,
    debugLabel: error.debugLabel,
    errors: error.errors,
    responseSnippet,
  });
}

function createRequestInit<TVariables>(
  query: string,
  options: WpFetchOptions<TVariables>,
): WpFetchRequestInit {
  const revalidate = parseRevalidate(options.revalidate);
  const mode = options.mode ?? "published";

  const requestInit: WpFetchRequestInit = {
    method: "POST",
    headers: buildWordPressHeaders({
      overrides: options.headers,
      mode,
      includeAuth: true,
    }),
    body: JSON.stringify({
      query,
      variables: options.variables ?? {},
    }),
    signal: options.signal,
  };

  if (options.cache) {
    requestInit.cache = options.cache;
  } else if (revalidate === false || mode === "preview") {
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

function ensureResponseData<TData>(
  payload: WpGraphQLResponse<TData>,
  context: {
    endpoint: string;
    queryName: string;
    debugLabel: string | null;
    status: number;
  },
): TData {
  if (payload.errors?.length) {
    throw new WpRequestError({
      code: "graphql_error",
      message: createErrorMessage("graphql_error", context.status, context.queryName, payload.errors),
      status: context.status,
      errors: payload.errors,
      endpoint: context.endpoint,
      queryName: context.queryName,
      debugLabel: context.debugLabel,
    });
  }

  if (payload.data === undefined || payload.data === null) {
    throw new WpRequestError({
      code: "empty_data",
      message: createErrorMessage("empty_data", context.status, context.queryName),
      status: context.status,
      endpoint: context.endpoint,
      queryName: context.queryName,
      debugLabel: context.debugLabel,
    });
  }

  return payload.data;
}

export async function wpFetch<TData, TVariables = WpVariables>(
  query: string,
  options: WpFetchOptions<TVariables> = {},
): Promise<TData> {
  const endpoint = getWordPressGraphqlEndpoint();
  const queryName = parseQueryName(query);
  const debugLabel = options.debugLabel?.trim() || null;
  const requestInit = createRequestInit(query, options);

  let response: Response;
  try {
    response = await fetch(endpoint, requestInit);
  } catch (error) {
    const requestError = new WpRequestError({
      code: "network_error",
      message: createErrorMessage("network_error", 0, queryName),
      status: 0,
      endpoint,
      queryName,
      debugLabel,
      cause: error,
    });
    logWpFetchDebug(requestError);
    throw requestError;
  }

  let rawBody = "";
  try {
    rawBody = await response.text();
  } catch (error) {
    const requestError = new WpRequestError({
      code: "invalid_json",
      message: createErrorMessage("invalid_json", response.status, queryName),
      status: response.status,
      endpoint,
      queryName,
      debugLabel,
      cause: error,
    });
    logWpFetchDebug(requestError);
    throw requestError;
  }

  let payload: WpGraphQLResponse<TData>;
  try {
    const parsed = rawBody.trim().length > 0 ? (JSON.parse(rawBody) as unknown) : {};
    payload = parseGraphQLResponse<TData>(parsed);
  } catch (error) {
    const requestError = new WpRequestError({
      code: "invalid_json",
      message: createErrorMessage("invalid_json", response.status, queryName),
      status: response.status,
      endpoint,
      queryName,
      debugLabel,
      cause: error,
    });
    logWpFetchDebug(requestError, rawBody.slice(0, 250));
    throw requestError;
  }

  if (!response.ok) {
    const errors = payload.errors ?? [];
    const requestError = new WpRequestError({
      code: "http_error",
      message: createErrorMessage("http_error", response.status, queryName, errors),
      status: response.status,
      errors,
      endpoint,
      queryName,
      debugLabel,
    });
    logWpFetchDebug(requestError, rawBody.slice(0, 250));
    throw requestError;
  }

  try {
    return ensureResponseData(payload, {
      endpoint,
      queryName,
      debugLabel,
      status: response.status,
    });
  } catch (error) {
    if (error instanceof WpRequestError) {
      logWpFetchDebug(error, rawBody.slice(0, 250));
    }
    throw error;
  }
}

