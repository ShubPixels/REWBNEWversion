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

export const PAGE_BLOCKS_FRAGMENT = /* GraphQL */ `
pageBuilder {
  blocks {
    __typename
    ... on AcfFieldGroup {
      fieldGroupName
    }
  }
}
`;

export const PRODUCT_FIELDS_FRAGMENT = /* GraphQL */ `
productFields {
  summary
  tagline
  benefits
  videoUrl
  specifications {
    label
    value
  }
  applications
  gallery {
    nodes {
      ...MediaFields
    }
  }
}
`;

export const TAXONOMY_FIELDS_FRAGMENT = /* GraphQL */ `
taxonomyFields {
  intro
  heroImage {
    ...MediaFields
  }
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
