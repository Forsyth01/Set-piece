/**
 * Data Transformers for Shopify Storefront API
 *
 * These functions transform Shopify's GraphQL response format
 * into the format expected by our app components.
 */

/**
 * Check if a date is within a certain number of days from now
 * @param {string} dateString - ISO date string
 * @param {number} days - Number of days
 * @returns {boolean}
 */
function isWithinDays(dateString, days) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
}

/**
 * Transform a Shopify variant to app format
 * @param {Object} variant - Shopify variant object
 * @returns {Object} - Transformed variant
 */
export function transformVariant(variant) {
  if (!variant) return null;

  const sizeOption = variant.selectedOptions?.find(
    (o) => o.name.toLowerCase() === 'size'
  );

  return {
    id: variant.id,
    title: variant.title,
    size: sizeOption?.value || variant.title,
    price: parseFloat(variant.price?.amount || 0),
    compareAtPrice: variant.compareAtPrice
      ? parseFloat(variant.compareAtPrice.amount)
      : null,
    availableForSale: variant.availableForSale,
    selectedOptions: variant.selectedOptions,
  };
}

/**
 * Transform a Shopify product to app format
 * @param {Object} shopifyProduct - Shopify product object from GraphQL
 * @returns {Object|null} - Transformed product matching app's expected format
 */
export function transformProduct(shopifyProduct) {
  if (!shopifyProduct) return null;

  // Extract variants
  const variants = shopifyProduct.variants?.edges?.map((e) =>
    transformVariant(e.node)
  ) || [];

  // Extract sizes from options
  const sizeOption = shopifyProduct.options?.find(
    (o) => o.name.toLowerCase() === 'size'
  );
  const sizes = sizeOption?.values || [];

  // Check if product is new (has "new" tag or created within 30 days)
  const hasNewTag = shopifyProduct.tags?.some(
    (tag) => tag.toLowerCase() === 'new'
  );
  const isNew = hasNewTag || isWithinDays(shopifyProduct.createdAt, 30);

  // Extract prices
  const price = parseFloat(
    shopifyProduct.priceRange?.minVariantPrice?.amount || 0
  );
  const compareAtPriceAmount = parseFloat(
    shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount || 0
  );
  const compareAtPrice = compareAtPriceAmount > price ? compareAtPriceAmount : null;

  // Extract images
  const images = shopifyProduct.images?.edges?.map((e) => ({
    url: e.node.url,
    altText: e.node.altText,
  })) || [];

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description || '',
    image: shopifyProduct.featuredImage?.url || '/placeholder.jpg',
    images: images,
    price: price,
    compareAtPrice: compareAtPrice,
    isNew: isNew,
    sizes: sizes,
    variants: variants,
    inStock: variants.some((v) => v.availableForSale),
    tags: shopifyProduct.tags || [],
  };
}

/**
 * Transform a Shopify collection to app format
 * @param {Object} shopifyCollection - Shopify collection object from GraphQL
 * @returns {Object|null} - Transformed collection
 */
export function transformCollection(shopifyCollection) {
  if (!shopifyCollection) return null;

  return {
    id: shopifyCollection.id,
    title: shopifyCollection.title,
    handle: shopifyCollection.handle,
    description: shopifyCollection.description || '',
    image: shopifyCollection.image?.url || null,
    products:
      shopifyCollection.products?.edges?.map((e) =>
        transformProduct(e.node)
      ) || [],
  };
}

/**
 * Transform a Shopify cart to app format
 * @param {Object} shopifyCart - Shopify cart object from GraphQL
 * @returns {Object} - Transformed cart
 */
export function transformCart(shopifyCart) {
  if (!shopifyCart) {
    return {
      id: null,
      items: [],
      checkoutUrl: null,
      subtotal: 0,
      total: 0,
      totalQuantity: 0,
    };
  }

  const items =
    shopifyCart.lines?.edges?.map((edge) => {
      const line = edge.node;
      const variant = line.merchandise;
      const sizeOption = variant.selectedOptions?.find(
        (o) => o.name.toLowerCase() === 'size'
      );

      return {
        lineId: line.id,
        variantId: variant.id,
        id: variant.product.id,
        handle: variant.product.handle,
        title: variant.product.title,
        image: variant.product.featuredImage?.url || '/placeholder.jpg',
        price: parseFloat(variant.price?.amount || 0),
        compareAtPrice: variant.compareAtPrice
          ? parseFloat(variant.compareAtPrice.amount)
          : null,
        size: sizeOption?.value || variant.title,
        quantity: line.quantity || 1,
      };
    }) || [];

  return {
    id: shopifyCart.id,
    items: items,
    checkoutUrl: shopifyCart.checkoutUrl,
    subtotal: parseFloat(shopifyCart.cost?.subtotalAmount?.amount || 0),
    total: parseFloat(shopifyCart.cost?.totalAmount?.amount || 0),
    tax: parseFloat(shopifyCart.cost?.totalTaxAmount?.amount || 0),
    totalQuantity: shopifyCart.totalQuantity || 0,
  };
}

/**
 * Transform collection list for navigation/sidebar
 * @param {Array} collections - Array of Shopify collection edges
 * @returns {Array} - Simplified collection list
 */
export function transformCollectionList(collections) {
  if (!collections) return [];

  return collections.map((edge) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
    image: edge.node.image?.url || null,
    productCount: edge.node.products?.edges?.length || 0,
  }));
}
