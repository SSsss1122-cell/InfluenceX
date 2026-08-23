'use client';

import Image from 'next/image';
import {  Music, Star, BadgeCheck } from 'lucide-react';

interface InfluencerCardProps {
  name: string;
  category: string;
  followers: string;
  engagement: string;
  image: string;
  verified?: boolean;
  rating: number;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

const InfluencerCard = ({
  name,
  category,
  followers,
  engagement,
  image,
  verified = false,
  rating,
  instagram = '#',
  youtube = '#',
  tiktok = '#',
}: InfluencerCardProps) => {
  return (
    <div className="w-64 sm:w-72 md:w-80 flex-shrink-0 p-4">
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:border-purple-400/50 p-5">
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity" />

        <div className="relative flex flex-col items-center">
          {/* Profile Image with badge */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
              <Image
                src={image}
                alt={name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            {verified && (
              <BadgeCheck className="absolute -bottom-1 -right-1 w-6 h-6 text-purple-400 fill-white" />
            )}
          </div>

          <h3 className="mt-3 text-lg font-bold text-white">{name}</h3>
          <p className="text-sm text-purple-200 font-medium">{category}</p>

          {/* Followers & Engagement */}
          <div className="flex justify-center gap-4 mt-3 text-sm text-white/80">
            <div className="text-center">
              <p className="font-semibold text-white">{followers}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-white">{engagement}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Engagement</p>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-white/20 fill-white/20'
                }`}
              />
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 mt-4">
            <a href={tiktok} className="text-white/60 hover:text-purple-400 transition-colors">
              <Music className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerCard;