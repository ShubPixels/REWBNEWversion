export const LEGACY_REFERENCE_FILES = {
  homePage: "../src/pages/HomePage.jsx",
  aboutPage: "../src/pages/AboutUs.jsx",
  contactPage: "../src/pages/ContactUs.jsx",
  categoriesPage: "../src/pages/CategoriesPage.jsx",
  productData: "../src/pages/ProductData.js",
  navbar: "../src/Components/Navbar.js",
  app: "../src/App.js",
} as const;

export type LegacyReferenceFileKey = keyof typeof LEGACY_REFERENCE_FILES;
export type LegacyReferenceFilePath = (typeof LEGACY_REFERENCE_FILES)[LegacyReferenceFileKey];

export type ConflictSeverity = "info" | "warning" | "error";

export interface ConflictReportItem {
  id: string;
  severity: ConflictSeverity;
  title: string;
  description: string;
  sourceFiles: LegacyReferenceFilePath[];
  fieldPaths: string[];
  suggestedAction: string;
}

export interface LegacyMediaReference {
  id: string;
  sourcePath: string;
}

export interface LegacyStatItem {
  key: string;
  label: string;
  value: number;
  suffix: string;
}

export interface LegacyFormPayload {
  initialValues: Record<string, string | boolean>;
  requiredFields: string[];
  categoryOptions: string[];
  labels: Record<string, string>;
  termsLabel: string;
  successMessage: string;
  errorMessage: string;
}

export interface LegacyContactSidebar {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  mapUrl: string;
}

export interface LegacyHomePayload {
  heroTitle: string;
  heroDescription: string;
  heroPrimaryLabel: string;
  heroPrimaryUrl: string;
  heroSecondaryLabel: string;
  heroSecondaryUrl: string;
  stats: LegacyStatItem[];
  partnerLogos: LegacyMediaReference[];
  services: LegacyServicePayload[];
  awards: LegacyAwardPayload[];
  testimonials: LegacyTestimonialPayload[];
  contactForm: LegacyFormPayload;
  contactSidebar: LegacyContactSidebar;
}

export interface LegacyAboutPayload {
  heroTitle: string;
  storyHeading: string;
  storyParagraphs: string[];
  storyImage: LegacyMediaReference | null;
  featureCards: Array<{ title: string; description: string; iconHint: string }>;
  services: LegacyServicePayload[];
  awards: LegacyAwardPayload[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  foundingYears: number[];
}

export interface LegacyContactPayload {
  pageHeading: string;
  form: LegacyFormPayload;
  sidebar: LegacyContactSidebar;
}

export interface LegacyCategoryPayload {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: LegacyMediaReference | null;
  productSlugs: string[];
}

export interface LegacyProductPayload {
  slug: string;
  title: string;
  categoryName: string;
  categorySlug: string;
  tagline: string;
  introDescription: string;
  videoUrl: string;
  gallery: LegacyMediaReference[];
  benefits: string[];
  legacyBenifits: string[];
  specRows: Array<{ specLabel: string; specValue: string }>;
  applicationMaterials: string[];
  applicationIndustries: string[];
}

export interface LegacyNavbarPayload {
  logoPath: string;
  navLinks: Array<{ label: string; url: string }>;
  socialLinks: Array<{ label: string; url: string; iconPath: string }>;
  contactPhone: string;
  contactEmail: string;
  brochureLabel: string;
  brochureUrl: string;
}

export interface LegacyAppPayload {
  promoDelayMs: number;
  promoAutoRotateMs: number;
  promoImages: LegacyMediaReference[];
}

export interface LegacyExtractionBundle {
  generatedAt: string;
  home: LegacyHomePayload;
  about: LegacyAboutPayload;
  contact: LegacyContactPayload;
  categories: LegacyCategoryPayload[];
  products: LegacyProductPayload[];
  navbar: LegacyNavbarPayload;
  app: LegacyAppPayload;
  conflicts: ConflictReportItem[];
}

export type FlexibleBlockKey =
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

export interface NormalizedFlexibleBlock<TData = Record<string, unknown>> {
  blockKey: FlexibleBlockKey;
  data: TData;
}

export interface NormalizedPagePayload {
  slug: "home" | "about" | "contact";
  title: string;
  uri: string;
  flexibleBlocks: NormalizedFlexibleBlock[];
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  sourceFiles: LegacyReferenceFilePath[];
}

export interface NormalizedGlobalOptionsPayload {
  site_name: string;
  site_tagline: string;
  header_options: {
    logo_path: string;
    links: Array<{ label: string; url: string }>;
  };
  footer_options: {
    links: Array<{ label: string; url: string }>;
  };
  contact_social_options: {
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    social_links: Array<{ label: string; url: string }>;
  };
  brochure_download_links: Array<{ label: string; url: string }>;
  promo_modal: {
    enabled: boolean;
    delay_ms: number;
    auto_rotate_ms: number;
    slides: Array<{ image: string; heading: string; description: string; cta_label: string; cta_url: string }>;
  };
  shared_credibility: {
    awards: Array<{ title: string; image: string }>;
    client_logos: Array<{ name: string; image: string }>;
  };
  seo_defaults: {
    meta_title: string;
    meta_description: string;
  };
  source_files: LegacyReferenceFilePath[];
  manual_review_fields: string[];
}

export interface NormalizedTaxonomyPayload {
  slug: string;
  name: string;
  short_description: string;
  card_image: string;
  archive_hero_image: string;
  cta_label: string;
  cta_url: string;
  is_service_category: boolean;
  empty_state_heading: string;
  empty_state_text: string;
  related_legacy_product_slugs: string[];
  source_files: LegacyReferenceFilePath[];
  manual_review_fields: string[];
}

export interface NormalizedProductPayload {
  slug: string;
  title: string;
  category_slugs: string[];
  tagline: string;
  intro_description: string;
  video_url: string;
  gallery: string[];
  benefits: string[];
  spec_rows: Array<{ spec_label: string; spec_value: string }>;
  application_materials: string[];
  application_industries: string[];
  cta_label: string;
  cta_url: string;
  related_product_override_slugs: string[];
  source_files: LegacyReferenceFilePath[];
  manual_review_fields: string[];
}

export interface BuildImportPayloadResult {
  generatedAt: string;
  pagesHome: NormalizedPagePayload;
  pagesAbout: NormalizedPagePayload;
  pagesContact: NormalizedPagePayload;
  globalOptions: NormalizedGlobalOptionsPayload;
  productCategories: NormalizedTaxonomyPayload[];
  products: NormalizedProductPayload[];
  conflicts: ConflictReportItem[];
  summary: {
    categories: number;
    products: number;
    conflicts: number;
  };
}

export interface LegacyServicePayload {
  title: string;
  description: string;
  image: LegacyMediaReference | null;
}

export interface LegacyAwardPayload {
  title: string;
  image: LegacyMediaReference | null;
}

export interface LegacyTestimonialPayload {
  name: string;
  company: string;
  designation: string;
  text: string;
  logo: LegacyMediaReference | null;
}
