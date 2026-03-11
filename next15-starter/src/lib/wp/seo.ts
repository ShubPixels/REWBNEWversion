import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Maybe, WpSeo } from "@/types/wp";

export interface BuildSeoMetadataOptions {
  seo?: Maybe<WpSeo>;
  fallbackTitle?: string;
  fallbackDescription?: string;
  canonicalPath?: string;
}

function toAbsoluteUrl(urlOrPath: string): string {
  try {
    return new URL(urlOrPath).toString();
  } catch {
    return new URL(urlOrPath, siteConfig.url).toString();
  }
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

  const canonicalSource = cleanOrNull(seo?.canonicalUrl) ?? cleanOrNull(options.canonicalPath);
  const canonical = canonicalSource ? toAbsoluteUrl(canonicalSource) : undefined;

  const openGraphImageUrl = seo?.openGraphImage?.url ? toAbsoluteUrl(seo.openGraphImage.url) : undefined;

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
