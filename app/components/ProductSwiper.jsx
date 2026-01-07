"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function ProductSwiper({
  eyebrow,
  title,
  products,
  ProductCard,
  viewAllText = "Want more of this?",
  viewAllHref,
}) {
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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isMobile) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 sm:py-20 py-10">
      <div className="mb-12">
        {eyebrow && (
          <span className="tracking-widest text-gray-400 text-[clamp(0.6rem,1.1vw,0.75rem)]">
            {eyebrow}
          </span>
        )}
        <h2 className="font-bold mt-2 text-[clamp(1.5rem,3vw,2.2rem)]">
          {title}
        </h2>
      </div>

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
          ${
            isMobile
              ? "flex overflow-x-auto gap-4 scrollbar-hide -mx-6 px-6"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          }
          ${
            isDragging
              ? "cursor-grabbing select-none"
              : "cursor-grab lg:cursor-default"
          }
        `}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={isMobile ? "min-w-[75vw] sm:min-w-[45vw]" : ""}
            onDragStart={(e) => e.preventDefault()}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {viewAllHref && (
        <div className="mt-16 flex justify-between items-center">
          <p className="text-gray-600 text-[clamp(0.75rem,1.2vw,0.9rem)]">
            {viewAllText}
          </p>

          <Link
            href={viewAllHref}
            className="border px-6 py-3 hover:bg-black hover:text-white transition text-[clamp(0.75rem,1.2vw,0.9rem)]"
          >
            VIEW ALL
          </Link>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
