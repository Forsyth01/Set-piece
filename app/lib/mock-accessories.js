export const accessories = Array.from({ length: 8 }).map((_, i) => ({
  id: `accessory-${i}`,
  title: "LEGACY PREMIUM ACCESSORY",
  handle: `accessory-${i}`,
  image: "/shirt2.png",
//   image: "/products/accessory.jpg",
  price: 122.0,
  compareAtPrice: i % 2 === 0 ? 154.03 : null,
  isNew: i < 3,
  sizes: ["XL", "XXL", "XXXL"],
}));
