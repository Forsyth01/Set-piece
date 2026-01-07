import ProductSwiper from "../ProductSwiper";
import ProductCard from "../product/ProductCard";
import { theVault } from "../../lib/mock-the-vault";

export default function TheVault() {
  return (
    <ProductSwiper
      eyebrow="SETPIECE"
      title="THE VAULT"
      products={theVault}
      ProductCard={ProductCard}
      viewAllText="Want more of this?"
      viewAllHref="/collections/the-vault"
    />
  );
}
