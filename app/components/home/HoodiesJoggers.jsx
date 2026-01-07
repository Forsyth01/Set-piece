import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";
import { hoodiesJoggers } from "../../lib/mock-hoodies-joggers";

export default function HoodiesJoggers() {
  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="HOODIES & JOGGERS"
      products={hoodiesJoggers}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/hoodies-joggers"
    />
  );
}
