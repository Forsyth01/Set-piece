import ProductCard from "../product/ProductCard";
import { soccerShorts } from "../../lib/mock-soccer-shorts";
import Link from "next/link";

export default function SoccerShorts() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <div className="mb-12">
        <span
          className="tracking-widest text-gray-400
          text-[clamp(0.6rem,1.1vw,0.75rem)] inter"
        >
          SETPIECE
        </span>

        <h2
          className="font-bold mt-2
          text-[clamp(1.5rem,3vw,2.2rem)] black"
        >
          SOCCER SHORTS
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {soccerShorts.map((product) => (
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
          href="/collections/soccer-shorts"
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
