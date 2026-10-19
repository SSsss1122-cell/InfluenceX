
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  BarChart3,
  BriefcaseBusiness,
  Wallet,
  Images,
  Package,
  MessageCircle,
  Search,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Plus,
  CalendarDays,
  Bell,
  MapPin,
  Loader2,
  RefreshCw,
  UserRound,
  AlertCircle,
} from "lucide-react";

type InfluencerProfile = {
  id: string;
  user_id?: string | null;
  name?: string | null;
  username?: string | null;
  bio?: string | null;
  location?: string | null;
  state?: string | null;
  city?: string | null;
  category?: string | null;
  categories?: string[] | null;
  platforms?: string[] | null;
  followers?: number | null;
  engagement_rate?: number | null;
  influencer_type?: string | null;
  starting_price?: number | null;
  profile_image?: string | null;
  cover_image?: string | null;
  verified?: boolean | null;
  available?: boolean | null;
  gender?: string | null;
};

type DataRow = Record<string, unknown>;

type Stat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

type SectionDetails = {
  title: string;
  description: string;
  icon: LucideIcon;
  heading: string;
};

const sections: Record<string, SectionDetails> = {
  analytics: {
    title: "Social Media Analytics",
    description:
      "Review your profile statistics and social media performance.",
    icon: BarChart3,
    heading: "Your Performance Overview",
  },
  collaborations: {
    title: "Collaboration Requests",
    description:
      "Manage your brand invitations and collaboration opportunities.",
    icon: BriefcaseBusiness,
    heading: "Your Collaboration Activity",
  },
  brands: {
    title: "Discover Brands & Campaigns",
    description:
      "Explore opportunities that match your niche and audience.",
    icon: Search,
    heading: "Your Brand Opportunities",
  },
  earnings: {
    title: "Earnings & Payments",
    description:
      "Review recorded earnings and payment activity.",
    icon: Wallet,
    heading: "Your Payment History",
  },
  portfolio: {
    title: "Portfolio & Content",
    description:
      "Review your portfolio and showcase your content.",
    icon: Images,
    heading: "Your Portfolio",
  },
  products: {
    title: "PR Products & Resale",
    description:
      "Manage your eligible unused and sealed PR product listings.",
    icon: Package,
    heading: "Your Product Listings",
  },
  messages: {
    title: "Messages & Notifications",
    description:
      "Review your messages and notifications.",
    icon: MessageCircle,
    heading: "Your Recent Activity",
  },
};

const emptyMessages: Record<string, string> = {
  collaborations:
    "No collaboration records were found for your account.",
  brands:
    "No campaign applications were found for your account yet.",
  earnings:
    "No payment records were found for your account yet.",
  portfolio:
    "Your portfolio records will appear here when you add content.",
  products:
    "Your product listings will appear here when you create them.",
  messages:
    "Your messages and notifications will appear here when available.",
  analytics:
    "Your profile statistics are shown above. Connect your social analytics to view reach and profile visits.",
};

const tableCandidates: Record<string, string[]> = {
  collaborations: ["collaboration_requests", "collaborations"],
  brands: ["campaign_applications"],
  earnings: ["payments", "collaboration_payments"],
  portfolio: ["portfolio_items"],
  products: ["influencer_products", "product_listings"],
  messages: ["messages", "notifications"],
};

function displayNumber(value: unknown): string {
  const number = Number(value ?? 0);

  if (!Number.isFinite(number)) return "0";

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(number);
}

function displayCurrency(value: unknown): string {
  const number = Number(value ?? 0);

  if (!Number.isFinite(number)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(number);
}

function getText(
  row: DataRow,
  keys: string[],
  fallback = ""
): string {
  for (const key of keys) {
    const value = row[key];

    if (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    ) {
      return String(value);
    }
  }

  return fallback;
}

function getNumber(row: DataRow, keys: string[]): number {
  for (const key of keys) {
    const value = row[key];

    if (value !== null && value !== undefined && value !== "") {
      const number = Number(value);

      if (Number.isFinite(number)) return number;
    }
  }

  return 0;
}

function getStatus(row: DataRow): string {
  return getText(
    row,
    ["status", "payment_status", "listing_status", "state"],
    "Recorded"
  );
}

function getTitle(row: DataRow): string {
  return getText(
    row,
    [
      "title",
      "name",
      "product_name",
      "campaign_name",
      "brand_name",
      "subject",
      "message",
      "content_title",
    ],
    "Untitled record"
  );
}

function getDescription(row: DataRow): string {
  return getText(
    row,
    [
      "description",
      "message",
      "bio",
      "notes",
      "content_url",
      "post_url",
    ],
    "Details have not been provided."
  );
}

function isStatus(row: DataRow, value: string): boolean {
  return getStatus(row).toLowerCase() === value.toLowerCase();
}

function getLocation(profile: InfluencerProfile): string {
  return [
    profile.city,
    profile.state,
  ]
    .filter(Boolean)
    .join(", ") ||
    profile.location ||
    "Location not added";
}

export default function InfluencerSectionPage() {
  const params = useParams<{ section: string }>();
  const section = String(params.section ?? "");
  const page = sections[section];

  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [records, setRecords] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recordsNotice, setRecordsNotice] = useState("");

  const loadPageData = useCallback(async () => {
    setLoading(true);
    setError("");
    setRecordsNotice("");
    setRecords([]);
    setProfile(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setError("Please sign in to view your influencer dashboard.");
        return;
      }

      // Load only the profile linked to the currently signed-in account.
      const { data: profileData, error: profileError } = await supabase
        .from("influencers")
        .select(
          "id,user_id,name,username,bio,location,state,city,category,categories,platforms,followers,engagement_rate,influencer_type,starting_price,profile_image,cover_image,verified,available,gender"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
        setError(
          "No influencer profile is linked to this login. Please check the user_id in your influencers table."
        );
        return;
      }

      const currentProfile = profileData as InfluencerProfile;
      setProfile(currentProfile);

      // These features use separate tables. Missing tables/columns
      // are handled without preventing the profile from displaying.
      if (section === "analytics") {
        setRecords([]);
        return;
      }

      const candidates = tableCandidates[section] ?? [];

      if (candidates.length === 0) return;

      setRecordsLoading(true);

      let foundRecords: DataRow[] | null = null;
      let lastError = "";

      for (const tableName of candidates) {
        // Try the common ownership columns. Your table must have
        // one of these columns for this query to return user records.
        for (const ownerColumn of ["influencer_id", "user_id"]) {
          const { data, error: tableError } = await (
            supabase as any
          )
            .from(tableName)
            .select("*")
            .eq(
              ownerColumn,
              ownerColumn === "user_id" ? user.id : currentProfile.id
            );

          if (!tableError) {
            foundRecords = (data ?? []) as DataRow[];
            break;
          }

          lastError = `${tableName}: ${tableError.message}`;
        }

        if (foundRecords !== null) break;
      }

      if (foundRecords !== null) {
        setRecords(foundRecords);

        if (
          foundRecords.length === 0 &&
          lastError
        ) {
          setRecordsNotice(
            "No matching records were found. Check that the selected table contains records linked to your influencer ID or login user ID."
          );
        }
      } else {
        setRecordsNotice(
          "The profile loaded successfully, but this section's data table could not be read. Check the table names, ownership columns, and Supabase RLS policies." +
            (lastError ? ` Details: ${lastError}` : "")
        );
      }
    } catch (err) {
      console.error("Influencer section loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your dashboard."
      );
    } finally {
      setLoading(false);
      setRecordsLoading(false);
    }
  }, [section]);

  useEffect(() => {
    void loadPageData();
  }, [loadPageData]);

  if (!page) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Page Not Found
        </h1>
        <p className="mt-2 text-slate-500">
          This dashboard section does not exist.
        </p>
        <Link
          href="/influencer/dashboard"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
        >
          Back to Dashboard
          <ArrowUpRight size={17} />
        </Link>
      </div>
    );
  }

  const PageIcon = page.icon;

  const followers = Number(profile?.followers ?? 0);
  const engagement = Number(profile?.engagement_rate ?? 0);
  const categories =
    profile?.categories?.filter(Boolean).join(", ") ||
    profile?.category ||
    "Not added";

  const platforms =
    profile?.platforms?.filter(Boolean).join(", ") ||
    "Not added";

  const acceptedCount = records.filter((record) =>
    isStatus(record, "accepted")
  ).length;

  const pendingCount = records.filter((record) =>
    isStatus(record, "pending")
  ).length;

  const completedCount = records.filter(
    (record) =>
      isStatus(record, "completed") ||
      isStatus(record, "paid")
  ).length;

  const availableCount = records.filter(
    (record) =>
      isStatus(record, "available") ||
      isStatus(record, "active")
  ).length;

  const unreadCount = records.filter(
    (record) =>
      record.is_read === false ||
      record.read === false ||
      isStatus(record, "unread")
  ).length;

  const totalEarnings = records.reduce(
    (sum, record) =>
      sum +
      getNumber(record, [
        "amount",
        "total_amount",
        "earnings",
        "payment_amount",
      ]),
    0
  );

  let stats: Stat[] = [];

  switch (section) {
    case "analytics":
      stats = [
        { label: "Total Followers", value: displayNumber(followers), icon: Users },
        { label: "Engagement Rate", value: `${displayNumber(engagement)}%`, icon: TrendingUp },
        { label: "Platforms", value: String(profile?.platforms?.length ?? 0), icon: BarChart3 },
        { label: "Profile Visits", value: "Not connected", icon: ArrowUpRight },
      ];
      break;

    case "collaborations":
      stats = [
        { label: "Total Records", value: displayNumber(records.length), icon: BriefcaseBusiness },
        { label: "Pending", value: displayNumber(pendingCount), icon: Clock },
        { label: "Accepted", value: displayNumber(acceptedCount), icon: CheckCircle },
        { label: "Completed", value: displayNumber(completedCount), icon: TrendingUp },
      ];
      break;

    case "brands":
      stats = [
        { label: "Applications", value: displayNumber(records.length), icon: BriefcaseBusiness },
        { label: "Pending", value: displayNumber(pendingCount), icon: Clock },
        { label: "Accepted", value: displayNumber(acceptedCount), icon: CheckCircle },
        { label: "Your Category", value: profile?.category || "Not added", icon: Users },
      ];
      break;

    case "earnings":
      stats = [
        { label: "Recorded Amount", value: displayCurrency(totalEarnings), icon: Wallet },
        { label: "Pending Payments", value: displayNumber(pendingCount), icon: Clock },
        { label: "Paid / Completed", value: displayNumber(completedCount), icon: CheckCircle },
        { label: "Payment Records", value: displayNumber(records.length), icon: BriefcaseBusiness },
      ];
      break;

    case "portfolio":
      stats = [
        { label: "Portfolio Items", value: displayNumber(records.length), icon: Images },
        { label: "Platforms", value: String(profile?.platforms?.length ?? 0), icon: Users },
        { label: "Featured Content", value: displayNumber(records.filter((r) => r.featured === true).length), icon: TrendingUp },
        { label: "Campaign Records", value: "Not connected", icon: BriefcaseBusiness },
      ];
      break;

    case "products":
      stats = [
        { label: "My Listings", value: displayNumber(records.length), icon: Package },
        { label: "Available", value: displayNumber(availableCount), icon: CheckCircle },
        { label: "Sold", value: displayNumber(records.filter((r) => isStatus(r, "sold")).length), icon: TrendingUp },
        { label: "Recorded Earnings", value: displayCurrency(totalEarnings), icon: Wallet },
      ];
      break;

    case "messages":
      stats = [
        { label: "Records", value: displayNumber(records.length), icon: MessageCircle },
        { label: "Unread", value: displayNumber(unreadCount), icon: Bell },
        { label: "Active Conversations", value: displayNumber(new Set(records.map((r) => getText(r, ["conversation_id", "sender_id", "brand_id"])).filter(Boolean)).size), icon: Users },
        { label: "Pending", value: displayNumber(pendingCount), icon: Clock },
      ];
      break;
  }

  const showProfileCard = Boolean(profile);

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <PageIcon size={25} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {page.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {page.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadPageData()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <Link
            href="/influencer/dashboard"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Dashboard Overview
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          <Loader2 className="animate-spin" size={22} />
          Loading your Supabase profile and dashboard data...
        </div>
      )}

      {/* Errors */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <div>
              <h2 className="font-bold">Unable to load your profile</h2>
              <p className="mt-1 text-sm leading-6">{error}</p>
              <button
                type="button"
                onClick={() => void loadPageData()}
                className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && showProfileCard && profile && (
        <>
          {/* Current influencer profile */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-24 bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500" />

            <div className="px-5 pb-6 sm:px-7">
              <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.name || "Influencer profile"}
                    className="h-24 w-24 rounded-2xl border-4 border-white bg-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-violet-100 text-violet-700 shadow-sm">
                    <UserRound size={36} />
                  </div>
                )}

                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {profile.name || "Name not added"}
                    </h2>

                    {profile.verified && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile.username
                      ? `@${profile.username.replace(/^@/, "")}`
                      : "Username not added"}
                  </p>
                </div>

                <Link
                  href="/influencer/dashboard/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Edit My Profile
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {profile.bio && (
                <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
                  {profile.bio}
                </p>
              )}

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    Location
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {getLocation(profile)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Users size={16} />
                    Followers
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {displayNumber(profile.followers)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <TrendingUp size={16} />
                    Engagement
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {displayNumber(profile.engagement_rate)}%
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Wallet size={16} />
                    Starting Price
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">
                    {displayCurrency(profile.starting_price)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                  Category: {categories}
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                  Platforms: {platforms}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  Type: {profile.influencer_type || "Not added"}
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    profile.available
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {profile.available ? "Available for work" : "Not currently available"}
                </span>
              </div>
            </div>
          </section>

          {/* Section statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const StatIcon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <div className="rounded-xl bg-violet-50 p-2 text-violet-600">
                      <StatIcon size={19} />
                    </div>
                  </div>
                  <p className="mt-4 break-words text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Section records */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {page.heading}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Records associated with your influencer account.
                </p>
              </div>

              {section === "portfolio" && (
                <button
                  type="button"
                  onClick={() =>
                    window.alert(
                      "To save portfolio items, connect this button to your portfolio table and form."
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  <Plus size={17} />
                  Add Content
                </button>
              )}

              {section === "products" && (
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  <Plus size={17} />
                  Browse Products
                </Link>
              )}

              {section === "brands" && (
                <Link
                  href="/influencers"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  <Search size={17} />
                  Explore Influencers
                </Link>
              )}

              {section === "collaborations" && (
                <Link
                  href="/influencer/dashboard/brands"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Discover Opportunities
                  <ArrowUpRight size={17} />
                </Link>
              )}
            </div>

            {recordsLoading && (
              <div className="flex items-center gap-3 py-8 text-sm text-slate-500">
                <Loader2 className="animate-spin" size={20} />
                Loading your records...
              </div>
            )}

            {!recordsLoading && records.length > 0 && (
              <div className="space-y-3">
                {records.map((record, index) => {
                  const recordId = getText(
                    record,
                    ["id"],
                    `${section}-${index}`
                  );

                  const image = getText(record, [
                    "image_url",
                    "product_image",
                    "cover_image",
                    "thumbnail_url",
                    "profile_image",
                  ]);

                  return (
                    <article
                      key={recordId}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        {image ? (
                          <img
                            src={image}
                            alt={getTitle(record)}
                            className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 bg-white object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                            <PageIcon size={23} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="break-words font-semibold text-slate-800">
                            {getTitle(record)}
                          </h3>
                          <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                            {getDescription(record)}
                          </p>

                          {getText(record, ["created_at", "updated_at"]) && (
                            <p className="mt-2 text-xs text-slate-400">
                              {new Date(
                                getText(record, ["created_at", "updated_at"])
                              ).toLocaleDateString("en-IN")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                        <span className="w-fit rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700">
                          {getStatus(record)}
                        </span>

                        {getText(record, [
                          "amount",
                          "total_amount",
                          "earnings",
                          "payment_amount",
                          "price",
                        ]) && (
                          <span className="text-sm font-semibold text-slate-800">
                            {displayCurrency(
                              getNumber(record, [
                                "amount",
                                "total_amount",
                                "earnings",
                                "payment_amount",
                                "price",
                              ])
                            )}
                          </span>
                        )}

                        {getText(record, ["url", "content_url", "post_url"]) && (
                          <a
                            href={getText(record, [
                              "url",
                              "content_url",
                              "post_url",
                            ])}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-violet-700 hover:underline"
                          >
                            Open link
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!recordsLoading && records.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <PageIcon size={23} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">
                  {section === "analytics"
                    ? "Your profile analytics"
                    : "No records to display"}
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  {emptyMessages[section]}
                </p>
              </div>
            )}

            {recordsNotice && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                {recordsNotice}
              </div>
            )}
          </section>

          {/* Profile setup reminder */}
          {(!profile.profile_image ||
            !profile.name ||
            !profile.location ||
            !profile.category) && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <CalendarDays className="mt-0.5 shrink-0" size={19} />
              <div>
                <p className="font-semibold">Complete your influencer profile</p>
                <p className="mt-1">
                  Add your photo, name, location, and category so brands can
                  understand your profile.
                </p>
                <Link
                  href="/influencer/dashboard/profile"
                  className="mt-3 inline-flex font-semibold underline"
                >
                  Update profile
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
