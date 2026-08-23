// components/influencers/InfluencerSearch.tsx
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface InfluencerSearchProps {
  onSearch: (query: string) => void;
  onCategoryClick: (category: string) => void;
  searchQuery: string;
}

const quickCategories = [
  'Fashion',
  'Beauty',
  'Fitness',
  'Food',
  'Travel',
  'Tech',
  'Gaming',
  'Lifestyle',
  'Education',
  'Finance',
];

export default function InfluencerSearch({
  onSearch,
  onCategoryClick,
  searchQuery,
}: InfluencerSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Find the Perfect Influencer for Your Brand
        </h1>
        <p className="mt-3 text-gray-600 text-lg">
          Discover creators across India and connect with influencers who match your audience, niche
          and campaign goals.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search influencers by name, niche, location or username…"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full pl-12 pr-32 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-gray-500 font-medium">Popular:</span>
          {quickCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className="text-sm bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-gray-200 transition-colors text-gray-700 hover:text-blue-600 hover:border-blue-300"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}