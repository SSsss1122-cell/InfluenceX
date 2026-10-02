"use client";

import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import {
  MessageCircle,
  Users,
  Building2,
  MessageSquare,
  Send,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  User,
  Store,
  ShoppingBag,
  UserCheck,
  AlertCircle,
} from "lucide-react";

// ⚠️ Reuse your existing Navbar & Footer
import Footer from "@/components/Footer";

// ⚠️ IMPORTANT: Change this import to match your project's Supabase client location
// Common locations:
//   "@/lib/supabase/client"
//   "@/utils/supabase/client"
//   "@/lib/supabase"
//   "@/lib/supabaseClient"
import { supabase } from "@/lib/supabase";

// ⚠️ Replace with your actual influence email
const CONTACT_EMAIL = "support@yourdomain.com"; // <-- change me

// ⚠️ Replace with your actual contact number
const CONTACT_PHONE = "Add your official contact number"; // <-- change me

// Type for influencer fetched from Supabase
type Influencer = {
  id: string | number;
  username?: string | null;
  name?: string | null;
  category?: string | null;
  location?: string | null;
};

// ---------------- Contact options ----------------
const contactOptions = [
  {
    icon: MessageCircle,
    title: "General Questions",
    desc: "Have a question about InfluenceX or how the platform works?",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50 text-pink-600",
  },
  {
    icon: Users,
    title: "Influencer Support",
    desc: "Need help with your influencer profile, availability, or platform experience?",
    color: "from-purple-500 to-fuchsia-500",
    bg: "bg-purple-50 text-purple-600",
  },
  {
    icon: Building2,
    title: "Brand & Business",
    desc: "Looking for influencers or interested in working with InfluenceX?",
    color: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: MessageSquare,
    title: "Feedback & Issues",
    desc: "Found a problem or have an idea that could improve InfluenceX?",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50 text-emerald-600",
  },
];

// ---------------- Who can reach out ----------------
const audiences = [
  {
    icon: UserCheck,
    title: "Influencers",
    desc: "Need help with your profile, products, or discovering opportunities? Get in touch with us.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Store,
    title: "Brands",
    desc: "Looking for relevant creators for your campaigns? Contact the InfluenceX team.",
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    icon: Building2,
    title: "Local Businesses",
    desc: "Want to discover creators who can help you reach your local audience?",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: ShoppingBag,
    title: "Buyers",
    desc: "Have a question about a product or your experience on the platform?",
    color: "from-emerald-500 to-teal-500",
  },
];

// ---------------- Team placeholders ----------------
// ⚠️ Replace the name & role values with real team member info
const teamMembers = [
  { name: "Your Name", role: "Project Lead" },
  { name: "Team Member Name", role: "Developer" },
  { name: "Team Member Name", role: "Developer / Designer" },
  { name: "Team Member Name", role: "Developer / Research" },
];

// ---------------- FAQ ----------------
const faqs = [
  {
    q: "Who can contact InfluenceX?",
    a: "Influencers, brands, local businesses, buyers, partners, and anyone with a question or feedback about the platform can contact the InfluenceX team.",
  },
  {
    q: "Can I contact InfluenceX about an influencer?",
    a: "Yes. You can use the contact form to ask questions or report concerns related to the platform.",
  },
  {
    q: "Can brands contact InfluenceX about collaborations?",
    a: "Yes. Brands and businesses can contact the InfluenceX team regarding influencer discovery and collaboration opportunities.",
  },
  {
    q: "Can I report a problem?",
    a: "Yes. Use the contact form and select the appropriate category so the team can understand your issue.",
  },
];

export default function ContactPage() {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userType: "",
    relatedInfluencer: "", // optional
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Influencers fetched from Supabase
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loadingInfluencers, setLoadingInfluencers] = useState(true);
  const [influencersError, setInfluencersError] = useState<string | null>(null);

  // Open FAQ index (single open at a time)
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // -------- Fetch influencers from Supabase (public info only) --------
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        // ⚠️ Change table name and column names to match your Supabase schema
        const { data, error } = await supabase
          .from("influencers")
          .select("id, username, name, category, location")
          .limit(100);

        if (error) throw error;
        setInfluencers((data as Influencer[]) || []);
      } catch (err) {
        console.error("Error fetching influencers:", err);
        setInfluencersError(
          "Could not load influencers. You can still send us a message."
        );
      } finally {
        setLoadingInfluencers(false);
      }
    };

    fetchInfluencers();
  }, []);

  // -------- Validation --------
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.userType) {
      newErrors.userType = "Please select an option.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please enter a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------- Submit handler (frontend only) --------
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Frontend-only success — no backend/email service is connected yet.
    // ⚠️ Later, replace this block with a real API call (Supabase / email service).
    console.log("Contact form submission:", formData);

    setSubmitted(true);
    setFormData({
      fullName: "",
      email: "",
      userType: "",
      relatedInfluencer: "",
      subject: "",
      message: "",
    });
  };

  // -------- Handle change --------
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <main className="overflow-x-hidden">
        {/* ==================== SECTION 1: HERO ==================== */}
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-50 via-white to-white" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(236,72,153,0.12),transparent_70%)]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left */}
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-pink-100 text-pink-700 border border-pink-200">
                  <Sparkles className="w-4 h-4" />
                  Contact InfluenceX
                </span>

                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Let&apos;s{" "}
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Connect
                  </span>
                </h1>

                <p className="mt-5 text-lg sm:text-xl text-gray-700 font-medium">
                  Have a question, need support, or want to work with
                  InfluenceX? We&apos;re here to help.
                </p>

                <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
                  Whether you&apos;re an influencer, brand, local business,
                  buyer, or potential partner, reach out to the InfluenceX team
                  and let us know how we can help.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a
                    href="#contact-form"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Send a Message
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/influencers"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-pink-200 transition-all duration-300"
                  >
                    Explore Influencers
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right visual card */}
              <div className="relative">
                <div className="rounded-3xl bg-white border border-gray-100 shadow-xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        We&apos;re here to help
                      </p>
                      <p className="text-xs text-gray-500">
                        InfluenceX Support Team
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        icon: MessageCircle,
                        title: "Ask a question",
                        desc: "General help & info",
                        color: "bg-pink-50 text-pink-600",
                      },
                      {
                        icon: AlertCircle,
                        title: "Report an issue",
                        desc: "Tell us what went wrong",
                        color: "bg-purple-50 text-purple-600",
                      },
                      {
                        icon: Send,
                        title: "Share feedback",
                        desc: "Help us improve",
                        color: "bg-indigo-50 text-indigo-600",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all duration-300"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
                        >
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500">
                    For influencer discovery, browse{" "}
                    <Link
                      href="/influencers"
                      className="text-pink-600 font-medium hover:underline"
                    >
                      /influencers
                    </Link>{" "}
                    · For products, see{" "}
                    <Link
                      href="/products"
                      className="text-purple-600 font-medium hover:underline"
                    >
                      /products
                    </Link>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="hidden sm:flex absolute -bottom-4 -left-4 items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-gray-900">
                    We reply to every message
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 2: CONTACT OPTIONS ==================== */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                How can we help?
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Choose a topic that fits your need
              </h2>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {contactOptions.map((opt) => (
                <div
                  key={opt.title}
                  className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${opt.color} text-white flex items-center justify-center shadow-md mb-5`}
                  >
                    <opt.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {opt.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== SECTION 3 + 4: FORM + INFO ==================== */}
        <section id="contact-form" className="py-20 sm:py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
              {/* ---- FORM ---- */}
              <div className="lg:col-span-3">
                <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border border-gray-100 shadow-sm">
                  <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                    Contact Form
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
                    Send Us a Message
                  </h2>
                  <p className="mt-2 text-gray-600 text-sm sm:text-base">
                    Fill out the form below and tell us how we can help.
                  </p>

                  {submitted ? (
                    <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-900">
                          Thank you! Your message has been received.
                        </p>
                        <p className="text-sm text-emerald-800 mt-1">
                          The InfluenceX team will get back to you.
                        </p>
                        <button
                          type="button"
                          onClick={() => setSubmitted(false)}
                          className="mt-3 text-sm font-medium text-emerald-700 hover:text-emerald-900 underline"
                        >
                          Send another message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-900 mb-1.5"
                        >
                          Full Name <span className="text-pink-600">*</span>
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition ${
                            errors.fullName
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                          aria-invalid={!!errors.fullName}
                        />
                        {errors.fullName && (
                          <p className="mt-1.5 text-sm text-red-600">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-900 mb-1.5"
                        >
                          Email Address <span className="text-pink-600">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition ${
                            errors.email ? "border-red-300" : "border-gray-200"
                          }`}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* I am a */}
                      <div>
                        <label
                          htmlFor="userType"
                          className="block text-sm font-medium text-gray-900 mb-1.5"
                        >
                          I am a <span className="text-pink-600">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="userType"
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl border bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition ${
                              errors.userType
                                ? "border-red-300"
                                : "border-gray-200"
                            } ${!formData.userType ? "text-gray-400" : ""}`}
                            aria-invalid={!!errors.userType}
                          >
                            <option value="">Select an option</option>
                            <option value="Influencer">Influencer</option>
                            <option value="Brand">Brand</option>
                            <option value="Local Business">Local Business</option>
                            <option value="Buyer">Buyer</option>
                            <option value="Partner">Partner</option>
                            <option value="Other">Other</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {errors.userType && (
                          <p className="mt-1.5 text-sm text-red-600">
                            {errors.userType}
                          </p>
                        )}
                      </div>

                      {/* Optional: Related influencer (fetched from Supabase) */}
                      <div>
                        <label
                          htmlFor="relatedInfluencer"
                          className="block text-sm font-medium text-gray-900 mb-1.5"
                        >
                          Related Influencer{" "}
                          <span className="text-gray-400 font-normal">
                            (optional)
                          </span>
                        </label>
                        <div className="relative">
                          <select
                            id="relatedInfluencer"
                            name="relatedInfluencer"
                            value={formData.relatedInfluencer}
                            onChange={handleChange}
                            disabled={loadingInfluencers}
                            className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            <option value="">
                              {loadingInfluencers
                                ? "Loading influencers..."
                                : "None / Not applicable"}
                            </option>
                            {influencers.map((inf) => {
                              const label =
                                inf.username ||
                                inf.name ||
                                `Influencer #${inf.id}`;
                              const extras = [
                                inf.category,
                                inf.location,
                              ]
                                .filter(Boolean)
                                .join(" · ");
                              return (
                                <option key={inf.id} value={String(inf.id)}>
                                  {label}
                                  {extras ? ` — ${extras}` : ""}
                                </option>
                              );
                            })}
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500">
                          Use this only if your message is related to a specific
                          influencer on the platform. Public info only — no
                          private contact details are shown.
                        </p>
                        {influencersError && (
                          <p className="mt-1 text-xs text-amber-600">
                            {influencersError}
                          </p>
                        )}
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-900 mb-1.5"
                        >
                          Subject <span className="text-pink-600">*</span>
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Brief subject of your message"
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition ${
                            errors.subject ? "border-red-300" : "border-gray-200"
                          }`}
                          aria-invalid={!!errors.subject}
                        />
                        {errors.subject && (
                          <p className="mt-1.5 text-sm text-red-600">
                            {errors.subject}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-900 mb-1.5"
                        >
                          Message <span className="text-pink-600">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Write your message here..."
                          className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition resize-y ${
                            errors.message ? "border-red-300" : "border-gray-200"
                          }`}
                          aria-invalid={!!errors.message}
                        />
                        {errors.message && (
                          <p className="mt-1.5 text-sm text-red-600">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Send Message
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* ---- INFO CARD ---- */}
              <div className="lg:col-span-2">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-50 via-white to-purple-50 border border-pink-100 shadow-sm h-full">
                  <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                    Contact Info
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-gray-900">
                    Reach InfluenceX
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Use the details below, or send a message using the form.
                  </p>

                  <div className="mt-6 space-y-4">
                    {/* Email */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Email
                        </p>
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="text-sm font-medium text-gray-900 hover:text-pink-600 transition break-all"
                        >
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Phone
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {CONTACT_PHONE}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Location
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          India
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-2xl bg-white/70 border border-pink-100">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <strong className="text-gray-900">
                        Please note:
                      </strong>{" "}
                      This page is for contacting the{" "}
                      <strong>InfluenceX team</strong>. It is not intended to
                      share private contact details of influencers. For
                      influencer discovery, use the{" "}
                      <Link
                        href="/influencers"
                        className="text-pink-600 font-medium hover:underline"
                      >
                        Influencers
                      </Link>{" "}
                      page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 5: WHO CAN REACH OUT ==================== */}
        <section className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                Who Can Reach Out
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Who Can Reach Out?
              </h2>
            </div>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {audiences.map((a) => (
                <div
                  key={a.title}
                  className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} text-white flex items-center justify-center shadow-md mb-5`}
                  >
                    <a.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{a.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== SECTION 6: TEAM ==================== */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                The People
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Meet the Team Behind InfluenceX
              </h2>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">
                The creators and contributors building the InfluenceX platform.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* ⚠️ Edit teamMembers array at the top of the file to change names/roles */}
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md mb-4">
                    <User className="w-7 h-7" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    {member.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== SECTION 7: FAQ ==================== */}
        <section className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                FAQ
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mt-10 space-y-3">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-gray-900 text-sm sm:text-base">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-pink-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 -mt-1 text-sm sm:text-base text-gray-600 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== SECTION 8: FINAL CTA ==================== */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Have Something to Share?
            </h2>
            <p className="mt-4 text-gray-600 text-base sm:text-lg">
              Your questions, feedback, and ideas can help make InfluenceX
              better.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/influencers"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Find Influencers
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-pink-200 transition-all duration-300"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}