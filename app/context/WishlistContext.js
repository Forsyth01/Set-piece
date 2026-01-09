"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const toastIdRef = useRef(null);

  // Load wishlist from localStorage on mount (only once)
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  // Helper to show toast without duplicates
  const showToast = (message, type = "success", icon) => {
    // Dismiss any existing toast
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
    
    // Show new toast and store its ID
    toastIdRef.current = toast[type](message, {
      icon: icon,
      id: `wishlist-toast-${Date.now()}`, // Unique ID
    });
  };

  // Add item to wishlist
  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      // Check if item already exists
      const exists = prevWishlist.find((item) => item.id === product.id);

      if (!exists) {
        showToast(
          `${product.title} added to wishlist`,
          "success",
          "❤️"
        );

        return [
          ...prevWishlist,
          {
            id: product.id,
            handle: product.handle,
            title: product.title,
            image: product.image,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            sizes: product.sizes,
          },
        ];
      }
      return prevWishlist;
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (id) => {
    // Find the item to get its details for the toast
    const itemToRemove = wishlist.find((item) => item.id === id);

    if (itemToRemove) {
      showToast(
        `${itemToRemove.title} removed from wishlist`,
        "error",
        "💔"
      );
    }

    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== id)
    );
  };

  // Toggle item in wishlist
  const toggleWishlist = (product) => {
    const exists = wishlist.find((item) => item.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  // Get total wishlist items count
  const getTotalWishlistItems = () => {
    return wishlist.length;
  };

  // Clear wishlist
  const clearWishlist = () => {
    if (wishlist.length > 0) {
      showToast("Wishlist cleared", "success", "🧹");
    }
    setWishlist([]);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getTotalWishlistItems,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}