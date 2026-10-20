'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// ─── Product type ──────────────────────────────────────
type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  created_at: string;
  seller: string;
  rating: number;
  reviews: number;
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAndSortProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch a bit more to fill the scroll area
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url, category, created_at')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        if (!data || data.length === 0) return setProducts([]);

        // Read local storage to find "liked" or "added to cart" products
        let interactedIds: string[] = [];
        try {
          const savedCart = JSON.parse(localStorage.getItem('influencex_cart') || '[]');
          const savedWishlist = JSON.parse(localStorage.getItem('influencex_wishlist') || '[]');
          
          // Combine IDs (using Set to remove duplicates)
          interactedIds = [...new Set([
            ...savedCart.map((item: any) => item.id),
            ...savedWishlist
          ])];
        } catch (e) {
          console.warn("Could not read local storage", e);
        }

        const mapped: Product[] = data.map((item) => ({
          id: item.id,
          name: item.name || 'Unnamed Product',
          image: item.image_url || 'https://via.placeholder.com/400?text=No+Image',
          price: Number(item.price) || 0,
          category: item.category || 'Uncategorized',
          created_at: item.created_at,
          seller: 'Store',
          rating: 4.5, // Dummy data for UI
          reviews: 12,
        }));

        // Sort: Items in local cart/wishlist go first, then newest
        mapped.sort((a, b) => {
          const aInteracted = interactedIds.includes(a.id) ? 1 : 0;
          const bInteracted = interactedIds.includes(b.id) ? 1 : 0;
          return bInteracted - aInteracted; 
        });

        setProducts(mapped);
      } catch (err: any) {
        setError(err.message || 'Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchAndSortProducts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Scroll by roughly the width of 2 cards
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const formatINR = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gray-50/50 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </section>
    );
  }

  if (error || products.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Controls */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Trending Now{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Popular
              </span>
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Discover top-rated products recommended by our trusted influencers.
            </p>
          </div>
          
          {/* Scroll Buttons */}
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-2 -mx-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] sm:min-w-[300px] snap-start group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-square rounded-t-3xl overflow-hidden bg-gray-50 p-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 280px, 300px"
                />
                <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-purple-50">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="font-medium text-gray-700">{product.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-purple-600 transition-colors">
                  {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-extrabold text-gray-900">
                    {formatINR(product.price)}
                  </span>
                  
                  {/* Link to product listing with highlight query */}
                  <Link
                    href={`/products?highlight=${product.id}`}
                     className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] rounded-xl hover:shadow-lg hover:shadow-pink-200/50 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-purple-600 hover:text-purple-600 transition-all duration-300 shadow-sm"
          >
            Explore All Products
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;