
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Check the current Supabase session and listen for auth changes.
  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoadingUser(false);
      }
    });

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error('Unable to check session:', error.message);
      }

      setUser(data.session?.user ?? null);
      setLoadingUser(false);
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Logout from Supabase.
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
      alert('Unable to log out. Please try again.');
      setLoggingOut(false);
      return;
    }

    setUser(null);
    setIsOpen(false);
    setLoggingOut(false);

    router.push('/');
    router.refresh();
  };

  // Back button visibility.
  useEffect(() => {
    setCanGoBack(pathname !== '/' && window.history.length > 1);
  }, [pathname]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Navbar scroll effect.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Public navigation links.
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Products', href: '/products' },
    { name: 'Find Influencers', href: '/influencers' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  // User display information.
  const meta = user?.user_metadata ?? {};

  const displayName =
    meta.full_name || user?.email?.split('@')[0] || 'Guest';

  const rawRole = String(meta.role ?? '').toLowerCase().trim();

  const roleBadge =
    rawRole === 'influencer'
      ? {
          emoji: '⭐',
          label: 'Influencer',
          classes:
            'bg-purple-500/15 text-purple-600 border-purple-500/30',
        }
      : rawRole === 'brand'
        ? {
            emoji: '🏢',
            label: 'Brand',
            classes:
              'bg-blue-500/15 text-blue-600 border-blue-500/30',
          }
        : {
            emoji: '👤',
            label: 'User',
            classes:
              'bg-slate-500/15 text-slate-600 border-slate-500/30',
          };

  // Shared styling for desktop navigation links.
  const desktopLinkClass = `
    relative px-4 py-2 text-sm font-medium rounded-lg
    transition-all duration-300 group
    ${
      isScrolled
        ? 'text-gray-700 hover:text-purple-700'
        : 'text-white/90 hover:text-white'
    }
  `;

  // Shared styling for mobile navigation links.
  const mobileLinkClass = `
    flex items-center justify-between px-4 py-3 rounded-lg
    text-sm font-medium transition-all duration-300
    ${
      isScrolled
        ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
        : 'text-white/90 hover:text-white hover:bg-white/10'
    }
  `;

  return (
    <nav
      className={`
        sticky top-0 z-50 w-full
        transition-all duration-300 ease-in-out
        ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20'
            : 'bg-transparent'
        }
      `}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Back Button */}
          <div className="flex items-center gap-2">
            {canGoBack && (
              <button
                onClick={handleBack}
                aria-label="Go back"
                className={`
                  flex items-center justify-center w-10 h-10
                  rounded-full border transition-all duration-300
                  hover:scale-105 active:scale-95
                  ${
                    isScrolled
                      ? 'bg-white border-gray-200 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      : 'bg-white/15 backdrop-blur-md border-white/20 text-white hover:bg-white/25'
                  }
                `}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={handleLinkClick}
            >
              <Image
                src="/images/logo.jpeg"
                alt="InfluenceX Logo"
                width={90}
                height={90}
                className="rounded object-cover"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={desktopLinkClass}
              >
                <span className="relative z-10">
                  {link.name}
                </span>

                <span
                  className={`
                    absolute inset-0 rounded-lg
                    transition-all duration-300 scale-95
                    opacity-0 group-hover:scale-100
                    group-hover:opacity-100
                    ${isScrolled ? 'bg-purple-50' : 'bg-white/10'}
                  `}
                />

                <span
                  className={`
                    absolute bottom-0 left-1/2
                    -translate-x-1/2 w-0 h-0.5 rounded-full
                    transition-all duration-300
                    group-hover:w-1/2
                    ${isScrolled ? 'bg-purple-600' : 'bg-white'}
                  `}
                />
              </Link>
            ))}

            {/* My Orders: visible only when logged in */}
            {!loadingUser && user && (
              <Link
                href="/orders"
                onClick={handleLinkClick}
                className={desktopLinkClass}
              >
                <span className="relative z-10">My Orders</span>

                <span
                  className={`
                    absolute inset-0 rounded-lg
                    transition-all duration-300 scale-95
                    opacity-0 group-hover:scale-100
                    group-hover:opacity-100
                    ${isScrolled ? 'bg-purple-50' : 'bg-white/10'}
                  `}
                />

                <span
                  className={`
                    absolute bottom-0 left-1/2
                    -translate-x-1/2 w-0 h-0.5 rounded-full
                    transition-all duration-300
                    group-hover:w-1/2
                    ${isScrolled ? 'bg-purple-600' : 'bg-white'}
                  `}
                />
              </Link>
            )}
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-3">
            {loadingUser ? (
              <div
                className={`text-sm ${
                  isScrolled ? 'text-gray-400' : 'text-white/50'
                }`}
              >
                Loading…
              </div>
            ) : user ? (
              <>
                <div
                  className={`
                    flex items-center gap-3 pl-2 pr-4 py-1.5
                    rounded-full border shadow-sm
                    transition-all duration-300
                    ${
                      isScrolled
                        ? 'bg-white/80 border-gray-200'
                        : 'bg-white/15 backdrop-blur-md border-white/20'
                    }
                  `}
                >
                  <div
                    className="
                      w-9 h-9 rounded-full
                      bg-gradient-to-br from-purple-600 to-pink-600
                      flex items-center justify-center
                      text-white font-bold
                    "
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col leading-tight">
                    <span
                      className={`text-sm font-semibold ${
                        isScrolled ? 'text-gray-900' : 'text-white'
                      }`}
                    >
                      {displayName}
                    </span>

                    <span
                      className={`
                        inline-flex items-center gap-1 mt-0.5
                        text-[11px] font-semibold px-2 py-0.5
                        rounded-full border ${roleBadge.classes}
                      `}
                    >
                      <span>{roleBadge.emoji}</span>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className={`
                    flex items-center gap-2 text-sm font-medium
                    px-3 py-2 rounded-xl transition-all duration-300
                    disabled:opacity-60
                    ${
                      isScrolled
                        ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <LogOut className="w-4 h-4" />
                  {loggingOut ? 'Logging out…' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className={`
                    px-5 py-2 text-sm font-semibold rounded-full
                    transition-all duration-300
                    ${
                      isScrolled
                        ? 'text-purple-700 hover:text-purple-800 hover:bg-purple-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
                  onClick={handleLinkClick}
                  className="
                    px-5 py-2 text-sm font-semibold rounded-full
                    bg-gradient-to-r from-purple-600 to-pink-600
                    text-white shadow-lg shadow-purple-500/30
                    hover:shadow-purple-500/50 hover:scale-105
                    active:scale-95 relative overflow-hidden group
                  "
                >
                  <span className="relative z-10">Sign Up</span>
                  <span
                    className="
                      absolute inset-0
                      bg-gradient-to-r from-purple-700 to-pink-700
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                    "
                  />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen((previous) => !previous)}
            className={`
              md:hidden p-2 rounded-lg transition-all duration-300
              ${
                isScrolled
                  ? 'text-gray-700 hover:bg-purple-50'
                  : 'text-white hover:bg-white/10'
              }
            `}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`
          md:hidden absolute top-full left-0 w-full overflow-hidden
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? 'max-h-[800px] opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          }
        `}
      >
        <div
          className={`
            w-full px-4 py-4 space-y-1
            ${
              isScrolled
                ? 'bg-white/90 backdrop-blur-xl border-b border-white/20'
                : 'bg-black/40 backdrop-blur-xl border-b border-white/10'
            }
          `}
        >
          {/* Mobile Back Button */}
          {canGoBack && (
            <button
              onClick={() => {
                setIsOpen(false);
                handleBack();
              }}
              className={`
                flex items-center gap-3 w-full px-4 py-3
                rounded-lg text-sm font-medium transition-all duration-300
                ${
                  isScrolled
                    ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {/* Public Links */}
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={handleLinkClick}
              className={`
                ${mobileLinkClass}
                transform transition-all duration-300
                ${
                  isOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-4 opacity-0'
                }
              `}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              <span>{link.name}</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Link>
          ))}

          {/* My Orders: visible only when logged in */}
          {!loadingUser && user && (
            <Link
              href="/orders"
              onClick={handleLinkClick}
              className={`
                ${mobileLinkClass}
                transform transition-all duration-300
                ${
                  isOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-4 opacity-0'
                }
              `}
            >
              <span>My Orders</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Link>
          )}

          {/* Mobile User Section */}
          <div
            className={`
              flex flex-col gap-2 pt-4 mt-2 border-t
              ${isScrolled ? 'border-gray-200' : 'border-white/10'}
              transform transition-all duration-300
              ${
                isOpen
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-4 opacity-0'
              }
            `}
          >
            {!loadingUser && user ? (
              <>
                <div
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-2xl border
                    ${
                      isScrolled
                        ? 'bg-purple-50 border-purple-100'
                        : 'bg-white/10 border-white/15'
                    }
                  `}
                >
                  <div
                    className="
                      w-10 h-10 rounded-full
                      bg-gradient-to-br from-purple-600 to-pink-600
                      flex items-center justify-center
                      text-white font-bold
                    "
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col leading-tight">
                    <span
                      className={`text-sm font-semibold ${
                        isScrolled ? 'text-gray-900' : 'text-white'
                      }`}
                    >
                      {displayName}
                    </span>

                    <span
                      className={`
                        inline-flex items-center gap-1 mt-0.5
                        text-[11px] font-semibold px-2 py-0.5
                        rounded-full border w-fit ${roleBadge.classes}
                      `}
                    >
                      <span>{roleBadge.emoji}</span>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className={`
                    w-full flex items-center justify-center gap-2
                    px-4 py-3 text-sm font-semibold rounded-lg
                    transition-all duration-300 disabled:opacity-60
                    ${
                      isScrolled
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-red-300 hover:bg-white/10'
                    }
                  `}
                >
                  <LogOut className="w-4 h-4" />
                  {loggingOut ? 'Logging out…' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className={`
                    w-full px-4 py-3 text-center text-sm
                    font-semibold rounded-lg transition-all duration-300
                    ${
                      isScrolled
                        ? 'text-purple-700 hover:bg-purple-50'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
                  onClick={handleLinkClick}
                  className="
                    w-full px-4 py-3 text-center text-sm font-semibold
                    rounded-lg bg-gradient-to-r from-purple-600 to-pink-600
                    text-white shadow-lg shadow-purple-500/30
                    hover:shadow-purple-500/50 transition-all duration-300
                  "
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
