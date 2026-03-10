import CollectionPageWithSidebar from "@/app/components/CollectionPageWithSidebar";
import Newsletter from "@/app/components/home/Newsletter";
import {
  getCollectionByHandle,
  getAllCollections,
} from "@/app/lib/shopify/api";

export default async function CollectionPage({ params }) {
  const { handle } = await params;

  // Fetch collection and all collections from Shopify in parallel
  const [collection, allCollections] = await Promise.all([
    getCollectionByHandle(handle),
    getAllCollections(),
  ]);

  if (!collection) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
        <p className="text-gray-600">
          The collection "{handle}" does not exist or has no products.
        </p>
        <p className="mt-4">
          <a href="/" className="text-blue-600 hover:underline">
            Return to home
          </a>
        </p>
      </main>
    );
  }

  return (
    <>
      <CollectionPageWithSidebar
        collection={collection}
        allCollections={allCollections}
      />
      {/* <Newsletter /> */}
    </>
  );
}

// Generate static params for known collections (enables ISR)
export async function generateStaticParams() {
  try {
    const collections = await getAllCollections();
    return collections.map((collection) => ({
      handle: collection.handle,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Revalidate every 60 seconds
export const revalidate = 60;
