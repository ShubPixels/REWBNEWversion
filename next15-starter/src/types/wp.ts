export type Maybe<T> = T | null | undefined;

export interface WpGraphQLError {
  message: string;
  path?: ReadonlyArray<string | number>;
  extensions?: Record<string, unknown>;
}

export interface WpGraphQLResponse<TData> {
  data?: TData;
  errors?: WpGraphQLError[];
}

export type ContentNodeIdTypeEnum = "DATABASE_ID" | "ID" | "SLUG" | "URI";

export interface WpRawMediaItem {
  id?: Maybe<string>;
  databaseId?: Maybe<number>;
  sourceUrl?: Maybe<string>;
  altText?: Maybe<string>;
  title?: Maybe<string>;
  caption?: Maybe<string>;
  mediaDetails?: Maybe<{
    width?: Maybe<number>;
    height?: Maybe<number>;
  }>;
}

export interface WpRawLinkField {
  title?: Maybe<string>;
  url?: Maybe<string>;
  target?: Maybe<string>;
}

export interface WpRawSeoFields {
  metaTitle?: Maybe<string>;
  metaDescription?: Maybe<string>;
  canonicalUrl?: Maybe<string>;
  noindex?: Maybe<boolean>;
  nofollow?: Maybe<boolean>;
  openGraphTitle?: Maybe<string>;
  openGraphDescription?: Maybe<string>;
  openGraphImage?: Maybe<WpRawMediaItem>;
}

export interface WpRawPromoSlide {
  heading?: Maybe<string>;
  description?: Maybe<string>;
  image?: Maybe<WpRawMediaItem>;
  cta?: Maybe<WpRawLinkField>;
}

export interface WpRawPromoModalOptions {
  enabled?: Maybe<boolean>;
  delayMs?: Maybe<number>;
  autoRotateMs?: Maybe<number>;
  slides?: Maybe<Array<Maybe<WpRawPromoSlide>>>;
}

export interface WpRawFlexibleBlock {
  __typename?: Maybe<string>;
  fieldGroupName?: Maybe<string>;
  acfFcLayout?: Maybe<string>;
  acf_fc_layout?: Maybe<string>;
  layout?: Maybe<string>;
  layoutName?: Maybe<string>;
  [key: string]: unknown;
}

export interface WpRawPageBuilder {
  blocks?: Maybe<Array<Maybe<WpRawFlexibleBlock>>>;
}

export interface WpRawProductFields {
  summary?: Maybe<string>;
  introDescription?: Maybe<string>;
  intro?: Maybe<string>;
  description?: Maybe<string>;
  tagline?: Maybe<string>;
  benefits?: Maybe<Array<Maybe<string>>>;
  videoUrl?: Maybe<string>;
  specifications?: Maybe<
    Array<
      Maybe<{
        label?: Maybe<string>;
        value?: Maybe<string>;
        [key: string]: Maybe<string>;
      }>
    >
  >;
  applications?:
    | Maybe<Array<Maybe<string>>>
    | Maybe<{
        materials?: Maybe<Array<Maybe<string>>>;
        industries?: Maybe<Array<Maybe<string>>>;
      }>;
  applicationMaterials?: Maybe<Array<Maybe<string>>>;
  applicationIndustries?: Maybe<Array<Maybe<string>>>;
  gallery?: Maybe<{
    nodes?: Maybe<Array<Maybe<WpRawMediaItem>>>;
  }>;
  cta?: Maybe<WpRawLinkField>;
  ctaLabel?: Maybe<string>;
  ctaUrl?: Maybe<string>;
  ctaTarget?: Maybe<string>;
  relatedProducts?: Maybe<{
    nodes?: Maybe<Array<Maybe<WpRawProduct>>>;
  }>;
  [key: string]: unknown;
}

export interface WpRawTaxonomyFields {
  shortDescription?: Maybe<string>;
  cardImage?: Maybe<WpRawMediaItem>;
  intro?: Maybe<string>;
  archiveIntro?: Maybe<string>;
  archiveHeroImage?: Maybe<WpRawMediaItem>;
  heroImage?: Maybe<WpRawMediaItem>;
  cta?: Maybe<WpRawLinkField>;
  ctaLabel?: Maybe<string>;
  ctaUrl?: Maybe<string>;
  ctaTarget?: Maybe<string>;
  isServiceCategory?: Maybe<boolean>;
  emptyStateHeading?: Maybe<string>;
  emptyStateText?: Maybe<string>;
  blocks?: Maybe<Array<Maybe<WpRawFlexibleBlock>>>;
  [key: string]: unknown;
}

export interface WpRawProductCategorySummary {
  id?: Maybe<string>;
  databaseId?: Maybe<number>;
  slug?: Maybe<string>;
  uri?: Maybe<string>;
  name?: Maybe<string>;
  description?: Maybe<string>;
  seoFields?: Maybe<WpRawSeoFields>;
  taxonomyFields?: Maybe<WpRawTaxonomyFields>;
}

export interface WpRawPage {
  id?: Maybe<string>;
  databaseId?: Maybe<number>;
  uri?: Maybe<string>;
  slug?: Maybe<string>;
  title?: Maybe<string>;
  excerpt?: Maybe<string>;
  content?: Maybe<string>;
  featuredImage?: Maybe<{
    node?: Maybe<WpRawMediaItem>;
  }>;
  seoFields?: Maybe<WpRawSeoFields>;
  pageBuilder?: Maybe<WpRawPageBuilder>;
}

export interface WpRawProduct extends WpRawPage {
  productFields?: Maybe<WpRawProductFields>;
  productCategories?: Maybe<{
    nodes?: Maybe<Array<Maybe<WpRawProductCategorySummary>>>;
  }>;
}

export interface WpRawProductCategory extends WpRawProductCategorySummary {
  products?: Maybe<{
    nodes?: Maybe<Array<Maybe<WpRawProduct>>>;
  }>;
}

export interface WpRawGlobalOptions {
  siteName?: Maybe<string>;
  siteTagline?: Maybe<string>;
  brandLogo?: Maybe<WpRawMediaItem>;
  contactEmail?: Maybe<string>;
  contactPhone?: Maybe<string>;
  contactAddress?: Maybe<string>;
  headerPrimaryLinks?: Maybe<Array<Maybe<WpRawLinkField>>>;
  footerLinks?: Maybe<Array<Maybe<WpRawLinkField>>>;
  socialLinks?: Maybe<Array<Maybe<WpRawLinkField>>>;
  whatsappPhone?: Maybe<string>;
  whatsappDefaultMessage?: Maybe<string>;
  enableBackToTop?: Maybe<boolean>;
  footerText?: Maybe<string>;
  promoModal?: Maybe<WpRawPromoModalOptions>;
  defaultSeo?: Maybe<WpRawSeoFields>;
  [key: string]: unknown;
}

export interface WpRawMenuItem {
  id?: Maybe<string>;
  databaseId?: Maybe<number>;
  parentDatabaseId?: Maybe<number>;
  label?: Maybe<string>;
  url?: Maybe<string>;
  path?: Maybe<string>;
  target?: Maybe<string>;
  cssClasses?: Maybe<Array<Maybe<string>>>;
}

export interface WpRawMenu {
  id?: Maybe<string>;
  databaseId?: Maybe<number>;
  name?: Maybe<string>;
  slug?: Maybe<string>;
  menuItems?: Maybe<{
    nodes?: Maybe<Array<Maybe<WpRawMenuItem>>>;
  }>;
}

export interface GetGlobalSettingsQuery {
  generalSettings?: Maybe<{
    title?: Maybe<string>;
    description?: Maybe<string>;
    url?: Maybe<string>;
  }>;
  globalSettings?: Maybe<{
    globalOptions?: Maybe<WpRawGlobalOptions>;
  }>;
}

export interface GetPageByUriQuery {
  nodeByUri?: Maybe<
    {
      __typename?: Maybe<string>;
    } & WpRawPage
  >;
}

export interface GetMenusQuery {
  menus?: Maybe<{
    nodes?: Maybe<Array<Maybe<WpRawMenu>>>;
  }>;
}

export interface GetPageByUriVariables {
  uri: string;
}

export interface GetHomepageQuery {
  homepage?: Maybe<WpRawPage>;
}

export interface GetProductBySlugQuery {
  product?: Maybe<WpRawProduct>;
}

export interface GetProductBySlugVariables {
  slug: string;
}

export interface GetProductCategoryBySlugQuery {
  productCategory?: Maybe<WpRawProductCategory>;
}

export interface GetProductCategoryBySlugVariables {
  slug: string;
}

export interface GetProductCategoriesQuery {
  productCategories?: Maybe<{
    nodes?: Maybe<Array<Maybe<WpRawProductCategorySummary>>>;
  }>;
}

export interface GetProductRelatedOverrideQuery {
  product?: Maybe<{
    id?: Maybe<string>;
    productFields?: Maybe<{
      relatedProducts?: Maybe<{
        nodes?: Maybe<Array<Maybe<WpRawProduct>>>;
      }>;
    }>;
  }>;
}

export interface GetProductRelatedOverrideVariables {
  slug: string;
}

export interface GetPreviewNodeQuery {
  contentNode?: Maybe<
    {
      __typename?: Maybe<string>;
      status?: Maybe<string>;
    } & WpRawPage &
      Partial<WpRawProduct> &
      Partial<WpRawProductCategory>
  >;
}

export interface GetPreviewNodeVariables {
  id: string;
  idType?: ContentNodeIdTypeEnum;
}

export interface WpMedia {
  id: string;
  databaseId: number | null;
  url: string;
  alt: string;
  title: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
}

export interface WpLink {
  label: string;
  url: string;
  target: string | null;
}

export interface WpSeo {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  nofollow: boolean;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  openGraphImage: WpMedia | null;
}

export interface WpPromoSlideData {
  id: string;
  heading: string;
  description: string;
  image: WpMedia | null;
  cta: WpLink | null;
}

export interface WpPromoModalData {
  enabled: boolean;
  delayMs: number;
  autoRotateMs: number;
  slides: WpPromoSlideData[];
}

export interface WpFloatingContactData {
  contactEmail: string;
  contactPhone: string;
  whatsappPhone: string;
  whatsappDefaultMessage: string;
  enableBackToTop: boolean;
}

export interface WpMenuItemData {
  id: string;
  databaseId: number | null;
  parentDatabaseId: number | null;
  label: string;
  url: string;
  target: string | null;
  cssClasses: string[];
  children: WpMenuItemData[];
}

export interface WpMenuData {
  id: string;
  databaseId: number | null;
  name: string;
  slug: string;
  items: WpMenuItemData[];
}

export interface WpPageBlock {
  type: string;
  fieldGroupName: string | null;
  layoutKey: string | null;
  raw: Record<string, unknown>;
}

export interface WpPageData {
  id: string;
  databaseId: number | null;
  uri: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: WpMedia | null;
  seo: WpSeo | null;
  blocks: WpPageBlock[];
}

export interface WpProductSpecification {
  label: string;
  value: string;
}

export interface WpProductApplicationsData {
  materials: string[];
  industries: string[];
}

export interface WpProductCardData {
  id: string;
  slug: string;
  uri: string;
  title: string;
  excerpt: string;
  featuredImage: WpMedia | null;
}

export interface WpProductFieldsData {
  summary: string;
  introDescription: string;
  tagline: string;
  benefits: string[];
  videoUrl: string | null;
  specifications: WpProductSpecification[];
  applications: WpProductApplicationsData;
  cta: WpLink | null;
  relatedProductsOverride: WpProductCardData[];
  gallery: WpMedia[];
  raw: Record<string, unknown>;
}

export interface WpProductCategorySummaryData {
  id: string;
  databaseId: number | null;
  slug: string;
  uri: string;
  name: string;
  description: string;
  shortDescription: string;
  cardImage: WpMedia | null;
  cta: WpLink | null;
  isServiceCategory: boolean;
}

export interface WpProductData extends WpPageData {
  product: WpProductFieldsData;
  categories: WpProductCategorySummaryData[];
}

export interface WpProductCategoryData {
  id: string;
  databaseId: number | null;
  slug: string;
  uri: string;
  name: string;
  description: string;
  shortDescription: string;
  seo: WpSeo | null;
  intro: string;
  archiveIntro: string;
  heroImage: WpMedia | null;
  archiveHeroImage: WpMedia | null;
  cardImage: WpMedia | null;
  cta: WpLink | null;
  isServiceCategory: boolean;
  emptyStateHeading: string;
  emptyStateText: string;
  blocks: WpPageBlock[];
  products: WpProductCardData[];
}

export interface WpGlobalSettingsData {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  siteName: string;
  siteTagline: string;
  brandLogo: WpMedia | null;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappPhone: string;
  whatsappDefaultMessage: string;
  enableBackToTop: boolean;
  footerText: string;
  headerPrimaryLinks: WpLink[];
  footerLinks: WpLink[];
  socialLinks: WpLink[];
  promoModal: WpPromoModalData;
  menus: WpMenuData[];
  defaultSeo: WpSeo | null;
  options: Record<string, unknown>;
}

export type WpPreviewNodeType = "page" | "product" | "productCategory" | "unknown";

export interface WpPreviewNodeData {
  nodeType: WpPreviewNodeType;
  typeName: string;
  id: string;
  databaseId: number | null;
  slug: string;
  uri: string;
  status: string | null;
}
