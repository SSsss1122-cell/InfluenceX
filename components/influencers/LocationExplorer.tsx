// components/influencers/LocationExplorer.tsx
'use client';

import { MapPin } from 'lucide-react';

interface LocationData {
  city: string;
  state: string;
  count: number;
}

const popularLocations: LocationData[] = [
  { city: 'Bengaluru', state: 'Karnataka', count: 320 },
  { city: 'Mumbai', state: 'Maharashtra', count: 450 },
  { city: 'Delhi', state: 'Delhi', count: 390 },
  { city: 'Hyderabad', state: 'Telangana', count: 280 },
  { city: 'Chennai', state: 'Tamil Nadu', count: 210 },
  { city: 'Pune', state: 'Maharashtra', count: 180 },
  { city: 'Kolkata', state: 'West Bengal', count: 160 },
  { city: 'Ahmedabad', state: 'Gujarat', count: 140 },
  { city: 'Jaipur', state: 'Rajasthan', count: 120 },
  { city: 'Kochi', state: 'Kerala', count: 100 },
];

interface LocationExplorerProps {
  onLocationClick: (city: string, state: string) => void;
}

export default function LocationExplorer({ onLocationClick }: LocationExplorerProps) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-blue-600" />
        Discover Influencers Near You
      </h2>
      <p className="text-gray-500 mb-4">Explore top influencer hubs across India</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {popularLocations.map((loc) => (
          <button
            key={loc.city}
            onClick={() => onLocationClick(loc.city, loc.state)}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-left hover:shadow-md transition-shadow group"
          >
            <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {loc.city}
            </p>
            <p className="text-sm text-gray-500">{loc.state}</p>
            <p className="text-sm font-medium text-blue-600 mt-1">{loc.count}+ creators</p>
          </button>
        ))}
      </div>
    </section>
  );
}