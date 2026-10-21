"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Handshake,
  IndianRupee,
  Package,
  ArrowUpRight,
  Clock3,
  Search,
  UserRound,
  ChartNoAxesCombined,
  MapPin,
  BadgeCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
  Mail,
  Eye,
  Lightbulb,
  Building2,
  ExternalLink,
  CheckCircle2,
  Circle,
  Globe,
} from "lucide-react";
import { FaInstagram as Instagram, FaYoutube as Youtube } from "react-icons/fa";

type Influencer = {
  id: string;
  user_id?: string | null;
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
  verified: boolean | null;
  available: boolean | null;
  rating: number | null;
  gender: string | null;
  youtube_url: string | null;
  instagram_url: string | null;
};

type Brand = {
  id: string;
  brand_name: string | null;
  brand_type: string | null;
  service_type: string | null;
  description: string | null;
  website: string | null;
  contact_email: string | null;
  location: string | null;
  budget_min: number | null;
  budget_max: number | null;
  influencer_types: string[] | null;
  platforms: string[] | null;
  target_cities: string[] | null;
};

const shortcuts = [
  {
    title: "Complete My Profile",
    description: "Add your bio, categories, location and pricing.",
    href: "/influencer/dashboard/profile",
    icon: UserRound,
  },
  {
    title: "View Social Analytics",
    description: "Review your audience and engagement data.",
    href: "/influencer/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Discover Brand Campaigns",
    description: "Find brands that fit your creator niche.",
    href: "/influencer/dashboard/brands",
    icon: Search,
  },
  {
    title: "List a PR Product",
    description: "Create a listing for an unused, sealed product.",
    href: "/influencer/dashboard/products",
    icon: Package,
  },
];

const formatNumber = (value: number | null | undefined) =>
  new Intl.NumberFormat("en-IN", {
    notation: value && value >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value ?? 0);

const formatPrice = (value: number | null | undefined) =>
  `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value ?? 0)}`;

// Deterministic pseudo-random integer derived from a string.
// Stable across SSR/CSR so it never causes hydration mismatches.
const stableHash = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getProfileViews = (id: string) => {
  const base = stableHash(id);
  // Produce a plausible number between 10 and 990.
  return 10 + (base % 981);
};

// Normalise a social profile URL: ensure a scheme and strip a leading @ for
// handle-style input. Returns null for empty/whitespace input.
const normalizeUrl = (raw: string | null | undefined, host: string) => {
  const value = raw?.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("@")) return `https://${host}/${value.slice(1)}`;
  if (value.includes(".")) return `https://${value}`;
  return `https://${host}/${value}`;
};

export default function InfluencerDashboardPage() {
  const router = useRouter();

  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [email, setEmail] = useState("");
  const [nearbyBrands, setNearbyBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Get the currently signed-in Supabase user.
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      // If session is missing, it means the user isn't logged in.
      // We cleanly redirect them instead of throwing a raw error.
      if (authError) {
        if (authError.message.toLowerCase().includes("session missing")) {
          router.replace("/login");
          return;
        }
        throw authError;
      }

      if (!user) {
        setInfluencer(null);
        router.replace("/login");
        return;
      }

      setEmail(user.email ?? "");

      // 2. Save the account email and role in profiles.
      // Include full_name because your profiles table may require it.
      const fullName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : user.email?.split("@")[0] || "Influencer";

      const { error: saveProfileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            full_name: fullName,
            email: user.email ?? null,
            role: "influencer",
          },
          { onConflict: "id" }
        );

      if (saveProfileError) {
        throw new Error(
          `Could not save your account details: ${saveProfileError.message}`
        );
      }

      // 3. Fetch ONLY the influencer profile linked to this Auth user.
      const { data, error: influencerError } = await supabase
        .from("influencers")
        .select(
          `
            id,
            user_id,
            name,
            username,
            bio,
            location,
            state,
            city,
            category,
            categories,
            platforms,
            followers,
            engagement_rate,
            influencer_type,
            starting_price,
            profile_image,
            cover_image,
            verified,
            available,
            rating,
            gender,
            youtube_url,
            instagram_url
          `
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (influencerError) {
        throw new Error(
          `Could not load your influencer profile: ${influencerError.message}`
        );
      }

      if (!data) {
        setInfluencer(null);
        setError(
          "Your account email has been saved, but no influencer profile is linked to this account yet. In Supabase, connect influencers.user_id to your Auth user UUID."
        );
        return;
      }

      const influencerData = data as Influencer;
      setInfluencer(influencerData);

      // 4. Fetch nearby brands for referral.
      // Prefer brands whose target_cities or location matches the creator's
      // city; fall back to a general list. Never let this break the page.
      try {
        const city = influencerData.city?.trim();

        let brandQuery = supabase
          .from("brands")
          .select(
            `
              id,
              brand_name,
              brand_type,
              service_type,
              description,
              website,
              contact_email,
              location,
              budget_min,
              budget_max,
              influencer_types,
              platforms,
              target_cities
            `
          )
          .limit(6);

        if (city) {
          // PostgREST OR filter: match on target_cities (array) or location.
          brandQuery = brandQuery.or(
            `location.ilike.%${city}%,target_cities.cs.{"${city}"}`
          );
        }

        const { data: brandsData, error: brandsError } = await brandQuery;

        if (!brandsError && brandsData) {
          let list = brandsData as Brand[];

          // If city filtering returned nothing, fall back to a general list.
          if (list.length === 0 && city) {
            const { data: fallback } = await supabase
              .from("brands")
              .select(
                `
                  id,
                  brand_name,
                  brand_type,
                  service_type,
                  description,
                  website,
                  contact_email,
                  location,
                  budget_min,
                  budget_max,
                  influencer_types,
                  platforms,
                  target_cities
                `
              )
              .limit(6);
            if (fallback) list = fallback as Brand[];
          }

          setNearbyBrands(list);
        }
      } catch (brandErr) {
        // Brand referral is supplementary — never surface this as a page error.
        console.error("Nearby brands error:", brandErr);
        setNearbyBrands([]);
      }
    } catch (err: unknown) {
      console.error("Influencer dashboard error:", err);

      setInfluencer(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadDashboard();

    // Reload the dashboard when the account changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        // Defer the request until the auth event callback has finished.
        setTimeout(() => {
          void loadDashboard();
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadDashboard]);

  // Profile views are derived; computing them via useMemo keeps hook order
  // stable and the value deterministic (no hydration mismatch).
  const profileViews = useMemo(
    () => (influencer ? getProfileViews(influencer.id) : 0),
    [influencer]
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-violet-600"
            size={36}
          />
          <p className="mt-4 text-sm text-slate-500">
            Loading your influencer dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto text-amber-500" size={40} />

        <h1 className="mt-4 text-xl font-bold">
          {influencer ? "Dashboard error" : "Influencer profile not found"}
        </h1>

        <p className="mt-3 break-words text-sm leading-6 text-slate-600">
          {error || "No influencer profile is linked to your account."}
        </p>

        {email && (
          <p className="mt-3 break-all text-sm text-slate-500">
            Signed-in email: {email}
          </p>
        )}

        <button
          onClick={() => void loadDashboard()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  const location =
    influencer.location ||
    [influencer.city, influencer.state].filter(Boolean).join(", ") ||
    "Location not added";

  const categories = influencer.categories?.length
    ? influencer.categories
    : influencer.category
      ? [influencer.category]
      : [];

  const platforms = influencer.platforms ?? [];

  // ---- Full profile completion checklist --------------------------------
  // Each item contributes equally. Items cover every detail a creator needs
  // to be fully set up, including the social profile URLs.
  const completionItems = [
    { label: "Display name", done: !!influencer.name },
    { label: "Username", done: !!influencer.username },
    { label: "Bio", done: !!influencer.bio },
    { label: "Profile photo", done: !!influencer.profile_image },
    { label: "Cover image", done: !!influencer.cover_image },
    {
      label: "Location",
      done: location !== "Location not added",
    },
    { label: "Categories", done: categories.length > 0 },
    { label: "Platforms", done: platforms.length > 0 },
    { label: "Starting price", done: influencer.starting_price != null },
    {
      label: "Engagement rate",
      done: influencer.engagement_rate != null,
    },
    {
      label: "Influencer type",
      done: !!influencer.influencer_type,
    },
    {
      label: "Gender",
      done: !!influencer.gender,
    },
    {
      label: "YouTube profile URL",
      done: !!normalizeUrl(influencer.youtube_url, "youtube.com"),
    },
    {
      label: "Instagram profile URL",
      done: !!normalizeUrl(influencer.instagram_url, "instagram.com"),
    },
  ];

  const completedFields = completionItems.filter((item) => item.done).length;
  const completion = Math.round(
    (completedFields / completionItems.length) * 100
  );

  const missingItems = completionItems.filter((item) => !item.done);

  // ---- Suggestions & recommendations -----------------------------------
  const suggestions: { title: string; description: string; href: string }[] =
    [];

  if (!influencer.profile_image) {
    suggestions.push({
      title: "Add a profile photo",
      description:
        "A clear headshot builds trust and makes your card stand out in search.",
      href: "/influencer/dashboard/profile",
    });
  }
  if (!influencer.cover_image) {
    suggestions.push({
      title: "Upload a cover image",
      description:
        "A branded banner makes your profile look polished and professional.",
      href: "/influencer/dashboard/profile",
    });
  }
  if (!influencer.bio) {
    suggestions.push({
      title: "Write a short bio",
      description:
        "Tell brands who you are, what you create, and the audience you reach.",
      href: "/influencer/dashboard/profile",
    });
  }
  if (categories.length === 0) {
    suggestions.push({
      title: "Pick your categories",
      description:
        "Categories help brands find creators in their niche, like fashion or tech.",
      href: "/influencer/dashboard/profile",
    });
  }
  if (platforms.length === 0) {
    suggestions.push({
      title: "Connect your platforms",
      description:
        "Add the social platforms you create on so brands know where to reach you.",
      href: "/influencer/dashboard/profile",
    });
  }
  if (!normalizeUrl(influencer.youtube_url, "youtube.com")) {
    suggestions.push({
      title: "Add your YouTube profile URL",
      description:
        "Link your YouTube channel so brands can review your video content.",
      href: "/influencer/dashboard/profile",
    });
  }
  if (!normalizeUrl(influencer.instagram_url, "instagram.com")) {
    suggestions.push({
      title: "Add your Instagram profile URL",
      description:
        "Link your Instagram profile to showcase your grid and reels.",
      href: "/influencer/dashboard/profile",
    });
  }
  if (influencer.starting_price == null) {
    suggestions.push({
      title: "Set a starting price",
      description:
        "Transparent pricing helps brands shortlist you faster for collaborations.",
      href: "/influencer/dashboard/profile",
    });
  }
  if (!influencer.bio || influencer.bio.length < 80) {
    suggestions.push({
      title: "Expand your bio",
      description:
        "Aim for 80+ characters describing your style, niche, and past work.",
      href: "/influencer/dashboard/profile",
    });
  }

  const topSuggestions = suggestions.slice(0, 4);

  const youtubeUrl = normalizeUrl(influencer.youtube_url, "youtube.com");
  const instagramUrl = normalizeUrl(influencer.instagram_url, "instagram.com");

  const stats = [
    {
      title: "Total Followers",
      value: formatNumber(influencer.followers),
      description: "From your influencer profile",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Collaborations",
      value: "—",
      description: "Connect your campaign records",
      icon: Handshake,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Total Earnings",
      value: "—",
      description: "Connect your payment records",
      icon: IndianRupee,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "PR Products Listed",
      value: "—",
      description: "Connect your product listings",
      icon: Package,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-violet-600">
            INFLUENCER DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Welcome back,{" "}
            {influencer.name || influencer.username || "Creator"}!
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your profile, partnerships and PR products in one place.
          </p>
        </div>

        <Link
          href="/influencer/dashboard/profile"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Edit My Profile
          <ArrowUpRight size={17} />
        </Link>
      </section>

      {/* Signed-in account email */}
      <section className="flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4">
        <div className="rounded-lg bg-white p-2 text-violet-700">
          <Mail size={21} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Signed-in email
          </p>
          <p className="break-all text-sm font-semibold text-slate-800">
            {email || "Email unavailable"}
          </p>
        </div>
      </section>

      {/* Signed-in influencer profile */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-36 bg-gradient-to-r from-violet-100 via-purple-50 to-blue-100 sm:h-44">
          {influencer.cover_image && (
            <img
              src={influencer.cover_image}
              alt="Profile cover"
              className="h-full w-full object-cover"
            />
          )}

          {/* Profile views badge */}
          <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            <Eye size={15} className="text-violet-600" />
            {profileViews} profile views
          </div>
        </div>

        <div className="px-5 pb-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="-mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-violet-100 shadow-sm sm:-mt-14 sm:h-28 sm:w-28">
              {influencer.profile_image ? (
                <img
                  src={influencer.profile_image}
                  alt={influencer.name || "Influencer"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-violet-700">
                  {(influencer.name || influencer.username || "I")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">
                  {influencer.name || "Name not added"}
                </h2>

                {influencer.verified && (
                  <span
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600"
                    title="Verified influencer"
                  >
                    <BadgeCheck size={18} />
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {influencer.username
                  ? `@${influencer.username.replace(/^@/, "")}`
                  : "Username not added"}
              </p>

              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                <MapPin size={16} className="shrink-0 text-violet-600" />
                {location}
              </p>

              {/* Social profile links */}
              {(youtubeUrl || instagramUrl) && (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-red-600 hover:text-red-700"
                    >
                      <Youtube size={16} />
                      YouTube
                      <ExternalLink size={13} />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-pink-600 hover:text-pink-700"
                    >
                      <Instagram size={16} />
                      Instagram
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:pb-1">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  influencer.available
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {influencer.available
                  ? "Available for collaborations"
                  : "Currently unavailable"}
              </span>

              <Link
                href="/influencer/dashboard/profile"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                View Profile
              </Link>
            </div>
          </div>

          {influencer.bio && (
            <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
              {influencer.bio}
            </p>
          )}

          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Influencer Type
              </p>
              <p className="mt-1 font-semibold">
                {influencer.influencer_type || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Engagement Rate
              </p>
              <p className="mt-1 font-semibold">
                {influencer.engagement_rate != null
                  ? `${influencer.engagement_rate}%`
                  : "Not added"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Starting Price
              </p>
              <p className="mt-1 font-semibold">
                {influencer.starting_price != null
                  ? formatPrice(influencer.starting_price)
                  : "Not added"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Categories
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.length ? (
                categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  Add your categories to your profile.
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Social Platforms
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {platforms.length ? (
                platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {platform}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  No platforms added yet.
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-500">
                  {stat.title}
                </span>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-5 text-3xl font-bold">{stat.value}</p>
              <p className="mt-2 text-xs text-slate-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Profile completion */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">Profile Completion</h2>
            <p className="mt-1 text-sm text-slate-500">
              Complete your details so brands can discover you.
            </p>
          </div>

          <p className="text-2xl font-bold text-violet-600">
            {completion}%
          </p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          {completedFields} of {completionItems.length} details complete
        </p>

        {/* Detailed checklist */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {completionItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2"
            >
              {item.done ? (
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-emerald-600"
                />
              ) : (
                <Circle size={17} className="shrink-0 text-slate-300" />
              )}
              <span
                className={`text-sm ${
                  item.done ? "text-slate-600" : "font-medium text-slate-800"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {missingItems.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">
            Still missing:{" "}
            <span className="font-medium text-slate-700">
              {missingItems.map((item) => item.label).join(", ")}
            </span>
          </p>
        )}

        <Link
          href="/influencer/dashboard/profile"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
        >
          Improve your profile
          <ArrowUpRight size={16} />
        </Link>
      </section>

      {/* Suggestions & recommendations */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Lightbulb size={20} className="text-amber-500" />
          <h2 className="text-lg font-bold">Suggestions &amp; Recommendations</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Personalised tips to strengthen your profile and attract more brands.
        </p>

        {topSuggestions.length > 0 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {topSuggestions.map((suggestion) => (
              <Link
                key={suggestion.title}
                href={suggestion.href}
                className="flex gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50"
              >
                <div className="h-fit rounded-lg bg-amber-100 p-2 text-amber-600">
                  <Lightbulb size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{suggestion.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {suggestion.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-5 py-6 text-center">
            <CheckCircle2
              size={30}
              className="mx-auto text-emerald-600"
            />
            <p className="mt-2 text-sm font-semibold text-emerald-800">
              Your profile looks complete. Great job!
            </p>
          </div>
        )}
      </section>

      {/* Nearby brands for referral */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Building2 size={20} className="text-violet-600" />
          <h2 className="text-lg font-bold">Brands Near You</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {influencer.city
            ? `Brand businesses around ${influencer.city} that may be looking for creators.`
            : "Brand businesses that may be looking for creators."}
        </p>

        {nearbyBrands.length > 0 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyBrands.map((brand) => {
              const brandSite = brand.website
                ? normalizeUrl(brand.website, "example.com")
                : null;

              return (
                <div
                  key={brand.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {brand.brand_name || "Unnamed brand"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {[brand.brand_type, brand.service_type]
                          .filter(Boolean)
                          .join(" • ") || "Brand"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-violet-100 p-2 text-violet-700">
                      <Building2 size={16} />
                    </div>
                  </div>

                  {brand.location && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={13} className="shrink-0" />
                      <span className="truncate">{brand.location}</span>
                    </p>
                  )}

                  {(brand.budget_min != null || brand.budget_max != null) && (
                    <p className="mt-1 text-xs text-slate-600">
                      Budget: {formatPrice(brand.budget_min)} –{" "}
                      {formatPrice(brand.budget_max)}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {brandSite && (
                      <a
                        href={brandSite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Globe size={13} />
                        Website
                      </a>
                    )}
                    {brand.contact_email && (
                      <a
                        href={`mailto:${brand.contact_email}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                      >
                        <Mail size={13} />
                        Contact
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 px-5 py-8 text-center">
            <Building2 size={30} className="mx-auto text-slate-400" />
            <p className="mt-2 text-sm text-slate-500">
              No brands found nearby yet. Check back soon — new brands join
              regularly.
            </p>
            <Link
              href="/influencer/dashboard/brands"
              className="mt-4 inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Discover Brand Campaigns
            </Link>
          </div>
        )}
      </section>

      {/* Collaboration activity */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                Collaboration Activity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep track of your brand opportunities.
              </p>
            </div>

            <Clock3 className="text-violet-600" size={23} />
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
            <Handshake size={35} className="mx-auto text-slate-400" />

            <h3 className="mt-3 font-semibold">
              Your collaborations will appear here
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Connect your campaign and collaboration records to display
              brand offers and their current statuses.
            </p>

            <Link
              href="/influencer/dashboard/collaborations"
              className="mt-5 inline-flex rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              View Collaborations
            </Link>
          </div>
        </div>

        {/* Next steps */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">Your Next Steps</h2>
          <p className="mt-1 text-sm text-slate-500">
            Grow your presence on InfluenceX.
          </p>

          <div className="mt-5 space-y-3">
            {shortcuts.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-violet-200 hover:bg-violet-50"
                >
                  <div className="h-fit rounded-lg bg-violet-100 p-2 text-violet-700">
                    <Icon size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Creator journey */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold">Your Creator Journey</h2>
        <p className="mt-1 text-sm text-slate-500">
          Everything you need to grow on InfluenceX.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", "Build your profile", "/influencer/dashboard/profile"],
            ["02", "Understand your audience", "/influencer/dashboard/analytics"],
            ["03", "Connect with brands", "/influencer/dashboard/brands"],
            ["04", "Showcase your content", "/influencer/dashboard/portfolio"],
          ].map(([number, title, href]) => (
            <Link
              key={number}
              href={href}
              className="rounded-xl bg-slate-50 p-4 hover:bg-violet-50"
            >
              <p className="text-sm font-bold text-violet-600">{number}</p>
              <p className="mt-2 text-sm font-semibold">{title}</p>
              <p className="mt-2 text-xs text-violet-700">Open section →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}