/**
 * Shopify Storefront API Service
 *
 * High-level API functions that combine GraphQL queries/mutations
 * with data transformers for a clean interface.
 */

import { shopifyFetch, isShopifyConfigured } from './client';
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_COLLECTION_BY_HANDLE,
  GET_ALL_COLLECTIONS,
  SEARCH_PRODUCTS,
  GET_PRODUCT_RECOMMENDATIONS,
} from './queries';
import {
  CREATE_CART,
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART_LINES,
  REMOVE_FROM_CART,
} from './cart';
import {
  transformProduct,
  transformCollection,
  transformCart,
  transformCollectionList,
} from './transformers';

// ============================================
// PRODUCTS
// ============================================

/**
 * Fetch all products
 * @param {number} first - Number of products to fetch (default: 100)
 * @returns {Promise<Array>} - Array of transformed products
 */
export async function getAllProducts(first = 100) {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured, returning empty products');
    return [];
  }

  const data = await shopifyFetch({
    query: GET_ALL_PRODUCTS,
    variables: { first },
  });

  return data.products.edges.map((edge) => transformProduct(edge.node));
}

/**
 * Fetch a single product by handle
 * @param {string} handle - Product handle (URL slug)
 * @returns {Promise<Object|null>} - Transformed product or null
 */
export async function getProductByHandle(handle) {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured');
    return null;
  }

  const data = await shopifyFetch({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle },
  });

  return transformProduct(data.product);
}

/**
 * Get product recommendations
 * @param {string} productId - Shopify product GID
 * @returns {Promise<Array>} - Array of recommended products
 */
export async function getProductRecommendations(productId) {
  if (!isShopifyConfigured()) {
    return [];
  }

  try {
    const data = await shopifyFetch({
      query: GET_PRODUCT_RECOMMENDATIONS,
      variables: { productId },
    });

    return (data.productRecommendations || []).map(transformProduct);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

// ============================================
// COLLECTIONS
// ============================================

/**
 * Fetch a collection by handle with products
 * @param {string} handle - Collection handle
 * @param {number} first - Number of products to fetch (default: 100)
 * @returns {Promise<Object|null>} - Transformed collection or null
 */
export async function getCollectionByHandle(handle, first = 100) {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured');
    return null;
  }

  const data = await shopifyFetch({
    query: GET_COLLECTION_BY_HANDLE,
    variables: { handle, first },
  });

  return transformCollection(data.collection);
}

/**
 * Fetch all collections
 * @param {number} first - Number of collections to fetch (default: 50)
 * @returns {Promise<Array>} - Array of collection objects
 */
export async function getAllCollections(first = 50) {
  if (!isShopifyConfigured()) {
    console.warn('Shopify not configured');
    return [];
  }

  const data = await shopifyFetch({
    query: GET_ALL_COLLECTIONS,
    variables: { first },
  });

  return transformCollectionList(data.collections.edges);
}

// ============================================
// SEARCH
// ============================================

/**
 * Search products by query
 * @param {string} query - Search query
 * @param {number} first - Number of results (default: 50)
 * @returns {Promise<Array>} - Array of matching products
 */
export async function searchProducts(query, first = 50) {
  if (!isShopifyConfigured() || !query) {
    return [];
  }

  const data = await shopifyFetch({
    query: SEARCH_PRODUCTS,
    variables: { query, first },
  });

  return data.products.edges.map((edge) => transformProduct(edge.node));
}

// ============================================
// CART
// ============================================

/**
 * Create a new cart
 * @param {Array} lines - Optional initial cart lines
 * @returns {Promise<Object>} - Transformed cart
 */
export async function createCart(lines = []) {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured');
  }

  const data = await shopifyFetch({
    query: CREATE_CART,
    variables: { lines: lines.length > 0 ? lines : null },
  });

  if (data.cartCreate.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return transformCart(data.cartCreate.cart);
}

/**
 * Get an existing cart by ID
 * @param {string} cartId - Shopify cart ID
 * @returns {Promise<Object|null>} - Transformed cart or null
 */
export async function getCart(cartId) {
  if (!isShopifyConfigured() || !cartId) {
    return null;
  }

  try {
    const data = await shopifyFetch({
      query: GET_CART,
      variables: { cartId },
    });

    return transformCart(data.cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

/**
 * Add item(s) to cart
 * @param {string} cartId - Shopify cart ID
 * @param {string} variantId - Product variant ID to add
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Promise<Object>} - Updated transformed cart
 */
export async function addToCart(cartId, variantId, quantity = 1) {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured');
  }

  const data = await shopifyFetch({
    query: ADD_TO_CART,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  if (data.cartLinesAdd.userErrors?.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return transformCart(data.cartLinesAdd.cart);
}

/**
 * Update cart line quantity
 * @param {string} cartId - Shopify cart ID
 * @param {string} lineId - Cart line ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} - Updated transformed cart
 */
export async function updateCartLine(cartId, lineId, quantity) {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured');
  }

  const data = await shopifyFetch({
    query: UPDATE_CART_LINES,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });

  if (data.cartLinesUpdate.userErrors?.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return transformCart(data.cartLinesUpdate.cart);
}

/**
 * Remove item(s) from cart
 * @param {string} cartId - Shopify cart ID
 * @param {string|Array} lineIds - Cart line ID(s) to remove
 * @returns {Promise<Object>} - Updated transformed cart
 */
export async function removeFromCart(cartId, lineIds) {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured');
  }

  const data = await shopifyFetch({
    query: REMOVE_FROM_CART,
    variables: {
      cartId,
      lineIds: Array.isArray(lineIds) ? lineIds : [lineIds],
    },
  });

  if (data.cartLinesRemove.userErrors?.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return transformCart(data.cartLinesRemove.cart);
}

// ============================================
// UTILITY EXPORTS
// ============================================

export { isShopifyConfigured } from './client';
