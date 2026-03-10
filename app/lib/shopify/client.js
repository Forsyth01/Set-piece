/**
 * Shopify Storefront API GraphQL Client
 *
 * This client handles all GraphQL requests to the Shopify Storefront API.
 * It uses the public Storefront API access token for unauthenticated requests.
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Storefront API endpoint (using 2024-01 API version)
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

/**
 * Execute a GraphQL query against the Shopify Storefront API
 *
 * @param {Object} options - Query options
 * @param {string} options.query - GraphQL query string
 * @param {Object} options.variables - Query variables
 * @returns {Promise<Object>} - Query response data
 * @throws {Error} - If the API returns errors
 */
export async function shopifyFetch({ query, variables = {} }) {
  // Validate configuration
  if (!domain || !storefrontAccessToken) {
    throw new Error(
      'Missing Shopify configuration. Please set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in your .env.local file.'
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      // Disable caching during development for fresh data
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('Shopify API Error:', json.errors);
      throw new Error(json.errors[0]?.message || 'Unknown Shopify API error');
    }

    return json.data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

/**
 * Check if Shopify is properly configured
 * @returns {boolean}
 */
export function isShopifyConfigured() {
  return Boolean(domain && storefrontAccessToken);
}

/**
 * Get the Shopify store domain
 * @returns {string}
 */
export function getStoreDomain() {
  return domain;
}
