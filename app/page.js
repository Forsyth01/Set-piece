import { Suspense } from "react";
import Accessories from "./components/home/Accessories";
import GirlsCollections from "./components/home/GirlsCollections";
import Hero from "./components/home/Hero";
import HoodiesJoggers from "./components/home/HoodiesJoggers";
import NewArrivals from "./components/home/NewArrivals";
import Newsletter from "./components/home/Newsletter";
import SoccerShorts from "./components/home/SoccerShorts";
import TheVault from "./components/home/Caps";
import TrendingCollections from "./components/home/TrendingCollections";
import TrustBar from "./components/home/TrustBar";
import Caps from "./components/home/Caps";

// Loading skeleton for product sections
function ProductSectionSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 sm:py-20">
      <div className="mb-12">
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-48 bg-gray-200 rounded mt-2 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-10 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-3/4 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="">
      <Hero />
      {/* <TrustBar /> */}

      <Suspense fallback={<ProductSectionSkeleton />}>
        <TrendingCollections />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <NewArrivals />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <SoccerShorts />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <HoodiesJoggers />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <Caps/>
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <Accessories />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <GirlsCollections />
      </Suspense>

      {/* <Newsletter/> */}
    </div>
  );
}

// Enable revalidation every 60 seconds
export const revalidate = 60;
