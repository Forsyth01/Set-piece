"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/app/components/product/ProductCard";

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <motion.div 
      className="flex items-center justify-center gap-2 mt-12 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-4 py-2 border transition ${
          currentPage === 1
            ? "text-gray-300 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
        }`}
        whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline text-sm">Previous</span>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
              ...
            </span>
          ) : (
            <motion.button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] px-3 py-2 border transition text-sm ${
                currentPage === page
                  ? "bg-black text-white border-black"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {page}
            </motion.button>
          )
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-4 py-2 border transition ${
          currentPage === totalPages
            ? "text-gray-300 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer"
        }`}
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
      >
        <span className="hidden sm:inline text-sm">Next</span>
        <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
};

export default function CollectionPageWithSidebar({ collection, allCollections }) {
  const [priceOpen, setPriceOpen] = useState(true);
  const [stockOpen, setStockOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [minPrice, setMinPrice] = useState(67);
  const [maxPrice, setMaxPrice] = useState(131);
  const [selectedCollections, setSelectedCollections] = useState([collection.handle]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 12;

  // Filter products based on selected filters
  const filteredProducts = collection.products.filter(product => {
    const priceInRange = product.price >= minPrice && product.price <= maxPrice;
    const stockMatch = !stockFilter || (stockFilter === "in-stock" && product.inStock) || (stockFilter === "out-of-stock" && !product.inStock);
    return priceInRange && stockMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  const handleFilterChange = (filterFn) => {
    filterFn();
    setCurrentPage(1);
  };

  const toggleCollection = (handle) => {
    handleFilterChange(() => {
      setSelectedCollections(prev => 
        prev.includes(handle) 
          ? prev.filter(h => h !== handle)
          : [...prev, handle]
      );
    });
  };

  const removeFilter = (handle) => {
    handleFilterChange(() => {
      setSelectedCollections(prev => prev.filter(h => h !== handle));
    });
  };

  const resetFilters = () => {
    setSelectedCollections([collection.handle]);
    setMinPrice(67);
    setMaxPrice(131);
    setStockFilter("");
    setCurrentPage(1);
  };

  const SidebarContent = () => (
    <>
      {/* Breadcrumb */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-gray-600">
          <a href="/" className="hover:underline cursor-pointer">Shop All</a> / <span className="font-medium">{collection.title}</span>
        </p>
        <h1 className="text-2xl font-bold mt-2 uppercase">{collection.title}</h1>
      </motion.div>

      {/* Collapse & Reset */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
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
        <AnimatePresence>
          {selectedCollections.length > 0 && (
            <motion.div 
              className="mt-3 flex flex-wrap gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {selectedCollections.map((handle, index) => {
                const col = allCollections.find(c => c.handle === handle);
                return col ? (
                  <motion.span 
                    key={handle} 
                    className="bg-white border px-3 py-1 text-sm flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {col.title}
                    <X 
                      size={14} 
                      className="cursor-pointer hover:text-red-600 transition" 
                      onClick={() => removeFilter(handle)}
                    />
                  </motion.span>
                ) : null;
              })}
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button 
          onClick={resetFilters}
          className="text-sm text-gray-600 hover:underline mt-3 flex items-center gap-1"
          whileHover={{ x: 3 }}
        >
          Reset All <span className="text-gray-400">○</span>
        </motion.button>
      </motion.div>

      {/* Price Filter */}
      <motion.div 
        className="mb-6 border-t pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <button 
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex justify-between items-center w-full text-left font-medium mb-3"
        >
          Price
          <motion.div
            animate={{ rotate: priceOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {priceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.div>
        </button>
        
        <AnimatePresence>
          {priceOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-4 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 block mb-1">Min</label>
                  <input 
                    type="number" 
                    value={minPrice}
                    onChange={(e) => handleFilterChange(() => setMinPrice(Number(e.target.value)))}
                    className="w-full border px-2 py-1 text-sm rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-600 block mb-1">Max</label>
                  <input 
                    type="number" 
                    value={maxPrice}
                    onChange={(e) => handleFilterChange(() => setMaxPrice(Number(e.target.value)))}
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
                onChange={(e) => handleFilterChange(() => setMaxPrice(Number(e.target.value)))}
                className="w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stock Filter */}
      <motion.div 
        className="mb-6 border-t pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <button 
          onClick={() => setStockOpen(!stockOpen)}
          className="flex justify-between items-center w-full text-left font-medium mb-3"
        >
          Stock
          <motion.div
            animate={{ rotate: stockOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {stockOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.div>
        </button>
        
        <AnimatePresence>
          {stockOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <select 
                value={stockFilter}
                onChange={(e) => handleFilterChange(() => setStockFilter(e.target.value))}
                className="w-full border px-3 py-2 text-sm text-gray-600 rounded"
              >
                <option value="">Select an option</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Collections Filter */}
      <motion.div 
        className="mb-6 border-t pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button 
          onClick={() => setCollectionsOpen(!collectionsOpen)}
          className="flex justify-between items-center w-full text-left font-medium mb-3"
        >
          Collections
          <motion.div
            animate={{ rotate: collectionsOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {collectionsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.div>
        </button>
        
        <AnimatePresence>
          {collectionsOpen && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {allCollections.map((col, index) => (
                <motion.label 
                  key={col.handle} 
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-black"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 3 }}
                >
                  <input 
                    type="checkbox" 
                    className="w-4 h-4" 
                    checked={selectedCollections.includes(col.handle)}
                    onChange={() => toggleCollection(col.handle)}
                  />
                  {col.title}
                </motion.label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden fixed top-20 left-4 z-50 bg-black text-white p-3 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Menu size={20} />
      </motion.button>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 bg-gray-50 p-6 border-r overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile (Overlay) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside 
              className="lg:hidden fixed top-0 left-0 bottom-0 w-80 bg-gray-50 p-6 z-50 overflow-y-auto"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Results Count */}
        <motion.div 
          className="mb-6 flex justify-between items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          {totalPages > 0 && (
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </motion.div>

        {/* Product Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {currentProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>

        {/* No Results */}
        <AnimatePresence>
          {filteredProducts.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <p className="text-gray-600 text-lg mb-4">No products found</p>
              <motion.button 
                onClick={resetFilters}
                className="bg-black text-white px-6 py-3 hover:bg-gray-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
}