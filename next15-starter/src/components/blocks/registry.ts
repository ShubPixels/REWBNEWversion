import type { ComponentType } from "react";
import AwardsGrid, { type AwardItem, type AwardsGridData } from "@/components/blocks/AwardsGrid";
import CategoryCardsGrid, { type CategoryCardItem, type CategoryCardsGridData } from "@/components/blocks/CategoryCardsGrid";
import ContactFormSplit, { type ContactFormSplitData } from "@/components/blocks/ContactFormSplit";
import CtaBanner, { type CtaBannerData } from "@/components/blocks/CtaBanner";
import FeatureCardsGrid, { type FeatureCardItem, type FeatureCardsGridData } from "@/components/blocks/FeatureCardsGrid";
import HeroShowcase, { type HeroShowcaseData } from "@/components/blocks/HeroShowcase";
import LogoMarquee, { type LogoMarqueeData, type LogoMarqueeItem } from "@/components/blocks/LogoMarquee";
import PageIntro, { type PageIntroData } from "@/components/blocks/PageIntro";
import ServiceRowsAlternating, {
  type ServiceRowItem,
  type ServiceRowsAlternatingData,
} from "@/components/blocks/ServiceRowsAlternating";
import SplitContentMedia, { type SplitContentMediaData } from "@/components/blocks/SplitContentMedia";
import StatsBand, { type StatsBandData, type StatsBandItem } from "@/components/blocks/StatsBand";
import TestimonialsSlider, {
  type TestimonialItem,
  type TestimonialsSliderData,
} from "@/components/blocks/TestimonialsSlider";
import { mapContactFormSplitContent } from "@/lib/forms/contactPayload";
import type { WpLink, WpMedia, WpPageBlock } from "@/types/wp";

export const FLEXIBLE_BLOCK_KEYS = [
  "hero_showcase",
  "stats_band",
  "logo_marquee",
  "category_cards_grid",
  "split_content_media",
  "feature_cards_grid",
  "service_rows_alternating",
  "awards_grid",
  "testimonials_slider",
  "contact_form_split",
  "page_intro",
  "cta_banner",
] as const;

export type FlexibleBlockKey = (typeof FLEXIBLE_BLOCK_KEYS)[number];

type BlockDataMap = {
  hero_showcase: HeroShowcaseData;
  stats_band: StatsBandData;
  logo_marquee: LogoMarqueeData;
  category_cards_grid: CategoryCardsGridData;
  split_content_media: SplitContentMediaData;
  feature_cards_grid: FeatureCardsGridData;
  service_rows_alternating: ServiceRowsAlternatingData;
  awards_grid: AwardsGridData;
  testimonials_slider: TestimonialsSliderData;
  contact_form_split: ContactFormSplitData;
  page_intro: PageIntroData;
  cta_banner: CtaBannerData;
};

type AnyBlockComponent = ComponentType<{ data: unknown; blockId: string }>;

interface BlockRegistryEntry<TData> {
  component: ComponentType<{ data: TData; blockId: string }>;
  parse: (raw: Record<string, unknown>) => TData;
}

type BlockRegistry = {
  [TKey in FlexibleBlockKey]: BlockRegistryEntry<BlockDataMap[TKey]>;
};

export type ParsedKnownBlock<TKey extends FlexibleBlockKey = FlexibleBlockKey> = {
  kind: "known";
  key: TKey;
  blockId: string;
  component: AnyBlockComponent;
  data: BlockDataMap[TKey];
  source: WpPageBlock;
};

export type ParsedUnknownBlock = {
  kind: "unknown";
  key: "unknown";
  blockId: string;
  source: WpPageBlock;
  inferredKey: string | null;
};

export type ParsedBlock = ParsedKnownBlock | ParsedUnknownBlock;

const KNOWN_KEYS_SET = new Set<string>(FLEXIBLE_BLOCK_KEYS);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeIdentifier(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function readPath(record: Record<string, unknown>, path: string): unknown {
  const segments = path.split(".");
  let cursor: unknown = record;

  for (const segment of segments) {
    if (!isRecord(cursor) || !(segment in cursor)) {
      return undefined;
    }
    cursor = cursor[segment];
  }

  return cursor;
}

function readFirst(record: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    const value = readPath(record, key);
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

function pickString(record: Record<string, unknown>, keys: string[], fallback = ""): string {
  const value = readFirst(record, keys);
  return typeof value === "string" ? value : fallback;
}

function pickStringArray(record: Record<string, unknown>, keys: string[]): string[] {
  const value = readFirst(record, keys);
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter((item) => item.length > 0);
}

function pickBoolean(record: Record<string, unknown>, keys: string[], fallback = false): boolean {
  const value = readFirst(record, keys);
  return typeof value === "boolean" ? value : fallback;
}

function pickNumber(record: Record<string, unknown>, keys: string[], fallback = 0): number {
  const value = readFirst(record, keys);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function pickRecordArray(record: Record<string, unknown>, keys: string[]): Record<string, unknown>[] {
  const value = readFirst(record, keys);
  return asArray(value).map((item) => asRecord(item)).filter((item): item is Record<string, unknown> => item !== null);
}

function parseMedia(value: unknown): WpMedia | null {
  if (typeof value === "string" && value.trim()) {
    return {
      id: `media:${value}`,
      databaseId: null,
      url: value,
      alt: "",
      title: null,
      caption: null,
      width: null,
      height: null,
    };
  }

  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const url = pickString(record, ["sourceUrl", "url"]);
  if (!url) {
    return null;
  }

  const mediaDetails = asRecord(readFirst(record, ["mediaDetails"]));
  const width = mediaDetails ? pickNumber(mediaDetails, ["width"], 0) : pickNumber(record, ["width"], 0);
  const height = mediaDetails ? pickNumber(mediaDetails, ["height"], 0) : pickNumber(record, ["height"], 0);

  return {
    id: pickString(record, ["id"], `media:${url}`),
    databaseId: pickNumber(record, ["databaseId"], 0) || null,
    url,
    alt: pickString(record, ["altText", "alt"], ""),
    title: pickString(record, ["title"], "") || null,
    caption: pickString(record, ["caption"], "") || null,
    width: width > 0 ? Math.round(width) : null,
    height: height > 0 ? Math.round(height) : null,
  };
}

function parseLink(value: unknown): WpLink | null {
  if (typeof value === "string" && value.trim()) {
    return {
      label: "Learn more",
      url: value,
      target: null,
    };
  }

  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const url = pickString(record, ["url", "href", "link"]);
  if (!url) {
    return null;
  }

  return {
    label: pickString(record, ["title", "label", "text"], "Learn more"),
    url,
    target: pickString(record, ["target"], "") || null,
  };
}

function pickMedia(record: Record<string, unknown>, keys: string[]): WpMedia | null {
  return parseMedia(readFirst(record, keys));
}

function pickLink(record: Record<string, unknown>, keys: string[]): WpLink | null {
  return parseLink(readFirst(record, keys));
}

function parseHeroShowcase(raw: Record<string, unknown>): HeroShowcaseData {
  const alignValue = pickString(raw, ["align", "alignment", "textAlign"], "left").toLowerCase();
  return {
    eyebrow: pickString(raw, ["eyebrow", "kicker", "overline"]),
    title: pickString(raw, ["title", "heading", "headline"], "Hero section"),
    description: pickString(raw, ["description", "subtitle", "text", "intro"]),
    backgroundImage: pickMedia(raw, ["backgroundImage", "background_image", "heroImage", "image", "media"]),
    primaryCta: pickLink(raw, ["primaryCta", "primary_cta", "primaryLink", "cta", "button"]),
    secondaryCta: pickLink(raw, ["secondaryCta", "secondary_cta", "secondaryLink", "ctaSecondary", "buttonSecondary"]),
    align: alignValue === "center" ? "center" : "left",
  };
}

function parseStatsBand(raw: Record<string, unknown>): StatsBandData {
  const rows = pickRecordArray(raw, ["stats", "items", "counters"]);
  const stats: StatsBandItem[] = rows
    .map((item) => ({
      label: pickString(item, ["label", "title"], ""),
      value: Math.round(pickNumber(item, ["value", "count", "number"], 0)),
      prefix: pickString(item, ["prefix"], ""),
      suffix: pickString(item, ["suffix"], ""),
    }))
    .filter((item) => item.label || item.value !== 0);

  return {
    eyebrow: pickString(raw, ["eyebrow", "kicker"]),
    title: pickString(raw, ["title", "heading"], ""),
    description: pickString(raw, ["description", "subtitle"], ""),
    stats,
  };
}

function parseLogoMarquee(raw: Record<string, unknown>): LogoMarqueeData {
  const rows = pickRecordArray(raw, ["logos", "items", "brands", "clients"]);
  const logos: LogoMarqueeItem[] = rows
    .map((item) => ({
      name: pickString(item, ["name", "title", "label"], ""),
      logo: pickMedia(item, ["logo", "image", "media"]),
      link: pickLink(item, ["link", "url", "cta"]),
    }))
    .filter((item) => item.name || item.logo !== null);

  return {
    title: pickString(raw, ["title", "heading"], ""),
    logos,
  };
}

function parseCategoryCardsGrid(raw: Record<string, unknown>): CategoryCardsGridData {
  const rows = pickRecordArray(raw, ["cards", "items", "categories"]);
  const cards: CategoryCardItem[] = rows
    .map((item) => ({
      title: pickString(item, ["title", "heading"], ""),
      description: pickString(item, ["description", "text"], ""),
      image: pickMedia(item, ["image", "media", "thumbnail"]),
      link: pickLink(item, ["link", "cta", "url"]),
    }))
    .filter((item) => item.title.length > 0);

  return {
    title: pickString(raw, ["title", "heading"], ""),
    description: pickString(raw, ["description", "intro"], ""),
    cards,
  };
}

function parseSplitContentMedia(raw: Record<string, unknown>): SplitContentMediaData {
  return {
    eyebrow: pickString(raw, ["eyebrow", "kicker"], ""),
    title: pickString(raw, ["title", "heading"], ""),
    description: pickString(raw, ["description", "subtitle"], ""),
    body: pickString(raw, ["body", "content", "text"], ""),
    media: pickMedia(raw, ["media", "image", "featuredImage"]),
    cta: pickLink(raw, ["cta", "link", "button"]),
    reverse: pickBoolean(raw, ["reverse", "isReversed", "flip"], false),
  };
}

function parseFeatureCardsGrid(raw: Record<string, unknown>): FeatureCardsGridData {
  const rows = pickRecordArray(raw, ["cards", "items", "features"]);
  const cards: FeatureCardItem[] = rows
    .map((item) => ({
      title: pickString(item, ["title", "heading"], ""),
      description: pickString(item, ["description", "text"], ""),
      icon: pickString(item, ["icon", "emoji"], ""),
      image: pickMedia(item, ["image", "media", "iconImage"]),
    }))
    .filter((item) => item.title.length > 0);

  return {
    title: pickString(raw, ["title", "heading"], ""),
    description: pickString(raw, ["description", "intro"], ""),
    cards,
  };
}

function parseServiceRowsAlternating(raw: Record<string, unknown>): ServiceRowsAlternatingData {
  const rowsRaw = pickRecordArray(raw, ["rows", "services", "items"]);
  const rows: ServiceRowItem[] = rowsRaw
    .map((item) => ({
      title: pickString(item, ["title", "heading"], ""),
      description: pickString(item, ["description", "text", "body"], ""),
      image: pickMedia(item, ["image", "media"]),
      cta: pickLink(item, ["cta", "link", "button"]),
    }))
    .filter((row) => row.title.length > 0);

  return {
    title: pickString(raw, ["title", "heading"], ""),
    rows,
  };
}

function parseAwardsGrid(raw: Record<string, unknown>): AwardsGridData {
  const rows = pickRecordArray(raw, ["awards", "items"]);
  const awards: AwardItem[] = rows
    .map((item) => ({
      title: pickString(item, ["title", "name"], ""),
      subtitle: pickString(item, ["subtitle", "description"], ""),
      year: pickString(item, ["year", "date"], ""),
      image: pickMedia(item, ["image", "media", "badge"]),
    }))
    .filter((item) => item.title.length > 0);

  return {
    title: pickString(raw, ["title", "heading"], ""),
    awards,
  };
}

function parseTestimonialsSlider(raw: Record<string, unknown>): TestimonialsSliderData {
  const rows = pickRecordArray(raw, ["testimonials", "items", "slides"]);
  const testimonials: TestimonialItem[] = rows
    .map((item) => ({
      quote: pickString(item, ["quote", "content", "text"], ""),
      author: pickString(item, ["author", "name"], ""),
      role: pickString(item, ["role", "designation"], ""),
      company: pickString(item, ["company", "organization"], ""),
      avatar: pickMedia(item, ["avatar", "image", "photo"]),
    }))
    .filter((item) => item.quote.length > 0);

  return {
    title: pickString(raw, ["title", "heading"], ""),
    autoplayMs: Math.max(2000, Math.round(pickNumber(raw, ["autoplayMs", "autoplay", "interval"], 5000))),
    testimonials,
  };
}

function parseContactFormSplit(raw: Record<string, unknown>): ContactFormSplitData {
  return mapContactFormSplitContent(raw);
}

function parsePageIntro(raw: Record<string, unknown>): PageIntroData {
  return {
    eyebrow: pickString(raw, ["eyebrow", "kicker"], ""),
    title: pickString(raw, ["title", "heading"], ""),
    description: pickString(raw, ["description", "subtitle", "intro"], ""),
  };
}

function parseCtaBanner(raw: Record<string, unknown>): CtaBannerData {
  const toneValue = pickString(raw, ["tone", "variant", "style"], "dark").toLowerCase();
  const tone: CtaBannerData["tone"] =
    toneValue === "light" || toneValue === "accent" ? toneValue : "dark";

  return {
    title: pickString(raw, ["title", "heading"], ""),
    description: pickString(raw, ["description", "text", "subtitle"], ""),
    primaryCta: pickLink(raw, ["primaryCta", "primaryLink", "cta"]),
    secondaryCta: pickLink(raw, ["secondaryCta", "secondaryLink", "ctaSecondary"]),
    tone,
  };
}

const blockRegistry: BlockRegistry = {
  hero_showcase: { component: HeroShowcase, parse: parseHeroShowcase },
  stats_band: { component: StatsBand, parse: parseStatsBand },
  logo_marquee: { component: LogoMarquee, parse: parseLogoMarquee },
  category_cards_grid: { component: CategoryCardsGrid, parse: parseCategoryCardsGrid },
  split_content_media: { component: SplitContentMedia, parse: parseSplitContentMedia },
  feature_cards_grid: { component: FeatureCardsGrid, parse: parseFeatureCardsGrid },
  service_rows_alternating: { component: ServiceRowsAlternating, parse: parseServiceRowsAlternating },
  awards_grid: { component: AwardsGrid, parse: parseAwardsGrid },
  testimonials_slider: { component: TestimonialsSlider, parse: parseTestimonialsSlider },
  contact_form_split: { component: ContactFormSplit, parse: parseContactFormSplit },
  page_intro: { component: PageIntro, parse: parsePageIntro },
  cta_banner: { component: CtaBanner, parse: parseCtaBanner },
};

function detectBlockKey(block: WpPageBlock): FlexibleBlockKey | null {
  const candidates: string[] = [];

  if (block.type) {
    candidates.push(block.type);
  }
  if (block.fieldGroupName) {
    candidates.push(block.fieldGroupName);
  }

  const rawCandidateKeys = [
    "acfFcLayout",
    "acf_fc_layout",
    "layout",
    "layoutName",
    "blockType",
    "block_key",
    "blockKey",
    "component",
    "componentKey",
    "slug",
  ];

  rawCandidateKeys.forEach((key) => {
    const value = readFirst(block.raw, [key]);
    if (typeof value === "string" && value.trim()) {
      candidates.push(value);
    }
  });

  for (const candidate of candidates) {
    const normalized = normalizeIdentifier(candidate);
    if (KNOWN_KEYS_SET.has(normalized)) {
      return normalized as FlexibleBlockKey;
    }

    for (const knownKey of FLEXIBLE_BLOCK_KEYS) {
      if (normalized === knownKey || normalized.endsWith(`_${knownKey}`) || normalized.includes(knownKey)) {
        return knownKey;
      }
    }
  }

  return null;
}

export function parseFlexibleBlock(block: WpPageBlock, index: number): ParsedBlock {
  const detectedKey = detectBlockKey(block);
  const blockId = `${detectedKey ?? "unknown"}-${index + 1}`;

  if (!detectedKey) {
    return {
      kind: "unknown",
      key: "unknown",
      blockId,
      source: block,
      inferredKey: null,
    };
  }

  const entry = blockRegistry[detectedKey];
  const data = entry.parse(block.raw);

  return {
    kind: "known",
    key: detectedKey,
    blockId,
    component: entry.component as AnyBlockComponent,
    data,
    source: block,
  };
}

export function getRegisteredBlockKeys(): FlexibleBlockKey[] {
  return [...FLEXIBLE_BLOCK_KEYS];
}
