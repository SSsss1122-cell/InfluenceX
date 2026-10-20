"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Heart,
  ShoppingCart,
  Zap,
  Search,
  Sparkles,
  ShoppingBag,
  ChevronDown,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
export type Product = {
  id: string;
  name: string;
  description: string | null;
  image: string;
  price: number;
  category: string;
  created_at: string;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

// --- Helpers ---
const formatINR = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function ProductListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the highlight ID from the URL (e.g., ?highlight=123)
  const highlightId = searchParams.get("highlight");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  // --- Load Temp Cart from LocalStorage ---
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("influencex_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  // --- Sync Cart to LocalStorage ---
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("influencex_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  // --- Data Fetching ---
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, category, description, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setProducts([]);
        return;
      }

      const mapped = data.map((item) => ({
        id: item.id,
        name: item.name || "Unnamed Product",
        description: item.description || null,
        image: item.image_url || "",
        price: Number(item.price) || 0,
        category: item.category || "Uncategorized",
        created_at: item.created_at,
      }));

      setProducts(mapped);
    } catch (err: unknown) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Highlight Scroll Effect ---
  useEffect(() => {
    if (highlightId && !loading && products.length > 0) {
      // Wait slightly for DOM to render the product grid
      const timer = setTimeout(() => {
        const element = document.getElementById(`product-${highlightId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightId, loading, products]);

  // --- Derived Data ---
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    switch (sortOption) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortOption]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Actions ---
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, quantity: 1, product }];
    });
    showToast(`${product.name} added to cart`);
  };

  const buyNow = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, quantity: 1, product }];
    });
    router.push("/cart");
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        showToast("Added to wishlist");
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortOption("newest");
  };

  // --- Render States ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-48 w-full bg-pink-50 rounded-3xl animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col h-[400px]">
                <div className="w-full aspect-square bg-gray-100 rounded-xl animate-pulse mb-4" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-4" />
                <div className="mt-auto h-10 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBFD]">
        <div className="text-center max-w-md p-8 bg-white rounded-3xl shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Oops, something went wrong</h3>
          <p className="text-gray-500 mt-2 mb-6">{error}</p>
          <button onClick={fetchProducts} className="px-6 py-2.5 bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFD] pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-[#D91C9A]" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pink-50/80 to-transparent pt-16 pb-12 px-4">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -z-10" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-100 shadow-sm text-sm font-semibold text-[#D91C9A]">
            <Sparkles className="w-4 h-4" />
            THE INFLUENCEX MARKETPLACE
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A]">Products You'll Love</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore curated products, discover creator favorites, and find something worth sharing.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8 sticky top-28 z-40">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D91C9A]/20 focus:border-[#D91C9A] transition-all"
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D91C9A]/20 focus:border-[#D91C9A] cursor-pointer">
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative flex-1 sm:flex-none">
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D91C9A]/20 focus:border-[#D91C9A] cursor-pointer">
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {(searchQuery || selectedCategory !== "All" || sortOption !== "newest") && (
                <button onClick={clearFilters} className="text-sm text-[#D91C9A] font-medium hover:underline px-2">
                  Clear
                </button>
              )}

              <button
                onClick={() => router.push("/cart")}
                className="relative p-2.5 bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white rounded-xl hover:shadow-lg hover:shadow-pink-200 transition-all ml-auto lg:ml-0"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-[#D91C9A] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#D91C9A]">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-sm font-bold text-[#D91C9A] tracking-wider uppercase mb-1 block">Curated for you</span>
            <h2 className="text-3xl font-bold text-gray-900">Explore the Marketplace</h2>
            <p className="text-gray-500 mt-1">Find products that match your style.</p>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm w-fit">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'Product' : 'Products'}
          </div>
        </div>

        {/* Empty States */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">The marketplace is getting ready!</h3>
            <p className="text-gray-500 mb-6">There are no products available just yet. Please check back soon.</p>
            <button onClick={fetchProducts} className="px-6 py-2.5 bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
              Refresh Page
            </button>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products match your search</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          /* Product Grid */
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => {
              const isWishlisted = wishlist.has(product.id);
              const inCart = cart.some((item) => item.id === product.id);
              
              // Check if this is the product we clicked from the Featured section
              const isHighlighted = highlightId === product.id;

              return (
                <motion.div 
                  key={product.id} 
                  id={`product-${product.id}`} // ID added for scroll targeting
                  variants={itemVariants} 
                  className={`group bg-white rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden
                    ${isHighlighted 
                      ? "border-purple-500 ring-4 ring-purple-500/20 shadow-2xl shadow-purple-200 scale-[1.02]" 
                      : "border-gray-100 shadow-sm hover:shadow-xl"
                    }
                  `}
                >
                  <div className="relative w-full aspect-square bg-[#FDF8FA] p-4 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23FDF8FA'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%23D91C9A' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-pink-200" />
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.category && (
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-600 uppercase tracking-wider rounded-md shadow-sm">
                          {product.category}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform active:scale-95 z-10"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-[#D91C9A] text-[#D91C9A]" : "text-gray-400"}`} />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#D91C9A] transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-auto pt-2">
                      <div className="text-xl font-extrabold text-gray-900 mb-4">
                        {formatINR(product.price)}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white hover:shadow-lg hover:shadow-pink-200/50 active:scale-[0.98]"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {inCart ? "Add More" : "Add to Cart"}
                        </button>
                        
                        <button
                          onClick={() => buyNow(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all bg-white text-gray-900 border border-gray-200 hover:border-[#D91C9A] hover:text-[#D91C9A] active:scale-[0.98]"
                        >
                          <Zap className="w-4 h-4" />
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}