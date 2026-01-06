"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { Search, Heart, ShoppingBag, User, X, Minus, Plus, Trash2 } from "lucide-react";

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
  const router = useRouter();
  
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, addToCart } = useCart();
  const { wishlist, removeFromWishlist, getTotalWishlistItems, isInWishlist } = useWishlist();
  
  const cartItemCount = getTotalItems();
  const wishlistItemCount = getTotalWishlistItems();
  const searchRef = useRef(null);

  // Get recommendations from all products (first 2 items from new arrivals)
  const recommendations = newArrivals.slice(0, 2);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions as user types
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

  // Close cart when clicking outside
  useEffect(() => {
    if (!isCartOpen) return;
    
    const handleClickOutside = (e) => {
      const cartElement = document.getElementById('sliding-cart');
      if (cartElement && !cartElement.contains(e.target) && !e.target.closest('[data-cart-button]')) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen]);

  // Close wishlist when clicking outside
  useEffect(() => {
    if (!isWishlistOpen) return;
    
    const handleClickOutside = (e) => {
      const wishlistElement = document.getElementById('sliding-wishlist');
      if (wishlistElement && !wishlistElement.contains(e.target) && !e.target.closest('[data-wishlist-button]')) {
        setIsWishlistOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isWishlistOpen]);

  const handleAddToCartFromWishlist = (product, size) => {
    addToCart(product, size);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl cursor-pointer whitespace-nowrap"
        >
          <div className="flex items-center gap-2">
            <img src="/logo-icon.png" alt="" className="" />
            <img src="/logo.png" alt="SetPiece Logo" className="" />
          </div>
        </Link>

        {/* Search */}
        <div className="w-[50%] m-auto">
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-2 relative"
            ref={searchRef}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for products"
              className="w-full border border-[#C8C8C8] px-4 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-[#C8C8C8]"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}

            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-600"
            >
              <Search size={18} />
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 transition text-left"
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
                  </button>
                ))}

                <button
                  onClick={handleSearch}
                  className="w-full p-3 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 border-t"
                >
                  View all results for "{query}"
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 ml-auto">
          <button
            data-wishlist-button
            onClick={() => setIsWishlistOpen(true)}
            className="relative cursor-pointer hover:text-gray-600 transition"
          >
            <Heart size={22} />
            {wishlistItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {wishlistItemCount}
              </span>
            )}
          </button>

          <button
            data-cart-button
            onClick={() => setIsCartOpen(true)}
            className="relative cursor-pointer hover:text-gray-600 transition"
          >
            <ShoppingBag size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {cartItemCount}
              </span>
            )}
          </button>

          <button className="cursor-pointer hover:text-gray-600 transition">
            <User size={22} />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {(isCartOpen || isWishlistOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" />
      )}

      {/* Sliding Cart */}
      <div
        id="sliding-cart"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cart Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Shopping Cart ({cartItemCount})</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-6 border-b">
                  <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-lg font-bold mb-2">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mb-3">Size: {item.size}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <h3 className="font-bold text-center mb-4">YOU MIGHT ALSO LIKE</h3>
                <div className="space-y-4">
                  {recommendations.map((product) => (
                    <div key={product.id} className="flex gap-4 p-4 border rounded hover:shadow-md transition">
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
                        <h4 className="font-bold text-sm mb-1">{product.title}</h4>
                        <p className="text-sm font-bold mb-2">${product.price.toFixed(2)}</p>
                        <div className="flex gap-2 text-xs mb-2">
                          {product.sizes?.map((size) => (
                            <button key={size} className="px-2 py-1 border rounded hover:bg-gray-100">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t bg-white p-6 space-y-4">
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
          </div>
        )}
      </div>

      {/* Sliding Wishlist */}
      <div
        id="sliding-wishlist"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">My Wishlist ({wishlistItemCount})</h2>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Heart size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Your wishlist is empty</p>
              <p className="text-gray-400 text-sm mt-2">Start adding your favorite items!</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {wishlist.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded hover:shadow-md transition">
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
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    
                    <div className="flex gap-2 items-center mb-3">
                      <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                      {item.compareAtPrice && (
                        <span className="text-sm line-through text-gray-400">
                          ${item.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mb-3">
                      {item.sizes?.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleAddToCartFromWishlist(item, size)}
                          className="px-3 py-1 text-xs border rounded hover:bg-black hover:text-white transition"
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        handleAddToCartFromWishlist(item, item.sizes[0]);
                        setIsWishlistOpen(false);
                      }}
                      className="w-full bg-black text-white text-xs py-2 rounded hover:bg-gray-800 transition"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="border-t bg-white p-6">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full text-center text-sm text-gray-600 hover:text-black underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
