import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Maybe, WpSeo } from "@/types/wp";

export interface BuildSeoMetadataOptions {
  seo?: Maybe<WpSeo>;
  fallbackTitle?: string;
  fallbackDescription?: string;
  canonicalPath?: string;
  fallbackOpenGraphImageUrl?: string | null;
}

function toAbsoluteUrl(urlOrPath: string): string {
  const parsed = new URL(urlOrPath, siteConfig.url);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Unsupported URL protocol.");
  }
  return parsed.toString();
}

function cleanOrNull(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : null;
}

export function buildSeoMetadata(options: BuildSeoMetadataOptions = {}): Metadata {
  const seo = options.seo ?? null;

  const title = cleanOrNull(seo?.title) ?? cleanOrNull(options.fallbackTitle) ?? siteConfig.name;
  const description =
    cleanOrNull(seo?.description) ?? cleanOrNull(options.fallbackDescription) ?? siteConfig.description;

  let canonical: string | undefined;
  const canonicalSource = cleanOrNull(seo?.canonicalUrl) ?? cleanOrNull(options.canonicalPath);
  if (canonicalSource) {
    try {
      canonical = toAbsoluteUrl(canonicalSource);
    } catch {
      canonical = undefined;
    }
  }

  let openGraphImageUrl: string | undefined;
  const openGraphSource = cleanOrNull(seo?.openGraphImage?.url) ?? cleanOrNull(options.fallbackOpenGraphImageUrl);
  if (openGraphSource) {
    try {
      openGraphImageUrl = toAbsoluteUrl(openGraphSource);
    } catch {
      openGraphImageUrl = undefined;
    }
  }

  const robots =
    seo && (seo.noindex || seo.nofollow)
      ? {
          index: !seo.noindex,
          follow: !seo.nofollow,
          googleBot: {
            index: !seo.noindex,
            follow: !seo.nofollow,
          },
        }
      : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots,
    openGraph: {
      title: cleanOrNull(seo?.openGraphTitle) ?? title,
      description: cleanOrNull(seo?.openGraphDescription) ?? description,
      url: canonical ?? siteConfig.url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: openGraphImageUrl ? [{ url: openGraphImageUrl }] : undefined,
    },
    twitter: {
      card: openGraphImageUrl ? "summary_large_image" : "summary",
      title: cleanOrNull(seo?.openGraphTitle) ?? title,
      description: cleanOrNull(seo?.openGraphDescription) ?? description,
      images: openGraphImageUrl ? [openGraphImageUrl] : undefined,
    },
  };
}
