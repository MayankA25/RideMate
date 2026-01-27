import React from "react";
import TrendingRidesItem from "../TrendingRidesItem/TrendingRidesItem";
import { TrendingUp } from "lucide-react";

export default function TrendingRides() {
  return (
    <div className="absolute top-0 right-0 h-full w-[20%] mr-5 overflow-y-scroll py-2 scrollbar">
        <div className="flex items-center gap-2.5 sticky top-0 bg-base-100/20 backdrop-blur-lg py-3 px-3 rounded-xl border border-white/10">
            <TrendingUp className="size-6"/>
            <h1 className="font-bold text-lg">Trending Rides</h1>
        </div>
      <div className="flex flex-col justify-center gap-3 py-5">
        {[...Array(15)].map((_, index) => {
          return <TrendingRidesItem />;
        })}
      </div>
    </div>
  );
}
