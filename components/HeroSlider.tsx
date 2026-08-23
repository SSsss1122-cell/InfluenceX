'use client';

import { useState, useRef, useEffect } from 'react';
import InfluencerCard from './InfluencerCard';
import { supabase } from '@/lib/supabase';

interface Influencer {
  id: string;
  name: string;
  category: string;        // primary niche
  followers: string;       // formatted, e.g., "1.2M"
  engagement: string;      // formatted, e.g., "4.8%"
  image: string;           // profile image URL
  verified: boolean;
  rating: number;          // 0-5
}

export default function HeroSlider() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Helper: format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  useEffect(() => {
    async function fetchInfluencers() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('influencers')
        .select('id, name, profile_image, category, followers, engagement_rate, verified, rating')
        .order('created_at', { ascending: false })
        .limit(10); // fetch enough for a smooth slider

      if (error) {
        console.error('Supabase error (HeroSlider):', error);
        setError('Failed to load influencers.');
        setInfluencers([]);
        setLoading(false);
        return;
      }

      // Map to the shape required by the slider's card
      const formatted: Influencer[] = (data || []).map((inf) => ({
        id: inf.id,
        name: inf.name || 'Unknown',
        category: inf.category || 'Creator',
        followers: formatNumber(Number(inf.followers || 0)),
        engagement: (Number(inf.engagement_rate) || 0).toFixed(1) + '%',
        image: inf.profile_image || 'https://i.pravatar.cc/160?img=' + Math.floor(Math.random() * 70),
        verified: Boolean(inf.verified),
        rating: Math.round(Number(inf.rating) || 4),
      }));

      setInfluencers(formatted);
      setLoading(false);
    }

    fetchInfluencers();
  }, []);

  // If not enough influencers, duplicate the list for seamless loop
  const allCards = influencers.length > 0
    ? [...influencers, ...influencers, ...influencers] // triple to ensure smooth looping
    : [];

  if (loading) {
    return (
      <div className="w-full py-8 flex justify-center">
        <div className="text-gray-500">Loading influencers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (influencers.length === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-500">
        No influencers found.
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-4 py-4"
        style={{
          animation: `scroll ${Math.max(20, allCards.length * 2)}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
          width: 'max-content',
        }}
      >
        {allCards.map((inf, index) => (
          <InfluencerCard key={`${inf.id}-${index}`} {...inf} />
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${100 / 3}%);
          }
        }
      `}</style>
    </div>
  );
}