import { products } from "@/app/lib/mock-products";
import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";

export default function TrendingCollections() {
  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="TRENDY COLLECTIONS"
      products={products}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/trendy"
    />
  );
}