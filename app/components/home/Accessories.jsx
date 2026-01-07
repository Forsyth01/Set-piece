import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";
import { accessories } from "../../lib/mock-accessories";

export default function Accessories() {
  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="ACCESSORIES"
      products={accessories}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/accessories"
    />
  );
}
