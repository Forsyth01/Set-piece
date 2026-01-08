"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group flex flex-col h-full">
      {/* Image */}
      <div className="relative bg-gra-100 p-4 aspect-square">
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-red-700 text-white px-4 py-1 text-[clamp(0.55rem,1vw,0.7rem)]">
            New
          </span>
        )}

        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 bg-white rounded-full p-1 cursor-pointer hover:bg-gray-100 transition"
        >
          <Heart
            size={16}
            className={inWishlist ? "fill-red-500 text-red-500" : ""}
          />
        </button>

        <Link href={`/products/${product.handle}`}>
          <img
            // src="/shirt2.png"
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        </Link>
      </div>

      {/* Content section with flex-grow to push button to bottom */}
      <div className="flex flex-col flex-grow space-y-[2px]">
        {/* Sizes */}
        <div className="flex gap-2 mt-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`border px-2 py-0.5 text-[clamp(0.55rem,1vw,0.7rem)] rounded-[4px] cursor-pointer transition ${
                selectedSize === size
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Title */}
        <h3 className="mt-3 black tracking-normal font-semibold text-[clamp(0.85rem,1.4vw,1rem)] line-clamp-2">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex gap-2 items-center mt-1">
          <span className="font-medium text-[clamp(0.8rem,1.3vw,0.95rem)]">
            ${product.price.toFixed(2)}
          </span>

          {product.compareAtPrice && (
            <span className="line-through text-gray-400 text-[clamp(0.75rem,1.2vw,0.9rem)]">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart - pushed to bottom with mt-auto */}
        <button
          onClick={handleAddToCart}
          className="md:mt-auto md:pt-4 mt-1 w-full bg-black text-white py-3 cursor-pointer hover:bg-gray-800 transition text-[clamp(0.75rem,1.2vw,0.9rem)] rounded-[6px]"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}