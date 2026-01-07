import { products } from "@/app/lib/mock-products";
import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";

export default function TrendingCollections() {
  // Only take the first 4 products
  const trendingProducts = products.slice(0, 4);

  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="TRENDY COLLECTIONS"
      products={trendingProducts}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/trendy"
    />
  );
}
