// src/components/map/InfluencerMapSection.tsx
"use client";

import InfluencerMap from "./InfluencerMap";
import { MapPin, BadgeCheck } from "lucide-react";

export default function InfluencerMapSection() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Discover Influencers Near You
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Find trusted local influencers and discover creators around your
            area.
          </p>
        </div>

        {/* Map */}
        <InfluencerMap />

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Influencer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BadgeCheck size={14} className="text-blue-500" />
            <span className="text-xs text-gray-500 font-medium">
              Verified Influencer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500 flex items-center justify-center text-[7px] font-bold text-white leading-none">
              5
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Cluster of influencers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}