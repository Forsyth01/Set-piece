"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { Heart, Loader2, Minus, Plus, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/app/context/WishlistContext";
import RecommendedSection from "@/app/components/RecommendedSection";
import Link from "next/link";

export default function ProductClient({ product, recommendations = [] }) {
  // Auto-select first size
  const sizes = product.sizes || [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart, isLoading } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Auto-select first size when product loads
  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes.length]);

  // Find the selected variant to get its price
  const selectedVariant = selectedSize
    ? product.variants?.find((v) => v.size === selectedSize)
    : product.variants?.[0];

  // Use variant price if available, otherwise use product base price
  const currentPrice = selectedVariant?.price || product.price || 0;
  const currentCompareAtPrice = selectedVariant?.compareAtPrice || product.compareAtPrice;

  // Calculate discount
  const discountPercent = currentCompareAtPrice
    ? Math.round((1 - currentPrice / currentCompareAtPrice) * 100)
    : null;

  // Check if selected variant is out of stock
  const isOutOfStock = selectedVariant?.availableForSale === false;

  // Get all product images
  const productImages = product.images?.length > 0
    ? product.images.map(img => img.url)
    : [product.image];

  const handleAddToCart = async () => {
    if (product && selectedSize && !isLoading) {
      await addToCart(product, selectedSize, quantity);
    }
  };

  const inWishlist = isInWishlist(product.id);

  const incrementQty = () => setQuantity(q => Math.min(q + 1, 10));
  const decrementQty = () => setQuantity(q => Math.max(q - 1, 1));

  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <ChevronRight size={14} />
          <Link href="/collections/shorts" className="hover:text-black transition">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-black font-medium truncate">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Left Side - Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-3"
          >
            {/* Thumbnails - Side */}
            {productImages.length > 1 && (
              <div className="flex flex-col gap-2 w-20 shrink-0">
                {productImages.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "ring-2 ring-black"
                        : "ring-1 ring-gray-200 hover:ring-gray-400"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={img}
                      alt={`${product.title} - View ${index + 1}`}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        selectedImageIndex === index ? "opacity-100" : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 bg-gray-50 rounded-2xl overflow-hidden aspect-square">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    NEW
                  </span>
                )}
                {discountPercent && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <motion.button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                  inWishlist
                    ? "bg-red-50 text-red-500"
                    : "bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={22} className={inWishlist ? "fill-red-500" : ""} />
              </motion.button>

              {/* Main Image with Animation */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={productImages[selectedImageIndex]}
                  alt={`${product.title} - Main`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Side - Product Details */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 leading-tight">
                {product.title}
              </h1>

          
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <motion.span
                key={currentPrice}
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                ${currentPrice?.toFixed(2)}
              </motion.span>
              {currentCompareAtPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${currentCompareAtPrice.toFixed(2)}
                </span>
              )}
              {discountPercent && (
                <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
              
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const variant = product.variants?.find(v => v.size === size);
                    const sizeOutOfStock = variant?.availableForSale === false;

                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={sizeOutOfStock}
                        className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 relative ${
                          sizeOutOfStock
                            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                            : selectedSize === size
                              ? "border-black bg-black text-white"
                              : "border-gray-200 hover:border-black bg-white text-gray-900"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>


              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-900 mr-4">Qty:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={decrementQty}
                    disabled={quantity <= 1}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition disabled:opacity-30"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQty}
                    disabled={quantity >= 10}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition disabled:opacity-30"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                  inWishlist
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 hover:border-black text-gray-700"
                }`}
              >
                <Heart size={20} className={inWishlist ? "fill-red-500" : ""} />
                <span className="font-medium text-sm hidden sm:inline">
                  {inWishlist ? "Saved" : "Save"}
                </span>
              </button>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isLoading || !selectedSize || isOutOfStock}
              className={`w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                !selectedSize || isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isLoading
                    ? "bg-gray-800 text-white"
                    : "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
              }`}
              whileTap={!isLoading && selectedSize && !isOutOfStock ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  ADDING TO CART...
                </>
              ) : isOutOfStock ? (
                "OUT OF STOCK"
              ) : !selectedSize ? (
                "SELECT A SIZE"
              ) : (
                <>
                  <Check size={20} />
                  ADD TO CART - ${(currentPrice * quantity).toFixed(2)}
                </>
              )}
            </motion.button>

          </motion.div>
        </div>
      </div>

      {/* Recommended Section */}
      <RecommendedSection products={recommendations} />

      {/* Mobile Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500">{product.title}</p>
            <p className="text-lg font-bold">${currentPrice?.toFixed(2)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !selectedSize || isOutOfStock}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              !selectedSize || isOutOfStock
                ? "bg-gray-200 text-gray-400"
                : "bg-black text-white active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : !selectedSize ? (
              "Select Size"
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>

      {/* Add padding at bottom for mobile sticky bar */}
      <div className="h-24 lg:hidden" />
    </main>
  );
}
