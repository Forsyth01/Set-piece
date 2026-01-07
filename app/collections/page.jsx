import Link from "next/link";

const COLLECTIONS = [
  { 
    title: "New Arrivals", 
    handle: "new-arrivals",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
    description: "Fresh drops for the modern player"
  },
  { 
    title: "Trending", 
    handle: "trending",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    description: "What everyone's talking about"
  },
  { 
    title: "Girls Collections", 
    handle: "girls-collections",
    image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80",
    description: "Designed for the women's game"
  },
  { 
    title: "Hoodies & Joggers", 
    handle: "hoodies-joggers",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    description: "Off-pitch comfort essentials"
  },
  { 
    title: "Soccer Shorts", 
    handle: "soccer-shorts",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    description: "Performance meets style"
  },
  { 
    title: "Accessories", 
    handle: "accessories",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    description: "Complete your kit"
  },
  { 
    title: "The Vault", 
    handle: "the-vault",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    description: "Exclusive archive pieces"
  },
];

export default function CollectionsPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-16 text-center">
        <span className="tracking-widest text-gray-400 text-[clamp(0.6rem,1.1vw,0.75rem)]">
          SETPIECE
        </span>
        <h1 className="font-bold mt-2 text-[clamp(2rem,4vw,3rem)]">
          ALL COLLECTIONS
        </h1>
        <p className="text-gray-600 mt-4 text-[clamp(0.85rem,1.3vw,1rem)] max-w-2xl mx-auto">
          Explore our curated collections of premium soccer apparel. From match-ready kits to off-pitch essentials.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.handle}
            href={`/collections/${collection.handle}`}
            className="group relative overflow-hidden bg-gray-100 hover:shadow-xl transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative h-80 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                {/* You can replace the div above with actual images like this: */}
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Placeholder Image - Replace with actual images */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  {collection.title}
                </span>
              </div>
              
            
             
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
              <h2 className="font-bold text-[clamp(1.2rem,2vw,1.5rem)] mb-2">
                {collection.title}
              </h2>
              <p className="text-sm text-gray-200 mb-4">
                {collection.description}
              </p>
              <span className="inline-flex items-center text-sm font-medium group-hover:gap-2 transition-all">
                Shop Now
                <span className="ml-1 group-hover:ml-2 transition-all">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}