"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import * as shopifyApi from "@/app/lib/shopify/api";

const CartContext = createContext();

// Local storage key for Shopify cart ID
const CART_ID_KEY = "shopify_cart_id";

export function CartProvider({ children }) {
  // Cart state - items array for backwards compatibility
  const [cart, setCart] = useState([]);
  // Full cart data from Shopify
  const [cartData, setCartData] = useState({
    id: null,
    items: [],
    checkoutUrl: null,
    subtotal: 0,
    total: 0,
  });
  // Cart ID stored separately for persistence
  const [cartId, setCartId] = useState(null);
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(false);
  // Initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  // Toast ref to prevent duplicates
  const toastIdRef = useRef(null);

  // Initialize cart on mount
  useEffect(() => {
    async function initializeCart() {
      // Check for existing cart ID in localStorage
      const savedCartId = localStorage.getItem(CART_ID_KEY);

      if (savedCartId) {
        try {
          // Try to fetch existing cart
          const existingCart = await shopifyApi.getCart(savedCartId);

          if (existingCart && existingCart.id) {
            setCartData(existingCart);
            setCart(existingCart.items);
            setCartId(savedCartId);
          } else {
            // Cart expired or invalid, create new one
            await createNewCart();
          }
        } catch (error) {
          console.error("Error loading existing cart:", error);
          await createNewCart();
        }
      } else {
        // No saved cart, create new one
        await createNewCart();
      }

      setIsInitialized(true);
    }

    async function createNewCart() {
      try {
        const newCart = await shopifyApi.createCart();
        setCartData(newCart);
        setCart(newCart.items);
        setCartId(newCart.id);
        localStorage.setItem(CART_ID_KEY, newCart.id);
      } catch (error) {
        console.error("Error creating cart:", error);
        // If Shopify is not configured, fall back to local-only cart
        setIsInitialized(true);
      }
    }

    initializeCart();
  }, []);

  // Helper to show toast without duplicates
  const showToast = useCallback((message, type = "success", icon) => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
    toastIdRef.current = toast[type](message, {
      icon: icon,
      id: `cart-toast-${Date.now()}`,
    });
  }, []);

  // Add item to cart
  const addToCart = useCallback(
    async (product, selectedSize, quantity = 1) => {
      if (!cartId) {
        showToast("Cart not initialized", "error", "❌");
        return;
      }

      if (isLoading) return;

      setIsLoading(true);

      try {
        // Find the variant ID for the selected size
        const variant = product.variants?.find((v) => v.size === selectedSize);

        if (!variant) {
          showToast(`Size ${selectedSize} not available`, "error", "❌");
          setIsLoading(false);
          return;
        }

        const updatedCart = await shopifyApi.addToCart(cartId, variant.id, quantity);
        setCartData(updatedCart);
        setCart(updatedCart.items);

        const qtyText = quantity > 1 ? ` (x${quantity})` : "";
        showToast(
          `${product.title} (${selectedSize})${qtyText} added to cart`,
          "success",
          "✅"
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
        showToast("Failed to add item to cart", "error", "❌");
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, isLoading, showToast]
  );

  // Remove item from cart - now uses lineId
  const removeFromCart = useCallback(
    async (lineIdOrProductId, size) => {
      if (!cartId || isLoading) return;

      // Find the item - support both old (id + size) and new (lineId) formats
      let itemToRemove;
      let lineId;

      // Check if it's a Shopify line ID (starts with 'gid://')
      if (
        typeof lineIdOrProductId === "string" &&
        lineIdOrProductId.startsWith("gid://")
      ) {
        lineId = lineIdOrProductId;
        itemToRemove = cart.find((item) => item.lineId === lineId);
      } else {
        // Old format: product id + size
        itemToRemove = cart.find(
          (item) => item.id === lineIdOrProductId && item.size === size
        );
        lineId = itemToRemove?.lineId;
      }

      if (!lineId) {
        console.error("Could not find line ID for removal");
        return;
      }

      setIsLoading(true);

      try {
        const updatedCart = await shopifyApi.removeFromCart(cartId, lineId);
        setCartData(updatedCart);
        setCart(updatedCart.items);

        if (itemToRemove) {
          showToast(`${itemToRemove.title} removed from cart`, "error", "🗑️");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
        showToast("Failed to remove item", "error", "❌");
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, cart, isLoading, showToast]
  );

  // Update quantity - now uses lineId
  const updateQuantity = useCallback(
    async (lineIdOrProductId, sizeOrNewQuantity, newQuantityParam) => {
      if (!cartId || isLoading) return;

      // Support both old (id, size, quantity) and new (lineId, quantity) formats
      let lineId;
      let newQuantity;
      let item;

      if (
        typeof lineIdOrProductId === "string" &&
        lineIdOrProductId.startsWith("gid://")
      ) {
        // New format: lineId, quantity
        lineId = lineIdOrProductId;
        newQuantity = sizeOrNewQuantity;
        item = cart.find((i) => i.lineId === lineId);
      } else {
        // Old format: productId, size, quantity
        const size = sizeOrNewQuantity;
        newQuantity = newQuantityParam;
        item = cart.find(
          (i) => i.id === lineIdOrProductId && i.size === size
        );
        lineId = item?.lineId;
      }

      if (!lineId) {
        console.error("Could not find line ID for update");
        return;
      }

      if (newQuantity < 1) {
        await removeFromCart(lineId);
        return;
      }

      setIsLoading(true);

      try {
        const updatedCart = await shopifyApi.updateCartLine(
          cartId,
          lineId,
          newQuantity
        );
        setCartData(updatedCart);
        setCart(updatedCart.items);

        if (item) {
          const difference = newQuantity - item.quantity;
          if (difference > 0) {
            showToast(`Quantity increased to ${newQuantity}`, "success", "➕");
          } else if (difference < 0) {
            showToast(`Quantity decreased to ${newQuantity}`, "success", "➖");
          }
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        showToast("Failed to update quantity", "error", "❌");
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, cart, isLoading, removeFromCart, showToast]
  );

  // Clear cart - creates a new empty cart
  const clearCart = useCallback(async () => {
    if (cart.length === 0) return;

    setIsLoading(true);

    try {
      const newCart = await shopifyApi.createCart();
      setCartData(newCart);
      setCart(newCart.items);
      setCartId(newCart.id);
      localStorage.setItem(CART_ID_KEY, newCart.id);

      showToast("Cart cleared", "success", "🧹");
    } catch (error) {
      console.error("Error clearing cart:", error);
      showToast("Failed to clear cart", "error", "❌");
    } finally {
      setIsLoading(false);
    }
  }, [cart.length, showToast]);

  // Redirect to Shopify checkout
  const proceedToCheckout = useCallback(() => {
    if (cartData.checkoutUrl) {
      window.location.href = cartData.checkoutUrl;
    } else {
      showToast("Checkout not available", "error", "❌");
    }
  }, [cartData.checkoutUrl, showToast]);

  // Get total items count
  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Get total price (use Shopify's calculated subtotal if available)
  const getTotalPrice = useCallback(() => {
    return (
      cartData.subtotal ||
      cart.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [cart, cartData.subtotal]);

  const value = {
    // Backwards compatible cart array
    cart,
    // Full cart data with Shopify info
    cartData,
    // Loading state for UI feedback
    isLoading,
    // Initialization state
    isInitialized,
    // Cart operations
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // Calculations
    getTotalItems,
    getTotalPrice,
    // Checkout
    proceedToCheckout,
    checkoutUrl: cartData.checkoutUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
