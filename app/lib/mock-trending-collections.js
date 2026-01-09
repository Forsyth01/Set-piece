const trendingCollectionImages = [
  "https://www.misskick.com/cdn/shop/files/miss_kick_girls_football.jpg?v=1692278536&width=800", // Girls in soccer casual wear/hoodie styles, football-themed brand
  "https://m.media-amazon.com/images/I/61lah0U2X+L.jpg", // "Love Soccer" hoodie on model, clear soccer graphic
  "https://static.nike.com/a/images/f_auto/dpr_3.0,cs_srgb/w_800,c_limit/23253d8a-e005-468e-bedd-5793a79e1ea1/the-best-athletic-wear-for-girls-by-nike.jpg", // Girls in Nike athletic hoodie/joggers, sporty soccer vibe
  "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3790475735832057289", // Woman in premium soccer-style heritage hoodie
  "https://luson.com/wp-content/uploads/2025/03/green-retro-soccer-jersey-streetwear-fashion-group-outfit.jpg", // Group in casual soccer-inspired outfits with joggers
  "https://i.etsystatic.com/20999652/r/il/ea885f/7277981858/il_fullxfull.7277981858_fi49.jpg", // Football hoodie + sweatpants set (model wearing)
  "https://www.goaluniform.com/wp-content/uploads/2020/06/Figure-5-Custom-soccer-hoodie.jpg", // Custom soccer hoodie on female model, with matching bottoms vibe
  "https://cdn.freepixel.com/thumb/free-photos-a-young-and-pretty-woman-is-wearing-a-soccer-hoodie-and-holding-a-soccer-ball-she-appears-to-be-show-th-100353500.jpg" // Young woman in soccer hoodie holding ball, casual joggers implied
];

export const trendingCollections = Array.from({ length: 8 }).map((_, i) => ({
  id: `trending-${i}`,
  title: "TRENDY COLLECTIONS",
  handle: `trendy-collections-${i}`,
  image: trendingCollectionImages[i],
  price: 122.0,
  compareAtPrice: null,
  isNew: true,
 sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
}));