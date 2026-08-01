'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Star } from 'lucide-react';

const influencers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    handle: '@sarahstyle',
    category: 'Fashion & Lifestyle',
    followers: '1.2M',
    location: 'New York, USA',
    rating: 4.9,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgWgQUNf5_FdslPd_joWFiXuQayMvk1tsT34SdqY3m5Q&s=10',
  },
  {
    id: 2,
    name: 'Alex Rivera',
    handle: '@alexfitness',
    category: 'Fitness & Health',
    followers: '856K',
    location: 'Los Angeles, USA',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Maya Chen',
    handle: '@mayafoodie',
    category: 'Food & Travel',
    followers: '2.1M',
    location: 'London, UK',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'James Park',
    handle: '@jamesbeats',
    category: 'Music & Entertainment',
    followers: '1.5M',
    location: 'Seoul, South Korea',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 5,
    name: 'Emma Watson',
    handle: '@emmaexplores',
    category: 'Travel & Adventure',
    followers: '3.2M',
    location: 'Sydney, Australia',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 6,
    name: 'Carlos Garcia',
    handle: '@carlosfit',
    category: 'Fitness & Wellness',
    followers: '624K',
    location: 'Madrid, Spain',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 7,
    name: 'Priya Sharma',
    handle: '@priyabeauty',
    category: 'Beauty & Skincare',
    followers: '2.8M',
    location: 'Mumbai, India',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 8,
    name: 'Tom Mitchell',
    handle: '@tomtech',
    category: 'Tech & Gadgets',
    followers: '1.1M',
    location: 'San Francisco, USA',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=400&h=400&fit=crop&crop=face',
  },
];

const InfluencerGrid = () => {
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
                  {influencer.rating}
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
};

export default InfluencerGrid;