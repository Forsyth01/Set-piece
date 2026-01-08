// Football/Soccer shorts with relevant images
const soccerShortsImages = [
  "https://images.unsplash.com/photo-1593032465172-3809bbaf79e6?w=400&h=400&fit=crop", // black shorts
  "https://images.unsplash.com/photo-1593032465172-1f783d3c24e4?w=400&h=400&fit=crop", // blue sports shorts
  "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&h=400&fit=crop", // training shorts
  "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop", // youth football shorts
  "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop", // football kit bottom
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop", // athletic shorts
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", // black training shorts
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop", // sports practice shorts
];

export const soccerShorts = Array.from({ length: 8 }).map((_, i) => ({
  id: `shorts-${i}`,
  title: "GLORY IN MOTION",
  handle: `soccer-shorts-${i}`,
  image: soccerShortsImages[i],
  price: 122.0,
  compareAtPrice: null,
  isNew: true,
  sizes: ["XL", "XXL", "XXXL"],
}));
