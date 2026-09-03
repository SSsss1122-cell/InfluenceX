"use client";

import { useState, useEffect, useMemo } from "react";
import { Heart, ShoppingCart, Zap, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  created_at: string;
};

type CartItem = {
  id: string;
  quantity: number;
};

export default function ProductListing() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, category, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setProducts([]);
        return;
      }

      const mapped = data.map((item) => ({
        id: item.id,
        name: item.name || "Unnamed",
        image: item.image_url || "https://via.placeholder.com/400?text=No+Image",
        price: Number(item.price) || 0,
        category: item.category || "Uncategorized",
        created_at: item.created_at,
      }));

      setProducts(mapped);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Filter products by search query ---
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const lowerQuery = searchQuery.toLowerCase().trim();
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

  // --- Cart functions ---
  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { id: productId, quantity: 1 }];
      }
    });
    showToast("Added to cart");
  };

  const buyNow = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { id: productId, quantity: 1 }];
      }
    });
    router.push("/checkout");
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Wishlist toggle ---
  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // --- Loading, Error, Empty states ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Failed to load products</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No products yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add some products to your Supabase table.</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // --- Main render ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search and Cart */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products ({filteredProducts.length})
          </h1>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => router.push("/cart")}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Toast notification */}
        {toast && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity">
            {toast}
          </div>
        )}

        {/* No search results */}
        {filteredProducts.length === 0 && searchQuery.trim() !== "" && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search term.
            </p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.has(product.id);
            const cartItem = cart.find((item) => item.id === product.id);
            const inCart = !!cartItem;

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
              >
                {/* Image & Wishlist */}
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400?text=No+Image";
                    }}
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    />
                  </button>
                </div>

                {/* Product details – this wrapper expands to fill remaining space */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {product.category}
                  </p>

                  {/* Buttons – pushed to bottom by mt-auto */}
                  <div className="mt-auto pt-4 flex gap-2">
                    <button
                      onClick={() => addToCart(product.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {inCart ? "Add More" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => buyNow(product.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition"
                    >
                      <Zap className="w-4 h-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}