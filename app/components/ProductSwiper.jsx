"use client";

import Link from "next/link";

export default function ProductSwiper({
  eyebrow,
  title,
  products = [],
  ProductCard,
  viewAllText = "Want more of this?",
  viewAllHref,
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 sm:py-20">
      {/* Header */}
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

      {/* Product Grid */}
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
        "
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All */}
      {viewAllHref && (
        <div className="mt-16 flex items-center justify-between">
          <p className="text-gray-600 text-[clamp(0.75rem,1.2vw,0.9rem)]">
            {viewAllText}
          </p>

          <Link
            href={viewAllHref}
            className="border font-bold rounded-sm px-6 py-3 text-sm hover:bg-black hover:text-white transition"
          >
            VIEW ALL
          </Link>
        </div>
      )}
    </section>
  );
}
