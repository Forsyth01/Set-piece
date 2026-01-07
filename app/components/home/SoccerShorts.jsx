import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";
import { soccerShorts } from "../../lib/mock-soccer-shorts";

export default function SoccerShorts() {
  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="SOCCER SHORTS"
      products={soccerShorts}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/soccer-shorts"
    />
  );
}
