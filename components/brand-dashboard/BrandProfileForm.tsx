
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save } from "lucide-react";

export type BrandProfile = {
  user_id: string;
  brand_name: string;
  brand_type: string;
  service_type: string;
  influencer_types: string[];
  platforms: string[];
  description: string;
  website: string;
  contact_email: string;
  phone: string;
  location: string;
};

const influencerOptions = ["Nano", "Micro", "Macro", "Mega"];
const platformOptions = [
  "Instagram",
  "YouTube",
  "Facebook",
  "LinkedIn",
];

const brandTypes = [
  "Fashion",
  "Beauty & Skincare",
  "Food & Beverages",
  "Technology",
  "Health & Wellness",
  "Lifestyle",
  "Education",
  "Other",
];

type Props = {
  initialData: BrandProfile;
  onSaved: (data: BrandProfile) => void;
};

export default function BrandProfileForm({
  initialData,
  onSaved,
}: Props) {
  const [form, setForm] = useState<BrandProfile>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update<K extends keyof BrandProfile>(
    key: K,
    value: BrandProfile[K]
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function toggleArray(
    key: "influencer_types" | "platforms",
    value: string
  ) {
    const current = form[key];

    update(
      key,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        throw new Error("Please log in before saving your brand profile.");
      }

      const payload = {
        ...form,
        user_id: authData.user.id,
        updated_at: new Date().toISOString(),
      };

      const { data, error: saveError } = await supabase
        .from("brands")
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .single();

      if (saveError) throw saveError;

      onSaved(data as BrandProfile);
      setForm(data as BrandProfile);
      setMessage("Brand profile saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save the profile."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {message && (
        <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section id="brand-profile" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Brand Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell creators about your business.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Brand Name *
            <input
              required
              maxLength={150}
              className={inputClass}
              placeholder="e.g. Glow Beauty"
              value={form.brand_name}
              onChange={(e) => update("brand_name", e.target.value)}
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Brand Type *
            <select
              required
              className={inputClass}
              value={form.brand_type}
              onChange={(e) => update("brand_type", e.target.value)}
            >
              {brandTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Service Type *
            <select
              required
              className={inputClass}
              value={form.service_type}
              onChange={(e) => update("service_type", e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Both">Both Online & Offline</option>
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Website
            <input
              type="url"
              className={inputClass}
              placeholder="https://yourbrand.com"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Contact Email
            <input
              type="email"
              className={inputClass}
              placeholder="contact@yourbrand.com"
              value={form.contact_email}
              onChange={(e) => update("contact_email", e.target.value)}
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Phone Number
            <input
              type="tel"
              className={inputClass}
              placeholder="Business contact number"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </label>

          <label className="text-sm font-medium text-gray-700 md:col-span-2">
            Business Location
            <input
              className={inputClass}
              placeholder="e.g. Bengaluru, Karnataka"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </label>

          <label className="text-sm font-medium text-gray-700 md:col-span-2">
            About Your Brand
            <textarea
              rows={4}
              maxLength={2000}
              className={inputClass}
              placeholder="Describe your brand, products, services and target audience..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </label>
        </div>
      </section>

      <section id="influencers" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">
          Influencer Preferences
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Select the creator categories and platforms suitable for your brand.
        </p>

        <h3 className="mt-6 text-sm font-semibold text-gray-700">
          Influencer Types
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {influencerOptions.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 p-3 text-sm hover:border-indigo-400"
            >
              <input
                type="checkbox"
                checked={form.influencer_types.includes(type)}
                onChange={() => toggleArray("influencer_types", type)}
                className="accent-indigo-600"
              />
              {type}
            </label>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-semibold text-gray-700">
          Social Media Platforms
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {platformOptions.map((platform) => (
            <label
              key={platform}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 p-3 text-sm hover:border-indigo-400"
            >
              <input
                type="checkbox"
                checked={form.platforms.includes(platform)}
                onChange={() => toggleArray("platforms", platform)}
                className="accent-indigo-600"
              />
              {platform}
            </label>
          ))}
        </div>
      </section>

      <div id="services" className="flex flex-col justify-between gap-4 rounded-2xl bg-indigo-50 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-indigo-950">Ready to update?</p>
          <p className="mt-1 text-sm text-indigo-700">
            Your changes will be saved to your brand profile.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Brand Profile"}
        </button>
      </div>
    </form>
  );
}
