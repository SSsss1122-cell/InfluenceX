// components/influencers/InfluencerSort.tsx
'use client';

import { ChevronDown } from 'lucide-react';

interface InfluencerSortProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'followers_desc', label: 'Highest Followers' },
  { value: 'engagement_desc', label: 'Highest Engagement' },
  { value: 'price_asc', label: 'Lowest Price' },
  { value: 'price_desc', label: 'Highest Price' },
  { value: 'newest', label: 'Recently Joined' },
];

export default function InfluencerSort({ sortBy, onSortChange }: InfluencerSortProps) {
  return (
    <div className="relative inline-block">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}