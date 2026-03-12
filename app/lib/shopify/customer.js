/**
 * Shopify Customer API
 *
 * Handles customer authentication, registration, and order history
 * using the Shopify Storefront API.
 */

import { shopifyFetch } from './client';

// ============================================
// GRAPHQL MUTATIONS & QUERIES
// ============================================

/**
 * Create a new customer account
 */
const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Login - Create customer access token
 */
const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Logout - Delete customer access token
 */
const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Renew customer access token (extend expiry)
 */
const CUSTOMER_ACCESS_TOKEN_RENEW_MUTATION = `
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Get customer info including orders
 */
const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
      defaultAddress {
        id
        address1
        address2
        city
        province
        country
        zip
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
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
 * Password recovery - send reset email
 */
const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Reset password with token
 */
const CUSTOMER_RESET_MUTATION = `
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer {
        id
        email
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Activate customer account with token
 */
const CUSTOMER_ACTIVATE_MUTATION = `
  mutation customerActivate($id: ID!, $input: CustomerActivateInput!) {
    customerActivate(id: $id, input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Update customer info
 */
const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Register a new customer
 * @param {Object} params - Customer registration data
 * @param {string} params.email - Customer email
 * @param {string} params.password - Customer password
 * @param {string} params.firstName - Customer first name
 * @param {string} params.lastName - Customer last name
 * @param {boolean} params.acceptsMarketing - Marketing opt-in
 * @returns {Promise<Object>} - Created customer or errors
 */
export async function registerCustomer({ email, password, firstName, lastName, acceptsMarketing = false }) {
  const data = await shopifyFetch({
    query: CUSTOMER_CREATE_MUTATION,
    variables: {
      input: {
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing,
      },
    },
  });

  const { customer, customerUserErrors } = data.customerCreate;

  if (customerUserErrors?.length > 0) {
    return {
      success: false,
      errors: customerUserErrors.map(e => e.message),
      errorCode: customerUserErrors[0]?.code,
    };
  }

  return {
    success: true,
    customer,
  };
}

/**
 * Login customer and get access token
 * @param {string} email - Customer email
 * @param {string} password - Customer password
 * @returns {Promise<Object>} - Access token or errors
 */
export async function loginCustomer(email, password) {
  const data = await shopifyFetch({
    query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  const { customerAccessToken, customerUserErrors } = data.customerAccessTokenCreate;

  if (customerUserErrors?.length > 0) {
    return {
      success: false,
      errors: customerUserErrors.map(e => e.message),
      errorCode: customerUserErrors[0]?.code,
    };
  }

  return {
    success: true,
    accessToken: customerAccessToken.accessToken,
    expiresAt: customerAccessToken.expiresAt,
  };
}

/**
 * Logout customer by deleting access token
 * @param {string} accessToken - Customer access token
 * @returns {Promise<Object>} - Success status
 */
export async function logoutCustomer(accessToken) {
  try {
    const data = await shopifyFetch({
      query: CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
      variables: {
        customerAccessToken: accessToken,
      },
    });

    return {
      success: true,
      deletedToken: data.customerAccessTokenDelete.deletedAccessToken,
    };
  } catch (error) {
    // Even if delete fails, we'll clear local storage
    return {
      success: true,
      deletedToken: null,
    };
  }
}

/**
 * Renew customer access token
 * @param {string} accessToken - Current access token
 * @returns {Promise<Object>} - New access token or errors
 */
export async function renewAccessToken(accessToken) {
  const data = await shopifyFetch({
    query: CUSTOMER_ACCESS_TOKEN_RENEW_MUTATION,
    variables: {
      customerAccessToken: accessToken,
    },
  });

  const { customerAccessToken, userErrors } = data.customerAccessTokenRenew;

  if (userErrors?.length > 0) {
    return {
      success: false,
      errors: userErrors.map(e => e.message),
    };
  }

  return {
    success: true,
    accessToken: customerAccessToken.accessToken,
    expiresAt: customerAccessToken.expiresAt,
  };
}

/**
 * Get customer info including orders
 * @param {string} accessToken - Customer access token
 * @returns {Promise<Object>} - Customer data with orders
 */
export async function getCustomer(accessToken) {
  try {
    const data = await shopifyFetch({
      query: CUSTOMER_QUERY,
      variables: {
        customerAccessToken: accessToken,
      },
    });

    if (!data.customer) {
      return {
        success: false,
        errors: ['Session expired. Please log in again.'],
      };
    }

    // Transform orders data
    const orders = data.customer.orders.edges.map(({ node }) => ({
      id: node.id,
      orderNumber: node.orderNumber,
      name: node.name,
      processedAt: node.processedAt,
      financialStatus: node.financialStatus,
      fulfillmentStatus: node.fulfillmentStatus,
      totalPrice: parseFloat(node.totalPrice.amount),
      currencyCode: node.totalPrice.currencyCode,
      lineItems: node.lineItems.edges.map(({ node: item }) => ({
        title: item.title,
        quantity: item.quantity,
        image: item.variant?.image?.url,
        price: item.variant?.price ? parseFloat(item.variant.price.amount) : 0,
        options: item.variant?.selectedOptions || [],
      })),
    }));

    return {
      success: true,
      customer: {
        id: data.customer.id,
        email: data.customer.email,
        firstName: data.customer.firstName,
        lastName: data.customer.lastName,
        phone: data.customer.phone,
        acceptsMarketing: data.customer.acceptsMarketing,
        defaultAddress: data.customer.defaultAddress,
        orders,
      },
    };
  } catch (error) {
    return {
      success: false,
      errors: [error.message || 'Failed to fetch customer data'],
    };
  }
}

/**
 * Send password recovery email
 * @param {string} email - Customer email
 * @returns {Promise<Object>} - Success status
 */
export async function recoverPassword(email) {
  const data = await shopifyFetch({
    query: CUSTOMER_RECOVER_MUTATION,
    variables: {
      email,
    },
  });

  const { customerUserErrors } = data.customerRecover;

  if (customerUserErrors?.length > 0) {
    return {
      success: false,
      errors: customerUserErrors.map(e => e.message),
    };
  }

  return {
    success: true,
  };
}

/**
 * Activate customer account with activation token
 * @param {string} customerId - Customer ID (gid://shopify/Customer/...)
 * @param {string} activationToken - Activation token from email
 * @param {string} password - New password for the account
 * @returns {Promise<Object>} - Customer and access token or errors
 */
export async function activateCustomer(customerId, activationToken, password) {
  try {
    const data = await shopifyFetch({
      query: CUSTOMER_ACTIVATE_MUTATION,
      variables: {
        id: customerId,
        input: {
          activationToken,
          password,
        },
      },
    });

    const { customer, customerAccessToken, customerUserErrors } = data.customerActivate;

    if (customerUserErrors?.length > 0) {
      return {
        success: false,
        errors: customerUserErrors.map(e => e.message),
        errorCode: customerUserErrors[0]?.code,
      };
    }

    return {
      success: true,
      customer,
      accessToken: customerAccessToken.accessToken,
      expiresAt: customerAccessToken.expiresAt,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error.message || 'Failed to activate account'],
    };
  }
}

/**
 * Update customer information
 * @param {string} accessToken - Customer access token
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated customer or errors
 */
export async function updateCustomer(accessToken, updates) {
  const data = await shopifyFetch({
    query: CUSTOMER_UPDATE_MUTATION,
    variables: {
      customerAccessToken: accessToken,
      customer: updates,
    },
  });

  const { customer, customerUserErrors } = data.customerUpdate;

  if (customerUserErrors?.length > 0) {
    return {
      success: false,
      errors: customerUserErrors.map(e => e.message),
    };
  }

  return {
    success: true,
    customer,
  };
}
