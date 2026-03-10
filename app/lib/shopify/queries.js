/**
 * Shopify Storefront API GraphQL Queries
 *
 * These queries fetch product and collection data from Shopify.
 */

// Reusable product fragment with all fields needed by the app
export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    tags
    createdAt
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
    options {
      name
      values
    }
  }
`;

/**
 * Fetch all products
 */
export const GET_ALL_PRODUCTS = `
  query GetAllProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/**
 * Fetch a single product by handle (URL slug)
 */
export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/**
 * Fetch a collection by handle with its products
 */
export const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/**
 * Fetch all collections (for navigation/sidebar)
 */
export const GET_ALL_COLLECTIONS = `
  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 4) {
            edges {
              node {
                id
                featuredImage {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Search products by query string
 */
export const SEARCH_PRODUCTS = `
  query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/**
 * Fetch products with pagination
 */
export const GET_PRODUCTS_PAGINATED = `
  query GetProductsPaginated($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/**
 * Fetch recommended products (products from same collection or with similar tags)
 */
export const GET_PRODUCT_RECOMMENDATIONS = `
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;
