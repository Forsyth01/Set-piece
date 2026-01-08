const newArrivalsImages = [
  "https://media.istockphoto.com/id/2189087096/photo/happy-soccer-girls-bonding-in-practice.jpg?s=612x612&w=400&h=400&fit=crop", // girls in practice, black shorts visible
  "https://theecnl.com/images/2025/6/4/DSC00886_89.jpeg?w=400&h=400&fit=crop", // ECNL girls team action, dark shorts
  "https://media.istockphoto.com/id/1455482890/photo/cheerful-girls-soccer-team-celebrating-after-winning-match.jpg?s=612x612&w=400&h=400&fit=crop", // celebrating team in black shorts
  "https://media.istockphoto.com/id/1193487256/photo/soccer-girls-huddling-after-winning-match.jpg?s=612x612&w=400&h=400&fit=crop", // huddle shot, visible black shorts
  "https://equalizersoccer.com/wp-content/uploads/2023/02/OCSC1930.jpg?w=400&h=400&fit=crop", // Orlando Pride in black shorts
  "https://www.shutterstock.com/image-photo/competitive-concentrated-teen-girl-soccer-600nw-2598523605.jpg?w=400&h=400&fit=crop", // focused teen girl in black shorts
  "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3752169232033922698?w=400&h=400&fit=crop", // player portrait with black shorts
  "https://frontofficesports.com/wp-content/uploads/2024/03/USATSI_21341443-1-scaled-e1710523811709.jpg?quality=100&w=400&h=400&fit=crop" // NWSL player in black shorts action
];

export const newArrivals = Array.from({ length: 8 }).map((_, i) => ({
  id: `new-${i}`,
  title: "GLORY IN MOTION",
  handle: `glory-in-motion-${i}`,
  image: newArrivalsImages[i],
  price: 122.0,
  compareAtPrice: null,
  isNew: true,
  sizes: ["XL", "XXL", "XXXL"],
}));