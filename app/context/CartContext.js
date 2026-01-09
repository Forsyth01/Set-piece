"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const toastIdRef = useRef(null);

  // Load cart from localStorage on mount (only once)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Helper to show toast without duplicates
  const showToast = (message, type = "success", icon) => {
    // Dismiss any existing toast
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
    
    // Show new toast and store its ID
    toastIdRef.current = toast[type](message, {
      icon: icon,
      id: `cart-toast-${Date.now()}`, // Unique ID
    });
  };

  // Add item to cart
  const addToCart = (product, selectedSize) => {
    setCart((prevCart) => {
      // Check if item with same product and size already exists
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.size === selectedSize
      );

      if (existingItem) {
        // If exists, increase quantity by 1
        showToast(
          `${product.title} (${selectedSize}) quantity updated`,
          "success",
          "🛒"
        );
        
        return prevCart.map((item) =>
          item.id === product.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new, add to cart with quantity 1
        showToast(
          `${product.title} (${selectedSize}) added to cart`,
          "success",
          "✅"
        );
        
        return [
          ...prevCart,
          {
            id: product.id,
            handle: product.handle,
            title: product.title,
            image: product.image,
            price: product.price,
            size: selectedSize,
            quantity: 1,
          },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id, size) => {
    // Find the item to get its details for the toast
    const itemToRemove = cart.find(
      (item) => item.id === id && item.size === size
    );

    if (itemToRemove) {
      showToast(
        `${itemToRemove.title} removed from cart`,
        "error",
        "🗑️"
      );
    }

    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.size === size))
    );
  };

  // Update quantity
  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id, size);
      return;
    }

    const item = cart.find((item) => item.id === id && item.size === size);
    
    if (item) {
      const difference = newQuantity - item.quantity;
      
      if (difference > 0) {
        showToast(
          `Quantity increased to ${newQuantity}`,
          "success",
          "➕"
        );
      } else if (difference < 0) {
        showToast(
          `Quantity decreased to ${newQuantity}`,
          "success",
          "➖"
        );
      }
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    if (cart.length > 0) {
      showToast("Cart cleared", "success", "🧹");
    }
    setCart([]);
  };

  // Get total items count
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
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