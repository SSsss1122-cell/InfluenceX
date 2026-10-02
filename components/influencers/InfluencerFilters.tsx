"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { categories, states, cities } from "@/data/influencers";

// ✅ This MUST match the Filters interface in your page exactly.
export interface Filters {
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
  availability: string; // "" | "available" | "unavailable"
}

interface InfluencerFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onApply: () => void;
  onClear: () => void;
  className?: string;
}

const PLATFORMS = ["instagram", "youtube", "facebook", "twitter", "linkedin"];
const INFLUENCER_TYPES = ["Nano", "Micro", "Mid-tier", "Macro", "Mega"];
const GENDERS = ["Male", "Female", "Other"];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200 py-4">
      <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
      {children}
    </div>
  );
}

export default function InfluencerFilters({
  filters,
  setFilters,
  onApply,
  onClear,
  className = "",
}: InfluencerFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 10);

  // Multi-select toggle (categories / platforms / influencerTypes / genders)
  const toggle = (
    key: "categories" | "platforms" | "influencerTypes" | "genders",
    value: string
  ) => {
    setFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  // Single-value setter
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {visibleCategories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggle("categories", cat)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {cat}
            </label>
          ))}
          {categories.length > 10 && (
            <button
              type="button"
              onClick={() => setShowAllCategories((s) => !s)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {showAllCategories ? "View Less" : "View More"}
            </button>
          )}
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        <div className="space-y-2">
          <select
            value={filters.state}
            onChange={(e) => set("state", e.target.value)}
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filters.city}
            onChange={(e) => set("city", e.target.value)}
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* Platform */}
      <FilterSection title="Platform">
        <div className="space-y-2">
          {PLATFORMS.map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.platforms.includes(p)}
                onChange={() => toggle("platforms", p)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Followers */}
      <FilterSection title="Followers">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.followersMin}
              onChange={(e) => set("followersMin", e.target.value)}
              className="w-1/2 rounded-lg border-gray-300 text-sm"
            />
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.followersMax}
              onChange={(e) => set("followersMax", e.target.value)}
              className="w-1/2 rounded-lg border-gray-300 text-sm"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>10K</span>
            <span>50K</span>
            <span>100K</span>
            <span>500K</span>
            <span>1M+</span>
          </div>
        </div>
      </FilterSection>

      {/* Engagement */}
      <FilterSection title="Engagement Rate (%)">
        <div className="flex items-center gap-4">
          <input
            type="number"
            step="0.1"
            min={0}
            placeholder="Min %"
            value={filters.engagementMin}
            onChange={(e) => set("engagementMin", e.target.value)}
            className="w-1/2 rounded-lg border-gray-300 text-sm"
          />
          <input
            type="number"
            step="0.1"
            min={0}
            placeholder="Max %"
            value={filters.engagementMax}
            onChange={(e) => set("engagementMax", e.target.value)}
            className="w-1/2 rounded-lg border-gray-300 text-sm"
          />
        </div>
      </FilterSection>

      {/* Influencer Type */}
      <FilterSection title="Influencer Type">
        <div className="space-y-2">
          {INFLUENCER_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.influencerTypes.includes(type)}
                onChange={() => toggle("influencerTypes", type)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {type}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Budget */}
      <FilterSection title="Budget (₹)">
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => set("priceMin", e.target.value)}
            className="w-1/2 rounded-lg border-gray-300 text-sm"
          />
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => set("priceMax", e.target.value)}
            className="w-1/2 rounded-lg border-gray-300 text-sm"
          />
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender">
        <div className="space-y-2">
          {GENDERS.map((g) => (
            <label
              key={g}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.genders.includes(g)}
                onChange={() => toggle("genders", g)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {g}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Verified */}
      <FilterSection title="Verification">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={(e) => set("verified", e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Verified Influencers Only
        </label>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value="available"
              checked={filters.availability === "available"}
              onChange={() => set("availability", "available")}
              className="text-blue-600 focus:ring-blue-500"
            />
            Available for campaigns
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value="unavailable"
              checked={filters.availability === "unavailable"}
              onChange={() => set("availability", "unavailable")}
              className="text-blue-600 focus:ring-blue-500"
            />
            Currently unavailable
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value=""
              checked={filters.availability === ""}
              onChange={() => set("availability", "")}
              className="text-blue-600 focus:ring-blue-500"
            />
            All
          </label>
        </div>
      </FilterSection>

      <button
        type="button"
        onClick={onApply}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
}