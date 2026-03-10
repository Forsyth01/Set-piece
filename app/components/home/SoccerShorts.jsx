import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";
import { getCollectionByHandle } from "@/app/lib/shopify/api";

export default async function SoccerShorts() {
  const collection = await getCollectionByHandle("shorts", 8);
  const products = collection?.products || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="SOCCER SHORTS"
      products={products}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/shorts"
    />
  );
}
