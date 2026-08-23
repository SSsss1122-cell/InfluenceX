'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Users, Zap } from 'lucide-react';
import HeroSlider from './HeroSlider';

const Heroo = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Soft glowing blobs */}
      <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] rounded-full bg-purple-200/20 blur-3xl" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[800px] h-[800px] rounded-full bg-pink-200/20 blur-3xl" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-100/20 blur-3xl" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-300 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-pink-300 rounded-full animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-indigo-300 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-purple-200 rounded-full animate-float-delayed" />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-pink-300 rounded-full animate-float" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 text-sm font-medium text-purple-700 mb-2">
              🚀 AI-Powered Influencer Marketing
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Discover the{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                Perfect Influencers
              </span>{' '}
              with AI
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              InfluenceX helps brands discover, analyze, and collaborate with the
              right creators using AI-powered search, analytics, and campaign
              management.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/influencers"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
              >
                Explore Influencers
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signup?role=creator"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-800 font-semibold rounded-full border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Become a Creator
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                10K+ Verified Creators
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                2M+ Campaign Reach
              </span>
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                AI Powered Matching
              </span>
            </div>
          </motion.div>

          {/* Right Side – Slider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Soft radial gradient behind cards */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl" />
            <div className="relative">
              <HeroSlider />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Heroo;