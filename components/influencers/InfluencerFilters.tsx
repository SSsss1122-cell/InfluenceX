"use client";

import { useState } from "react";
import { categories, states, cities } from "@/data/influencers";
import { SlidersHorizontal } from "lucide-react";

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

interface InfluencerFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onApply: () => void;
  onClear: () => void;
  className?: string;
}

export default function InfluencerFilters({
  filters,
  setFilters,
  onApply,
  onClear,
  className = "",
}: InfluencerFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 10);

  const handleCheckboxChange = (key: keyof Filters, value: string) => {
    const current = filters[key] as string[];
    const newVal = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ ...filters, [key]: newVal });
  };

  const handleRangeChange = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSelectChange = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleBoolChange = (key: keyof Filters, value: boolean) => {
    setFilters({ ...filters, [key]: value });
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-200 py-4">
      <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </h3>
        <button onClick={onClear} className="text-sm text-blue-600 hover:underline font-medium">
          Clear All
        </button>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {visibleCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => handleCheckboxChange("categories", cat)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {cat}
            </label>
          ))}
          {categories.length > 10 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
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
            onChange={(e) => handleSelectChange("state", e.target.value)}
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={filters.city}
            onChange={(e) => handleSelectChange("city", e.target.value)}
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* Platform */}
      <FilterSection title="Platform">
        <div className="space-y-2">
          {["instagram", "youtube", "facebook", "twitter", "linkedin"].map((p) => (
            <label key={p} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.platforms.includes(p)}
                onChange={() => handleCheckboxChange("platforms", p)}
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
              placeholder="Min"
              value={filters.followersMin}
              onChange={(e) => handleRangeChange("followersMin", e.target.value)}
              className="w-1/2 rounded-lg border-gray-300 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.followersMax}
              onChange={(e) => handleRangeChange("followersMax", e.target.value)}
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
      <FilterSection title="Engagement Rate">
        <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder="Min %"
            value={filters.engagementMin}
            onChange={(e) => handleRangeChange("engagementMin", e.target.value)}
            className="w-1/2 rounded-lg border-gray-300 text-sm"
          />
          <input
            type="number"
            placeholder="Max %"
            value={filters.engagementMax}
            onChange={(e) => handleRangeChange("engagementMax", e.target.value)}
            className="w-1/2 rounded-lg border-gray-300 text-sm"
          />
        </div>
      </FilterSection>

      {/* Influencer Type */}
      <FilterSection title="Influencer Type">
        <div className="space-y-2">
          {["Nano", "Micro", "Mid-tier", "Macro", "Mega"].map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.influencerTypes.includes(type)}
                onChange={() => handleCheckboxChange("influencerTypes", type)}
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
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => handleRangeChange("priceMin", e.target.value)}
            className="w-1/2 rounded-lg border-gray-300 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => handleRangeChange("priceMax", e.target.value)}
            className="w-1/2 rounded-lg border-gray-300 text-sm"
          />
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender">
        <div className="space-y-2">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.genders.includes(g)}
                onChange={() => handleCheckboxChange("genders", g)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {g}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Verified */}
      <FilterSection title="Verification">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={(e) => handleBoolChange("verified", e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Verified Influencers Only
        </label>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="availability"
              value="available"
              checked={filters.availability === "available"}
              onChange={() => handleSelectChange("availability", "available")}
              className="text-blue-600 focus:ring-blue-500"
            />
            Available for campaigns
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="availability"
              value="unavailable"
              checked={filters.availability === "unavailable"}
              onChange={() => handleSelectChange("availability", "unavailable")}
              className="text-blue-600 focus:ring-blue-500"
            />
            Currently unavailable
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="availability"
              value=""
              checked={filters.availability === ""}
              onChange={() => handleSelectChange("availability", "")}
              className="text-blue-600 focus:ring-blue-500"
            />
            All
          </label>
        </div>
      </FilterSection>

      <button
        onClick={onApply}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
}