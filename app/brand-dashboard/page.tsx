
"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Users,
  Save,
  LogOut,
  LayoutDashboard,
  BriefcaseBusiness,
  CheckCircle2,
  LoaderCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

type BrandProfile = {
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

const initialProfile: BrandProfile = {
  user_id: "",
  brand_name: "",
  brand_type: "Other",
  service_type: "Online",
  influencer_types: [],
  platforms: [],
  description: "",
  website: "",
  contact_email: "",
  phone: "",
  location: "",
};

const influencerOptions = [
  "Nano Influencer",
  "Micro Influencer",
  "Macro Influencer",
  "Mega Influencer",
];

const platformOptions = [
  "Instagram",
  "YouTube",
  "Facebook",
  "LinkedIn",
];

export default function BrandDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<BrandProfile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.replace("/login");
      return;
    }

    setUserEmail(user.email ?? "");

    const { data, error: profileError } = await supabase
      .from("brands")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      setError(
        "Could not load your brand profile. Check the brands table and its RLS policies in Supabase."
      );
    } else if (data) {
      setProfile({
        ...initialProfile,
        ...data,
        influencer_types: data.influencer_types ?? [],
        platforms: data.platforms ?? [],
      });
    } else {
      setProfile({
        ...initialProfile,
        user_id: user.id,
        contact_email: user.email ?? "",
      });
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateField = (
    field: keyof BrandProfile,
    value: string | string[]
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleArrayValue = (
    field: "influencer_types" | "platforms",
    value: string
  ) => {
    setProfile((previous) => {
      const values = previous[field];

      return {
        ...previous,
        [field]: values.includes(value)
          ? values.filter((item) => item !== value)
          : [...values, value],
      };
    });
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setSaving(false);
      router.replace("/login");
      return;
    }

    if (!profile.brand_name.trim()) {
      setError("Please enter your brand name.");
      setSaving(false);
      return;
    }

    const payload = {
      user_id: user.id,
      brand_name: profile.brand_name.trim(),
      brand_type: profile.brand_type,
      service_type: profile.service_type,
      influencer_types: profile.influencer_types,
      platforms: profile.platforms,
      description: profile.description.trim(),
      website: profile.website.trim(),
      contact_email: profile.contact_email.trim(),
      phone: profile.phone.trim(),
      location: profile.location.trim(),
      updated_at: new Date().toISOString(),
    };

    const { error: saveError } = await supabase
      .from("brands")
      .upsert(payload, { onConflict: "user_id" });

    setSaving(false);

    if (saveError) {
      setError(`Unable to save your profile: ${saveError.message}`);
      return;
    }

    setProfile((previous) => ({
      ...previous,
      user_id: user.id,
    }));

    setMessage("Your brand profile has been saved successfully.");
  };

  const handleLogout = async () => {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError("Unable to log out. Please try again.");
      return;
    }

    router.replace("/login");
    router.refresh();
  };

  const filledFields = [
    profile.brand_name,
    profile.brand_type !== "Other" ? profile.brand_type : "",
    profile.service_type,
    profile.description,
    profile.website,
    profile.contact_email,
    profile.phone,
    profile.location,
    profile.influencer_types.length > 0 ? "selected" : "",
    profile.platforms.length > 0 ? "selected" : "",
  ];

  const completion = Math.round(
    (filledFields.filter(Boolean).length / filledFields.length) * 100
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-slate-300">
          <LoaderCircle className="h-6 w-6 animate-spin" />
          Loading your brand dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-900/70 p-6 md:flex md:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">InfluenceX</h1>
              <p className="text-xs text-slate-400">Brand workspace</p>
            </div>
          </div>

          <nav className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl bg-violet-600/15 px-4 py-3 font-medium text-violet-300">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </div>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("brand-profile")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-white/5"
            >
              <BriefcaseBusiness className="h-5 w-5" />
              Brand profile
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("influencer-preferences")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-white/5"
            >
              <Users className="h-5 w-5" />
              Influencer preferences
            </button>
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-semibold">Build your brand profile</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Add your business details and preferred influencer types to
              help creators understand your brand.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {completion}% complete
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8">
            <div>
              <p className="text-sm text-slate-400">Brand workspace</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                Brand Dashboard
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">Brand account</p>
                <p className="max-w-56 truncate text-xs text-slate-400">
                  {userEmail}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600/20 text-lg font-bold text-violet-300">
                {(profile.brand_name || userEmail || "B")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 md:hidden"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
            <div className="overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-r from-violet-700/30 via-indigo-700/20 to-slate-900 p-6 sm:p-8">
              <p className="text-sm font-medium text-violet-300">
                WELCOME TO INFLUENCEX
              </p>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                {profile.brand_name
                  ? `Welcome, ${profile.brand_name}!`
                  : "Let's set up your brand"}
              </h3>
              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                Manage your business information, describe the services you
                offer, and choose the influencers and platforms that match
                your marketing goals.
              </p>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("brand-profile")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500"
              >
                Edit brand profile
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                icon={<Building2 className="h-5 w-5" />}
                label="Brand name"
                value={profile.brand_name || "Not added yet"}
                detail="Your business identity"
              />
              <SummaryCard
                icon={<BriefcaseBusiness className="h-5 w-5" />}
                label="Brand category"
                value={profile.brand_type || "Other"}
                detail="Type of business"
              />
              <SummaryCard
                icon={<Globe className="h-5 w-5" />}
                label="Service type"
                value={profile.service_type || "Online"}
                detail="How you serve customers"
              />
              <SummaryCard
                icon={<Users className="h-5 w-5" />}
                label="Influencer types"
                value={`${profile.influencer_types.length} selected`}
                detail="Your preferred creator categories"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {message && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{message}</p>
              </div>
            )}

            <form onSubmit={saveProfile} className="space-y-8">
              <section
                id="brand-profile"
                className="scroll-mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-8"
              >
                <div className="mb-7 flex items-start gap-4">
                  <div className="rounded-xl bg-violet-500/15 p-3 text-violet-300">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Brand Information</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Tell influencers who you are and what your business does.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Brand name *">
                    <input
                      required
                      value={profile.brand_name}
                      onChange={(e) =>
                        updateField("brand_name", e.target.value)
                      }
                      placeholder="e.g. Glow Beauty"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Brand type">
                    <select
                      value={profile.brand_type}
                      onChange={(e) =>
                        updateField("brand_type", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option>Beauty & Cosmetics</option>
                      <option>Fashion & Clothing</option>
                      <option>Food & Beverage</option>
                      <option>Health & Wellness</option>
                      <option>Technology</option>
                      <option>Education</option>
                      <option>Travel & Tourism</option>
                      <option>Fitness & Sports</option>
                      <option>Home & Lifestyle</option>
                      <option>E-commerce</option>
                      <option>Other</option>
                    </select>
                  </Field>

                  <Field label="Service type">
                    <select
                      value={profile.service_type}
                      onChange={(e) =>
                        updateField("service_type", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Both">Both online and offline</option>
                    </select>
                  </Field>

                  <Field label="Website URL">
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) =>
                        updateField("website", e.target.value)
                      }
                      placeholder="https://yourbrand.com"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Contact email">
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        value={profile.contact_email}
                        onChange={(e) =>
                          updateField("contact_email", e.target.value)
                        }
                        placeholder="contact@yourbrand.com"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>

                  <Field label="Contact phone">
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          updateField("phone", e.target.value)
                        }
                        placeholder="+91 98765 43210"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>

                  <Field label="Brand location">
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                      <input
                        value={profile.location}
                        onChange={(e) =>
                          updateField("location", e.target.value)
                        }
                        placeholder="e.g. Bengaluru, Karnataka"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="About your brand">
                      <textarea
                        rows={4}
                        value={profile.description}
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
                        placeholder="Describe your brand, products, services, and target audience..."
                        className={`${inputClass} resize-y`}
                      />
                    </Field>
                  </div>
                </div>
              </section>

              <section
                id="influencer-preferences"
                className="scroll-mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-8"
              >
                <div className="mb-7 flex items-start gap-4">
                  <div className="rounded-xl bg-fuchsia-500/15 p-3 text-fuchsia-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Influencer Preferences
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Select the creator types and platforms that suit your
                      marketing needs.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">
                    Preferred influencer types
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {influencerOptions.map((option) => (
                      <CheckOption
                        key={option}
                        label={option}
                        checked={profile.influencer_types.includes(option)}
                        onChange={() =>
                          toggleArrayValue("influencer_types", option)
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="mb-3 font-semibold">
                    Preferred social media platforms
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {platformOptions.map((option) => (
                      <CheckOption
                        key={option}
                        label={option}
                        checked={profile.platforms.includes(option)}
                        onChange={() =>
                          toggleArrayValue("platforms", option)
                        }
                        icon={
                          option === "Instagram" ? (
                            <FaInstagram className="h-5 w-5" />
                          ) : option === "YouTube" ? (
                            <FaYoutube className="h-5 w-5" />
                          ) : (
                            <Globe className="h-5 w-5" />
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              </section>

              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold">Save your brand profile</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Your details will be stored securely in your Supabase
                    account.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {saving ? "Saving..." : "Save Brand Profile"}
                </button>
              </div>
            </form>

            <footer className="pb-4 text-center text-xs text-slate-500">
              InfluenceX · Brand workspace
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
        {icon}
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 break-words text-xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
        checked
          ? "border-violet-500/60 bg-violet-500/10"
          : "border-white/10 bg-slate-950/40 hover:border-white/20"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-violet-500"
      />
      {icon && <span className="text-violet-300">{icon}</span>}
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {checked && (
        <CheckCircle2 className="ml-auto h-5 w-5 text-violet-300" />
      )}
    </label>
  );
}
