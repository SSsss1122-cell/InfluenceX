'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  review: string;
  rating: number;
}

const StarRating = ({ rating }: { rating: number }) => (
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

// --- Fallback data (used when Supabase returns empty) ---
const fallbackTestimonials: Testimonial[] = [
  {
    id: 'fallback-1',
    name: 'Jessica Miller',
    role: 'Marketing Director, GlowCo',
    avatar: 'https://images.unsplash.com/photo-1494790108375-be9c0b0d6d32?w=150&h=150&fit=crop&crop=face',
    review:
      'InfluenceX completely transformed how we collaborate with influencers. The platform is intuitive, and we’ve seen a 3x increase in engagement since using it.',
    rating: 5,
  },
  {
    id: 'fallback-2',
    name: 'David Chen',
    role: 'Fashion Influencer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    review:
      'As a creator, InfluenceX has opened doors to amazing brand partnerships. The discovery tools help me find brands that truly align with my values.',
    rating: 5,
  },
  {
    id: 'fallback-3',
    name: 'Sarah Thompson',
    role: 'Founder, EcoVibe',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    review:
      'We were skeptical at first, but InfluenceX delivered beyond expectations. The analytics and campaign tracking are game-changers for our startup.',
    rating: 4,
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('id, name, role, avatar, review, rating')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Supabase error (Testimonials):', error);
          setError('Failed to load testimonials.');
          // Use fallback if DB fails
          setTestimonials(fallbackTestimonials);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          // Map DB data
          const formatted = data.map((t) => ({
            id: t.id,
            name: t.name || 'Anonymous',
            role: t.role || 'User',
            avatar: t.avatar || 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
            review: t.review || 'Amazing experience!',
            rating: Number(t.rating) || 5,
          }));
          setTestimonials(formatted);
        } else {
          // No rows – use fallback
          console.log('No testimonials found in DB, using fallback.');
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred.');
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/80">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </section>
    );
  }

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
}