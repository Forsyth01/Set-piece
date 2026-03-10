"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/app/components/product/ProductCard";
import Link from "next/link";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import { searchProducts, getAllCollections } from "@/app/lib/shopify/api";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [collections, setCollections] = useState([]);
  const [matchedCollections, setMatchedCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all collections on mount for collection matching
  useEffect(() => {
    async function fetchCollections() {
      try {
        const allCollections = await getAllCollections();
        setCollections(allCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
    fetchCollections();
  }, []);

  // Search products when query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      setMatchedCollections([]);
      return;
    }

    async function performSearch() {
      setIsLoading(true);
      try {
        // Search products via Shopify API
        const productResults = await searchProducts(query, 50);
        setResults(productResults);

        // Match collections locally
        const searchTerm = query.toLowerCase().trim();
        const collectionMatches = collections.filter((collection) =>
          collection.title.toLowerCase().includes(searchTerm)
        );
        setMatchedCollections(collectionMatches);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [query, collections]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
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
          {!isLoading && (
            <p className="text-gray-600">
              Found {results.length} product{results.length !== 1 ? "s" : ""}
              {matchedCollections.length > 0 &&
                ` and ${matchedCollections.length} collection${
                  matchedCollections.length !== 1 ? "s" : ""
                }`}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-gray-400 mb-4" />
            <p className="text-gray-600">Searching products...</p>
          </div>
        ) : (
          <>
            {matchedCollections.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Collections</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {matchedCollections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.handle}`}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-105"
                    >
                      <h3 className="font-bold text-lg mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {collection.productCount || 0} products
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : query && matchedCollections.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No results found</h2>
                <p className="text-gray-600 mb-8">
                  We couldn't find any products matching "{query}". Try searching with different keywords.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
                >
                  Back to Home
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
