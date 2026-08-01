'use client';

import Link from 'next/link';
import {
  Building2,
  Users,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const WhatIsInfluenceX = () => {
  const cards = [
    {
      icon: Building2,
      title: 'For Brands',
      description:
        'Discover and collaborate with trusted influencers to promote your products. Run campaigns, track performance, and scale your brand presence.',
      color: 'from-blue-500 to-cyan-400',
      bgHover: 'group-hover:border-blue-300 group-hover:shadow-blue-200/50',
    },
    {
      icon: Users,
      title: 'For Influencers',
      description:
        'Monetize your influence by partnering with top brands. Access exclusive deals, manage your portfolio, and grow your audience authentically.',
      color: 'from-purple-500 to-pink-400',
      bgHover: 'group-hover:border-purple-300 group-hover:shadow-purple-200/50',
    },
    {
      icon: ShoppingBag,
      title: 'For Buyers',
      description:
        'Shop products recommended by influencers you trust. Discover new items, read authentic reviews, and make confident purchases.',
      color: 'from-amber-500 to-orange-400',
      bgHover: 'group-hover:border-amber-300 group-hover:shadow-amber-200/50',
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/80 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-purple-200/20 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-pink-200/20 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/70 backdrop-blur-sm border border-purple-200/50 text-sm font-medium text-purple-700 mb-4">
            <Sparkles className="w-4 h-4" />
            The Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            What is{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              InfluenceX
            </span>
            ?
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 leading-relaxed">
            A unified platform where brands, influencers, and buyers come
            together to create authentic connections and drive meaningful
            commerce.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`
                  group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 
                  border border-gray-200/60 shadow-lg shadow-gray-200/30
                  transition-all duration-300 hover:-translate-y-2 
                  hover:shadow-2xl hover:border-opacity-100
                  ${card.bgHover}
                  flex flex-col items-start
                `}
              >
                {/* Icon with gradient background */}
                <div
                  className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center 
                    bg-gradient-to-br ${card.color} 
                    shadow-lg shadow-opacity-30 
                    transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                    mb-5
                  `}
                >
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed flex-1">
                  {card.description}
                </p>

                {/* Decorative bottom glow */}
                <div
                  className={`
                    absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl 
                    bg-gradient-to-r ${card.color} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  `}
                />

                {/* Subtle arrow on hover */}
                <div className="mt-6 flex items-center text-sm font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
          >
            Discover the full story
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatIsInfluenceX;