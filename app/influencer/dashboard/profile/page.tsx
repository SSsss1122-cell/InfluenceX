"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Country, State, City } from "country-state-city";
import {
  UserRound,
  MapPin,
  Save,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  Search,
  Users,
  BadgeCheck,
  Eye,
  X,
  RefreshCw,
} from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

type InfluencerProfile = {
  id: string;
  user_id: string | null;
  name: string | null;
  username: string | null;
  bio: string | null;
  location: string | null;
  state: string | null;
  city: string | null;
  category: string | null;
  categories: string[] | null;
  platforms: string[] | null;
  followers: number | null;
  engagement_rate: number | null;
  influencer_type: string | null;
  starting_price: number | null;
  profile_image: string | null;
  cover_image: string | null;
  gender: string | null;
  available: boolean | null;
  verified?: boolean | null;
  youtube_url: string | null;
  instagram_url: string | null;
};

type EditableFields = {
  name: string;
  username: string;
  bio: string;
  location: string;
  state: string;
  city: string;
  category: string;
  custom_category: string;
  categories: string;
  platforms: string;
  followers: string;
  engagement_rate: string;
  influencer_type: string;
  starting_price: string;
  profile_image: string;
  cover_image: string;
  gender: string;
  available: boolean;
  youtube_url: string;
  instagram_url: string;
};

// Fetch all Indian states from the package
const allStates = State.getStatesOfCountry("IN");

const categoryOptions = [
  "Fashion", "Beauty", "Tech", "Gaming", "Travel", "Food", "Fitness",
  "Lifestyle", "Education", "Finance", "Comedy", "Motivation", "Philosophy",
  "Entrepreneur", "Life Coach", "Other"
];

const emptyForm: EditableFields = {
  name: "",
  username: "",
  bio: "",
  location: "",
  state: "",
  city: "",
  category: "",
  custom_category: "",
  categories: "",
  platforms: "",
  followers: "",
  engagement_rate: "",
  influencer_type: "Micro",
  starting_price: "",
  profile_image: "",
  cover_image: "",
  gender: "",
  available: true,
  youtube_url: "",
  instagram_url: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

const publicFields =
  "id,user_id,name,username,bio,location,state,city,category,categories,platforms,followers,engagement_rate,influencer_type,starting_price,profile_image,cover_image,gender,available,verified,youtube_url,instagram_url";

function toForm(row: InfluencerProfile): EditableFields {
  const isCustomCategory = row.category && !categoryOptions.includes(row.category);
  
  return {
    name: row.name ?? "",
    username: row.username ?? "",
    bio: row.bio ?? "",
    location: row.location ?? "",
    state: row.state ?? "",
    city: row.city ?? "",
    category: isCustomCategory ? "Other" : (row.category ?? ""),
    custom_category: isCustomCategory ? row.category ?? "" : "",
    categories: (row.categories ?? []).join(", "),
    platforms: (row.platforms ?? []).join(", "),
    followers: row.followers?.toString() ?? "",
    engagement_rate: row.engagement_rate?.toString() ?? "",
    influencer_type: row.influencer_type ?? "Micro",
    starting_price: row.starting_price?.toString() ?? "",
    profile_image: row.profile_image ?? "",
    cover_image: row.cover_image ?? "",
    gender: row.gender ?? "",
    available: row.available ?? true,
    youtube_url: row.youtube_url ?? "",
    instagram_url: row.instagram_url ?? "",
  };
}

function formatFollowers(value: number | null) {
  return new Intl.NumberFormat("en-IN", {
    notation: value != null && value >= 100000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value ?? 0);
}

function formatPrice(value: number | null) {
  return value == null
    ? "Not specified"
    : `₹${new Intl.NumberFormat("en-IN").format(value)}`;
}

function getLocation(row: InfluencerProfile) {
  return (
    row.location ||
    [row.city, row.state].filter(Boolean).join(", ") ||
    "Location not added"
  );
}

export default function InfluencerProfilePage() {
  const [form, setForm] = useState<EditableFields>(emptyForm);
  const [userId, setUserId] = useState("");
  const [recordId, setRecordId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Real influencer records fetched from the database.
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerProfile | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setUserId("");
        setRecordId("");
        setError("Please log in to edit your influencer profile.");
        return;
      }

      setUserId(user.id);

      const { data, error: queryError } = await supabase
        .from("influencers")
        .select(publicFields)
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError) throw queryError;

      if (!data) {
        setRecordId("");
        setForm(emptyForm);
        setError(
          "Your account does not have a linked influencer profile yet. You can still browse the influencer directory below."
        );
        return;
      }

      const row = data as InfluencerProfile;
      setRecordId(row.id);
      setForm(toForm(row));
    } catch (err: unknown) {
      console.error("Load own influencer profile:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInfluencers = useCallback(async () => {
    setDirectoryLoading(true);
    setDirectoryError("");

    try {
      const { data, error: queryError } = await supabase
        .from("influencers")
        .select(publicFields)
        .order("name", { ascending: true });

      if (queryError) throw queryError;

      setInfluencers((data ?? []) as InfluencerProfile[]);
    } catch (err: unknown) {
      console.error("Load influencer directory:", err);
      setDirectoryError(
        err instanceof Error ? err.message : "Unable to fetch influencers right now."
      );
    } finally {
      setDirectoryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
    void loadInfluencers();
  }, [loadProfile, loadInfluencers]);

  function updateField<K extends keyof EditableFields>(
    key: K,
    value: EditableFields[K]
  ) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      
      // Auto-fill location when state or city changes
      if (key === "state" || key === "city") {
        // If state changes, reset city
        if (key === "state") {
          next.city = "";
        }
        
        if (next.city && next.state) {
          next.location = `${next.city}, ${next.state}`;
        } else if (next.state) {
          next.location = next.state;
        } else {
          next.location = "";
        }
      }
      
      return next;
    });
    setSuccess("");
    setError("");
  }

  function togglePlatform(platform: string) {
    const current = form.platforms.split(",").map(p => p.trim()).filter(Boolean);
    let updated;
    if (current.includes(platform)) {
      updated = current.filter(p => p !== platform);
    } else {
      updated = [...current, platform];
    }
    updateField("platforms", updated.join(", "));
  }

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user || user.id !== userId) {
        throw new Error("Your login session has changed. Please log in again.");
      }

      if (!recordId) {
        throw new Error("Your influencer profile is not linked.");
      }

      const followers = form.followers.trim() ? Number(form.followers) : null;
      const engagement = form.engagement_rate.trim() ? Number(form.engagement_rate) : null;
      const price = form.starting_price.trim() ? Number(form.starting_price) : null;

      if (
        (followers !== null && (!Number.isSafeInteger(followers) || followers < 0)) ||
        (engagement !== null && (!Number.isFinite(engagement) || engagement < 0 || engagement > 100)) ||
        (price !== null && (!Number.isFinite(price) || price < 0))
      ) {
        throw new Error(
          "Enter valid follower and price values. Engagement rate must be between 0 and 100."
        );
      }

      const finalCategory = form.category === "Other" ? form.custom_category.trim() : form.category;

      const payload = {
        name: form.name.trim(),
        username: form.username.trim().replace(/^@/, ""),
        bio: form.bio.trim(),
        location: form.location.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        category: finalCategory,
        categories: form.categories.split(",").map((value) => value.trim()).filter(Boolean),
        platforms: form.platforms.split(",").map((value) => value.trim()).filter(Boolean),
        followers,
        engagement_rate: engagement,
        influencer_type: form.influencer_type,
        starting_price: price,
        profile_image: form.profile_image.trim(),
        cover_image: form.cover_image.trim(),
        gender: form.gender.trim(),
        available: form.available,
        youtube_url: form.youtube_url.trim() || null,
        instagram_url: form.instagram_url.trim() || null,
      };

      const { data, error: updateError } = await supabase
        .from("influencers")
        .update(payload)
        .eq("id", recordId)
        .eq("user_id", user.id)
        .select(publicFields)
        .maybeSingle();

      if (updateError) throw updateError;

      if (!data) {
        throw new Error("Your profile was not updated. Check your database policies and account ownership.");
      }

      const updated = data as InfluencerProfile;

      setForm(toForm(updated));
      setInfluencers((current) => current.map((item) => (item.id === updated.id ? updated : item)));

      setSuccess("Your profile was updated successfully.");
    } catch (err: unknown) {
      console.error("Save influencer profile:", err);
      setError(err instanceof Error ? err.message : "Something went wrong while saving your profile.");
    } finally {
      setSaving(false);
    }
  }

  const filteredInfluencers = influencers.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    const searchable = [
      item.name,
      item.username,
      item.city,
      item.state,
      item.location,
      item.category,
      ...(item.categories ?? []),
      ...(item.platforms ?? []),
    ].filter(Boolean).join(" ").toLowerCase();

    return searchable.includes(query);
  });

  // Get cities based on selected state
  const availableCities = form.state
    ? City.getCitiesOfState("IN", allStates.find((s) => s.name === form.state)?.isoCode ?? "")
    : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* YOUR OWN PROFILE */}
      <section>
        <p className="text-sm font-semibold text-violet-600">
          CREATOR SETTINGS
        </p>
        <h1 className="mt-2 text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          Edit your own information and browse real influencers registered on InfluenceX.
        </p>
      </section>

      {loading ? (
        <div className="flex min-h-40 items-center justify-center gap-3 text-slate-500">
          <LoaderCircle className="animate-spin" />
          Loading your profile...
        </div>
      ) : recordId ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-violet-700 to-indigo-600 px-6 py-7 text-white sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white/15">
                {form.profile_image ? (
                  <img
                    src={form.profile_image}
                    alt="Your profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={32} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {form.name || "Your creator name"}
                </h2>
                <p className="mt-1 text-sm text-violet-100">
                  {form.username ? `@${form.username}` : "Add your username"}
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs text-violet-100">
                  <MapPin size={13} />
                  {form.location || "Add your location"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-7 p-5 sm:p-8">
            <section>
              <h3 className="font-bold">Basic Information</h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Full name
                  <input
                    required
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </label>

                <label className="text-sm font-medium">
                  Username
                  <input
                    className={inputClass}
                    value={form.username}
                    onChange={(e) => updateField("username", e.target.value)}
                  />
                </label>

                <label className="text-sm font-medium sm:col-span-2">
                  Bio
                  <textarea
                    rows={4}
                    maxLength={1000}
                    className={inputClass}
                    value={form.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder="Tell brands about your content and audience..."
                  />
                </label>

                <label className="text-sm font-medium">
                  Profile image URL
                  <input
                    type="url"
                    className={inputClass}
                    value={form.profile_image}
                    onChange={(e) => updateField("profile_image", e.target.value)}
                    placeholder="https://..."
                  />
                </label>

                <label className="text-sm font-medium">
                  Cover image URL
                  <input
                    type="url"
                    className={inputClass}
                    value={form.cover_image}
                    onChange={(e) => updateField("cover_image", e.target.value)}
                    placeholder="https://..."
                  />
                </label>
              </div>
            </section>

            <section className="border-t border-slate-100 pt-6">
              <h3 className="font-bold">Location and Niche</h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  State
                  <select
                    className={inputClass}
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                  >
                    <option value="">Select a state...</option>
                    {allStates.map((state) => (
                      <option key={state.isoCode} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium">
                  City
                  <select
                    className={inputClass}
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    disabled={!form.state}
                  >
                    <option value="">Select a city...</option>
                    {availableCities.map((city) => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium sm:col-span-2">
                  Location (Auto-filled)
                  <input
                    className={`${inputClass} bg-slate-50 text-slate-500`}
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="City, State"
                    readOnly
                  />
                </label>

                <label className="text-sm font-medium sm:col-span-2">
                  Primary category
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                  >
                    <option value="">Select a primary category...</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </label>

                {form.category === "Other" && (
                  <label className="text-sm font-medium sm:col-span-2">
                    Custom Category
                    <input
                      className={inputClass}
                      value={form.custom_category}
                      onChange={(e) => updateField("custom_category", e.target.value)}
                      placeholder="Type your custom category"
                    />
                  </label>
                )}

                <label className="text-sm font-medium sm:col-span-2">
                  Sub-categories (comma-separated)
                  <input
                    className={inputClass}
                    value={form.categories}
                    onChange={(e) => updateField("categories", e.target.value)}
                    placeholder="Fashion, Lifestyle, Beauty"
                  />
                </label>
              </div>
            </section>

            <section className="border-t border-slate-100 pt-6">
              <h3 className="font-bold">Social Presence and Pricing</h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">
                    Platforms
                  </label>
                  <div className="mt-2 flex gap-4">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={form.platforms.includes("Instagram")}
                        onChange={() => togglePlatform("Instagram")}
                        className="h-4 w-4 accent-violet-600"
                      />
                      <FaInstagram className="h-4 w-4 text-pink-600" />
                      Instagram
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={form.platforms.includes("YouTube")}
                        onChange={() => togglePlatform("YouTube")}
                        className="h-4 w-4 accent-violet-600"
                      />
                      <FaYoutube className="h-4 w-4 text-red-600" />
                      YouTube
                    </label>
                  </div>
                </div>

                <label className="text-sm font-medium">
                  Influencer type
                  <select
                    className={inputClass}
                    value={form.influencer_type}
                    onChange={(e) => updateField("influencer_type", e.target.value)}
                  >
                    <option value="Nano">Nano</option>
                    <option value="Micro">Micro</option>
                    <option value="Macro">Macro</option>
                    <option value="Mega">Mega</option>
                  </select>
                </label>

                <label className="text-sm font-medium">
                  Gender
                  <select
                    className={inputClass}
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                  >
                    <option value="">Select gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </label>

                <label className="text-sm font-medium">
                  YouTube Profile URL
                  <div className="relative">
                    <FaYoutube
                      size={18}
                      className="absolute left-4 top-5 -translate-y-1/2 text-red-500"
                    />
                    <input
                      type="url"
                      className={`${inputClass} pl-11`}
                      value={form.youtube_url}
                      onChange={(e) => updateField("youtube_url", e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>
                </label>

                <label className="text-sm font-medium">
                  Instagram Profile URL
                  <div className="relative">
                    <FaInstagram
                      size={18}
                      className="absolute left-4 top-5 -translate-y-1/2 text-pink-500"
                    />
                    <input
                      type="url"
                      className={`${inputClass} pl-11`}
                      value={form.instagram_url}
                      onChange={(e) => updateField("instagram_url", e.target.value)}
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                </label>

                <label className="text-sm font-medium">
                  Followers
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    value={form.followers}
                    onChange={(e) => updateField("followers", e.target.value)}
                  />
                </label>

                <label className="text-sm font-medium">
                  Engagement rate (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className={inputClass}
                    value={form.engagement_rate}
                    onChange={(e) => updateField("engagement_rate", e.target.value)}
                  />
                </label>

                <label className="text-sm font-medium sm:col-span-2">
                  Starting price (₹)
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    value={form.starting_price}
                    onChange={(e) => updateField("starting_price", e.target.value)}
                  />
                </label>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => updateField("available", e.target.checked)}
                  className="h-4 w-4 accent-violet-600"
                />
                <span>
                  <span className="block font-semibold">
                    Available for collaborations
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Let brands know when you are open to opportunities.
                  </span>
                </span>
              </label>
            </section>

            {error && (
              <div className="flex gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={19} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle2 size={19} className="shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Saving..." : "Save My Profile"}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-3">
            <AlertCircle className="shrink-0 text-amber-600" size={23} />
            <div>
              <h2 className="font-semibold text-amber-900">
                Your profile is not linked yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                {error || "Link your Auth user ID to your influencer record to edit your profile."}
              </p>
              <button
                onClick={() => void loadProfile()}
                className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INFLUENCER DIRECTORY */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              INFLUENCEX COMMUNITY
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Discover Influencers
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Real records loaded from your influencers table.
            </p>
          </div>

          <div className="text-sm font-medium text-slate-500">
            {directoryLoading
              ? "Loading..."
              : `${filteredInfluencers.length} influencer${
                  filteredInfluencers.length === 1 ? "" : "s"
                } found`}
          </div>
        </div>

        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, category or platform..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {directoryError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{directoryError}</p>
            <button
              onClick={() => void loadInfluencers()}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-800"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {directoryLoading ? (
          <div className="flex min-h-40 items-center justify-center gap-3 text-slate-500">
            <LoaderCircle className="animate-spin" />
            Fetching influencers...
          </div>
        ) : !directoryError && filteredInfluencers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Users size={34} className="mx-auto text-slate-400" />
            <h3 className="mt-3 font-semibold">
              No influencers found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {influencers.length === 0
                ? "No accessible records were returned from your influencers table. Check your database data and SELECT policies."
                : "Try another search term."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredInfluencers.map((item) => {
              const itemCategories =
                item.categories?.length
                  ? item.categories
                  : item.category
                    ? [item.category]
                    : [];

              const isOwnProfile = item.id === recordId;

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-28 bg-gradient-to-r from-violet-100 to-indigo-100">
                    {item.cover_image && (
                      <img
                        src={item.cover_image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                    {isOwnProfile && (
                      <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
                        Your profile
                      </span>
                    )}
                  </div>

                  <div className="px-5 pb-5">
                    <div className="-mt-10 flex items-end justify-between gap-3">
                      <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-violet-100 shadow-sm">
                        {item.profile_image ? (
                          <img
                            src={item.profile_image}
                            alt={item.name || "Influencer"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-violet-700">
                            {(item.name || item.username || "I")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      {item.verified && (
                        <span className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                          <BadgeCheck size={16} />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-lg font-bold">
                      {item.name || "Name not added"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.username
                        ? `@${item.username.replace(/^@/, "")}`
                        : "Username not added"}
                    </p>

                    <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin size={16} className="shrink-0 text-violet-600" />
                      {getLocation(item)}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Followers</p>
                        <p className="mt-1 font-bold">
                          {formatFollowers(item.followers)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Engagement</p>
                        <p className="mt-1 font-bold">
                          {item.engagement_rate != null
                            ? `${item.engagement_rate}%`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-slate-500">Category</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {itemCategories.length ? (
                          itemCategories.slice(0, 3).map((category) => (
                            <span
                              key={category}
                              className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                            >
                              {category}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Starting price</p>
                        <p className="mt-1 text-sm font-bold">
                          {formatPrice(item.starting_price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedInfluencer(item)}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                      >
                        <Eye size={16} />
                        View details
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* READ-ONLY SELECTED INFLUENCER DETAILS */}
      {selectedInfluencer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onClick={() => setSelectedInfluencer(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="influencer-detail-title"
            className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-36 bg-gradient-to-r from-violet-700 to-indigo-600">
              {selectedInfluencer.cover_image && (
                <img
                  src={selectedInfluencer.cover_image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
              <button
                type="button"
                aria-label="Close influencer details"
                onClick={() => setSelectedInfluencer(null)}
                className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-700 shadow hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="-mt-14 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-violet-100 text-2xl font-bold text-violet-700 shadow-sm">
                {selectedInfluencer.profile_image ? (
                  <img
                    src={selectedInfluencer.profile_image}
                    alt={selectedInfluencer.name || "Influencer"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (selectedInfluencer.name || selectedInfluencer.username || "I")
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <h2 id="influencer-detail-title" className="text-2xl font-bold">
                  {selectedInfluencer.name || "Name not added"}
                </h2>
                {selectedInfluencer.verified && (
                  <BadgeCheck className="text-blue-600" size={21} />
                )}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {selectedInfluencer.username
                  ? `@${selectedInfluencer.username.replace(/^@/, "")}`
                  : "Username not added"}
              </p>

              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={17} className="text-violet-600" />
                {getLocation(selectedInfluencer)}
              </p>

              {selectedInfluencer.bio && (
                <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {selectedInfluencer.bio}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Followers</p>
                  <p className="mt-1 font-bold">
                    {formatFollowers(selectedInfluencer.followers)}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Engagement</p>
                  <p className="mt-1 font-bold">
                    {selectedInfluencer.engagement_rate != null
                      ? `${selectedInfluencer.engagement_rate}%`
                      : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Starting price</p>
                  <p className="mt-1 font-bold">
                    {formatPrice(selectedInfluencer.starting_price)}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Categories
                  </p>
                  <p className="mt-1 text-sm">
                    {selectedInfluencer.categories?.length
                      ? selectedInfluencer.categories.join(", ")
                      : selectedInfluencer.category || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Social platforms
                  </p>
                  <p className="mt-1 text-sm">
                    {selectedInfluencer.platforms?.join(", ") || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Creator type
                  </p>
                  <p className="mt-1 text-sm">
                    {selectedInfluencer.influencer_type || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Collaboration status
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                      selectedInfluencer.available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {selectedInfluencer.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInfluencer(null)}
                className="mt-7 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Close details
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}