// Girls football/soccer match kits with relevant images
const girlsCollectionImages = [
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop", // soccer kit
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=400&fit=crop", // girls sports uniform
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop", // football jersey
  "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&h=400&fit=crop", // youth sports kit
  "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=400&fit=crop", // soccer apparel
  "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=400&fit=crop", // athletic wear
  "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=400&fit=crop", // sports uniform
  "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=400&h=400&fit=crop", // training kit
];

export const girlsCollections = Array.from({ length: 8 }).map((_, i) => ({
  id: `girls-${i}`,
  title: "GIRLS MATCH KIT",
  handle: `girls-collection-${i}`,
  image: girlsCollectionImages[i],
  price: 118.0,
  compareAtPrice: i % 3 === 0 ? 148.0 : null,
  isNew: i < 4,
sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
}));

