"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

// Import products for suggestions
import { accessories } from "@/app/lib/mock-accessories";
import { girlsCollections } from "@/app/lib/mock-girls-collections";
import { hoodiesJoggers } from "@/app/lib/mock-hoodies-joggers";
import { newArrivals } from "@/app/lib/mock-new-arrivals";
import { soccerShorts } from "@/app/lib/mock-soccer-shorts";
import { theVault } from "@/app/lib/mock-the-vault";

const ALL_PRODUCTS = [
  ...accessories,
  ...girlsCollections,
  ...hoodiesJoggers,
  ...newArrivals,
  ...soccerShorts,
  ...theVault,
];

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showClearWishlistModal, setShowClearWishlistModal] = useState(false);
  const router = useRouter();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    addToCart,
    clearCart,
  } = useCart();
  const { wishlist, removeFromWishlist, getTotalWishlistItems, clearWishlist } = useWishlist();

  const cartItemCount = getTotalItems();
  const wishlistItemCount = getTotalWishlistItems();
  const searchRef = useRef(null);

  const recommendations = newArrivals.slice(0, 2);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matches = ALL_PRODUCTS.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    setSuggestions(matches);
  }, [query]);

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleSuggestionClick(product) {
    setQuery("");
    setShowSuggestions(false);
    router.push(`/products/${product.handle}`);
  }

  const handleAddToCartFromWishlist = (product, size) => {
    addToCart(product, size);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearCartModal(false);
  };

  const handleClearWishlist = () => {
    clearWishlist();
    setShowClearWishlistModal(false);
  };

  return (
    <>
      <motion.div 
        className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl cursor-pointer whitespace-nowrap"
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img src="/logo-icon.png" alt="" className="h-7 object-contain" />
            <img
              src="/logo.png"
              alt="SetPiece Logo"
              className="h-7 object-contain"
            />
          </motion.div>
        </Link>

        {/* Search */}
        <div className="w-[50%] m-auto">
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-2 relative"
            ref={searchRef}
          >
            <motion.input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for products"
              className="w-full border border-[#C8C8C8] px-4 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-[#C8C8C8]"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />

            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search size={18} />
            </motion.button>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {suggestions.map((product, index) => (
                    <motion.button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 transition text-left"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.title}</p>
                        <p className="text-xs text-gray-600">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </motion.button>
                  ))}

                  <motion.button
                    onClick={handleSearch}
                    className="w-full p-3 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 border-t"
                    whileHover={{ backgroundColor: "rgb(239 246 255)" }}
                  >
                    View all results for "{query}"
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 ml-auto">
          <motion.button
            data-wishlist-button
            onClick={() => setIsWishlistOpen(true)}
            className="relative cursor-pointer hover:text-gray-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart size={22} />
            <AnimatePresence>
              {wishlistItemCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={wishlistItemCount}
                >
                  {wishlistItemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            data-cart-button
            onClick={() => setIsCartOpen(true)}
            className="relative cursor-pointer hover:text-gray-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShoppingBag size={22} />
            <AnimatePresence>
              {cartItemCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={cartItemCount}
                >
                  {cartItemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button 
            className="cursor-pointer hover:text-gray-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <User size={22} />
          </motion.button>
        </div>
      </motion.div>

      {/* Backdrop for Cart/Wishlist */}
      <AnimatePresence>
        {(isCartOpen || isWishlistOpen) && !showClearCartModal && !showClearWishlistModal && (
          <motion.div
            className="fixed inset-0  bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsCartOpen(false);
              setIsWishlistOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Clear Cart Confirmation Modal */}
      <AnimatePresence>
        {showClearCartModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              style={{ backdropFilter: 'blur(4px)' }}
              onClick={() => setShowClearCartModal(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-[70] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Clear Cart?</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove all items from your cart? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowClearCartModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleClearCart}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear Cart
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clear Wishlist Confirmation Modal */}
      <AnimatePresence>
        {showClearWishlistModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              style={{ backdropFilter: 'blur(4px)' }}
              onClick={() => setShowClearWishlistModal(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-[70] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Clear Wishlist?</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove all items from your wishlist? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowClearWishlistModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleClearWishlist}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear Wishlist
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sliding Cart */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            id="sliding-cart"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Cart Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <motion.h2 
                className="text-xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Shopping Cart ({cartItemCount})
              </motion.h2>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <motion.button
                    onClick={() => setShowClearCartModal(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Clear cart"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full p-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <ShoppingBag size={64} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                </motion.div>
              ) : (
                <div className="p-6 space-y-6">
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${item.size}`}
                        className="flex gap-4 pb-6 border-b"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                          <p className="text-lg font-bold mb-2">
                            ${item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            Size: {item.size}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border rounded">
                              <motion.button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.size,
                                    item.quantity - 1
                                  )
                                }
                                className="p-2 hover:bg-gray-100"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Minus size={14} />
                              </motion.button>
                              <motion.span 
                                className="w-8 text-center font-semibold"
                                key={item.quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.size,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 hover:bg-gray-100"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Plus size={14} />
                              </motion.button>
                            </div>

                            <motion.button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 size={16} />
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.div 
                    className="pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-bold text-center mb-4">
                      YOU MIGHT ALSO LIKE
                    </h3>
                    <div className="space-y-4">
                      {recommendations.map((product, index) => (
                        <motion.div
                          key={product.id}
                          className="flex gap-4 p-4 border rounded hover:shadow-md transition"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 relative">
                            <span className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded-br">
                              New
                            </span>
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1">
                              {product.title}
                            </h4>
                            <p className="text-sm font-bold mb-2">
                              ${product.price.toFixed(2)}
                            </p>
                            <div className="flex gap-2 text-xs mb-2">
                              {product.sizes?.map((size) => (
                                <button
                                  key={size}
                                  className="px-2 py-1 border rounded hover:bg-gray-100"
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                            <Link
                              href={`/products/${product.handle}`}
                              onClick={() => setIsCartOpen(false)}
                              className="block w-full bg-black text-white text-xs py-2 rounded hover:bg-gray-800 transition text-center"
                            >
                              VIEW PRODUCT
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <motion.div 
                className="border-t bg-white p-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-black text-white py-4 rounded font-bold text-lg hover:bg-gray-800 transition text-center"
                >
                  CHECKOUT - ${getTotalPrice().toFixed(2)}
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-sm text-gray-600 hover:text-black underline"
                >
                  Or Continue Shopping
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding Wishlist */}
      <AnimatePresence>
        {isWishlistOpen && (
          <motion.div
            id="sliding-wishlist"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <motion.h2 
                className="text-xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                My Wishlist ({wishlistItemCount})
              </motion.h2>
              <div className="flex items-center gap-2">
                {wishlist.length > 0 && (
                  <motion.button
                    onClick={() => setShowClearWishlistModal(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Clear wishlist"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {wishlist.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full p-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Heart size={64} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Your wishlist is empty</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Start adding your favorite items!
                  </p>
                </motion.div>
              ) : (
                <div className="p-6 space-y-4">
                  <AnimatePresence>
                    {wishlist.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="flex gap-4 p-4 border rounded hover:shadow-md transition"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <Link
                              href={`/products/${item.handle}`}
                              onClick={() => setIsWishlistOpen(false)}
                              className="font-bold text-sm hover:text-gray-600"
                            >
                              {item.title}
                            </Link>
                            <motion.button
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-gray-400 hover:text-red-600 transition"
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X size={18} />
                            </motion.button>
                          </div>

                          <div className="flex gap-2 items-center mb-3">
                            <span className="text-lg font-bold">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.compareAtPrice && (
                              <span className="text-sm line-through text-gray-400">
                                ${item.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2 mb-3">
                            {item.sizes?.map((size) => (
                              <motion.button
                                key={size}
                                onClick={() =>
                                  handleAddToCartFromWishlist(item, size)
                                }
                                className="px-3 py-1 text-xs border rounded hover:bg-black hover:text-white transition"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {size}
                              </motion.button>
                            ))}
                          </div>

                          <motion.button
                            onClick={() => {
                              handleAddToCartFromWishlist(item, item.sizes[0]);
                              setIsWishlistOpen(false);
                            }}
                            className="w-full bg-black text-white text-xs py-2 rounded hover:bg-gray-800 transition"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            ADD TO CART
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {wishlist.length > 0 && (
              <motion.div 
                className="border-t bg-white p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-full text-center text-sm text-gray-600 hover:text-black underline"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}