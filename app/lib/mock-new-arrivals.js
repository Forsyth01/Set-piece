export const newArrivals = Array.from({ length: 8 }).map((_, i) => ({
  id: `new-${i}`,
  title: "GLORY IN MOTION",
  handle: `glory-in-motion-${i}`,
  image: "/products/shorts-black.jpg",
  price: 122.0,
  compareAtPrice: null,
  isNew: true,
  sizes: ["XL", "XXL", "XXXL"],
}));
