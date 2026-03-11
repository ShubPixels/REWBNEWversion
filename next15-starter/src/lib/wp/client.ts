const GRAPHQL_PATH = "/graphql";

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

export function getWordPressGraphqlEndpoint(): string {
  const explicitEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (explicitEndpoint) {
    return explicitEndpoint.trim();
  }

  const publicBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (publicBaseUrl) {
    return `${normalizeUrl(publicBaseUrl)}${GRAPHQL_PATH}`;
  }

  throw new Error(
    "WordPress GraphQL endpoint is not configured. Set WORDPRESS_GRAPHQL_ENDPOINT or NEXT_PUBLIC_WORDPRESS_URL.",
  );
}

export function getWordPressAuthToken(): string | null {
  const token = process.env.WORDPRESS_AUTH_TOKEN?.trim();
  return token ? token : null;
}

export function getWordPressPreviewSecret(): string | null {
  const secret = process.env.WORDPRESS_PREVIEW_SECRET?.trim();
  return secret ? secret : null;
}

export function buildWordPressHeaders(overrides?: HeadersInit): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  const authToken = getWordPressAuthToken();
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  if (overrides) {
    const overrideHeaders = new Headers(overrides);
    overrideHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}
