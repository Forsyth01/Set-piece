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
  accessories: { 
    title: "Accessories", 
    products: accessories, 
    handle: "accessories" 
  },
  "girls-collections": {
    title: "Girls Collections",
    products: girlsCollections,
    handle: "girls-collections"
  },
  "hoodies-joggers": { 
    title: "Hoodies & Joggers", 
    products: hoodiesJoggers,
    handle: "hoodies-joggers"
  },
  "new-arrivals": { 
    title: "New Arrivals", 
    products: newArrivals,
    handle: "new-arrivals"
  },
  "soccer-shorts": { 
    title: "Soccer Shorts", 
    products: soccerShorts,
    handle: "soccer-shorts"
  },
  "the-vault": { 
    title: "The Vault", 
    products: theVault,
    handle: "the-vault"
  },
  "trendy-collections": { 
    title: "Trendy Collections", 
    products: trendingCollections,
    handle: "trendy-collections"
  },
};

const ALL_COLLECTIONS = [
  { title: "New Arrivals", handle: "new-arrivals" },
  { title: "Accessories", handle: "accessories" },
  { title: "Girls Collections", handle: "girls-collections" },
  { title: "Hoodies & Joggers", handle: "hoodies-joggers" },
  { title: "Soccer Shorts", handle: "soccer-shorts" },
  { title: "The Vault", handle: "the-vault" },
  { title: "Trendy Collections", handle: "trendy-collections" },
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