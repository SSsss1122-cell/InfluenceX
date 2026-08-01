'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    originalPrice: 199.99,
    discountedPrice: 149.99,
    seller: 'AudioVibe Store',
    rating: 4.8,
    reviews: 342,
  },
  {
    id: 2,
    name: 'Smart Fitness Tracker Watch',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
    originalPrice: 89.99,
    discountedPrice: 69.99,
    seller: 'FitTech Co.',
    rating: 4.6,
    reviews: 218,
  },
  {
    id: 3,
    name: 'Organic Vitamin C Serum',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXxbZ2828tgvNDblms_pdS4n7tiEEKv4WlOQvh4clSDg&s=10',
    originalPrice: 45.00,
    discountedPrice: 34.50,
    seller: 'GlowLab Skincare',
    rating: 4.9,
    reviews: 507,
  },
  {
    id: 4,
    name: 'Minimalist Leather Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    originalPrice: 120.00,
    discountedPrice: 89.00,
    seller: 'UrbanCraft',
    rating: 4.7,
    reviews: 163,
  },
];

const FeaturedProducts = () => {
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
                />
                {/* Discount badge */}
                {product.originalPrice > product.discountedPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                    -{Math.round((1 - product.discountedPrice / product.originalPrice) * 100)}%
                  </div>
                )}
                {/* Quick add button (optional) */}
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
                    <span className="font-medium text-gray-700">{product.rating}</span>
                    <span className="text-gray-400 text-xs">({product.reviews})</span>
                  </div>
                </div>

                <h3 className="mt-3 text-base font-semibold text-gray-800 line-clamp-2 flex-1">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.discountedPrice.toFixed(2)}
                  </span>
                  {product.originalPrice > product.discountedPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
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
            href="/explore"
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