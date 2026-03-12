"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const sizes = useMemo(
    () => (Array.isArray(product?.sizes) ? product.sizes : []),
    [product?.sizes]
  );
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);

  // Create a map for fast variant lookup (O(1) instead of O(n))
  const variantMap = useMemo(() => {
    const map = new Map();
    product.variants?.forEach((v) => map.set(v.size, v));
    return map;
  }, [product.variants]);

  // Always select first size when sizes change
  useEffect(() => {
    if (sizes.length > 0) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes]);

  // Find the selected variant using the map
  const selectedVariant = useMemo(() => {
    return selectedSize ? variantMap.get(selectedSize) : product.variants?.[0];
  }, [selectedSize, variantMap, product.variants]);

  // Use variant price if available, otherwise use product base price
  const currentPrice = selectedVariant?.price || product.price || 0;
  const currentCompareAtPrice =
    selectedVariant?.compareAtPrice || product.compareAtPrice;

  // Check if selected variant is out of stock
  const isOutOfStock = selectedVariant?.availableForSale === false;

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      return;
    }
    if (isOutOfStock) {
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
    <div className="group relative flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
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
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 ${
            inWishlist
              ? "bg-red-50 text-red-500"
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart
            size={18}
            className={inWishlist ? "fill-red-500" : ""}
          />
        </button>

        {/* Product Image */}
        <Link href={`/products/${product.handle}`} className="block h-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Add to Cart Overlay - Always Visible */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          <button
            onClick={handleAddToCart}
            disabled={(sizes.length > 0 && !selectedSize) || isOutOfStock}
            className={`w-full cursor-pointer flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 active:scale-[0.98] ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : sizes.length > 0 && !selectedSize
                  ? "bg-white/80 text-gray-400 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            <ShoppingBag size={16} />
            {isOutOfStock
              ? "OUT OF STOCK"
              : sizes.length > 0 && !selectedSize
                ? "SELECT SIZE"
                : "ADD TO CART"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow pt-4">
        {/* Sizes - Clickable */}
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {sizes.map((size) => {
              const variant = variantMap.get(size);
              const sizeOutOfStock = variant?.availableForSale === false;

              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={sizeOutOfStock}
                  className={`text-[11px] px-2 py-1 rounded-md border transition-colors duration-100 ${
                    sizeOutOfStock
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                      : selectedSize === size
                        ? "bg-black text-white border-black cursor-pointer"
                        : "bg-white text-gray-600 border-gray-200 hover:border-black cursor-pointer"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}

        {/* Title */}
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 text-gray-900 group-hover:text-gray-600 transition-colors duration-150">
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
