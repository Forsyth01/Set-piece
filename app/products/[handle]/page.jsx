import {
  getProductByHandle,
  getProductRecommendations,
  getAllProducts,
} from "@/app/lib/shopify/api";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
  const { handle } = await params;

  // Fetch product from Shopify
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Fetch recommendations (if product has Shopify ID)
  let recommendations = [];
  try {
    if (product.id) {
      recommendations = await getProductRecommendations(product.id);
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
  }

  return <ProductClient product={product} recommendations={recommendations} />;
}

// Generate static params for all products (enables ISR)
export async function generateStaticParams() {
  try {
    const products = await getAllProducts(100);
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Revalidate every 60 seconds
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} | SetPiece`,
    description: product.description || `Shop ${product.title} at SetPiece`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.image ? [{ url: product.image }] : [],
    },
  };
}
