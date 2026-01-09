"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/hero/Hero.png",
    eyebrow: "PREMIUM SOCCER APPAREL • US EXCLUSIVE",
    title: "SetPieces",
    description:
      "Elite kits for the modern game. Jerseys, shorts, hoodies, and accessories. Available in sizes that actually fit—XL to XXXL.",
    cta: "Shop Now",
    href: "/collections/all",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    eyebrow: "LIMITED DROPS • AUTHENTIC DESIGNS",
    title: "Match Ready",
    description:
      "Built for matchday and beyond. Premium fabrics, modern fits, and timeless football culture.",
    cta: "Explore",
    href: "/collections/new-arrivals",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
    eyebrow: "LIMITED DROPS • AUTHENTIC DESIGNS",
    title: "Game On",
    description:
      "Built for matchday and beyond. Premium fabrics, modern fits, and timeless football culture.",
    cta: "Explore",
    href: "/collections/new-arrivals",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideChange((current + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [current]);

  const handleSlideChange = (newIndex) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(newIndex);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <section className="relative w-full h-[50vh] flex overflow-hidden">
      {/* Background Images - Stacked with transitions */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === current
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
      ))}

      {/* Text Content - Left Aligned with staggered animations */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="max-w-xl text-white">
          {/* Eyebrow */}
          <p
            key={`eyebrow-${current}`}
            className="text-xs mb-4 lg:tracking-[4px] tracking-widest animate-slideInLeft"
            style={{ animationDelay: "0ms" }}
          >
            {slides[current].eyebrow}
          </p>

          {/* Title */}
          <h1
            key={`title-${current}`}
            className="text-5xl md:text-6xl font-bold mb-6 animate-slideInLeft"
            style={{ animationDelay: "100ms" }}
          >
            {slides[current].title}
          </h1>

          {/* Description */}
          <p
            key={`desc-${current}`}
            className="text-sm md:text-base tracking-tight text-gray-200 mb-8 animate-slideInLeft"
            style={{ animationDelay: "200ms" }}
          >
            {slides[current].description}
          </p>

          {/* CTA Button */}
          <a
            key={`cta-${current}`}
            href={slides[current].href}
            className="inline-block bg-white text-black px-8 py-3 rounded-md font-medium cursor-pointer hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg animate-slideInLeft"
            style={{ animationDelay: "300ms" }}
          >
            {slides[current].cta}
          </a>
        </div>
      </div>

      {/* Next Arrow with hover animation */}
      <button
        onClick={() => handleSlideChange((current + 1) % slides.length)}
        className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full cursor-pointer z-20 transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      {/* Pagination Dots with scale animation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`rounded-full cursor-pointer transition-all duration-300 ${
              index === current 
                ? "bg-white w-8 h-3" 
                : "bg-white/40 w-3 h-3 hover:bg-white/60 hover:scale-110"
            }`}
          />
        ))}
      </div>

      {/* Progress bar animation */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          className="h-full bg-white transition-all duration-[6000ms] linear"
          style={{
            width: isAnimating ? "0%" : "100%",
          }}
        />
      </div>
          </section>
    </>
  );
}