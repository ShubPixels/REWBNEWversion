import {
  GLOBAL_OPTIONS_FRAGMENT,
  MEDIA_FRAGMENT,
  MENU_ITEM_FIELDS_FRAGMENT,
  PAGE_BLOCKS_FRAGMENT,
  PRODUCT_FIELDS_FRAGMENT,
  SEO_FIELDS_FRAGMENT,
  TAXONOMY_FIELDS_FRAGMENT,
} from "@/lib/wp/fragments";

const PAGE_CORE_FIELDS = /* GraphQL */ `
id
databaseId
uri
slug
title
excerpt
content
featuredImage {
  node {
    ...MediaFields
  }
}
${SEO_FIELDS_FRAGMENT}
${PAGE_BLOCKS_FRAGMENT}
`;

const PRODUCT_CATEGORY_SUMMARY_FIELDS = /* GraphQL */ `
id
databaseId
slug
uri
name
description
`;

const PRODUCT_CORE_FIELDS = /* GraphQL */ `
${PAGE_CORE_FIELDS}
${PRODUCT_FIELDS_FRAGMENT}
productCategories {
  nodes {
    ${PRODUCT_CATEGORY_SUMMARY_FIELDS}
  }
}
`;

export const GET_GLOBAL_SETTINGS_QUERY = /* GraphQL */ `
query GetGlobalSettings {
  generalSettings {
    title
    description
    url
  }
  globalSettings {
    ${GLOBAL_OPTIONS_FRAGMENT}
  }
}
${MEDIA_FRAGMENT}
`;

export const GET_MENUS_QUERY = /* GraphQL */ `
query GetMenus {
  menus(first: 20) {
    nodes {
      id
      databaseId
      name
      slug
      menuItems(first: 500) {
        nodes {
          ${MENU_ITEM_FIELDS_FRAGMENT}
        }
      }
    }
  }
}
`;

export const GET_PAGE_BY_URI_QUERY = /* GraphQL */ `
query GetPageByUri($uri: String!) {
  nodeByUri(uri: $uri) {
    __typename
    ... on Page {
      ${PAGE_CORE_FIELDS}
    }
  }
}
${MEDIA_FRAGMENT}
`;

export const GET_HOMEPAGE_QUERY = /* GraphQL */ `
query GetHomepage {
  homepage: pageBy(uri: "/") {
    ${PAGE_CORE_FIELDS}
  }
}
${MEDIA_FRAGMENT}
`;

export const GET_PRODUCT_BY_SLUG_QUERY = /* GraphQL */ `
query GetProductBySlug($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    ${PRODUCT_CORE_FIELDS}
  }
}
${MEDIA_FRAGMENT}
`;

export const GET_PRODUCT_CATEGORY_BY_SLUG_QUERY = /* GraphQL */ `
query GetProductCategoryBySlug($slug: ID!) {
  productCategory(id: $slug, idType: SLUG) {
    ${PRODUCT_CATEGORY_SUMMARY_FIELDS}
    ${SEO_FIELDS_FRAGMENT}
    ${TAXONOMY_FIELDS_FRAGMENT}
    products(first: 24) {
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
}
${MEDIA_FRAGMENT}
`;

export const GET_PRODUCT_CATEGORIES_QUERY = /* GraphQL */ `
query GetProductCategories {
  productCategories(first: 100) {
    nodes {
      ${PRODUCT_CATEGORY_SUMMARY_FIELDS}
    }
  }
}
`;

export const GET_PRODUCT_RELATED_OVERRIDE_QUERY = /* GraphQL */ `
query GetProductRelatedOverride($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    id
    productFields {
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
  }
}
${MEDIA_FRAGMENT}
`;

export const GET_PREVIEW_NODE_QUERY = /* GraphQL */ `
query GetPreviewNode($id: ID!, $idType: ContentNodeIdTypeEnum = DATABASE_ID) {
  contentNode(id: $id, idType: $idType, asPreview: true) {
    __typename
    ... on Node {
      id
      databaseId
    }
    ... on NodeWithUri {
      uri
      slug
    }
    ... on Page {
      status
      ${PAGE_CORE_FIELDS}
    }
    ... on Product {
      status
      ${PRODUCT_CORE_FIELDS}
    }
    ... on ProductCategory {
      status
      ${PRODUCT_CATEGORY_SUMMARY_FIELDS}
      ${SEO_FIELDS_FRAGMENT}
      ${TAXONOMY_FIELDS_FRAGMENT}
      products(first: 24) {
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
  }
}
${MEDIA_FRAGMENT}
`;
