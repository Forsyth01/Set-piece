import Hero from "@/app/components/home/Hero";
import ProductCard from "@/app/components/product/ProductCard";
import { accessories } from "@/app/lib/mock-accessories";
import { girlsCollections } from "@/app/lib/mock-girls-collections";
import { hoodiesJoggers } from "@/app/lib/mock-hoodies-joggers";
import { newArrivals } from "@/app/lib/mock-new-arrivals";
import { soccerShorts } from "@/app/lib/mock-soccer-shorts";
import { theVault } from "@/app/lib/mock-the-vault";

const COLLECTION_MAP = {
  accessories: { title: "Accessories", products: accessories },
  "girls-collections": {
    title: "Girls Collections",
    products: girlsCollections,
  },
  "hoodies-joggers": { title: "Hoodies & Joggers", products: hoodiesJoggers },
  "new-arrivals": { title: "New Arrivals", products: newArrivals },
  "soccer-shorts": { title: "Soccer Shorts", products: soccerShorts },
  "the-vault": { title: "The Vault", products: theVault },
};

export default async function CollectionPage({ params }) {
  const { handle } = await params;

  const collection = COLLECTION_MAP[handle];

  if (!collection) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1>Collection not found</h1>
        <p>Handle: {handle}</p>
      </main>
    );
  }

  return (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Heading */}
        <div className="mb-12">
          <span className="tracking-widest text-gray-400 text-[clamp(0.6rem,1.1vw,0.75rem)]">
            SETPIECE
          </span>
          <h2 className="font-bold mt-2 text-[clamp(1.5rem,3vw,2.2rem)]">
            {collection.title.toUpperCase()}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {collection.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
}
