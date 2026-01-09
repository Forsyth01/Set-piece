"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { accessories } from "@/app/lib/mock-accessories";
import { girlsCollections } from "@/app/lib/mock-girls-collections";
import { hoodiesJoggers } from "@/app/lib/mock-hoodies-joggers";
import { newArrivals } from "@/app/lib/mock-new-arrivals";
import { soccerShorts } from "@/app/lib/mock-soccer-shorts";
import { theVault } from "@/app/lib/mock-the-vault";
import Hero from "@/app/components/home/Hero";
import { useWishlist } from "@/app/context/WishlistContext"; // Import the Wishlist context
import { trendingCollections } from "@/app/lib/mock-trending-collections";
import RecommendedSection from "@/app/components/RecommendedSection";

const PRODUCTS = [
  ...accessories,
  ...girlsCollections,
  ...hoodiesJoggers,
  ...newArrivals,
  ...soccerShorts,
  ...theVault,
  ...trendingCollections
];

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist(); // Using the Wishlist context

  // Mock color variants (you'll replace this with real data)
  const colorVariants = [
    { name: "WHITE", image: "/products/shirt-white.jpg" },
    { name: "BLUE", image: "/products/shirt-blue.jpg" },
    { name: "BLACK", image: "/products/shirt-black.jpg" },
  ];

  useEffect(() => {
    async function getProduct() {
      const { handle } = await params;
      const foundProduct = PRODUCTS.find((p) => p.handle === handle);
      setProduct(foundProduct);
      if (foundProduct) {
        setSelectedSize(foundProduct.sizes[0]);
      }
    }
    getProduct();
  }, [params]);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedSize);
      }
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product); // Toggle wishlist item
    }
  };

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-20">
        <h1>Product not found</h1>
      </main>
    );
  }

  const inWishlist = isInWishlist(product.id); // Check if the item is in the wishlist

  return (
    <main className="bg-white min-h-screen">
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Side - Product Image */}
          <div className="bg-gray-50 rounded-lg p-8">
            <img
                src={product.image || "/shirt2.png"}
            //   src="/shirt2.png"
              alt={product.title}
              className="w-full object-contain"
            />
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-bold uppercase tracking-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-light text-gray-600">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <p className="text-sm font-medium mb-3">
                Color:{" "}
                <span className="font-bold">
                  {colorVariants[selectedColor].name}
                </span>
              </p>
              <div className="flex gap-3">
                {colorVariants.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-24 h-24 border-2 rounded-lg overflow-hidden transition ${
                      selectedColor === index
                        ? "border-black shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      //   src={color.image}
                      src="/shirt2.png"
                      alt={color.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <p className="text-sm font-medium mb-3 uppercase tracking-wide">
                Select Size
              </p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border transition font-medium ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div>
                <p className="text-sm font-medium  uppercase tracking-wide">
                  QTY
                </p>
                <div className="flex items-center gap-4">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-24 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add to Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className="flex items-center gap-2 px-4 mt-5 py-3 border border-gray-300 hover:border-black transition"
              >
                <Heart size={20} />
                <span className="text-sm font-medium">
                  {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </span>
              </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 font-bold text-sm tracking-wider hover:bg-gray-800 transition uppercase"
              >
                ADD TO CART
              </button>
            {/* Design & Aesthetic */}
            <div className="pt-6 border-t">
              <h3 className="font-bold text-lg mb-3">Design & Aesthetic</h3>
              <p className="text-gray-700 leading-relaxed">
                This premium soccer jersey features a sleek, monochromatic black
                base accented with sharp white geometric line-work. The design
                creates a high-contrast, dynamic visual effect tailored for a
                professional "SetPiece" look. It includes a centered, tonal club
                crest and a minimalist sponsor logo for a clean, modern finish.
              </p>
            </div>

            {/* Performance & Build */}
            <div className="pt-6">
              <h3 className="font-bold text-lg mb-4">Performance & Build</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>
                    <strong>Fabric:</strong> Lightweight, breathable performance
                    mesh designed for elite-level play.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>
                    <strong>Fit:</strong> Standard athletic silhouette with
                    reinforced stitching at the collar and sleeves.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>
                    <strong>Colors:</strong> Also available in alternate White
                    and Royal Blue colorways.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-black mt-1">•</span>
                  <span>
                    <strong>Sizing:</strong> Offered in extended sizes including
                    XL, XXL, and XXXL.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
          <RecommendedSection />
    </main>
  );
}
