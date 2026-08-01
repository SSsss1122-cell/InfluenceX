'use client';

import Link from 'next/link';
import { ArrowRight, Users, ShoppingBag, UserPlus } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Decorative gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-300/30 blur-3xl animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-pink-300/25 blur-3xl animate-float-delayed" />
      <div className="absolute top-[30%] right-[5%] w-[300px] h-[300px] rounded-full bg-blue-300/20 blur-2xl animate-float" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side – content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/50 text-sm font-medium text-purple-700 mb-2">
              🚀 Join the influencer revolution
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                Buy, Sell & Discover
              </span>
              <br />
              <span className="text-gray-900">Through Trusted Influencers</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect with authentic creators, grow your brand, and turn influence into impact – all in one trusted platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                Explore Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/signup?role=influencer"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white/80 backdrop-blur-sm text-gray-800 font-semibold rounded-full border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-white transition-all duration-300"
              >
                <UserPlus className="w-5 h-5 text-purple-600" />
                Join as Influencer
              </Link>

              <Link
                href="/influencers"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-transparent text-purple-700 font-semibold rounded-full hover:bg-purple-100/50 transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5" />
                Find Influencers
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500 pt-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                2,500+ active creators
              </span>
              <span>•</span>
              <span>⭐ 4.9/5 from 1,200+ brands</span>
            </div>
          </div>

          {/* Right side – Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Main glass card */}
              <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <span className="text-white font-bold text-xl">I</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">InfluenceX</p>
                    <p className="text-sm text-gray-500">Trusted by 10k+ users</p>
                  </div>
                </div>

                {/* Illustration content – mock dashboard cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 shadow-inner">
                    <p className="text-xs font-medium text-purple-700 uppercase tracking-wider">Top Creator</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">@sarah_style</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full">Fashion</span>
                      <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full">Lifestyle</span>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-600">
                      <span>⭐ 4.9</span>
                      <span>📈 1.2M</span>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/40">
                    <p className="text-xs font-medium text-gray-500">Products</p>
                    <p className="text-lg font-bold text-gray-800">24</p>
                    <div className="flex mt-1">
                      <span className="inline-block w-6 h-6 bg-blue-200 rounded-full -mr-1 border-2 border-white"></span>
                      <span className="inline-block w-6 h-6 bg-green-200 rounded-full -mr-1 border-2 border-white"></span>
                      <span className="inline-block w-6 h-6 bg-yellow-200 rounded-full border-2 border-white"></span>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/40">
                    <p className="text-xs font-medium text-gray-500">Engagement</p>
                    <p className="text-lg font-bold text-gray-800">8.4%</p>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl animate-pulse" />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-6 -left-6 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50 text-sm font-semibold text-purple-700 animate-float hidden sm:flex items-center gap-2">
                <span className="text-yellow-400">✦</span> #1 Platform
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50 text-sm font-semibold text-pink-600 animate-float-delayed hidden sm:flex items-center gap-2">
                🏆 Trusted by Brands
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;