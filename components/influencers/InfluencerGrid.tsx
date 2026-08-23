// components/influencers/InfluencerGrid.tsx
'use client';

import { useState, useEffect } from 'react';
import InfluencerCard from './InfluencerCard';
import { Influencer } from '@/data/influencers';

interface InfluencerGridProps {
  influencers: Influencer[];
  totalCount: number;
  pageSize?: number;
}

export default function InfluencerGrid({ influencers, totalCount, pageSize = 12 }: InfluencerGridProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Reset visible count when influencers change (e.g., new filters)
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [influencers, pageSize]);

  const visibleInfluencers = influencers.slice(0, visibleCount);
  const hasMore = visibleCount < influencers.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + pageSize);
  };

  if (influencers.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600">No influencers found</p>
        <p className="text-gray-400">Try changing or clearing your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleInfluencers.map((influencer) => (
          <InfluencerCard key={influencer.id} influencer={influencer} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            Load More
          </button>
          <p className="text-sm text-gray-400 mt-2">
            Showing {visibleCount} of {influencers.length} influencers
          </p>
        </div>
      )}
    </div>
  );
}