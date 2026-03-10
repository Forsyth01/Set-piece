"use client";

import { useState } from "react";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/CartContext";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    getTotalWishlistItems,
  } = useWishlist();
  const { addToCart, isLoading: cartLoading } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [openSizeDropdown, setOpenSizeDropdown] = useState(null);

  const handleClearWishlist = () => {
    clearWishlist();
    setShowConfirmModal(false);
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
    setOpenSizeDropdown(null);
  };

  const handleAddToCart = async (item) => {
    const size = selectedSizes[item.id];
    if (!size) {
      // Highlight size selector
      setOpenSizeDropdown(item.id);
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [item.id]: true }));
    try {
      await addToCart(item, size, 1);
      // Optionally remove from wishlist after adding to cart
      // removeFromWishlist(item.id);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleMoveToCart = async (item) => {
    const size = selectedSizes[item.id];
    if (!size) {
      setOpenSizeDropdown(item.id);
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [item.id]: true }));
    try {
      await addToCart(item, size, 1);
      removeFromWishlist(item.id);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  if (wishlist.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Save items you love to your wishlist and find them here anytime
            </p>
            <Link
              href="/collections/shorts"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all hover:scale-105 font-medium"
            >
              <ArrowLeft size={20} />
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {getTotalWishlistItems()}{" "}
                {getTotalWishlistItems() === 1 ? "item" : "items"} saved
              </p>
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Product Image */}
                <Link href={`/products/${item.handle}`}>
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.id);
                      }}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <X size={18} />
                    </button>
                    {/* Sale Badge */}
                    {item.compareAtPrice && item.compareAtPrice > item.price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/products/${item.handle}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-gray-600 transition">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold">
                      ${item.price?.toFixed(2)}
                    </span>
                    {item.compareAtPrice && item.compareAtPrice > item.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ${item.compareAtPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Size Selector */}
                  <div className="relative mb-4">
                    <button
                      onClick={() =>
                        setOpenSizeDropdown(
                          openSizeDropdown === item.id ? null : item.id
                        )
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition ${
                        openSizeDropdown === item.id && !selectedSizes[item.id]
                          ? "border-red-400 bg-red-50"
                          : selectedSizes[item.id]
                          ? "border-green-400 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span
                        className={
                          selectedSizes[item.id]
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {selectedSizes[item.id] || "Select Size"}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          openSizeDropdown === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Size Dropdown */}
                    <AnimatePresence>
                      {openSizeDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          {(item.sizes || ["S", "M", "L", "XL", "XXL"]).map(
                            (size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeSelect(item.id, size)}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                                  selectedSizes[item.id] === size
                                    ? "bg-black text-white hover:bg-gray-800"
                                    : ""
                                }`}
                              >
                                {size}
                                {selectedSizes[item.id] === size && (
                                  <Check size={16} />
                                )}
                              </button>
                            )
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={addingToCart[item.id] || cartLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart[item.id] ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingBag size={18} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>

                  {/* Move to Cart Link */}
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={addingToCart[item.id] || cartLoading}
                    className="w-full mt-2 text-center text-sm text-gray-500 hover:text-black transition disabled:opacity-50"
                  >
                    Move to cart and remove from wishlist
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Quick Add Summary */}
        {wishlist.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Ready to check out?
                </h3>
                <p className="text-gray-600 text-sm">
                  Add sizes for each item above, then proceed to cart
                </p>
              </div>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition font-medium"
              >
                <ShoppingBag size={20} />
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={24} />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart size={32} className="text-red-600" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-3">
                  Clear Wishlist?
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-center mb-8">
                  Are you sure you want to remove all {getTotalWishlistItems()}{" "}
                  items from your wishlist? This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearWishlist}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
