"use client";

import Accessories from "./components/home/Accessories";
import GirlsCollections from "./components/home/GirlsCollections";
import Hero from "./components/home/Hero";
import HoodiesJoggers from "./components/home/HoodiesJoggers";
import NewArrivals from "./components/home/NewArrivals";
import Newsletter from "./components/home/Newsletter";
import SoccerShorts from "./components/home/SoccerShorts";
import TheVault from "./components/home/TheVault";
import TrendingCollections from "./components/home/TrendingCollections";
import TrustBar from "./components/home/TrustBar";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <TrustBar />
      <TrendingCollections />
      <NewArrivals />
      <SoccerShorts />
      <HoodiesJoggers />
      <TheVault />
      <Accessories />
      <GirlsCollections />
      <Newsletter/>
    </div>
  );
}
