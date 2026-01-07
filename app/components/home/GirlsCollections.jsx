import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";
import { girlsCollections } from "../../lib/mock-girls-collections";

export default function GirlsCollections() {
  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="GIRLS’ COLLECTIONS"
      products={girlsCollections}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/girls"
    />
  );
}
