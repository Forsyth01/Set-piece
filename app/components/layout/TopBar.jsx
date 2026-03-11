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
  Loader2,
  Menu,
  ChevronRight,
  Home,
  Package,
  Mail,
  HelpCircle,
} from "lucide-react";
import { searchProducts } from "@/app/lib/shopify/api";

export default function TopBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showClearWishlistModal, setShowClearWishlistModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef(null);
  const router = useRouter();

  // Close account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target)) {
        setIsAccountDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Customer accounts URL (Shopify's new customer accounts)
  const customerAccountsUrl = "https://accounts.setpiecesclothing.com";

  // Navigation links for mobile menu
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shorts", href: "/collections/shorts", icon: Package },
    { name: "Jerseys", href: "/collections/jerseys", icon: Package },
    { name: "Caps", href: "/collections/caps-1", icon: Package },
    { name: "Hoodies", href: "/collections/hoodie", icon: Package },
    { name: "Sweatshirts", href: "/collections/sweatshirts", icon: Package },
    { name: "Sweatpants", href: "/collections/sweatpants", icon: Package },
  ];

  const supportLinks = [
    { name: "Sign In", href: customerAccountsUrl, icon: User, external: true },
    { name: "My Orders", href: `${customerAccountsUrl}/orders`, icon: Package, external: true },
    { name: "My Wishlist", href: "/wishlist", icon: Heart },
    { name: "Contact Us", href: "/contact", icon: Mail },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (!mobileSearchQuery.trim()) return;
    setIsMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(mobileSearchQuery)}`);
    setMobileSearchQuery("");
  };

  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    addToCart,
    clearCart,
    proceedToCheckout,
    isLoading,
  } = useCart();
  const { wishlist, removeFromWishlist, getTotalWishlistItems, clearWishlist } = useWishlist();

  const cartItemCount = getTotalItems();
  const wishlistItemCount = getTotalWishlistItems();
  const searchRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search with debounce using Shopify API
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProducts(query, 5);
        setSuggestions(results);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
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
        className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={24} />
        </motion.button>

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
            className="hidden md:block flex-2 relative "
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
              className="w-full border border-[#C8C8C8] px-4 py-3 pr-20 focus:outline-none focus:ring-1 focus:ring-[#C8C8C8] rounded-full"
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
            className="relative cursor-pointer hover:text-gray-600 transition mr-2 sm:mr-0"
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

          {/* Account Button with Dropdown */}
          <div className="relative hidden sm:block" ref={accountDropdownRef}>
            <motion.button
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
              className="cursor-pointer hover:text-gray-600 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="My Account"
            >
              <User size={22} />
            </motion.button>

            {/* Account Dropdown */}
            <AnimatePresence>
              {isAccountDropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-2">
                    <a
                      href={customerAccountsUrl}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700 hover:text-black"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <User size={18} />
                      <span className="font-medium">Sign In</span>
                    </a>
                    <a
                      href={customerAccountsUrl}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700 hover:text-black"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <User size={18} />
                      <span className="font-medium">Create Account</span>
                    </a>
                  </div>
                  <div className="border-t border-gray-100 p-2">
                    <a
                      href={`${customerAccountsUrl}/orders`}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700 hover:text-black"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <Package size={18} />
                      <span className="font-medium">My Orders</span>
                    </a>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700 hover:text-black"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <Heart size={18} />
                      <span className="font-medium">My Wishlist</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 p-2">
                    <Link
                      href="/contact"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700 hover:text-black"
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <HelpCircle size={18} />
                      <span className="font-medium">Help & Support</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <motion.h2 
                className="text-xl font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                 Cart ({cartItemCount})
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
                  className="flex flex-col items-center justify-center h-full p-8 text-center "
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
                        key={item.lineId || `${item.id}-${item.size}`}
                        className="flex gap-4 pb-6 border-b border-gray-200"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="w-24 h-24  rounded flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                          <p className="text-lg font-bold mb-2">
                            ${item.price?.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            Size: {item.size}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border border-gray-400 rounded">
                              <motion.button
                                onClick={() =>
                                  item.lineId
                                    ? updateQuantity(item.lineId, item.quantity - 1)
                                    : updateQuantity(item.id, item.size, item.quantity - 1)
                                }
                                disabled={isLoading}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50"
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
                                  item.lineId
                                    ? updateQuantity(item.lineId, item.quantity + 1)
                                    : updateQuantity(item.id, item.size, item.quantity + 1)
                                }
                                disabled={isLoading}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Plus size={14} />
                              </motion.button>
                            </div>

                            <motion.button
                              onClick={() =>
                                item.lineId
                                  ? removeFromCart(item.lineId)
                                  : removeFromCart(item.id, item.size)
                              }
                              disabled={isLoading}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm disabled:opacity-50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 size={16} />
                              {/* Remove */}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* <motion.div 
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
                            <div className="lg:flex grid grid-cols-4 gap-2 text-xs mb-2">
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
                  </motion.div> */}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <motion.div
                className="border-t border-gray-300 bg-white p-6 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">Subtotal:</span>
                  <span className="text-2xl font-bold">${getTotalPrice().toFixed(2)}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    proceedToCheckout();
                  }}
                  disabled={isLoading}
                  className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition text-center disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    "PROCEED TO CHECKOUT"
                  )}
                </button>

                {/* <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-white text-black border-2 border-black py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition text-center"
                >
                  VIEW FULL CART
                </Link> */}

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-sm text-gray-600 hover:text-black underline"
                >
                  Continue Shopping
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
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-300">
              <motion.h2
                className="text-lg sm:text-xl font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
               Wishlist ({wishlistItemCount})
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
                <div className="p-4 sm:p-6 space-y-4">
                  <AnimatePresence>
                    {wishlist.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="flex gap-3 sm:gap-4  border-b border-gray-200 pb-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="w-20 h-20 sm:w-34 sm:h-24 ">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain p-1 sm:p-2"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <Link
                              href={`/products/${item.handle}`}
                              onClick={() => setIsWishlistOpen(false)}
                              className="font-bold text-xs sm:text-sm hover:text-gray-600 line-clamp-2"
                            >
                              {item.title}
                            </Link>
                            <motion.button
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-gray-400 hover:text-red-600 transition flex-shrink-0"
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </motion.button>
                          </div>

                          <div className="flex gap-2 items-center mb-2 sm:mb-3">
                            <span className="text-base sm:text-lg font-bold">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.compareAtPrice && (
                              <span className="text-xs sm:text-sm line-through text-gray-400">
                                ${item.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 mb-2 sm:mb-3">
                            {item.sizes?.map((size) => (
                              <motion.button
                                key={size}
                                onClick={() =>
                                  handleAddToCartFromWishlist(item, size)
                                }
                                className="px-2 sm:px-3 py-1 text-xs border rounded-xl hover:bg-black hover:text-white transition"
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
                            className="w-full bg-black text-white text-xs py-3 rounded hover:bg-gray-800 transition"
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
                className="border-t border-gray-200 bg-white p-4 sm:p-6 space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/wishlist"
                  onClick={() => setIsWishlistOpen(false)}
                  className="block w-full bg-black text-white py-3 rounded-full font-medium text-center hover:bg-gray-800 transition"
                >
                  VIEW FULL WISHLIST
                </Link>
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

      {/* Mobile Navigation Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 md:hidden flex flex-col shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img src="/logo-icon.png" alt="" className="h-7 object-contain" />
                  <img src="/logo.png" alt="SetPiece" className="h-6 object-contain" />
                </Link>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-gray-100">
                <form onSubmit={handleMobileSearch} className="relative">
                  <input
                    type="text"
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:bg-white transition"
                  />
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </form>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Shop
                  </span>
                </div>
                <nav className="space-y-1 px-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-gray-50 transition group"
                      >
                        <div className="flex items-center gap-3">
                          <link.icon size={20} className="text-gray-400 group-hover:text-black transition" />
                          <span className="font-medium text-gray-700 group-hover:text-black transition">
                            {link.name}
                          </span>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="px-4 mt-6 mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Support
                  </span>
                </div>
                <nav className="space-y-1 px-2">
                  {supportLinks.map((link, index) => {
                    const LinkComponent = link.external ? 'a' : Link;
                    const linkProps = link.external
                      ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
                      : { href: link.href };

                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + index) * 0.05 }}
                      >
                        <LinkComponent
                          {...linkProps}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-gray-50 transition group"
                        >
                          <div className="flex items-center gap-3">
                            <link.icon size={20} className="text-gray-400 group-hover:text-black transition" />
                            <span className="font-medium text-gray-700 group-hover:text-black transition">
                              {link.name}
                            </span>
                          </div>
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </LinkComponent>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-4 space-y-3">
                {/* Quick Actions */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsWishlistOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart size={20} />
                    <span className="text-sm font-medium">Wishlist</span>
                    {wishlistItemCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {wishlistItemCount}
                      </span>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag size={20} />
                    <span className="text-sm font-medium">Cart</span>
                    {cartItemCount > 0 && (
                      <span className="bg-white text-black text-xs px-2 py-0.5 rounded-full">
                        {cartItemCount}
                      </span>
                    )}
                  </motion.button>
                </div>

                {/* Social/Brand */}
                <p className="text-center text-xs text-gray-400">
                  Premium Soccer Apparel
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}