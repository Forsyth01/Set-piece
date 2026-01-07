import { useState, useRef, useEffect } from 'react';

// Mock Product Card Component (replace with your actual import)
function ProductCard({ product }) {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <div className="aspect-square bg-gray-100 mb-4 flex items-center justify-center">
        <span className="text-gray-400 text-sm">{product.name}</span>
      </div>
      <h3 className="font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
    </div>
  );
}

// Mock products data (replace with your actual import)
const products = [
  { id: 1, name: 'Product 1', price: 99 },
  { id: 2, name: 'Product 2', price: 149 },
  { id: 3, name: 'Product 3', price: 199 },
  { id: 4, name: 'Product 4', price: 249 },
  { id: 5, name: 'Product 5', price: 299 },
  { id: 6, name: 'Product 6', price: 349 },
];

export default function TrendingCollections() {
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseDown = (e) => {
    if (!isMobile) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isMobile) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isMobile) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <div className="mb-12">
        <span className="tracking-widest text-gray-400 text-[clamp(0.6rem,1.1vw,0.75rem)]">
          SETPIECE
        </span>

        <h2 className="font-bold mt-2 text-[clamp(1.5rem,3vw,2.2rem)]">
          TRENDY COLLECTIONS
        </h2>
      </div>

      {/* Grid / Swiper */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        className={`
          ${isMobile 
            ? 'flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6' 
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
          }
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`
              ${isMobile ? 'min-w-[75vw] sm:min-w-[45vw] snap-center' : ''}
            `}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Scroll Indicator (Mobile Only) */}
      {/* Removed as per user request */}

      {/* View All */}
      <div className="mt-16 flex justify-between items-center">
        <p className="text-gray-600 text-[clamp(0.75rem,1.2vw,0.9rem)]">
          Want more of this?
        </p>

        <a
          href="/collections/trendy"
          className="border px-6 py-3 cursor-pointer hover:bg-black hover:text-white transition text-[clamp(0.75rem,1.2vw,0.9rem)]"
        >
          VIEW ALL
        </a>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}