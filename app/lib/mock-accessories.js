// Football/Soccer accessories with relevant placeholder images
const footballAccessoryImages = [
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop", // soccer ball
  "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&h=400&fit=crop", // football boots
  "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=400&h=400&fit=crop", // shin guards
  "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&h=400&fit=crop", // sports gloves
  "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&h=400&fit=crop", // goalkeeper gloves
  "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=400&h=400&fit=crop", // football socks
  "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=400&fit=crop", // sports bag
  "https://images.unsplash.com/photo-1589894403913-f4b24ac9bc3e?w=400&h=400&fit=crop", // water bottle
  "https://images.unsplash.com/photo-1577212017184-80cc0da11082?w=400&h=400&fit=crop", // sports headband
  "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=400&fit=crop", // captain armband
  "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=400&h=400&fit=crop", // football cone
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=400&fit=crop", // sports backpack
  "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=400&h=400&fit=crop", // whistle
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop", // sports watch
  "https://images.unsplash.com/photo-1606103836293-0a063aa4c1ea?w=400&h=400&fit=crop", // compression sleeve
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop", // sports towel
  "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&h=400&fit=crop", // gym bag
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", // sports cap
];

export const accessories = Array.from({ length: 18 }).map((_, i) => ({
  id: `accessory-${i}`,
  title: "LEGACY PREMIUM ACCESSORY",
  handle: `accessory-${i}`,
  image: footballAccessoryImages[i],
  price: 122.0,
  compareAtPrice: i % 2 === 0 ? 154.03 : null,
  isNew: i < 3,
  sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
}));