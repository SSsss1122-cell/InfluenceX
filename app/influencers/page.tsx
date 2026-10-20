"use client";

import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Sparkles, SlidersHorizontal, X, Search } from "lucide-react";

import InfluencerFilters from "@/components/influencers/InfluencerFilters";
import InfluencerSort from "@/components/influencers/InfluencerSort";
import InfluencerGrid from "@/components/influencers/InfluencerGrid";

// ==============================
// TYPES
// ==============================

interface Influencer {
  id: string;
  name: string;
  username: string;
  bio: string;
  location: string;
  state: string;
  city: string;
  category: string;
  categories: string[];
  platforms: string[];
  followers: number;
  engagementRate: number;
  influencerType: string;
  startingPrice: number;
  profileImage: string;
  coverImage: string;
  verified: boolean;
  available: boolean;
  rating: number;
  gender: string;
}

interface Filters {
  categories: string[];
  state: string;
  city: string;
  platforms: string[];
  followersMin: string;
  followersMax: string;
  engagementMin: string;
  engagementMax: string;
  influencerTypes: string[];
  priceMin: string;
  priceMax: string;
  genders: string[];
  verified: boolean;
  availability: string;
}

const initialFilters: Filters = {
  categories: [],
  state: "",
  city: "",
  platforms: [],
  followersMin: "",
  followersMax: "",
  engagementMin: "",
  engagementMax: "",
  influencerTypes: [],
  priceMin: "",
  priceMax: "",
  genders: [],
  verified: false,
  availability: "",
};

// ==============================
// PAGE
// ==============================

export default function FindInfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortBy, setSortBy] = useState("recommended");
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // ---------------- FETCH ----------------
  useEffect(() => {
    async function fetchInfluencers() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("influencers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError("Unable to load influencers.");
        setInfluencers([]);
        setLoading(false);
        return;
      }

      const formatted: Influencer[] = (data || []).map((inf) => ({
        id: inf.id,
        name: inf.name || "",
        username: inf.username || "",
        bio: inf.bio || "",
        location: inf.location || "",
        state: inf.state || "",
        city: inf.city || "",
        category: inf.category || "",
        categories: Array.isArray(inf.categories) ? inf.categories : [],
        platforms: Array.isArray(inf.platforms) ? inf.platforms : [],
        followers: Number(inf.followers || 0),
        engagementRate: Number(inf.engagement_rate || 0),
        influencerType: inf.influencer_type || "",
        startingPrice: Number(inf.starting_price || 0),
        profileImage: inf.profile_image || "",
        coverImage: inf.cover_image || "",
        verified: Boolean(inf.verified),
        available: Boolean(inf.available),
        rating: Number(inf.rating || 0),
        gender: inf.gender || "",
      }));

      setInfluencers(formatted);
      setLoading(false);
    }

    fetchInfluencers();
  }, []);

  // ---------------- FILTER + SORT ----------------
  const filteredInfluencers = useMemo(() => {
    let result = [...influencers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (inf) =>
          inf.name.toLowerCase().includes(q) ||
          inf.username.toLowerCase().includes(q) ||
          inf.category.toLowerCase().includes(q) ||
          inf.categories.some((c) => c.toLowerCase().includes(q)) ||
          inf.platforms.some((p) => p.toLowerCase().includes(q)) ||
          inf.location.toLowerCase().includes(q) ||
          inf.city.toLowerCase().includes(q) ||
          inf.state.toLowerCase().includes(q) ||
          inf.bio.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((inf) =>
        inf.categories.some((c) => filters.categories.includes(c))
      );
    }

    if (filters.state) result = result.filter((inf) => inf.state === filters.state);
    if (filters.city) result = result.filter((inf) => inf.city === filters.city);

    if (filters.platforms.length > 0) {
      result = result.filter((inf) =>
        inf.platforms.some((p) => filters.platforms.includes(p))
      );
    }

    if (filters.followersMin) result = result.filter((inf) => inf.followers >= Number(filters.followersMin));
    if (filters.followersMax) result = result.filter((inf) => inf.followers <= Number(filters.followersMax));
    if (filters.engagementMin) result = result.filter((inf) => inf.engagementRate >= Number(filters.engagementMin));
    if (filters.engagementMax) result = result.filter((inf) => inf.engagementRate <= Number(filters.engagementMax));

    if (filters.influencerTypes.length > 0) {
      result = result.filter((inf) => filters.influencerTypes.includes(inf.influencerType));
    }

    if (filters.priceMin) result = result.filter((inf) => inf.startingPrice >= Number(filters.priceMin));
    if (filters.priceMax) result = result.filter((inf) => inf.startingPrice <= Number(filters.priceMax));

    if (filters.genders.length > 0) {
      result = result.filter((inf) => filters.genders.includes(inf.gender));
    }

    if (filters.verified) result = result.filter((inf) => inf.verified === true);

    if (filters.availability === "available") {
      result = result.filter((inf) => inf.available === true);
    } else if (filters.availability === "unavailable") {
      result = result.filter((inf) => inf.available === false);
    }

    switch (sortBy) {
      case "followers_desc": result.sort((a, b) => b.followers - a.followers); break;
      case "engagement_desc": result.sort((a, b) => b.engagementRate - a.engagementRate); break;
      case "price_asc": result.sort((a, b) => a.startingPrice - b.startingPrice); break;
      case "price_desc": result.sort((a, b) => b.startingPrice - a.startingPrice); break;
    }

    return result;
  }, [influencers, searchQuery, filters, sortBy]);

  // ---------------- HANDLERS ----------------
  const handleSearch = (q: string) => setSearchQuery(q);

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
  };

  // ---------------- LOADING / ERROR ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D91C9A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 font-semibold text-gray-600">Finding creators across India...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex justify-center items-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-red-500">{error}</h2>
          <p className="mt-2 text-gray-500">Please check your network connection and try again.</p>
        </div>
      </div>
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-[#FDFBFD] pb-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pink-50/80 to-transparent pt-20 pb-12 px-4">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-100 shadow-sm text-sm font-semibold text-[#D91C9A]"
          >
            <Sparkles className="w-4 h-4" />
            THE INFLUENCEX DIRECTORY
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight"
          >
            Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A]">Creator</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Connect with top influencers across India to elevate your brand's next big campaign.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mt-8 relative"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search creators by name, niche, location..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-base shadow-lg shadow-purple-500/5 focus:outline-none focus:ring-2 focus:ring-[#D91C9A]/30 focus:border-[#D91C9A] transition-all"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        
        {/* 2. AMAZON-STYLE TOOLBAR */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8 sticky top-24 z-40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {filteredInfluencers.length} <span className="text-gray-500 font-medium text-base">Creators Found</span>
            </h2>
            {(searchQuery || Object.values(filters).some(val => val && (Array.isArray(val) ? val.length > 0 : true))) && (
              <button onClick={handleClearFilters} className="text-sm text-[#D91C9A] font-medium hover:underline mt-1">
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <InfluencerSort sortBy={sortBy} onSortChange={setSortBy} />
            </div>
            
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-200/50 hover:scale-105 active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* 3. RESULTS GRID */}
        <div className="w-full">
          {filteredInfluencers.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No creators found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or removing some filters.</p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <InfluencerGrid
              influencers={filteredInfluencers}
              totalCount={filteredInfluencers.length}
            />
          )}
        </div>

      </div>

      {/* 4. SLIDE-OUT FILTER DRAWER */}
      <AnimatePresence>
        {isFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFiltersOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#D91C9A]" /> Filter Influencers
                </h2>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <InfluencerFilters
                  filters={filters}
                  setFilters={setFilters}
                  onApply={() => setIsFiltersOpen(false)}
                  onClear={handleClearFilters}
                />
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all"
                >
                  Show {filteredInfluencers.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}