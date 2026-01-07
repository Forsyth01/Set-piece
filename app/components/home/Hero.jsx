"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/hero/Hero.png",
   
    eyebrow: "PREMIUM SOCCER APPAREL • US EXCLUSIVE",
    title: "SetPiece",
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

  // Auto slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[50vh] flex overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slides[current].image}
          alt={slides[current].title}
          className="w-full h-full object-cover transition-opacity duration-800"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>

      {/* Text Content - Left Aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="max-w-xl text-white">
          <p className="text-xs mb-4 lg:tracking-[4px] tracking-widest">
            {slides[current].eyebrow}
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {slides[current].title}
          </h1>

          <p className="text-sm md:text-base tracking-tight text-gray-200 mb-8">
            {slides[current].description}
          </p>

          <a
            href={slides[current].href}
            className="inline-block bg-white text-black px-8 py-3 rounded-md font-medium cursor-pointer hover:bg-gray-200 transition"
          >
            {slides[current].cta}
          </a>
        </div>
      </div>

      {/* Next Arrow */}
      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full cursor-pointer z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === current ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}