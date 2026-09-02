'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // adjust path if needed

// ─── Product type ──────────────────────────────────────
type Product = {
  id: string;
  name: string;
  image: string;        // from image_url
  price: number;        // from price
  category: string;     // from category
  created_at: string;
  // additional fields we'll derive or default:
  seller: string;
  rating: number;
  reviews: number;
};

const FeaturedProducts = () => {
  // ─── State ──────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DISPLAY_LIMIT = 4; // show only 4 products

  // ─── Fetch from Supabase ─────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url, category, created_at')
          .order('created_at', { ascending: false })
          .limit(DISPLAY_LIMIT); // only fetch 4 newest products

        if (error) throw error;

        if (!data || data.length === 0) {
          setProducts([]);
          return;
        }

        const mapped: Product[] = data.map((item) => ({
          id: item.id,
          name: item.name || 'Unnamed Product',
          image: item.image_url || 'https://via.placeholder.com/400?text=No+Image',
          price: Number(item.price) || 0,
          category: item.category || 'Uncategorized',
          created_at: item.created_at,
          // default values for missing fields
          seller: 'Store',
          rating: 0,
          reviews: 0,
        }));

        setProducts(mapped);
      } catch (err: any) {
        setError(err.message || 'Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ─── Loading state ──────────────────────────────────
  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading featured products...</p>
        </div>
      </section>
    );
  }

  // ─── Error state ────────────────────────────────────
  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full text-sm"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // ─── Empty state ────────────────────────────────────
  if (products.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">No products available yet.</p>
        </div>
      </section>
    );
  }

  // ─── Main UI ──────────────────────────────────────────
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Featured{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Products
            </span>
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top-rated products recommended by our trusted influencers.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-md shadow-gray-200/50 hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  onError={(e) => {
                    // fallback if image fails to load
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400?text=No+Image';
                  }}
                />
                {/* Discount badge - hidden because we have no discount info */}
                {/* Quick add button */}
                <button className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-purple-50">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    {product.seller}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="font-medium text-gray-700">
                      {product.rating > 0 ? product.rating.toFixed(1) : 'New'}
                    </span>
                    {product.reviews > 0 && (
                      <span className="text-gray-400 text-xs">({product.reviews})</span>
                    )}
                  </div>
                </div>

                <h3 className="mt-3 text-base font-semibold text-gray-800 line-clamp-2 flex-1">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {/* No discount price because we only have one price */}
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="mt-4 w-full py-2.5 text-center text-sm font-semibold text-purple-700 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-300 border border-transparent hover:border-purple-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-all duration-300 hover:scale-105 shadow-md"
          >
            Explore All Products
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;