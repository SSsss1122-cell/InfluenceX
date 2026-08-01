'use client';

import { useEffect, useState, useRef } from 'react';
import { Users, ShoppingBag, User, Building2 } from 'lucide-react';

interface StatItem {
  label: string;
  target: number;
  suffix?: string;
  icon: React.ElementType;
  color: string;
}

const stats: StatItem[] = [
  {
    label: 'Influencers',
    target: 12500,
    suffix: '+',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Products',
    target: 5200,
    suffix: '+',
    icon: ShoppingBag,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    label: 'Buyers',
    target: 8700,
    suffix: '+',
    icon: User,
    color: 'from-emerald-500 to-teal-400',
  },
  {
    label: 'Brands',
    target: 3100,
    suffix: '+',
    icon: Building2,
    color: 'from-amber-500 to-orange-400',
  },
];

// Counter component with animation
const Counter = ({
  target,
  suffix = '',
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const startTime = Date.now();
            const endTime = startTime + duration;

            const updateCounter = () => {
              const now = Date.now();
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              const current = Math.round(eased * target);
              setCount(current);

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                setCount(target);
              }
            };

            requestAnimationFrame(updateCounter);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [target, duration, hasAnimated]);

  return (
    <span ref={counterRef} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-200/30 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-pink-200/30 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Trusted by Thousands
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            InfluenceX is growing fast – join the community today.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-purple-200/30 transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 hover:border-purple-200/70 flex flex-col items-center text-center"
              >
                {/* Icon with gradient */}
                <div
                  className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center 
                    bg-gradient-to-br ${stat.color} 
                    shadow-lg shadow-opacity-30 
                    transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                    mb-4
                  `}
                >
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>

                {/* Number */}
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
                  <Counter target={stat.target} suffix={stat.suffix || ''} duration={2500} />
                </div>

                {/* Label */}
                <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>

                {/* Decorative bottom glow */}
                <div
                  className={`
                    absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl 
                    bg-gradient-to-r ${stat.color} 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  `}
                />
              </div>
            );
          })}
        </div>

        {/* Extra callout */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            ⭐ Join 10,000+ happy users today
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;