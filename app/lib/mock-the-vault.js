export const theVault = Array.from({ length: 8 }).map((_, i) => ({
  id: `vault-${i}`,
  title: "VAULT EXCLUSIVE",
  handle: `the-vault-${i}`,
  image: "/products/vault-item.jpg",
  price: 122.0,
  compareAtPrice: 154.03,
  isNew: false,
  sizes: ["XL", "XXL", "XXXL"],
}));
