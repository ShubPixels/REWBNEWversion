import { getServerEnv } from "@/lib/env";

export type WordPressRequestMode = "published" | "preview";

export function getWordPressGraphqlEndpoint(): string {
  return getServerEnv().wordpressGraphqlEndpoint;
}

export function getWordPressAuthToken(): string | null {
  return getServerEnv().wordpressAuthToken;
}

export function getWordPressPreviewSecret(): string | null {
  return getServerEnv().wordpressPreviewSecret;
}

export function getWordPressRevalidationSecret(): string | null {
  return getServerEnv().wordpressRevalidationSecret;
}

export interface BuildWordPressHeadersOptions {
  overrides?: HeadersInit;
  mode?: WordPressRequestMode;
  includeAuth?: boolean;
}

export function buildWordPressHeaders(options: BuildWordPressHeadersOptions = {}): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  const authToken = getWordPressAuthToken();
  if (options.includeAuth !== false && authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  if (options.mode === "preview") {
    headers.set("X-WP-Preview", "true");
  }

  if (options.overrides) {
    const overrideHeaders = new Headers(options.overrides);
    overrideHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}
