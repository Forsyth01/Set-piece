"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // ✅ SAFE SIZES HANDLING
  const sizes = Array.isArray(product?.sizes) ? product.sizes : [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? null);

  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize && sizes.length > 0) return;
    addToCart(product, selectedSize);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div
      ref={cardRef}
      className={`group flex flex-col h-full transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Image */}
      <div className="relative bg-gray-100 p-4 aspect-square overflow-hidden rounded-lg">
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-red-700 text-white px-4 py-1 text-[clamp(0.55rem,1vw,0.7rem)] z-10 transition-transform duration-300 group-hover:scale-105">
            New
          </span>
        )}

        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 bg-white rounded-full p-1 cursor-pointer hover:bg-gray-100 transition-all duration-300 z-10 hover:scale-110"
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              inWishlist ? "fill-red-500 text-red-500 scale-110" : ""
            }`}
          />
        </button>

        <Link href={`/products/${product.handle}`}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow space-y-[2px]">
        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {sizes.map((size, i) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`border px-2 py-0.5 text-[clamp(0.55rem,1vw,0.7rem)] rounded-[4px] cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "text-gray-500 hover:bg-gray-100 hover:border-gray-400"
                }`}
                style={{
                  transitionDelay: isVisible ? `${i * 50}ms` : "0ms",
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="mt-3 tracking-normal font-semibold text-[clamp(0.85rem,1.4vw,1rem)] line-clamp-2 transition-colors duration-300 group-hover:text-gray-700">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex gap-2 items-center mt-1">
          <span className="font-medium text-[clamp(0.8rem,1.3vw,0.95rem)] transition-transform duration-300 group-hover:scale-105 inline-block">
            ${product.price.toFixed(2)}
          </span>

          {product.compareAtPrice && (
            <span className="line-through text-gray-400 text-[clamp(0.75rem,1.2vw,0.9rem)]">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={sizes.length > 0 && !selectedSize}
          className={`md:mt-auto md:pt-4 mt-1 w-full cursor-pointer py-3 rounded-[6px] font-bold text-[clamp(0.75rem,1.2vw,0.9rem)] transition-all duration-300 transform ${
            sizes.length > 0 && !selectedSize
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
          }`}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
