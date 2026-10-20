"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Target,
  Zap,
  ChevronDown,
  IndianRupee,
  BrainCircuit,
} from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

// --- Types ---
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
  budget_min: number | "";
  budget_max: number | "";
  target_cities: string; // Comma separated in UI, converted to array for DB
};

type Influencer = {
  id: string;
  name: string;
  username: string;
  category: string;
  categories: string[];
  platforms: string[];
  followers: number;
  engagement_rate: number;
  influencer_type: string;
  starting_price: number;
  profile_image: string;
  location: string;
  city: string;
  state: string;
  verified: boolean;
  matchScore?: number;
  matchReasons?: string[];
};

const initialProfile: BrandProfile = {
  user_id: "",
  brand_name: "",
  brand_type: "Beauty & Cosmetics",
  service_type: "Online",
  influencer_types: [],
  platforms: ["Instagram"],
  description: "",
  website: "",
  contact_email: "",
  phone: "",
  location: "",
  budget_min: "",
  budget_max: "",
  target_cities: "",
};

const influencerOptions = ["Nano Influencer", "Micro Influencer", "Macro Influencer", "Mega Influencer"];
const platformOptions = ["Instagram", "YouTube", "Facebook", "LinkedIn"];

// --- Matching Engine (Deterministic & Transparent) ---
const calculateMatch = (brand: BrandProfile, inf: Influencer) => {
  let score = 0;
  const reasons: string[] = [];
  
  const normalize = (txt: string) => (txt || "").toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const brandText = normalize(`${brand.brand_name} ${brand.brand_type} ${brand.description}`);
  const infText = normalize(`${inf.category} ${inf.bio || ""} ${(inf.categories || []).join(" ")}`);
  
  // 1. Niche (35%)
  const brandWords = brandText.split(" ").filter((w) => w.length > 3);
  let keywordMatches = 0;
  brandWords.forEach((w) => {
    if (infText.includes(w)) keywordMatches++;
  });
  
  const nicheScore = Math.min(35, keywordMatches * 7);
  if (nicheScore > 0) {
    score += nicheScore;
    reasons.push(`Strong niche relevance in ${inf.category}`);
  }

  // 2. Platform (20%)
  const commonPlatforms = (brand.platforms || []).filter((p) => (inf.platforms || []).includes(p));
  if (commonPlatforms.length > 0) {
    score += 20;
    reasons.push(`Uses your preferred platform: ${commonPlatforms.join(", ")}`);
  }

  // 3. Influencer Type (15%)
  if ((brand.influencer_types || []).includes(inf.influencer_type)) {
    score += 15;
    reasons.push(`Matches preferred creator type (${inf.influencer_type})`);
  }

  // 4. Location (10%)
  const targetCities = (brand.target_cities || "").split(",").map((c) => normalize(c.trim()));
  const brandLoc = normalize(brand.location);
  const infLoc = normalize(`${inf.city} ${inf.state} ${inf.location}`);

  if (targetCities.some((c) => c && infLoc.includes(c)) || (brandLoc && infLoc.includes(brandLoc))) {
    score += 10;
    reasons.push(`Located in target region (${inf.city})`);
  }

  // 5. Audience & Engagement (10%)
  let engScore = 0;
  if (inf.engagement_rate > 0) {
    engScore = Math.min(5, (inf.engagement_rate / 5) * 5);
    if (inf.engagement_rate >= 3) reasons.push(`High engagement rate (${inf.engagement_rate}%)`);
  }
  
  let follScore = 0;
  if (inf.followers > 0) {
    follScore = 5;
    reasons.push(`Active audience (${(inf.followers / 1000).toFixed(1)}k followers)`);
  }
  score += engScore + follScore;

  // 6. Budget (10%)
  const bMin = Number(brand.budget_min) || 0;
  const bMax = Number(brand.budget_max) || 0;
  const price = Number(inf.starting_price) || 0;

  if (bMax > 0 && price > 0) {
    if (price >= bMin && price <= bMax) {
      score += 10;
      reasons.push(`Fits your campaign budget (₹${price})`);
    } else if (price < bMin) {
      score += 10;
    } else {
      reasons.push(`Slightly above your budget (₹${price})`);
    }
  } else {
    score += 5; // Don't penalize if budget isn't specified
  }

  return { score: Math.min(100, Math.round(score)), reasons };
};

export default function BrandDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<BrandProfile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // AI Matching State
  const [matchState, setMatchState] = useState<"idle" | "analyzing" | "done">("idle");
  const [matchStage, setMatchStage] = useState(0);
  const [results, setResults] = useState<Influencer[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

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

    if (data) {
      setProfile({
        ...initialProfile,
        ...data,
        influencer_types: data.influencer_types ?? [],
        platforms: data.platforms ?? [],
        target_cities: (data.target_cities || []).join(", "),
      });
    } else {
      setProfile({ ...initialProfile, user_id: user.id, contact_email: user.email ?? "" });
    }
    setLoading(false);
  }, [router]);

  useEffect(() => { void loadProfile(); }, [loadProfile]);

  const updateField = (field: keyof BrandProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: "influencer_types" | "platforms", value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleFindInfluencers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.brand_name.trim()) {
      setError("Please enter your brand name.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    setMatchState("analyzing");
    setMatchStage(0);

    // 1. Save Profile First
    const citiesArray = profile.target_cities.split(",").map(c => c.trim()).filter(Boolean);
    const payload = {
      user_id: profile.user_id,
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
      budget_min: Number(profile.budget_min) || 0,
      budget_max: Number(profile.budget_max) || 0,
      target_cities: citiesArray,
      updated_at: new Date().toISOString(),
    };

    const { error: saveError } = await supabase.from("brands").upsert(payload, { onConflict: "user_id" });
    if (saveError) {
      setError(`Failed to save profile: ${saveError.message}`);
      setSaving(false);
      setMatchState("idle");
      return;
    }

    // 2. AI Animation Sequence
    setMatchStage(1);
    await new Promise((r) => setTimeout(r, 800)); // Visual delay
    setMatchStage(2);

    // 3. Fetch Real Influencers
    const { data: infData, error: infError } = await supabase
      .from("influencers")
      .select("*")
      .eq("available", true)
      .limit(100); // Limit for performance

    if (infError) {
      setError("Failed to fetch influencers.");
      setSaving(false);
      setMatchState("idle");
      return;
    }

    setMatchStage(3);
    await new Promise((r) => setTimeout(r, 800));

    // 4. Calculate Scores
    const scoredInfluencers = (infData || []).map((inf) => {
      const { score, reasons } = calculateMatch(profile, inf as Influencer);
      return { ...inf, matchScore: score, matchReasons: reasons };
    });

    // 5. Rank and Finalize
    setMatchStage(4);
    await new Promise((r) => setTimeout(r, 800));
    setMatchStage(5);
    await new Promise((r) => setTimeout(r, 800));

    scoredInfluencers.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    
    setResults(scoredInfluencers);
    setMatchState("done");
    setSaving(false);
    setMessage("Brand profile saved. Here are your personalized matches.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex justify-center items-center">
        <LoaderCircle className="w-10 h-10 animate-spin text-[#D91C9A]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBFD] text-gray-900 pb-20">
      <div className="flex min-h-screen">
        
        {/* SIDEBAR */}
        <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white p-6 md:flex md:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B2BE2] to-[#D91C9A] text-white shadow-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">InfluenceX</h1>
              <p className="text-xs text-gray-500">Brand Workspace</p>
            </div>
          </div>

          <nav className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl bg-pink-50 px-4 py-3 font-semibold text-[#D91C9A]">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </div>
            <button onClick={() => document.getElementById('brand-profile')?.scrollIntoView({ behavior: 'smooth' })} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-gray-600 font-medium hover:bg-gray-50 transition">
              <BriefcaseBusiness className="h-5 w-5" /> Brand Profile
            </button>
            <button onClick={() => document.getElementById('matching-section')?.scrollIntoView({ behavior: 'smooth' })} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-gray-600 font-medium hover:bg-gray-50 transition">
              <Sparkles className="h-5 w-5" /> AI Matching
            </button>
          </nav>

          <div className="mt-auto rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">Profile Status</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] transition-all" style={{ width: profile.brand_name ? '100%' : '20%' }} />
            </div>
            <p className="mt-2 text-xs text-gray-500">{profile.brand_name ? 'Ready for matching' : 'Setup required'}</p>
          </div>

          <button onClick={handleLogout} className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-500 hover:bg-red-50 transition">
            <LogOut className="h-5 w-5" /> Log out
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white/50 px-6 py-5 backdrop-blur-xl">
            <div>
              <p className="text-sm font-medium text-[#D91C9A]">Brand Workspace</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">AI Influencer Matcher</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold">{profile.brand_name || "New Brand"}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#8B2BE2] to-[#D91C9A] text-white font-bold shadow-md">
                {(profile.brand_name || userEmail || "B").charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl space-y-10 p-6 sm:p-10">
            
            {/* ALERTS */}
            {error && <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}
            {message && <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"><CheckCircle2 className="w-5 h-5 shrink-0" />{message}</div>}

            {/* FORM */}
            <form onSubmit={handleFindInfluencers} className="space-y-8">
              
              {/* SECTION 1: BRAND INFO */}
              <section id="brand-profile" className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex items-center gap-4">
                  <div className="rounded-xl bg-purple-50 p-3 text-[#8B2BE2]"><Building2 className="h-6 w-6" /></div>
                  <div>
                    <h3 className="text-xl font-bold">Brand Information</h3>
                    <p className="text-sm text-gray-500">Tell us who you are and what you do.</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Brand Name *">
                    <input required value={profile.brand_name} onChange={(e) => updateField("brand_name", e.target.value)} placeholder="e.g. Glow Beauty" className={inputClass} />
                  </Field>
                  <Field label="Industry / Brand Type">
                    <select value={profile.brand_type} onChange={(e) => updateField("brand_type", e.target.value)} className={inputClass}>
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
                  <Field label="Brand Location">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input value={profile.location} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. Bengaluru, Karnataka" className={`${inputClass} pl-10`} />
                    </div>
                  </Field>
                  <Field label="Target Cities (Optional)">
                    <input value={profile.target_cities} onChange={(e) => updateField("target_cities", e.target.value)} placeholder="e.g. Mumbai, Delhi, Bengaluru" className={inputClass} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="About Your Brand (Crucial for AI Matching)">
                      <textarea rows={4} value={profile.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe your products, services, and target audience in detail..." className={`${inputClass} resize-y`} />
                    </Field>
                  </div>
                </div>
              </section>

              {/* SECTION 2: PREFERENCES */}
              <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex items-center gap-4">
                  <div className="rounded-xl bg-pink-50 p-3 text-[#D91C9A]"><Target className="h-6 w-6" /></div>
                  <div>
                    <h3 className="text-xl font-bold">Campaign Requirements</h3>
                    <p className="text-sm text-gray-500">Set your budget and preferred creator types.</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Min Budget (₹)">
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input type="number" value={profile.budget_min} onChange={(e) => updateField("budget_min", e.target.value)} placeholder="5000" className={`${inputClass} pl-10`} />
                    </div>
                  </Field>
                  <Field label="Max Budget (₹)">
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input type="number" value={profile.budget_max} onChange={(e) => updateField("budget_max", e.target.value)} placeholder="50000" className={`${inputClass} pl-10`} />
                    </div>
                  </Field>
                </div>

                <div className="mt-8">
                  <h4 className="mb-3 font-semibold text-gray-800">Preferred Influencer Types</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {influencerOptions.map((option) => (
                      <CheckOption key={option} label={option} checked={profile.influencer_types.includes(option)} onChange={() => toggleArrayValue("influencer_types", option)} />
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="mb-3 font-semibold text-gray-800">Preferred Platforms</h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {platformOptions.map((option) => (
                      <CheckOption 
                        key={option} label={option} checked={profile.platforms.includes(option)} onChange={() => toggleArrayValue("platforms", option)}
                        icon={option === "Instagram" ? <FaInstagram className="h-5 w-5" /> : option === "YouTube" ? <FaYoutube className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* SUBMIT BUTTON */}
              <div className="flex justify-end pt-4">
                <button type="submit" disabled={saving} className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] px-8 py-4 font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70">
                  {saving ? <LoaderCircle className="h-6 w-6 animate-spin" /> : <BrainCircuit className="h-6 w-6" />}
                  {saving ? "Saving & Matching..." : "Save & Find My Influencers"}
                </button>
              </div>
            </form>

            {/* AI ANIMATION SECTION */}
            <AnimatePresence>
              {matchState === "analyzing" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="relative flex flex-col items-center justify-center rounded-3xl border border-purple-100 bg-white p-12 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-pink-50/50 to-transparent rounded-3xl -z-10" />
                    
                    {/* Pulsing AI Orb */}
                    <div className="relative flex h-32 w-32 items-center justify-center">
                      <div className="absolute inset-0 animate-ping rounded-full bg-[#D91C9A]/20 duration-1000" />
                      <div className="absolute inset-4 animate-pulse rounded-full bg-purple-200/50 blur-md" />
                      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#8B2BE2] to-[#D91C9A] shadow-2xl shadow-pink-500/50">
                        <Sparkles className="h-10 w-10 text-white animate-pulse" />
                      </div>
                    </div>

                    <h3 className="mt-8 text-2xl font-bold text-gray-900">Analyzing your brand...</h3>
                    <p className="mt-2 text-sm font-medium text-[#D91C9A]">Scanning real influencer data</p>

                    {/* Animated Stages */}
                    <div className="mt-8 w-full max-w-md space-y-3">
                      {[
                        "Reading your brand profile",
                        "Extracting relevant keywords",
                        "Searching available influencers",
                        "Comparing niches and platforms",
                        "Evaluating budget and location",
                        "Ranking your best matches"
                      ].map((text, idx) => (
                        <div key={idx} className={`flex items-center gap-3 text-sm font-medium transition-all duration-300 ${matchStage === idx ? "text-[#D91C9A]" : matchStage > idx ? "text-green-500" : "text-gray-400 opacity-50"}`}>
                          {matchStage > idx ? <CheckCircle2 className="h-5 w-5" /> : matchStage === idx ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <div className="h-5 w-5 rounded-full border-2 border-current" />}
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RESULTS SECTION */}
            {matchState === "done" && results.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Your Personalized Matches</h2>
                    <p className="mt-1 text-gray-500">Creators ranked by how closely they match your requirements.</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-100">
                    <Sparkles className="w-4 h-4 text-[#D91C9A]" />
                    <span className="text-sm font-bold text-[#8B2BE2]">{results.length} Found</span>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {results.map((inf) => (
                    <div key={inf.id} className="group relative flex flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-xl hover:border-purple-100">
                      {/* Match Badge */}
                      <div className="absolute -top-3 -right-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#8B2BE2] to-[#D91C9A] text-white font-extrabold shadow-lg ring-4 ring-white text-sm">
                        {inf.matchScore}%
                      </div>

                      <div className="flex items-center gap-4">
                        {inf.profile_image ? (
                          <img src={inf.profile_image} alt={inf.name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-gray-100" />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-2xl font-bold text-[#D91C9A] ring-2 ring-gray-100">
                            {inf.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1">
                            {inf.name}
                            {inf.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                          </h3>
                          <p className="text-sm font-medium text-gray-500">@{inf.username}</p>
                          <p className="text-xs font-semibold text-[#D91C9A] mt-1 bg-pink-50 inline-block px-2 py-0.5 rounded-md">{inf.category}</p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="rounded-lg bg-gray-50 p-2">
                          <p className="font-bold text-gray-900">{(inf.followers / 1000).toFixed(0)}k</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Followers</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2">
                          <p className="font-bold text-gray-900">{inf.engagement_rate}%</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Engagement</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2">
                          <p className="font-bold text-gray-900">₹{inf.starting_price}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Starting</p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                        <button 
                          onClick={() => setExpandedCard(expandedCard === inf.id ? null : inf.id)}
                          className="text-sm font-bold text-[#8B2BE2] hover:text-[#D91C9A] transition-colors flex items-center gap-1"
                        >
                          {expandedCard === inf.id ? "Hide reasons" : "Why this match?"}
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedCard === inf.id ? 'rotate-180' : ''}`} />
                        </button>
                        <button onClick={() => router.push(`/influencers/${inf.id}`)} className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors">
                          View Profile
                        </button>
                      </div>

                      {/* Expanded Reasons */}
                      <AnimatePresence>
                        {expandedCard === inf.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="mt-4 space-y-2 rounded-xl bg-purple-50/50 p-4">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Match Breakdown</p>
                              {inf.matchReasons?.map((reason, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                  {reason}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* EMPTY STATE */}
            {matchState === "done" && results.length === 0 && (
              <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                <Users className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-xl font-bold text-gray-900">No influencers found</h3>
                <p className="mt-2 text-gray-500">We couldn't find any creators matching your criteria. Try expanding your budget or location.</p>
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#D91C9A] focus:ring-2 focus:ring-[#D91C9A]/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function CheckOption({ label, checked, onChange, icon }: { label: string; checked: boolean; onChange: () => void; icon?: React.ReactNode }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${checked ? "border-[#D91C9A] bg-pink-50/50" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[#D91C9A]" />
      {icon && <span className={checked ? "text-[#D91C9A]" : "text-gray-400"}>{icon}</span>}
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {checked && <CheckCircle2 className="ml-auto h-4 w-4 text-[#D91C9A]" />}
    </label>
  );
}