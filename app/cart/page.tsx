"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Trash2, ArrowLeft, ShieldCheck, ShoppingBag, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/components/ProductListing";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Check Auth Session
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    checkUser();

    // 2. Load Temp Cart Cache
    const savedCart = localStorage.getItem("influencex_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Sync to localStorage whenever cart changes
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("influencex_cart", JSON.stringify(newCart));
  };

  const updateQuantity = (id: string, change: number) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const formatINR = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return <div className="min-h-screen bg-[#FDFBFD] flex items-center justify-center">Loading...</div>;
  }

  // --- NOT LOGGED IN VIEW ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-[#D91C9A]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Log in to view your cart</h2>
          <p className="text-gray-500 mb-6">Your items are saved locally, but you need to be logged in to proceed.</p>
          <Link
            href="/login"
            className="w-full block py-3 bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Log In / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // --- EMPTY CART VIEW ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link
            href="/products"
            className="w-full block py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // --- FILLED CART VIEW ---
  return (
    <div className="min-h-screen bg-[#FDFBFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#D91C9A] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to shopping
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Shopping Cart <span className="text-lg font-medium text-gray-500 ml-2">({totalItems} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 bg-[#FDF8FA] rounded-xl flex-shrink-0 flex items-center justify-center p-2">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.product.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">{item.product.category}</p>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded transition-colors shadow-sm">
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded transition-colors shadow-sm">
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatINR(item.product.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">{formatINR(item.product.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="text-gray-400 text-sm">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-[#D91C9A]">{formatINR(subtotal)}</span>
              </div>

              <button 
                onClick={() => router.push("/checkout")}
                className="w-full py-4 bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}