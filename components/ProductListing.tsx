"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Heart,
  Star,
  MapPin,
  CheckCircle,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────
type Product = {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  seller: string;
  isVerified: boolean;
  location: string;
  rating: number;
  reviews: number;
  category: string;
  createdAt: string; // ISO date
};

type SortOption = "latest" | "price-asc" | "price-desc" | "rating";

// ─── Fake product data ────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
    originalPrice: 299.99,
    discountedPrice: 199.99,
    seller: "AudioPro",
    isVerified: true,
    location: "San Francisco, CA",
    rating: 4.8,
    reviews: 342,
    category: "Electronics",
    createdAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Slim Fit Organic Cotton T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    originalPrice: 49.99,
    discountedPrice: 29.99,
    seller: "EcoWear",
    isVerified: true,
    location: "Portland, OR",
    rating: 4.5,
    reviews: 128,
    category: "Fashion",
    createdAt: "2026-07-18T14:30:00Z",
  },
  {
    id: "3",
    name: "Smart Fitness Tracker Watch",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop&crop=center",
    originalPrice: 149.99,
    discountedPrice: 89.99,
    seller: "TechLife",
    isVerified: false,
    location: "Austin, TX",
    rating: 4.2,
    reviews: 87,
    category: "Electronics",
    createdAt: "2026-07-16T08:15:00Z",
  },
  {
    id: "4",
    name: "Handcrafted Ceramic Mug Set",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop&crop=center",
    originalPrice: 39.99,
    discountedPrice: 24.99,
    seller: "ArtisanHome",
    isVerified: true,
    location: "Asheville, NC",
    rating: 4.9,
    reviews: 56,
    category: "Home",
    createdAt: "2026-07-14T19:20:00Z",
  },
  {
    id: "5",
    name: "Leather Backpack with Laptop Sleeve",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
    originalPrice: 129.99,
    discountedPrice: 79.99,
    seller: "UrbanCarry",
    isVerified: true,
    location: "New York, NY",
    rating: 4.7,
    reviews: 215,
    category: "Fashion",
    createdAt: "2026-07-12T12:00:00Z",
  },
  {
    id: "6",
    name: "Portable Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center",
    originalPrice: 79.99,
    discountedPrice: 49.99,
    seller: "SoundWave",
    isVerified: false,
    location: "Los Angeles, CA",
    rating: 4.3,
    reviews: 92,
    category: "Electronics",
    createdAt: "2026-07-10T17:45:00Z",
  },
  {
    id: "7",
    name: "Premium Yoga Mat (Non-Slip)",
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&h=400&fit=crop&crop=center",
    originalPrice: 89.99,
    discountedPrice: 59.99,
    seller: "ZenFit",
    isVerified: true,
    location: "Denver, CO",
    rating: 4.6,
    reviews: 73,
    category: "Sports",
    createdAt: "2026-07-08T07:30:00Z",
  },
  {
    id: "8",
    name: "Minimalist Desk Lamp with Wireless Charger",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGBQUTi3-QtaFvH9IyjaC4liMzRgiUd_EQx7P-n9l5LQ&s=10",
    originalPrice: 69.99,
    discountedPrice: 39.99,
    seller: "LightSpace",
    isVerified: false,
    location: "Seattle, WA",
    rating: 4.1,
    reviews: 41,
    category: "Home",
    createdAt: "2026-07-06T11:00:00Z",
  },
];

// ─── Helper: get unique categories ──────────────────
const CATEGORIES = Array.from(new Set(PRODUCTS.map(p => p.category)));

// ─── Component ──────────────────────────────────────
export default function ProductListing() {
  // ─── Theme ──────────────────────────────────────────
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("influencex-theme") as "dark" | "light" | null;
    if (stored) setTheme(stored);
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("influencex-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // ─── Filters & search state ────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // ─── Derived: filtered & sorted products ────────────
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    // Search (name or seller)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price range
    result = result.filter(p => p.discountedPrice >= minPrice && p.discountedPrice <= maxPrice);

    // Location (case-insensitive partial match)
    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase().trim();
      result = result.filter(p => p.location.toLowerCase().includes(loc));
    }

    // Sorting
    switch (sortBy) {
      case "latest":
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, minPrice, maxPrice, locationFilter, sortBy]);

  // ─── Wishlist toggle ────────────────────────────────
  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // ─── Render stars ──────────────────────────────────
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(full)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        ))}
        {half === 1 && <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />}
        {[...Array(empty)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300 dark:text-white/20" />
        ))}
        <span className="ml-1 text-xs font-medium text-gray-600 dark:text-white/60">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // ─── Theme icon ────────────────────────────────────
  const ThemeIcon = () =>
    theme === "dark" ? (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 dark:from-[#0b0d15] dark:via-[#1a1d2e] dark:to-[#0b0d15] transition-colors duration-300">
      <div className="sticky top-16 z-40 bg-white dark:bg-[#0b0d15] border-b border-gray-200 dark:border-white/10">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div className="relative max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

      <input
        type="text"
        placeholder="Search products, sellers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-full border border-gray-300 dark:border-white/10 px-12 py-3 bg-white dark:bg-white/5 outline-none"
      />
    </div>
  </div>
</div>
      {/* ─── Background Orbs ────────────────────────── */}
      <div className="fixed w-[600px] h-[600px] bg-indigo-300/20 dark:bg-indigo-500/15 rounded-full blur-[140px] -top-60 -right-60 pointer-events-none" />
      <div className="fixed w-[500px] h-[500px] bg-purple-300/20 dark:bg-purple-500/15 rounded-full blur-[140px] -bottom-60 -left-60 pointer-events-none" />


      {/* ─── Main content ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">

        {/* ─── Filters bar ────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur border border-white/30 dark:border-white/8 shadow-sm">
          {/* Category filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === null
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white/50 dark:bg-white/5 text-gray-700 dark:text-white/70 hover:bg-white/80 dark:hover:bg-white/10"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white/50 dark:bg-white/5 text-gray-700 dark:text-white/70 hover:bg-white/80 dark:hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Price range */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-white/40 font-medium">Price:</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
              className="w-16 rounded-full border border-white/20 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur px-2 py-1 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-400/60"
            />
            <span className="text-xs text-gray-500 dark:text-white/40">—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value) || 500)}
              className="w-16 rounded-full border border-white/20 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur px-2 py-1 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-400/60"
            />
          </div>

          {/* Location filter */}
          <div className="relative">
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-white/40" />
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-7 pr-3 py-1.5 rounded-full border border-white/20 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur text-xs text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:border-indigo-400/60 w-32"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none pl-3 pr-7 py-1.5 rounded-full border border-white/20 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-400/60 cursor-pointer"
            >
              <option value="latest">Latest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 dark:text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* ─── Results count ──────────────────────────── */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600 dark:text-white/60">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
              setMinPrice(0);
              setMaxPrice(500);
              setLocationFilter("");
              setSortBy("latest");
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        </div>

        {/* ─── Product Grid ─────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No products found</h3>
            <p className="text-gray-500 dark:text-white/50 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.has(product.id);
              return (
                <div
                  key={product.id}
                  className="group relative bg-white/70 dark:bg-white/6 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-white/8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-white/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Discount badge */}
                    {product.originalPrice > product.discountedPrice && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                        -{Math.round((1 - product.discountedPrice / product.originalPrice) * 100)}%
                      </span>
                    )}
                    {/* Wishlist button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 dark:text-white/60 group-hover:text-red-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-1">
                        {product.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${product.discountedPrice.toFixed(2)}
                      </span>
                      {product.originalPrice > product.discountedPrice && (
                        <span className="text-xs text-gray-400 dark:text-white/40 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Seller & location */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-600 dark:text-white/70 font-medium">{product.seller}</span>
                      {product.isVerified && (
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
                      )}
                      <span className="text-gray-400 dark:text-white/30">•</span>
                      <span className="text-gray-500 dark:text-white/50 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />
                        {product.location.split(',')[0]}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-500 dark:text-white/40">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}