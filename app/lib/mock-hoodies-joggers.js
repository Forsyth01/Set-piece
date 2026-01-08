// Football/Soccer hoodies and joggers with relevant images
const hoodiesJoggersImages = [
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", // black hoodie
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop", // grey joggers
  "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=400&fit=crop", // sports hoodie
  "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop", // tracksuit
  "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop", // hoodie and joggers set
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop", // athletic wear
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop", // sports pants
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop", // training gear
];

export const hoodiesJoggers = Array.from({ length: 8 }).map((_, i) => ({
  id: `hoodies-${i}`,
  title: "GLORY IN MOTION",
  handle: `hoodies-joggers-${i}`,
  image: hoodiesJoggersImages[i],
  price: 122.0,
  compareAtPrice: null,
  isNew: true,
  sizes: ["XL", "XXL", "XXXL"],
}));

