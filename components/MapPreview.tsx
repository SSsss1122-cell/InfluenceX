'use client';

import Link from 'next/link';
import { MapPin, Navigation, Users, Compass } from 'lucide-react';

const MapPreview = () => {
  // Simulated location pins data
  const pins = [
    { id: 1, top: '25%', left: '15%', label: 'NYC', active: true },
    { id: 2, top: '45%', left: '30%', label: 'LA' },
    { id: 3, top: '60%', left: '55%', label: 'London' },
    { id: 4, top: '35%', left: '70%', label: 'Dubai' },
    { id: 5, top: '70%', left: '80%', label: 'Tokyo' },
    { id: 6, top: '20%', left: '50%', label: 'Paris' },
    { id: 7, top: '75%', left: '20%', label: 'Miami' },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900">
      {/* Background glow */}
      <div className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-pink-600/20 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium text-purple-300">
              <Compass className="w-4 h-4" />
              Live Location
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.2]">
              Discover Influencers{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Near You
              </span>
            </h2>

            <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Connect with top creators in your area. Find local influencers who
              understand your community and can amplify your brand authentically.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="/map"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
              >
                <Navigation className="w-5 h-5" />
                Explore Map
              </Link>
              <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-colors duration-300">
                <Users className="w-5 h-5" />
                View All
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-400 pt-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                1,200+ active near you
              </span>
              <span>•</span>
              <span>🌍 50+ cities</span>
            </div>
          </div>

          {/* Right – Map Preview */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Map container with glassmorphism */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-purple-500/10 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm">
                {/* Map grid lines (futuristic) */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
                </div>

                {/* Abstract map shape */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/4 h-3/4">
                    {/* Continent-like blob */}
                    <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                      <path
                        d="M40,80 Q70,30 120,40 Q160,50 170,90 Q180,130 140,160 Q100,190 60,160 Q20,130 40,80 Z"
                        fill="none"
                        stroke="rgba(168,85,247,0.6)"
                        strokeWidth="2"
                      />
                      <path
                        d="M70,100 Q90,70 130,80 Q150,100 140,130 Q120,150 90,140 Q70,130 70,100 Z"
                        fill="rgba(168,85,247,0.2)"
                        stroke="rgba(168,85,247,0.4)"
                        strokeWidth="1.5"
                      />
                    </svg>

                    {/* Pins */}
                    {pins.map((pin) => (
                      <div
                        key={pin.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125"
                        style={{ top: pin.top, left: pin.left }}
                      >
                        <div
                          className={`
                            relative flex items-center justify-center
                            ${pin.active
                              ? 'w-8 h-8'
                              : 'w-5 h-5'
                            }
                          `}
                        >
                          {pin.active && (
                            <span className="absolute inset-0 animate-ping rounded-full bg-purple-400/50" />
                          )}
                          <MapPin
                            className={`
                              w-full h-full 
                              ${pin.active
                                ? 'text-purple-400 drop-shadow-glow'
                                : 'text-gray-400/60'
                              }
                            `}
                            fill={pin.active ? 'rgba(168,85,247,0.3)' : 'none'}
                          />
                          {pin.active && (
                            <span className="absolute -bottom-6 text-[10px] font-medium text-white/80 whitespace-nowrap bg-black/30 px-1.5 py-0.5 rounded">
                              {pin.label}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Connection lines (pulsing) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-purple-500/20 rounded-full animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-purple-500/10 rounded-full animate-pulse [animation-delay:1s]" />
                  </div>
                </div>

                {/* Futuristic corner accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-purple-400/30" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-purple-400/30" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-purple-400/30" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-purple-400/30" />

                {/* Glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 via-transparent to-transparent pointer-events-none" />

                {/* Floating label */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs text-white/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Live: 237 influencers active
                </div>
              </div>

              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-3xl border border-purple-500/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;