"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/app/components/product/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Import all your products
import { accessories } from "@/app/lib/mock-accessories";
import { girlsCollections } from "@/app/lib/mock-girls-collections";
import { hoodiesJoggers } from "@/app/lib/mock-hoodies-joggers";
import { newArrivals } from "@/app/lib/mock-new-arrivals";
import { soccerShorts } from "@/app/lib/mock-soccer-shorts";
import { theVault } from "@/app/lib/mock-the-vault";

// Combine all products
const ALL_PRODUCTS = [
  ...accessories,
  ...girlsCollections,
  ...hoodiesJoggers,
  ...newArrivals,
  ...soccerShorts,
  ...theVault,
];

// Collection names for category search
const COLLECTIONS = {
  accessories: { title: "Accessories", products: accessories },
  "girls-collections": { title: "Girls Collections", products: girlsCollections },
  "hoodies-joggers": { title: "Hoodies & Joggers", products: hoodiesJoggers },
  "new-arrivals": { title: "New Arrivals", products: newArrivals },
  "soccer-shorts": { title: "Soccer Shorts", products: soccerShorts },
  "the-vault": { title: "The Vault", products: theVault },
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [matchedCollections, setMatchedCollections] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setMatchedCollections([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();

    // Search products by title
    const productResults = ALL_PRODUCTS.filter((product) =>
      product.title.toLowerCase().includes(searchTerm)
    );

    // Search collections by name
    const collectionMatches = Object.entries(COLLECTIONS).filter(
      ([handle, collection]) =>
        collection.title.toLowerCase().includes(searchTerm)
    );

    setResults(productResults);
    setMatchedCollections(collectionMatches);
  }, [query]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            Found {results.length} product{results.length !== 1 ? "s" : ""} 
            {matchedCollections.length > 0 && ` and ${matchedCollections.length} collection${matchedCollections.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Matched Collections */}
        {matchedCollections.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {matchedCollections.map(([handle, collection]) => (
                <Link
                  key={handle}
                  href={`/collections/${handle}`}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-105"
                >
                  <h3 className="font-bold text-lg mb-2">{collection.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {collection.products.length} products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Product Results */}
        {results.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : query && matchedCollections.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">No results found</h2>
            <p className="text-gray-600 mb-8">
              Try searching with different keywords
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
            >
              Back to Home
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}