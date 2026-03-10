"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const sizes = Array.isArray(product?.sizes) ? product.sizes : [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);

  // Always select first size when sizes change
  useEffect(() => {
    if (sizes.length > 0) {
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

  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      return;
    }
    addToCart(product, selectedSize);
  };

  const inWishlist = isInWishlist(product.id);

  // Calculate discount percentage
  const discountPercent = currentCompareAtPrice
    ? Math.round((1 - currentPrice / currentCompareAtPrice) * 100)
    : null;

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col h-full transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-black text-white text-[10px] font-semibold tracking-wider px-3 py-1.5 rounded-full uppercase">
              New
            </span>
          )}
          {discountPercent && (
            <span className="bg-red-500 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            inWishlist
              ? "bg-red-50 text-red-500"
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${inWishlist ? "fill-red-500" : ""}`}
          />
        </button>

        {/* Product Image */}
        <Link href={`/products/${product.handle}`} className="block h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Add to Cart Overlay - Always Visible */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          <button
            onClick={handleAddToCart}
            disabled={sizes.length > 0 && !selectedSize}
            className={`w-full cursor-pointer flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
              sizes.length > 0 && !selectedSize
                ? "bg-white/80 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <ShoppingBag size={16} />
            {sizes.length > 0 && !selectedSize ? "SELECT SIZE" : "ADD TO CART"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow pt-4">
        {/* Sizes - Clickable */}
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`text-[11px] px-2 py-1 rounded-md border transition-all duration-200 cursor-pointer ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold text-base text-gray-900">
            ${currentPrice?.toFixed(2)}
          </span>
          {currentCompareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${currentCompareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
