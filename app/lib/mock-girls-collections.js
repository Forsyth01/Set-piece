export const girlsCollections = Array.from({ length: 8 }).map((_, i) => ({
  id: `girls-${i}`,
  title: "GIRLS MATCH KIT",
  handle: `girls-collection-${i}`,
  image: "/products/girls-kit.jpg",
  price: 118.0,
  compareAtPrice: i % 3 === 0 ? 148.0 : null,
  isNew: i < 4,
  sizes: ["XS", "S", "M", "L", "XL"],
}));
