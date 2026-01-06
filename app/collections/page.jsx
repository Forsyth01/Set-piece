import Link from "next/link";

const COLLECTIONS = [
  { title: "New Arrivals", handle: "new-arrivals" },
  { title: "Trending", handle: "trending" },
  { title: "Girls Collections", handle: "girls-collections" },
  { title: "Hoodies & Joggers", handle: "hoodies-joggers" },
  { title: "Soccer Shorts", handle: "soccer-shorts" },
  { title: "Accessories", handle: "accessories" },
  { title: "The Vault", handle: "the-vault" },
];

export default function CollectionsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Collections</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {COLLECTIONS.map((c) => (
          <Link
            key={c.handle}
            href={`/collections/${c.handle}`}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 24,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h2>{c.title}</h2>
            <p>Shop now →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
