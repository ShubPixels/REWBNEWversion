import type { WpMedia } from "@/types/wp";

function normalize(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getSafeMediaUrl(media: WpMedia | null | undefined): string | null {
  if (!media) {
    return null;
  }

  const url = normalize(media.url);
  if (!url) {
    return null;
  }

  const isAbsoluteHttp = /^https?:\/\//i.test(url);
  const isRootRelative = url.startsWith("/");
  return isAbsoluteHttp || isRootRelative ? url : null;
}

export function getSafeMediaAlt(media: WpMedia | null | undefined, fallback: string): string {
  const alt = normalize(media?.alt);
  if (alt) {
    return alt;
  }

  const title = normalize(media?.title);
  if (title) {
    return title;
  }

  const normalizedFallback = normalize(fallback);
  return normalizedFallback || "Image";
}

export function getSafeMediaDimensions(
  media: WpMedia | null | undefined,
  fallbackWidth: number,
  fallbackHeight: number,
): { width: number; height: number } {
  const width = typeof media?.width === "number" && media.width > 0 ? media.width : fallbackWidth;
  const height = typeof media?.height === "number" && media.height > 0 ? media.height : fallbackHeight;
  return { width, height };
}

