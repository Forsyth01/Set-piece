import ProductCard from "../product/ProductCard";
import { newArrivals } from "../../lib/mock-new-arrivals";
import Link from "next/link";

export default function NewArrivals() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <div className="mb-12">
        <span
          className="tracking-widest text-gray-400
          text-[clamp(0.6rem,1.1vw,0.75rem)]"
        >
          SETPIECE
        </span>

        <h2
          className="font-bold mt-2
          text-[clamp(1.5rem,3vw,2.2rem)]"
        >
          NEW ARRIVALS
        </h2>
      </div>

      {/* Grid (2 rows on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 flex justify-between items-center">
        <p
          className="text-gray-600
          text-[clamp(0.75rem,1.2vw,0.9rem)]"
        >
          Want more of this?
        </p>

        <Link
          href="/collections/new-arrivals"
          className="border px-6 py-3 cursor-pointer
            hover:bg-black hover:text-white transition
            text-[clamp(0.75rem,1.2vw,0.9rem)]"
        >
          VIEW ALL
        </Link>
      </div>
    </section>
  );
}
