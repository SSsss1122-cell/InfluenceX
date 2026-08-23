'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import Image from "next/image";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect for sticky navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on link click
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Explore Products', href: '/products' },
        { name: 'Find Influencers',  href: '/influencers' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav
            className={`
          sticky top-0 z-50 w-full transition-all duration-300 ease-in-out
          ${
              isScrolled
                  ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20'
                  : 'bg-transparent'
          }
        `}
        >
            <div className="w-full px-6 lg:px-12">
               <div className="flex items-center justify-between h-24">
                    {/* Logo */}
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
                   className="rounded object cover"
                  />

                  <span
                  className={`
                  text-xl font-extrabold tracking-tight transition-colors duration-300
                  ${
                  isScrolled
                  ? "bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent"
                  : "text-white"
                  }
                 `}
                  >
    
                  </span>
                  </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`
                          relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                          group
                          ${
                              isScrolled
                                  ? 'text-gray-700 hover:text-purple-700'
                                  : 'text-white/90 hover:text-white'
                          }
                        `}
                            >
                                <span className="relative z-10">{link.name}</span>
                                <span
                                    className={`
                              absolute inset-0 rounded-lg transition-all duration-300 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100
                              ${isScrolled ? 'bg-purple-50' : 'bg-white/10'}
                            `}
                                ></span>
                                <span
                                    className={`
                              absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-1/2
                              ${isScrolled ? 'bg-purple-600' : 'bg-white'}
                            `}
                                ></span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className={`
                            px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300
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
                            className={`
                            px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300
                            bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30
                            hover:shadow-purple-500/50 hover:scale-105 active:scale-95
                            relative overflow-hidden group
                          `}
                        >
                            <span className="relative z-10">Sign Up</span>
                            <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`
                        md:hidden p-2 rounded-lg transition-all duration-300
                        ${
                            isScrolled
                                ? 'text-gray-700 hover:bg-purple-50'
                                : 'text-white hover:bg-white/10'
                        }
                      `}
                        aria-label="Toggle menu"
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
                md:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-400 ease-in-out
                ${
                    isOpen
                        ? 'max-h-[500px] opacity-100 visible'
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
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={handleLinkClick}
                            className={`
                            flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                            ${
                                isScrolled
                                    ? 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                            }
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

                    <div
                        className={`
                        flex flex-col gap-2 pt-4 mt-2 border-t
                        ${
                            isScrolled
                                ? 'border-gray-200'
                                : 'border-white/10'
                        }
                        transform transition-all duration-300
                        ${
                            isOpen
                                ? 'translate-x-0 opacity-100'
                                : '-translate-x-4 opacity-0'
                        }
                        transition-delay: ${navLinks.length * 50 + 100}ms
                      `}
                    >
                        <Link
                            href="/login"
                            onClick={handleLinkClick}
                            className={`
                            w-full px-4 py-3 text-center text-sm font-semibold rounded-lg transition-all duration-300
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
                            className="w-full px-4 py-3 text-center text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;