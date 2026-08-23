'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Influencer {
  id: string;
  name: string;
  handle: string;        // username
  category: string;      // primary niche
  followers: string;     // formatted, e.g., "1.2M"
  location: string;      // city + state or just city
  rating: number;
  image: string;         // profile image URL
}

export default function InfluencerGrid() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: format follower count
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  // Helper: generate a location string from city & state
  const formatLocation = (city: string, state: string) => {
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return 'India';
  };

  useEffect(() => {
    async function fetchInfluencers() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('influencers')
        .select('id, name, username, category, city, state, followers, rating, profile_image')
        .order('created_at', { ascending: false })
        .limit(8); // fetch exactly 8

      if (error) {
        console.error('Supabase error (InfluencerGrid):', error);
        setError('Failed to load influencers.');
        setInfluencers([]);
        setLoading(false);
        return;
      }

      // Map to the shape expected by the component
      const formatted: Influencer[] = (data || []).map((inf) => ({
        id: inf.id,
        name: inf.name || 'Unknown',
        handle: inf.username || `@${inf.name?.toLowerCase().replace(/\s/g, '')}`,
        category: inf.category || 'Creator',
        followers: formatNumber(Number(inf.followers) || 0),
        location: formatLocation(inf.city, inf.state),
        rating: Number(inf.rating) || 4.0,
        image: inf.profile_image || `https://i.pravatar.cc/400?img=${Math.floor(Math.random() * 70)}`,
      }));

      setInfluencers(formatted);
      setLoading(false);
    }

    fetchInfluencers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading top influencers...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (influencers.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>No influencers found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Top{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Influencers
            </span>
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with the most trusted creators across every niche.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {influencers.map((influencer) => (
            <div
              key={influencer.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 flex flex-col"
            >
              {/* Profile Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={influencer.image}
                  alt={influencer.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-600 shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  {influencer.rating.toFixed(1)}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{influencer.name}</h3>
                  <p className="text-sm text-purple-600 font-medium">{influencer.handle}</p>
                  <p className="text-sm text-gray-500 mt-1">{influencer.category}</p>

                  <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{influencer.followers} followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{influencer.location}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/influencers/${influencer.id}`}
                  className="mt-4 w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/influencers"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Browse All Influencers
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}