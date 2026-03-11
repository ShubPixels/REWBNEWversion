import { z } from "zod";

const URL_MESSAGE = "must be a valid absolute URL";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const LOCAL_SITE_URL_FALLBACK = "http://localhost:3000";

const emptyStringToUndefined = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const optionalNonEmptyString = z.preprocess(emptyStringToUndefined, z.string().min(1).optional());
const optionalEmail = z.preprocess(emptyStringToUndefined, z.string().email().optional());
const optionalUrl = z.preprocess(emptyStringToUndefined, z.string().url(URL_MESSAGE).optional());

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().trim().url(URL_MESSAGE),
  NEXT_PUBLIC_WORDPRESS_URL: optionalUrl,
  NEXT_PUBLIC_WORDPRESS_HOSTNAME: optionalNonEmptyString,
  NEXT_PUBLIC_IMAGE_HOSTNAMES: optionalNonEmptyString,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalNonEmptyString,
});

const serverEnvSchema = z.object({
  WORDPRESS_GRAPHQL_ENDPOINT: optionalUrl,
  WORDPRESS_AUTH_TOKEN: optionalNonEmptyString,
  WORDPRESS_PREVIEW_SECRET: z
    .string()
    .trim()
    .min(16, "WORDPRESS_PREVIEW_SECRET must be at least 16 characters long."),
  WORDPRESS_REVALIDATION_SECRET: optionalNonEmptyString,
  RESEND_API_KEY: optionalNonEmptyString,
  CONTACT_TO_EMAIL: optionalEmail,
  CONTACT_FROM_EMAIL: optionalEmail,
  CONTACT_REPLY_TO_EMAIL: optionalEmail,
  CONTACT_SUBJECT_PREFIX: optionalNonEmptyString,
  TURNSTILE_SECRET_KEY: optionalNonEmptyString,
});

export interface PublicEnv {
  siteUrl: string;
  wordpressUrl: string | null;
  wordpressHostname: string | null;
  imageHostnames: string[];
  turnstileSiteKey: string | null;
}

export interface ServerEnv {
  wordpressGraphqlEndpoint: string;
  wordpressAuthToken: string | null;
  wordpressPreviewSecret: string;
  wordpressRevalidationSecret: string | null;
  resendApiKey: string | null;
  contactToEmail: string | null;
  contactFromEmail: string | null;
  contactReplyToEmail: string | null;
  contactSubjectPrefix: string | null;
  turnstileSecretKey: string | null;
}

function parseCsvHostnames(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter((hostname) => hostname.length > 0);
}

function formatZodError(prefix: string, issues: z.ZodIssue[]): Error {
  const messageLines = issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    return `- ${path}: ${issue.message}`;
  });

  return new Error(`${prefix}\n${messageLines.join("\n")}`);
}

let cachedPublicEnv: PublicEnv | null = null;
let cachedServerEnv: ServerEnv | null = null;
let warnedLocalSiteUrlFallback = false;

function resolveSiteUrlForValidation(rawSiteUrl: string | undefined): string | undefined {
  const normalized = rawSiteUrl?.trim();
  if (normalized) {
    return normalized;
  }

  if (IS_PRODUCTION) {
    return undefined;
  }

  if (!warnedLocalSiteUrlFallback) {
    warnedLocalSiteUrlFallback = true;
    console.warn(
      `[env] NEXT_PUBLIC_SITE_URL is missing. Falling back to ${LOCAL_SITE_URL_FALLBACK} for local development.`,
    );
  }

  return LOCAL_SITE_URL_FALLBACK;
}

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) {
    return cachedPublicEnv;
  }

  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: resolveSiteUrlForValidation(process.env.NEXT_PUBLIC_SITE_URL),
    NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    NEXT_PUBLIC_WORDPRESS_HOSTNAME: process.env.NEXT_PUBLIC_WORDPRESS_HOSTNAME,
    NEXT_PUBLIC_IMAGE_HOSTNAMES: process.env.NEXT_PUBLIC_IMAGE_HOSTNAMES,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  });

  if (!parsed.success) {
    throw formatZodError("[env] Invalid public environment variables.", parsed.error.issues);
  }

  cachedPublicEnv = {
    siteUrl: parsed.data.NEXT_PUBLIC_SITE_URL,
    wordpressUrl: parsed.data.NEXT_PUBLIC_WORDPRESS_URL ?? null,
    wordpressHostname: parsed.data.NEXT_PUBLIC_WORDPRESS_HOSTNAME ?? null,
    imageHostnames: parseCsvHostnames(parsed.data.NEXT_PUBLIC_IMAGE_HOSTNAMES ?? null),
    turnstileSiteKey: parsed.data.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null,
  };

  return cachedPublicEnv;
}

function resolveWordPressGraphqlEndpoint(rawEndpoint: string | undefined, publicEnv: PublicEnv): string {
  const endpoint = rawEndpoint?.trim();
  if (endpoint) {
    return endpoint;
  }

  if (publicEnv.wordpressUrl) {
    return `${publicEnv.wordpressUrl.replace(/\/+$/, "")}/graphql`;
  }

  throw new Error(
    "[env] WORDPRESS_GRAPHQL_ENDPOINT is required when NEXT_PUBLIC_WORDPRESS_URL is not configured.",
  );
}

export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("[env] getServerEnv() must only be used on the server.");
  }

  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = serverEnvSchema.safeParse({
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    WORDPRESS_AUTH_TOKEN: process.env.WORDPRESS_AUTH_TOKEN,
    WORDPRESS_PREVIEW_SECRET: process.env.WORDPRESS_PREVIEW_SECRET,
    WORDPRESS_REVALIDATION_SECRET: process.env.WORDPRESS_REVALIDATION_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    CONTACT_REPLY_TO_EMAIL: process.env.CONTACT_REPLY_TO_EMAIL,
    CONTACT_SUBJECT_PREFIX: process.env.CONTACT_SUBJECT_PREFIX,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  });

  if (!parsed.success) {
    throw formatZodError("[env] Invalid server environment variables.", parsed.error.issues);
  }

  const publicEnv = getPublicEnv();
  const wordpressGraphqlEndpoint = resolveWordPressGraphqlEndpoint(
    parsed.data.WORDPRESS_GRAPHQL_ENDPOINT,
    publicEnv,
  );

  cachedServerEnv = {
    wordpressGraphqlEndpoint,
    wordpressAuthToken: parsed.data.WORDPRESS_AUTH_TOKEN ?? null,
    wordpressPreviewSecret: parsed.data.WORDPRESS_PREVIEW_SECRET,
    wordpressRevalidationSecret: parsed.data.WORDPRESS_REVALIDATION_SECRET ?? null,
    resendApiKey: parsed.data.RESEND_API_KEY ?? null,
    contactToEmail: parsed.data.CONTACT_TO_EMAIL ?? null,
    contactFromEmail: parsed.data.CONTACT_FROM_EMAIL ?? null,
    contactReplyToEmail: parsed.data.CONTACT_REPLY_TO_EMAIL ?? null,
    contactSubjectPrefix: parsed.data.CONTACT_SUBJECT_PREFIX ?? null,
    turnstileSecretKey: parsed.data.TURNSTILE_SECRET_KEY ?? null,
  };

  return cachedServerEnv;
}
