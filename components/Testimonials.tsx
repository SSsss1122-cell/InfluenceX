'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Jessica Miller',
    role: 'Marketing Director, GlowCo',
    avatar: 'https://images.unsplash.com/photo-1494790108375-be9c0b0d6d32?w=150&h=150&fit=crop&crop=face',
    review:
      'InfluenceX completely transformed how we collaborate with influencers. The platform is intuitive, and we’ve seen a 3x increase in engagement since using it.',
    rating: 5,
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Fashion Influencer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    review:
      'As a creator, InfluenceX has opened doors to amazing brand partnerships. The discovery tools help me find brands that truly align with my values.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sarah Thompson',
    role: 'Founder, EcoVibe',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    review:
      'We were skeptical at first, but InfluenceX delivered beyond expectations. The analytics and campaign tracking are game-changers for our startup.',
    rating: 4,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 fill-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/80">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            What Our{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Community
            </span>{' '}
            Says
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from real people using InfluenceX every day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={t.id}
              className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-purple-200 opacity-0 translate-y-8 animate-fadeInUp"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-200 group-hover:border-purple-500 transition-colors">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>

              <StarRating rating={t.rating} />

              <blockquote className="mt-4 text-gray-700 leading-relaxed">
                “{t.review}”
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;