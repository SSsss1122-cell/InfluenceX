"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
  Search,
  Filter,
  Users,
  MapPin,
  Sparkles,
  Store,
  ShoppingBag,
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  Calendar,
  Layers,
  UserCheck,
  Wallet,
  Globe,
  Heart,
  Compass,
  Link2,
  CheckCircle2,
} from "lucide-react";

// ⚠️ Update these import paths if your project uses different locations

import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="overflow-x-hidden">
        {/* ============================ 1. HERO ============================ */}
        <section className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-pink-50 via-white to-white" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(236,72,153,0.12),transparent_70%)]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left */}
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-pink-100 text-pink-700 border border-pink-200">
                  <Sparkles className="w-4 h-4" />
                  About InfluenceX
                </span>

                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                  About{" "}
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    InfluenceX
                  </span>
                </h1>

                <p className="mt-5 text-lg sm:text-xl text-gray-700 font-medium">
                  Connecting brands with real influencers and giving unused PR
                  products a second life.
                </p>

                <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
                  InfluenceX combines influencer discovery and PR product resale
                  into one platform. Brands can find the right local creators,
                  and influencers can turn unused PR products into value instead
                  of letting them sit on a shelf.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    href="/influencers"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Explore Influencers
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-pink-200 transition-all duration-300"
                  >
                    Explore Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right visual card */}
              <div className="relative">
                <div className="relative rounded-3xl bg-white border border-gray-100 shadow-xl p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          InfluenceX Ecosystem
                        </p>
                        <p className="text-xs text-gray-500">
                          One platform, two sides of value
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        icon: Users,
                        title: "Influencers",
                        desc: "List unused PR products",
                        color: "bg-pink-50 text-pink-600",
                      },
                      {
                        icon: Store,
                        title: "Brands & Businesses",
                        desc: "Discover local creators",
                        color: "bg-purple-50 text-purple-600",
                      },
                      {
                        icon: ShoppingBag,
                        title: "Buyers",
                        desc: "Find useful PR products",
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

                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[
                        "from-pink-400 to-pink-600",
                        "from-purple-400 to-purple-600",
                        "from-indigo-400 to-indigo-600",
                        "from-rose-400 to-rose-600",
                      ].map((c, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} border-2 border-white`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Connecting creators, brands &amp; buyers in one place
                    </p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="hidden sm:flex absolute -bottom-4 -left-4 items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-gray-100">
                  <MapPin className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Location-based discovery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 2. WHAT IS INFLUENCEX ============================ */}
        <section className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left text */}
              <div>
                <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                  The Platform
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                  What is InfluenceX?
                </h2>
                <p className="mt-5 text-gray-600 leading-relaxed text-base sm:text-lg">
                  InfluenceX is an influencer discovery and PR product resale
                  platform. It connects brands and businesses with relevant
                  influencers, while helping influencers find value in products
                  they no longer use.
                </p>
                <p className="mt-4 text-gray-600 leading-relaxed text-base sm:text-lg">
                  Instead of juggling multiple tools to find creators and
                  separate marketplaces for reselling products, InfluenceX
                  brings both together — with a focus on local, affordable, and
                  relevant collaborations.
                </p>
              </div>

              {/* Right — highlight list */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: MapPin,
                    title: "Local Influencer Discovery",
                    color: "bg-pink-50 text-pink-600",
                  },
                  {
                    icon: Users,
                    title: "Micro & Nano Influencers",
                    color: "bg-purple-50 text-purple-600",
                  },
                  {
                    icon: Compass,
                    title: "Location-Based Matching",
                    color: "bg-indigo-50 text-indigo-600",
                  },
                  {
                    icon: Wallet,
                    title: "Affordable Collaborations",
                    color: "bg-rose-50 text-rose-600",
                  },
                  {
                    icon: Package,
                    title: "Unused PR Product Resale",
                    color: "bg-amber-50 text-amber-600",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Trust & Verification",
                    color: "bg-emerald-50 text-emerald-600",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} mb-3`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 3. THE PROBLEM ============================ */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                The Problem
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Two problems, one platform
              </h2>
              <p className="mt-4 text-gray-600 text-base sm:text-lg">
                InfluenceX was built to address two everyday challenges in the
                creator and brand ecosystem.
              </p>
            </div>

            <div className="mt-14 grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Problem 1 */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-pink-600 mb-5">
                  <Package className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-pink-600 uppercase tracking-wide">
                  Problem 01
                </span>
                <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">
                  Unused PR Products
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed text-sm sm:text-base">
                  Influencers may receive products through PR campaigns that
                  remain unused or unopened. Instead of letting these products
                  sit unused, InfluenceX provides a way to give them a second
                  life through resale.
                </p>
              </div>

              {/* Problem 2 */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-purple-600 mb-5">
                  <Search className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Problem 02
                </span>
                <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">
                  Finding the Right Local Influencer
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed text-sm sm:text-base">
                  Brands and businesses may struggle to find influencers who
                  match their location, category, audience size, budget, and
                  engagement requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 4. OUR SOLUTION ============================ */}
        <section className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                Our Solution
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                One platform, two connected flows
              </h2>
              <p className="mt-4 text-gray-600 text-base sm:text-lg">
                InfluenceX addresses both problems through a single, focused
                experience.
              </p>
            </div>

            <div className="mt-14 grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Flow 1 — Product Resale */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Product Resale Flow
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Users, label: "Influencers" },
                    { icon: Package, label: "Unused PR Products" },
                    { icon: Store, label: "List Products" },
                    { icon: ShoppingBag, label: "Interested Buyers" },
                  ].map((step, i, arr) => (
                    <div key={step.label}>
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-pink-50 transition-colors duration-300">
                        <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-pink-600">
                          <step.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">
                          {step.label}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ArrowRight className="w-4 h-4 text-gray-300 rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flow 2 — Influencer Discovery */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Influencer Discovery Flow
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Store, label: "Brands / Businesses" },
                    { icon: Search, label: "Search Influencers" },
                    { icon: Filter, label: "Apply Filters" },
                    { icon: Users, label: "Find Relevant Local Influencers" },
                    { icon: Link2, label: "Collaborate" },
                  ].map((step, i, arr) => (
                    <div key={step.label}>
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors duration-300">
                        <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-purple-600">
                          <step.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">
                          {step.label}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ArrowRight className="w-4 h-4 text-gray-300 rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 5. HOW IT WORKS ============================ */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                How It Works
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Four simple steps
              </h2>
              <p className="mt-4 text-gray-600 text-base sm:text-lg">
                InfluenceX keeps the experience focused and straightforward for
                both sides of the platform.
              </p>
            </div>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {[
                {
                  step: "01",
                  icon: Compass,
                  title: "Discover",
                  desc: "Users discover products or influencers based on their needs.",
                  color: "from-pink-500 to-rose-500",
                },
                {
                  step: "02",
                  icon: Filter,
                  title: "Search & Filter",
                  desc: "Search influencers using location, category, platform, followers, engagement, influencer type, price, gender, verification, and availability.",
                  color: "from-purple-500 to-fuchsia-500",
                },
                {
                  step: "03",
                  icon: Link2,
                  title: "Connect",
                  desc: "Brands and businesses can identify influencers suitable for their campaigns.",
                  color: "from-indigo-500 to-blue-500",
                },
                {
                  step: "04",
                  icon: Sparkles,
                  title: "Create Value",
                  desc: "Influencers can resell unused PR products while businesses can discover relevant creators.",
                  color: "from-emerald-500 to-teal-500",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md mb-5`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 tracking-widest">
                    STEP {item.step}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 6. KEY FEATURES ============================ */}
        <section className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                Features
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Key features of InfluenceX
              </h2>
              <p className="mt-4 text-gray-600 text-base sm:text-lg">
                A focused set of tools designed for discovery, collaboration,
                and value creation.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                { icon: MapPin, label: "Local Influencer Discovery" },
                { icon: Users, label: "Micro & Nano Influencers" },
                { icon: Compass, label: "Location-Based Search" },
                { icon: Filter, label: "Advanced Influencer Filters" },
                { icon: BadgeCheck, label: "Influencer Verification" },
                { icon: TrendingUp, label: "Engagement Information" },
                { icon: Calendar, label: "Influencer Availability" },
                { icon: Package, label: "PR Product Resale" },
                { icon: ShoppingBag, label: "Product Discovery" },
                { icon: Wallet, label: "Affordable Collaboration" },
                { icon: Layers, label: "Category-Based Discovery" },
                { icon: Globe, label: "Platform-Based Discovery" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 text-pink-600 flex items-center justify-center mb-3">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 leading-snug">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 7. WHO IS IT FOR ============================ */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                Who It's For
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Built for everyone in the creator ecosystem
              </h2>
            </div>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {[
                {
                  icon: UserCheck,
                  title: "Influencers",
                  desc: "Showcase your profile, discover opportunities, and give unused PR products a second life.",
                  color: "from-pink-500 to-rose-500",
                },
                {
                  icon: Store,
                  title: "Brands",
                  desc: "Find relevant influencers based on your campaign requirements.",
                  color: "from-purple-500 to-fuchsia-500",
                },
                {
                  icon: Heart,
                  title: "Small & Local Businesses",
                  desc: "Discover affordable local creators who can help reach nearby audiences.",
                  color: "from-indigo-500 to-blue-500",
                },
                {
                  icon: ShoppingBag,
                  title: "Buyers",
                  desc: "Discover unused PR products that may still be useful to you.",
                  color: "from-emerald-500 to-teal-500",
                },
              ].map((u) => (
                <div
                  key={u.title}
                  className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${u.color} text-white flex items-center justify-center shadow-md mb-5`}
                  >
                    <u.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{u.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {u.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ 8. WHY LOCAL INFLUENCERS ============================ */}
        <section className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                  Local Reach
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                  Discover Influencers Where Your Audience Is
                </h2>
                <p className="mt-5 text-gray-600 leading-relaxed text-base sm:text-lg">
                  Location can matter for businesses that want to reach specific
                  cities or regions. InfluenceX makes it easier to find creators
                  whose audience is nearby — an option worth exploring when your
                  campaigns are tied to a place.
                </p>
                <p className="mt-4 text-gray-600 leading-relaxed text-base sm:text-lg">
                  Local influencers are one way to reach a relevant audience.
                  They're not always the best fit for every campaign, but for
                  businesses with a location focus, they can be a strong option.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: MapPin,
                    title: "City-Based Campaigns",
                  },
                  {
                    icon: Store,
                    title: "Local Businesses",
                  },
                  {
                    icon: TrendingUp,
                    title: "Regional Promotions",
                  },
                  {
                    icon: Users,
                    title: "Community-Focused Campaigns",
                  },
                  {
                    icon: Compass,
                    title: "Location-Specific Audiences",
                  },
                  {
                    icon: Globe,
                    title: "Area-Based Reach",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 leading-snug pt-1">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 9. TRUST & DISCOVERY ============================ */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                Trust & Discovery
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Signals that help you evaluate profiles
              </h2>
              <p className="mt-4 text-gray-600 text-base sm:text-lg">
                InfluenceX presents useful profile information so you can make
                more informed discovery decisions.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                { icon: Users, label: "Followers" },
                { icon: TrendingUp, label: "Engagement Rate" },
                { icon: Layers, label: "Category" },
                { icon: MapPin, label: "Location" },
                { icon: Globe, label: "Platforms" },
                { icon: Wallet, label: "Starting Price" },
                { icon: Calendar, label: "Availability" },
                { icon: BadgeCheck, label: "Verification Status" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-white shadow-sm flex items-center justify-center text-pink-600 mb-3">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                These signals can help users evaluate profiles before deciding
                who may be relevant for their needs. Verification indicates that
                certain details have been provided — it does not by itself
                guarantee authenticity or campaign results.
              </p>
            </div>
          </div>
        </section>

        {/* ============================ 10. VISION ============================ */}
        <section className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs sm:text-sm font-medium border border-white/20 mb-6">
                  <Sparkles className="w-4 h-4" />
                  Our Vision
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Our Vision
                </h2>
                <p className="mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-white/90">
                  To create a more accessible creator ecosystem where brands can
                  discover relevant influencers, local creators can find
                  meaningful opportunities, and unused PR products can continue
                  to create value instead of going to waste.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ 11. FINAL CTA ============================ */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Ready to Explore InfluenceX?
            </h2>
            <p className="mt-4 text-gray-600 text-base sm:text-lg">
              Discover creators, explore products, and find new ways to create
              value.
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