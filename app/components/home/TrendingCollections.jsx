import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";
import { getCollectionByHandle } from "@/app/lib/shopify/api";

export default async function TrendingCollections() {
  const collection = await getCollectionByHandle("trendy-collections", 8);
  const products = collection?.products || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="TRENDY COLLECTIONS"
      products={products}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/trendy-collections"
    />
  );
}
