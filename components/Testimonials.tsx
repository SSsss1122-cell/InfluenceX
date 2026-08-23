'use client';

import { useState, useEffect } from 'react';
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

const StarRating = ({ rating }: { rating: number }) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < safeRating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-300 text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching testimonials...');

        const { data, error: supabaseError } = await supabase
          .from('testimonials')
          .select('id, name, role, avatar, review, rating')
          .limit(3);

        console.log('📦 Testimonials data:', data);
        console.log('🚨 Testimonials error:', supabaseError);

        if (supabaseError) {
          console.error('❌ Supabase error message:', supabaseError.message);
          console.error('❌ Supabase error code:', supabaseError.code);
          console.error('❌ Supabase error details:', supabaseError.details);
          console.error('❌ Supabase error hint:', supabaseError.hint);

          setError(supabaseError.message || 'Failed to load testimonials.');
          return;
        }

        if (!data || data.length === 0) {
          console.warn('⚠️ No testimonials found.');
          setError('No testimonials found.');
          return;
        }

        const formattedTestimonials: Testimonial[] = data.map((item) => ({
          id: String(item.id),
          name: item.name || 'Anonymous',
          role: item.role || 'Content Creator',
          avatar:
            item.avatar ||
            'https://i.pravatar.cc/150?img=12',
          review:
            item.review ||
            'Amazing experience with InfluenceX!',
          rating: Math.max(
            0,
            Math.min(5, Number(item.rating) || 5)
          ),
        }));

        setTestimonials(formattedTestimonials);
      } catch (err) {
        console.error('💥 Unexpected testimonials error:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Loading
  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/80">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading reviews...
          </p>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/80">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-xl mx-auto">
            <p className="text-red-500 font-medium">
              Unable to load testimonials
            </p>

            <p className="text-gray-500 text-sm mt-2">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No data
  if (testimonials.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/80">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            No testimonials available.
          </p>
        </div>
      </section>
    );
  }

  // Success
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/80">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
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

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="
                group
                bg-white
                rounded-2xl
                p-8
                shadow-md
                hover:shadow-2xl
                transition-all
                duration-500
                hover:-translate-y-2
                border
                border-gray-100
                hover:border-purple-200
                opacity-0
                translate-y-8
                animate-fadeInUp
              "
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >

              {/* User */}
              <div className="flex items-center gap-4 mb-5">

                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-200 group-hover:border-purple-500 transition-colors">

                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src =
                        'https://i.pravatar.cc/150?img=12';
                    }}
                  />

                </div>

                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {testimonial.role}
                  </p>
                </div>

              </div>

              {/* Rating */}
              <StarRating rating={testimonial.rating} />

              {/* Review */}
              <blockquote className="mt-4 text-gray-700 leading-relaxed">
                “{testimonial.review}”
              </blockquote>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}