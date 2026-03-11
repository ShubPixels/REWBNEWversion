export const MEDIA_FRAGMENT = /* GraphQL */ `
fragment MediaFields on MediaItem {
  id
  databaseId
  sourceUrl
  altText
  title
  caption
  mediaDetails {
    width
    height
  }
}
`;

export const LINK_FIELDS_FRAGMENT = /* GraphQL */ `
title
url
target
`;

export const SEO_FIELDS_FRAGMENT = /* GraphQL */ `
seoFields {
  metaTitle
  metaDescription
  canonicalUrl
  noindex
  nofollow
  openGraphTitle
  openGraphDescription
  openGraphImage {
    ...MediaFields
  }
}
`;

export const HERO_SHOWCASE_BLOCK_FRAGMENT = /* GraphQL */ `
fragment HeroShowcaseBlockFields on Page_Pagebuilder_Blocks_HeroShowcase {
  acfFcLayout
  eyebrow
  title
  description
  align
  backgroundImage {
    ...MediaFields
  }
  primaryCta {
    ${LINK_FIELDS_FRAGMENT}
  }
  secondaryCta {
    ${LINK_FIELDS_FRAGMENT}
  }
}
`;

export const STATS_BAND_BLOCK_FRAGMENT = /* GraphQL */ `
fragment StatsBandBlockFields on Page_Pagebuilder_Blocks_StatsBand {
  acfFcLayout
  eyebrow
  title
  description
  stats {
    label
    value
    prefix
    suffix
  }
}
`;

export const LOGO_MARQUEE_BLOCK_FRAGMENT = /* GraphQL */ `
fragment LogoMarqueeBlockFields on Page_Pagebuilder_Blocks_LogoMarquee {
  acfFcLayout
  title
  logos {
    name
    logo {
      ...MediaFields
    }
    link {
      ${LINK_FIELDS_FRAGMENT}
    }
  }
}
`;

export const CATEGORY_CARDS_GRID_BLOCK_FRAGMENT = /* GraphQL */ `
fragment CategoryCardsGridBlockFields on Page_Pagebuilder_Blocks_CategoryCardsGrid {
  acfFcLayout
  title
  description
  cards {
    title
    description
    image {
      ...MediaFields
    }
    link {
      ${LINK_FIELDS_FRAGMENT}
    }
  }
}
`;

export const SPLIT_CONTENT_MEDIA_BLOCK_FRAGMENT = /* GraphQL */ `
fragment SplitContentMediaBlockFields on Page_Pagebuilder_Blocks_SplitContentMedia {
  acfFcLayout
  eyebrow
  title
  description
  body
  media {
    ...MediaFields
  }
  cta {
    ${LINK_FIELDS_FRAGMENT}
  }
  reverse
}
`;

export const FEATURE_CARDS_GRID_BLOCK_FRAGMENT = /* GraphQL */ `
fragment FeatureCardsGridBlockFields on Page_Pagebuilder_Blocks_FeatureCardsGrid {
  acfFcLayout
  title
  description
  cards {
    title
    description
    icon
    image {
      ...MediaFields
    }
  }
}
`;

export const SERVICE_ROWS_ALTERNATING_BLOCK_FRAGMENT = /* GraphQL */ `
fragment ServiceRowsAlternatingBlockFields on Page_Pagebuilder_Blocks_ServiceRowsAlternating {
  acfFcLayout
  title
  rows {
    title
    description
    image {
      ...MediaFields
    }
    cta {
      ${LINK_FIELDS_FRAGMENT}
    }
  }
}
`;

export const AWARDS_GRID_BLOCK_FRAGMENT = /* GraphQL */ `
fragment AwardsGridBlockFields on Page_Pagebuilder_Blocks_AwardsGrid {
  acfFcLayout
  title
  awards {
    title
    subtitle
    year
    image {
      ...MediaFields
    }
  }
}
`;

export const TESTIMONIALS_SLIDER_BLOCK_FRAGMENT = /* GraphQL */ `
fragment TestimonialsSliderBlockFields on Page_Pagebuilder_Blocks_TestimonialsSlider {
  acfFcLayout
  title
  autoplayMs
  testimonials {
    quote
    author
    role
    company
    avatar {
      ...MediaFields
    }
  }
}
`;

export const CONTACT_FORM_SPLIT_BLOCK_FRAGMENT = /* GraphQL */ `
fragment ContactFormSplitBlockFields on Page_Pagebuilder_Blocks_ContactFormSplit {
  acfFcLayout
  title
  description
  formTitle
  submitLabel
  submitPendingLabel
  successMessage
  errorMessage
  categoryPlaceholder
  termsLabel
  categories
  labels {
    name
    email
    phone
    company
    category
    message
  }
  sidebar {
    title
    phoneLabel
    emailLabel
    addressLabel
    mapButtonLabel
  }
  contactEmail
  contactPhone
  contactAddress
  mapLink {
    ${LINK_FIELDS_FRAGMENT}
  }
}
`;

export const PAGE_INTRO_BLOCK_FRAGMENT = /* GraphQL */ `
fragment PageIntroBlockFields on Page_Pagebuilder_Blocks_PageIntro {
  acfFcLayout
  eyebrow
  title
  description
}
`;

export const CTA_BANNER_BLOCK_FRAGMENT = /* GraphQL */ `
fragment CtaBannerBlockFields on Page_Pagebuilder_Blocks_CtaBanner {
  acfFcLayout
  title
  description
  tone
  primaryCta {
    ${LINK_FIELDS_FRAGMENT}
  }
  secondaryCta {
    ${LINK_FIELDS_FRAGMENT}
  }
}
`;

export const PAGE_BLOCK_FRAGMENT_DEFINITIONS = /* GraphQL */ `
${HERO_SHOWCASE_BLOCK_FRAGMENT}
${STATS_BAND_BLOCK_FRAGMENT}
${LOGO_MARQUEE_BLOCK_FRAGMENT}
${CATEGORY_CARDS_GRID_BLOCK_FRAGMENT}
${SPLIT_CONTENT_MEDIA_BLOCK_FRAGMENT}
${FEATURE_CARDS_GRID_BLOCK_FRAGMENT}
${SERVICE_ROWS_ALTERNATING_BLOCK_FRAGMENT}
${AWARDS_GRID_BLOCK_FRAGMENT}
${TESTIMONIALS_SLIDER_BLOCK_FRAGMENT}
${CONTACT_FORM_SPLIT_BLOCK_FRAGMENT}
${PAGE_INTRO_BLOCK_FRAGMENT}
${CTA_BANNER_BLOCK_FRAGMENT}
`;

export const PAGE_BLOCKS_FRAGMENT = /* GraphQL */ `
pageBuilder {
  blocks {
    __typename
    ... on AcfFieldGroup {
      fieldGroupName
    }
    ...HeroShowcaseBlockFields
    ...StatsBandBlockFields
    ...LogoMarqueeBlockFields
    ...CategoryCardsGridBlockFields
    ...SplitContentMediaBlockFields
    ...FeatureCardsGridBlockFields
    ...ServiceRowsAlternatingBlockFields
    ...AwardsGridBlockFields
    ...TestimonialsSliderBlockFields
    ...ContactFormSplitBlockFields
    ...PageIntroBlockFields
    ...CtaBannerBlockFields
  }
}
`;

export const PRODUCT_FIELDS_FRAGMENT = /* GraphQL */ `
productFields {
  summary
  introDescription
  intro
  description
  tagline
  benefits
  videoUrl
  applicationMaterials
  applicationIndustries
  specifications {
    label
    value
  }
  applications
  cta {
    ${LINK_FIELDS_FRAGMENT}
  }
  ctaLabel
  ctaUrl
  ctaTarget
  gallery {
    nodes {
      ...MediaFields
    }
  }
  relatedProducts {
    nodes {
      id
      slug
      uri
      title
      excerpt
      featuredImage {
        node {
          ...MediaFields
        }
      }
    }
  }
}
`;

export const TAXONOMY_FIELDS_FRAGMENT = /* GraphQL */ `
taxonomyFields {
  shortDescription
  cardImage {
    ...MediaFields
  }
  intro
  archiveIntro
  archiveHeroImage {
    ...MediaFields
  }
  heroImage {
    ...MediaFields
  }
  cta {
    ${LINK_FIELDS_FRAGMENT}
  }
  ctaLabel
  ctaUrl
  ctaTarget
  isServiceCategory
  emptyStateHeading
  emptyStateText
  blocks {
    __typename
    ... on AcfFieldGroup {
      fieldGroupName
    }
  }
}
`;

export const GLOBAL_OPTIONS_FRAGMENT = /* GraphQL */ `
globalOptions {
  siteName
  siteTagline
  brandLogo {
    ...MediaFields
  }
  contactEmail
  contactPhone
  contactAddress
  whatsappPhone
  whatsappDefaultMessage
  enableBackToTop
  footerText
  headerPrimaryLinks {
    ${LINK_FIELDS_FRAGMENT}
  }
  footerLinks {
    ${LINK_FIELDS_FRAGMENT}
  }
  socialLinks {
    ${LINK_FIELDS_FRAGMENT}
  }
  promoModal {
    enabled
    delayMs
    autoRotateMs
    slides {
      heading
      description
      image {
        ...MediaFields
      }
      cta {
        ${LINK_FIELDS_FRAGMENT}
      }
    }
  }
  defaultSeo {
    metaTitle
    metaDescription
    canonicalUrl
    noindex
    nofollow
    openGraphTitle
    openGraphDescription
    openGraphImage {
      ...MediaFields
    }
  }
}
`;

export const MENU_ITEM_FIELDS_FRAGMENT = /* GraphQL */ `
id
databaseId
parentDatabaseId
label
url
path
target
cssClasses
`;
