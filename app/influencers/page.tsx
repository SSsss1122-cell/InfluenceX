"use client";

import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";

import InfluencerSearch from "@/components/influencers/InfluencerSearch";
import InfluencerFilters from "@/components/influencers/InfluencerFilters";
import InfluencerSort from "@/components/influencers/InfluencerSort";
import InfluencerGrid from "@/components/influencers/InfluencerGrid";
import LocationExplorer from "@/components/influencers/LocationExplorer";

import { Filter } from "lucide-react";

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
  categories: string[];          // must be array of strings
  platforms: string[];           // must be array of strings
  followers: number;
  engagementRate: number;
  influencerType: string;        // e.g., "Micro"
  startingPrice: number;
  profileImage: string;
  coverImage: string;
  verified: boolean;
  available: boolean;
  rating: number;
  gender: string;                // "Male" | "Female" | "Other"
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
  availability: string;          // "" | "available" | "unavailable"
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
// PAGE COMPONENT
// ==============================

export default function FindInfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortBy, setSortBy] = useState("recommended");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // ------------------------------------------
  // FETCH INFLUENCERS FROM SUPABASE
  // ------------------------------------------

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

      // Map DB columns to our frontend interface
      const formatted: Influencer[] = (data || []).map((inf) => ({
        id: inf.id,
        name: inf.name || "",
        username: inf.username || "",
        bio: inf.bio || "",
        location: inf.location || "",
        state: inf.state || "",
        city: inf.city || "",
        category: inf.category || "",
        // ensure arrays, even if null
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

  // ------------------------------------------
  // SEARCH + FILTER + SORT (CLIENT-SIDE)
  // ------------------------------------------

  const filteredInfluencers = useMemo(() => {
    let result = [...influencers];

    // --- Search ---
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

    // --- Category (multi-select) ---
    if (filters.categories.length > 0) {
      result = result.filter((inf) =>
        inf.categories.some((c) => filters.categories.includes(c))
      );
    }

    // --- State ---
    if (filters.state) {
      result = result.filter((inf) => inf.state === filters.state);
    }

    // --- City ---
    if (filters.city) {
      result = result.filter((inf) => inf.city === filters.city);
    }

    // --- Platforms (multi-select) ---
    if (filters.platforms.length > 0) {
      result = result.filter((inf) =>
        inf.platforms.some((p) => filters.platforms.includes(p))
      );
    }

    // --- Followers range ---
    if (filters.followersMin) {
      result = result.filter((inf) => inf.followers >= Number(filters.followersMin));
    }
    if (filters.followersMax) {
      result = result.filter((inf) => inf.followers <= Number(filters.followersMax));
    }

    // --- Engagement range ---
    if (filters.engagementMin) {
      result = result.filter((inf) => inf.engagementRate >= Number(filters.engagementMin));
    }
    if (filters.engagementMax) {
      result = result.filter((inf) => inf.engagementRate <= Number(filters.engagementMax));
    }

    // --- Influencer Type (multi-select) ---
    if (filters.influencerTypes.length > 0) {
      result = result.filter((inf) =>
        filters.influencerTypes.includes(inf.influencerType)
      );
    }

    // --- Price range ---
    if (filters.priceMin) {
      result = result.filter((inf) => inf.startingPrice >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter((inf) => inf.startingPrice <= Number(filters.priceMax));
    }

    // --- Gender (multi-select) ---
    if (filters.genders.length > 0) {
      result = result.filter((inf) => filters.genders.includes(inf.gender));
    }

    // --- Verified ---
    if (filters.verified) {
      result = result.filter((inf) => inf.verified === true);
    }

    // --- Availability ---
    if (filters.availability === "available") {
      result = result.filter((inf) => inf.available === true);
    } else if (filters.availability === "unavailable") {
      result = result.filter((inf) => inf.available === false);
    }

    // --- Sorting ---
    switch (sortBy) {
      case "followers_desc":
        result.sort((a, b) => b.followers - a.followers);
        break;
      case "engagement_desc":
        result.sort((a, b) => b.engagementRate - a.engagementRate);
        break;
      case "price_asc":
        result.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case "price_desc":
        result.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      default:
        // 'recommended' or 'relevant' – keep original order
        break;
    }

    return result;
  }, [influencers, searchQuery, filters, sortBy]);

  // ------------------------------------------
  // HANDLERS
  // ------------------------------------------

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleCategoryClick = (category: string) => setSearchQuery(category);

  const handleLocationClick = (city: string, state: string) => {
    setSearchQuery("");
    setFilters((prev) => ({ ...prev, city, state }));
    setIsMobileFiltersOpen(false);
  };

  const handleApplyFilters = () => setIsMobileFiltersOpen(false);

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
    setIsMobileFiltersOpen(false);
  };

  // ------------------------------------------
  // LOADING / ERROR STATES
  // ------------------------------------------

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Finding influencers across India...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
          <p className="mt-2 text-gray-500">Please check your Supabase connection.</p>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // RENDER
  // ------------------------------------------

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <InfluencerSearch
        onSearch={handleSearch}
        onCategoryClick={handleCategoryClick}
        searchQuery={searchQuery}
      />

      <LocationExplorer onLocationClick={handleLocationClick} />

      <div className="mt-8 flex flex-col md:flex-row gap-6">
        {/* Mobile filter toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              {filteredInfluencers.length}
            </span>
          </button>
          <span className="text-sm text-gray-500">
            {filteredInfluencers.length} influencers found
          </span>
        </div>

        {/* Filters Sidebar (drawer on mobile) */}
        <div
          className={`
            fixed inset-0 z-50 bg-black/30 transition-opacity
            md:static md:bg-transparent md:z-auto md:transition-none
            ${isMobileFiltersOpen ? "opacity-100" : "pointer-events-none opacity-0 md:opacity-100"}
          `}
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <div
            className={`
              absolute left-0 top-0 h-full w-80 bg-white p-4 shadow-lg overflow-y-auto transition-transform
              md:static md:w-72 md:shadow-none md:p-0
              ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              ✕
            </button>
            <InfluencerFilters
              filters={filters}
              setFilters={setFilters}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              className="md:sticky md:top-0"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredInfluencers.length} Influencers Found
              </h2>
              <p className="text-sm text-gray-500">Across India</p>
            </div>
            <div className="flex items-center gap-2">
              <InfluencerSort sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          {filteredInfluencers.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900">No influencers found</h3>
              <p className="text-gray-500 mt-2">Try changing your search or filters.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
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
    </div>
  );
}