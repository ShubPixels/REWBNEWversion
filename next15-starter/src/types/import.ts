export type ImportEntityStatus = "draft" | "publish" | "private";

export type FlexibleBlockLayoutKey =
  | "hero_showcase"
  | "stats_band"
  | "logo_marquee"
  | "category_cards_grid"
  | "split_content_media"
  | "feature_cards_grid"
  | "service_rows_alternating"
  | "awards_grid"
  | "testimonials_slider"
  | "contact_form_split"
  | "page_intro"
  | "cta_banner";

export interface ImportMediaRef {
  sourceUrl: string;
  alt?: string;
  title?: string;
  caption?: string;
}

export interface ImportLinkField {
  label: string;
  url: string;
  target?: string | null;
}

export interface ImportSeoFields {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: ImportMediaRef | null;
}

export interface PageIntroBlockData {
  eyebrow?: string;
  title: string;
  description?: string;
}

export interface HeroShowcaseBlockData {
  eyebrow?: string;
  title: string;
  description?: string;
  backgroundImage?: ImportMediaRef | null;
  primaryCta?: ImportLinkField | null;
  secondaryCta?: ImportLinkField | null;
  align?: "left" | "center";
}

export interface StatsBandItemData {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export interface StatsBandBlockData {
  eyebrow?: string;
  title?: string;
  description?: string;
  stats: StatsBandItemData[];
}

export interface LogoMarqueeItemData {
  name: string;
  logo?: ImportMediaRef | null;
  link?: ImportLinkField | null;
}

export interface LogoMarqueeBlockData {
  title?: string;
  logos: LogoMarqueeItemData[];
}

export interface CategoryCardItemData {
  title: string;
  description?: string;
  image?: ImportMediaRef | null;
  link?: ImportLinkField | null;
}

export interface CategoryCardsGridBlockData {
  title?: string;
  description?: string;
  cards: CategoryCardItemData[];
}

export interface SplitContentMediaBlockData {
  eyebrow?: string;
  title?: string;
  description?: string;
  body?: string;
  media?: ImportMediaRef | null;
  cta?: ImportLinkField | null;
  reverse?: boolean;
}

export interface FeatureCardItemData {
  title: string;
  description?: string;
  icon?: string;
  image?: ImportMediaRef | null;
}

export interface FeatureCardsGridBlockData {
  title?: string;
  description?: string;
  cards: FeatureCardItemData[];
}

export interface ServiceRowItemData {
  title: string;
  description?: string;
  image?: ImportMediaRef | null;
  cta?: ImportLinkField | null;
}

export interface ServiceRowsAlternatingBlockData {
  title?: string;
  rows: ServiceRowItemData[];
}

export interface AwardItemData {
  title: string;
  subtitle?: string;
  year?: string;
  image?: ImportMediaRef | null;
}

export interface AwardsGridBlockData {
  title?: string;
  awards: AwardItemData[];
}

export interface TestimonialItemData {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  avatar?: ImportMediaRef | null;
}

export interface TestimonialsSliderBlockData {
  title?: string;
  autoplayMs?: number;
  testimonials: TestimonialItemData[];
}

export interface ContactFormLabelsData {
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  message: string;
}

export interface ContactFormSidebarData {
  title: string;
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  mapButtonLabel: string;
}

export interface ContactFormSplitBlockData {
  title?: string;
  description?: string;
  formTitle?: string;
  submitLabel?: string;
  submitPendingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  categoryPlaceholder?: string;
  termsLabel?: string;
  categories: string[];
  labels: ContactFormLabelsData;
  sidebar: ContactFormSidebarData;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  mapLink?: ImportLinkField | null;
}

export interface CtaBannerBlockData {
  title?: string;
  description?: string;
  primaryCta?: ImportLinkField | null;
  secondaryCta?: ImportLinkField | null;
  tone?: "dark" | "light" | "accent";
}

export interface FlexibleBlockDataMap {
  page_intro: PageIntroBlockData;
  hero_showcase: HeroShowcaseBlockData;
  stats_band: StatsBandBlockData;
  logo_marquee: LogoMarqueeBlockData;
  category_cards_grid: CategoryCardsGridBlockData;
  split_content_media: SplitContentMediaBlockData;
  feature_cards_grid: FeatureCardsGridBlockData;
  service_rows_alternating: ServiceRowsAlternatingBlockData;
  awards_grid: AwardsGridBlockData;
  testimonials_slider: TestimonialsSliderBlockData;
  contact_form_split: ContactFormSplitBlockData;
  cta_banner: CtaBannerBlockData;
}

export type FlexibleBlockSeed<TKey extends FlexibleBlockLayoutKey = FlexibleBlockLayoutKey> = {
  layout: TKey;
  anchor?: string;
  data: FlexibleBlockDataMap[TKey];
};

export interface ImportPageSeed {
  externalId: string;
  slug: string;
  uri: string;
  title: string;
  status?: ImportEntityStatus;
  excerpt?: string;
  seo?: ImportSeoFields;
  blocks: FlexibleBlockSeed[];
}

export interface ImportMenuItemSeed {
  externalId: string;
  parentExternalId?: string | null;
  label: string;
  url: string;
  target?: string | null;
  cssClasses?: string[];
}

export interface ImportMenuSeed {
  slug: string;
  name: string;
  items: ImportMenuItemSeed[];
}

export interface PromoModalSlideSeed {
  heading: string;
  description?: string;
  image?: ImportMediaRef | null;
  cta?: ImportLinkField | null;
}

export interface ImportGlobalOptionsSeed {
  siteName?: string;
  siteTagline?: string;
  brandLogo?: ImportMediaRef | null;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  whatsappPhone?: string;
  whatsappDefaultMessage?: string;
  enableBackToTop?: boolean;
  headerPrimaryLinks: ImportLinkField[];
  footerLinks: ImportLinkField[];
  socialLinks: ImportLinkField[];
  footerText?: string;
  promoModal?: {
    enabled: boolean;
    delayMs: number;
    autoRotateMs: number;
    slides: PromoModalSlideSeed[];
  };
  defaultSeo?: ImportSeoFields;
  options?: Record<string, unknown>;
}

export interface ImportProductCategorySeed {
  externalId: string;
  slug: string;
  name: string;
  description?: string;
  intro?: string;
  heroImage?: ImportMediaRef | null;
  serviceMode?: boolean;
  seo?: ImportSeoFields;
  blocks?: FlexibleBlockSeed[];
}

export interface ImportProductSpecificationRow {
  label: string;
  value: string;
}

export interface ImportProductApplications {
  materials: string[];
  industries: string[];
}

export interface ImportProductSeed {
  externalId: string;
  slug: string;
  title: string;
  status?: ImportEntityStatus;
  summary?: string;
  tagline?: string;
  benefits: string[];
  videoUrl?: string | null;
  specifications: ImportProductSpecificationRow[];
  applications: ImportProductApplications;
  gallery: ImportMediaRef[];
  featuredImage?: ImportMediaRef | null;
  categorySlugs: string[];
  relatedProductSlugs?: string[];
  seo?: ImportSeoFields;
}

export interface ImportBundle {
  schemaVersion: "1.0.0";
  source: "cra-reference";
  generatedAt: string;
  globals: {
    options: ImportGlobalOptionsSeed;
    menus: ImportMenuSeed[];
  };
  pages: ImportPageSeed[];
  productCategories: ImportProductCategorySeed[];
  products: ImportProductSeed[];
}

export interface LegacyCraProductRecord {
  category?: string;
  name?: string;
  tagline?: string;
  heading?: string;
  benifits?: string[];
  benefits?: string[];
  description?: string;
  image?: unknown[];
  specifications?: Array<Record<string, string>>;
  applications?: string[] | { materials?: string[]; industries?: string[] };
  videoUrl?: string;
}

export type LegacyCraProductMap = Record<string, LegacyCraProductRecord>;

export interface ImportTransformIssue {
  level: "warning" | "error";
  field: string;
  message: string;
  externalId?: string;
}

export interface ImportTransformResult {
  bundle: ImportBundle;
  issues: ImportTransformIssue[];
}
