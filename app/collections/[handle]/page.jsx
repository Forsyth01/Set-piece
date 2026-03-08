import Hero from "@/app/components/home/Hero";
import CollectionPageWithSidebar from "@/app/components/CollectionPageWithSidebar";
import { accessories } from "@/app/lib/mock-accessories";
import { hoodiesJoggers } from "@/app/lib/mock-hoodies-joggers";
import { newArrivals } from "@/app/lib/mock-new-arrivals";
import { soccerShorts } from "@/app/lib/mock-soccer-shorts";
import { theVault } from "@/app/lib/mock-the-vault";
import Newsletter from "@/app/components/home/Newsletter";
import { girlsCollections } from "@/app/lib/mock-girls-collections";
import { trendingCollections } from "@/app/lib/mock-trending-collections";

const COLLECTION_MAP = {
  shorts: {
    title: "Shorts",
    products: soccerShorts,
    handle: "shorts"
  },
  jerseys: {
    title: "Jerseys",
    products: newArrivals,
    handle: "jerseys"
  },
  caps: {
    title: "Caps",
    products: accessories,
    handle: "caps"
  },
  hoodie: {
    title: "Hoodie",
    products: hoodiesJoggers,
    handle: "hoodie"
  },
  sweatshirts: {
    title: "Sweatshirts",
    products: theVault,
    handle: "sweatshirts"
  },
  sweatpants: {
    title: "Sweatpants",
    products: trendingCollections,
    handle: "sweatpants"
  },
  // Keep old routes for backward compatibility
  "girls-collections": {
    title: "Girls Collections",
    products: girlsCollections,
    handle: "girls-collections"
  },
};

const ALL_COLLECTIONS = [
  { title: "Shorts", handle: "shorts" },
  { title: "Jerseys", handle: "jerseys" },
  { title: "Caps", handle: "caps" },
  { title: "Hoodie", handle: "hoodie" },
  { title: "Sweatshirts", handle: "sweatshirts" },
  { title: "Sweatpants", handle: "sweatpants" },
];

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
      {/* <Hero /> */}
      <CollectionPageWithSidebar 
        collection={collection} 
        allCollections={ALL_COLLECTIONS}
      />
      <Newsletter/>
    </>
  );
}