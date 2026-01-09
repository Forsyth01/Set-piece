"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { accessories } from "@/app/lib/mock-accessories";
import { girlsCollections } from "@/app/lib/mock-girls-collections";
import { hoodiesJoggers } from "@/app/lib/mock-hoodies-joggers";
import { newArrivals } from "@/app/lib/mock-new-arrivals";
import { soccerShorts } from "@/app/lib/mock-soccer-shorts";
import { theVault } from "@/app/lib/mock-the-vault";
import Hero from "@/app/components/home/Hero";
import { useWishlist } from "@/app/context/WishlistContext";
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
  const { toggleWishlist, isInWishlist } = useWishlist();

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
      toggleWishlist(product);
    }
  };

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-20">
        <h1>Product not found</h1>
      </main>
    );
  }

  const inWishlist = isInWishlist(product.id);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <main className="bg-white min-h-screen">
      {/* <Hero /> */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:my-20">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left Side - Product Image */}
          <motion.div
            className="bg-gray-50 rounded-lg p-8 overflow-hidden"
            variants={imageVariants}
          >
            <motion.img
              src={product.image || "/shirt2.png"}
              alt={product.title}
              className="w-full object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          {/* Right Side - Product Details */}
          <motion.div className="space-y-6" variants={containerVariants}>
            {/* Title */}
            <motion.h1
              className="text-3xl font-bold uppercase tracking-tight"
              variants={itemVariants}
            >
              {product.title}
            </motion.h1>

            {/* Price */}
            <motion.div
              className="flex items-baseline gap-3"
              variants={itemVariants}
            >
              <span className="text-3xl font-light text-gray-600">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </motion.div>

            {/* Color Selection */}
            <motion.div variants={itemVariants}>
              <p className="text-sm font-medium mb-3">
                Color:{" "}
                <span className="font-bold">
                  {colorVariants[selectedColor].name}
                </span>
              </p>
              <div className="flex gap-3">
                {colorVariants.map((color, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-24 h-24 border-2 rounded-lg overflow-hidden transition ${
                      selectedColor === index
                        ? "border-black shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src="/shirt2.png"
                      alt={color.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div variants={itemVariants}>
              <p className="text-sm font-medium mb-3 uppercase tracking-wide">
                Select Size
              </p>
              <div className="flex gap-2">
                {product.sizes.map((size, index) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border transition font-medium ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:border-black"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-4"
              variants={itemVariants}
            >
              {/* Quantity */}
              <div>
                <p className="text-sm font-medium uppercase tracking-wide">
                  QTY
                </p>
                <div className="flex items-center gap-4">
                  <motion.select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-24 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    whileHover={{ scale: 1.02 }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </motion.select>
                </div>
              </div>

              {/* Add to Wishlist Button */}
              <motion.button
                onClick={handleToggleWishlist}
                className="flex items-center gap-2 px-4 mt-5 py-3 border border-gray-300 hover:border-black transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={inWishlist ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    size={20}
                    className={inWishlist ? "fill-red-500 text-red-500" : ""}
                  />
                </motion.div>
                <span className="text-sm font-medium">
                  {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </span>
              </motion.button>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 font-bold text-sm tracking-wider hover:bg-gray-800 transition uppercase"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ADD TO CART
            </motion.button>

            {/* Design & Aesthetic */}
            <motion.div
              className="pt-6 border-t"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-bold text-lg mb-3">Design & Aesthetic</h3>
              <p className="text-gray-700 leading-relaxed">
                This premium soccer jersey features a sleek, monochromatic black
                base accented with sharp white geometric line-work. The design
                creates a high-contrast, dynamic visual effect tailored for a
                professional "SetPiece" look. It includes a centered, tonal club
                crest and a minimalist sponsor logo for a clean, modern finish.
              </p>
            </motion.div>

            {/* Performance & Build */}
            <motion.div
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-bold text-lg mb-4">Performance & Build</h3>
              <motion.ul className="space-y-2 text-gray-700">
                {[
                  {
                    label: "Fabric:",
                    text: "Lightweight, breathable performance mesh designed for elite-level play.",
                  },
                  {
                    label: "Fit:",
                    text: "Standard athletic silhouette with reinforced stitching at the collar and sleeves.",
                  },
                  {
                    label: "Colors:",
                    text: "Also available in alternate White and Royal Blue colorways.",
                  },
                  {
                    label: "Sizing:",
                    text: "Offered in extended sizes including XL, XXL, and XXXL.",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <span className="text-black mt-1">•</span>
                    <span>
                      <strong>{item.label}</strong> {item.text}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <RecommendedSection />
    </main>
  );
}