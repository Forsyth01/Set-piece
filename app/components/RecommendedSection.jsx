"use client";

import ProductCard from "@/app/components/product/ProductCard";
import { accessories } from "../lib/mock-accessories";
import { hoodiesJoggers } from "../lib/mock-hoodies-joggers";
import { girlsCollections } from "../lib/mock-girls-collections";
import { newArrivals } from "../lib/mock-new-arrivals";
import { soccerShorts } from "../lib/mock-soccer-shorts";


export default function RecommendedSection() {
  // Combine all products from different collections
  const allProducts = [
    ...accessories,
    ...hoodiesJoggers,
    ...girlsCollections,
    ...newArrivals,
    ...soccerShorts,
  ];

  // Shuffle and get 4 random products
  const getRandomProducts = (products, count = 4) => {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const recommendedProducts = getRandomProducts(allProducts, 4);

  return (
    <section className="py-12 md:my-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-gray-500 text-sm tracking-widest uppercase mb-2">
            SETPIECE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            RECOMMENDED FOR YOU
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}