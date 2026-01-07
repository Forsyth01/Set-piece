import { useState, useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';

// Product Card Component with actual Cart & Wishlist functionality
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group">
      {/* Image */}
      <div className="relative bg-gray-100 p-4">
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

        <a href={`/products/${product.handle || product.id}`}>
          <img
            src={product.image || "/shirt2.png"}
            alt={product.title || product.name}
            className="w-full object-contain"
          />
        </a>
      </div>

      {/* Sizes */}
      <div className="flex gap-2 mt-3">
        {(product.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`border px-2 py-0.5 text-[clamp(0.55rem,1vw,0.7rem)] cursor-pointer transition ${
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
      <h3 className="mt-3 tracking-normal font-semibold text-[clamp(0.85rem,1.4vw,1rem)]">
        {product.title || product.name}
      </h3>

      {/* Price */}
      <div className="flex gap-2 items-center mt-1">
        <span className="font-medium text-[clamp(0.8rem,1.3vw,0.95rem)]">
          ${product.price?.toFixed(2) || product.price}
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
        className="mt-4 w-full bg-black text-white py-3 cursor-pointer hover:bg-gray-800 transition text-[clamp(0.75rem,1.2vw,0.9rem)]"
      >
        ADD TO CART
      </button>
    </div>
  );
}

// Mock products data
const products = [
  { 
    id: 1, 
    name: 'Premium Jersey', 
    title: 'Premium Jersey',
    price: 99.99, 
    compareAtPrice: 129.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    handle: 'premium-jersey'
  },
  { 
    id: 2, 
    name: 'Classic Kit', 
    title: 'Classic Kit',
    price: 149.99,
    sizes: ['M', 'L', 'XL', 'XXL'],
    handle: 'classic-kit'
  },
  { 
    id: 3, 
    name: 'Training Top', 
    title: 'Training Top',
    price: 79.99,
    compareAtPrice: 99.99,
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    handle: 'training-top'
  },
  { 
    id: 4, 
    name: 'Match Shorts', 
    title: 'Match Shorts',
    price: 59.99,
    sizes: ['M', 'L', 'XL', 'XXL'],
    handle: 'match-shorts'
  },
  { 
    id: 5, 
    name: 'Hoodie', 
    title: 'Hoodie',
    price: 89.99,
    sizes: ['L', 'XL', 'XXL', 'XXXL'],
    handle: 'hoodie'
  },
  { 
    id: 6, 
    name: 'Track Jacket', 
    title: 'Track Jacket',
    price: 119.99,
    compareAtPrice: 149.99,
    sizes: ['M', 'L', 'XL', 'XXL'],
    handle: 'track-jacket'
  },
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
    const walk = (x - startX) * 1.5; // Reduced multiplier for smoother movement
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isMobile) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Reduced multiplier for smoother movement
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
            ? 'flex overflow-x-auto gap-4 scrollbar-hide -mx-6 px-6' 
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
          }
          ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab lg:cursor-default'}
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`
              ${isMobile ? 'min-w-[75vw] sm:min-w-[45vw]' : ''}
            `}
            onDragStart={(e) => e.preventDefault()} // Prevent image drag
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

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