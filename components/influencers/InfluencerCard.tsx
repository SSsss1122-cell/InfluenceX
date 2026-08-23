// components/influencers/InfluencerCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {Heart} from "lucide-react";
import {
  MapPin,
  Users,
  Star,
  CheckCircle,
  X,
  ArrowLeft,
} from "lucide-react";

import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";
import { Influencer } from '@/data/influencers';
import { useFavorites } from '@/hooks/useFavorites';

interface InfluencerCardProps {
  influencer: Influencer;
}

const platformIcons = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  twitter: X,
};

export default function InfluencerCard({ influencer }: InfluencerCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(influencer.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(influencer.id);
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/influencers/${influencer.id}`);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Contact ${influencer.name}`);
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    // Outer Link wraps the entire card – this is the only <a> tag
    <Link href={`/influencers/${influencer.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Card Top: Image + overlay */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={influencer.profileImage}
            alt={influencer.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {influencer.verified && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium text-blue-600">
              <CheckCircle className="w-4 h-4 fill-blue-600 text-white" />
              Verified
            </div>
          )}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            aria-label="Favorite"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                liked ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {influencer.name}
              </h3>
              <p className="text-sm text-gray-500">{influencer.username}</p>
            </div>
            {influencer.rating && (
              <div className="flex items-center gap-1 text-sm bg-amber-50 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-amber-700">{influencer.rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{influencer.location}</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {influencer.categories.slice(0, 2).map((cat) => (
              <span key={cat} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {cat}
              </span>
            ))}
            {influencer.categories.length > 2 && (
              <span className="text-xs text-gray-400">+{influencer.categories.length - 2}</span>
            )}
          </div>

          <div className="flex gap-1 mt-3 text-gray-500">
            {influencer.platforms.map((platform) => {
              const Icon = platformIcons[platform as keyof typeof platformIcons];
              return Icon ? <Icon key={platform} className="w-4 h-4" /> : null;
            })}
          </div>

          <div className="grid grid-cols-2 gap-1 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{formatNumber(influencer.followers)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-emerald-600 font-medium">{influencer.engagementRate}%</span>
              <span className="text-gray-400 text-xs">engagement</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              <span className="text-sm text-gray-500">Starting at</span>
              <p className="font-bold text-gray-900">₹{influencer.startingPrice.toLocaleString()}</p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                influencer.available
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {influencer.available ? 'Available' : 'Unavailable'}
            </span>
          </div>

          {/* Buttons – both are <button> elements, no nested <a> */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleViewProfile}
              className="flex-1 text-center text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              View Profile
            </button>
            <button
              onClick={handleContact}
              className="flex-1 text-center text-sm border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-medium py-2 rounded-lg transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}