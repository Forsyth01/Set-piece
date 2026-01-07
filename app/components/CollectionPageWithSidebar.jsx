"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Menu } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";

export default function CollectionPageWithSidebar({ collection, allCollections }) {
  const [priceOpen, setPriceOpen] = useState(true);
  const [stockOpen, setStockOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [minPrice, setMinPrice] = useState(67);
  const [maxPrice, setMaxPrice] = useState(131);
  const [selectedCollections, setSelectedCollections] = useState([collection.handle]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState("");

  // Filter products based on selected filters
  const filteredProducts = collection.products.filter(product => {
    const priceInRange = product.price >= minPrice && product.price <= maxPrice;
    const stockMatch = !stockFilter || (stockFilter === "in-stock" && product.inStock) || (stockFilter === "out-of-stock" && !product.inStock);
    return priceInRange && stockMatch;
  });

  const toggleCollection = (handle) => {
    setSelectedCollections(prev => 
      prev.includes(handle) 
        ? prev.filter(h => h !== handle)
        : [...prev, handle]
    );
  };

  const removeFilter = (handle) => {
    setSelectedCollections(prev => prev.filter(h => h !== handle));
  };

  const resetFilters = () => {
    setSelectedCollections([collection.handle]);
    setMinPrice(67);
    setMaxPrice(131);
    setStockFilter("");
  };

  const SidebarContent = () => (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          <a href="/" className="hover:underline cursor-pointer">Shop All</a> / <span className="font-medium">{collection.title}</span>
        </p>
        <h1 className="text-2xl font-bold mt-2 uppercase">{collection.title}</h1>
      </div>

      {/* Collapse & Reset */}
      <div className="mb-6">
        <button 
          onClick={() => {
            setPriceOpen(false);
            setStockOpen(false);
            setCollectionsOpen(false);
          }}
          className="text-sm text-gray-600 hover:underline"
        >
          Collapse All -
        </button>
        
        {/* Active Filters */}
        {selectedCollections.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedCollections.map(handle => {
              const col = allCollections.find(c => c.handle === handle);
              return col ? (
                <span key={handle} className="bg-white border px-3 py-1 text-sm flex items-center gap-2">
                  {col.title}
                  <X 
                    size={14} 
                    className="cursor-pointer hover:text-red-600" 
                    onClick={() => removeFilter(handle)}
                  />
                </span>
              ) : null;
            })}
          </div>
        )}
        
        <button 
          onClick={resetFilters}
          className="text-sm text-gray-600 hover:underline mt-3 flex items-center gap-1"
        >
          Reset All <span className="text-gray-400">○</span>
        </button>
      </div>

      {/* Price Filter */}
      <div className="mb-6 border-t pt-4">
        <button 
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex justify-between items-center w-full text-left font-medium mb-3"
        >
          Price
          {priceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {priceOpen && (
          <div>
            <div className="flex gap-4 mb-3">
              <div className="flex-1">
                <label className="text-xs text-gray-600 block mb-1">Min</label>
                <input 
                  type="number" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full border px-2 py-1 text-sm rounded"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 block mb-1">Max</label>
                <input 
                  type="number" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full border px-2 py-1 text-sm rounded"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              ${minPrice} - ${maxPrice}
            </div>
            <input 
              type="range" 
              min="67" 
              max="250" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Stock Filter */}
      <div className="mb-6 border-t pt-4">
        <button 
          onClick={() => setStockOpen(!stockOpen)}
          className="flex justify-between items-center w-full text-left font-medium mb-3"
        >
          Stock
          {stockOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {stockOpen && (
          <div>
            <select 
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full border px-3 py-2 text-sm text-gray-600 rounded"
            >
              <option value="">Select an option</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        )}
      </div>

      {/* Collections Filter */}
      <div className="mb-6 border-t pt-4">
        <button 
          onClick={() => setCollectionsOpen(!collectionsOpen)}
          className="flex justify-between items-center w-full text-left font-medium mb-3"
        >
          Collections
          {collectionsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {collectionsOpen && (
          <div className="space-y-2">
            {allCollections.map((col) => (
              <label key={col.handle} className="flex items-center gap-2 text-sm cursor-pointer hover:text-black">
                <input 
                  type="checkbox" 
                  className="w-4 h-4" 
                  checked={selectedCollections.includes(col.handle)}
                  onChange={() => toggleCollection(col.handle)}
                />
                {col.title}
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-black text-white p-3 rounded-full shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 bg-gray-50 p-6 border-r overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile (Overlay) */}
      {sidebarOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-gray-50 p-6 z-50 overflow-y-auto">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={24} />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {collection.products.length} products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">No products found</p>
            <button 
              onClick={resetFilters}
              className="bg-black text-white px-6 py-3 hover:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}