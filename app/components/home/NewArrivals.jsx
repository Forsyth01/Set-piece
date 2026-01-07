import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";
import { newArrivals } from "../../lib/mock-new-arrivals";

export default function NewArrivals() {
  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="NEW ARRIVALS"
      products={newArrivals}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/new-arrivals"
    />
  );
}
