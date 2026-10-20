"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Truck, CreditCard, ChevronLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/components/ProductListing";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI">("UPI");
  
  // Store Settings (UPI ID)
  const [storeUpi, setStoreUpi] = useState("");

  useEffect(() => {
    async function init() {
      // 1. Check User
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/checkout");
        return;
      }
      setUser(session.user);

      // 2. Load Cart
      const savedCart = localStorage.getItem("influencex_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (parsed.length === 0) router.push("/cart");
        setCart(parsed);
      } else {
        router.push("/cart");
      }

      // 3. Fetch Store UPI ID
      const { data: settings } = await supabase.from("store_settings").select("upi_id").single();
      if (settings) setStoreUpi(settings.upi_id);

      setLoading(false);
    }
    init();
  }, [router]);

  const formatINR = (price: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      alert("Please fill in your shipping address and phone number.");
      return;
    }
    if (phone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Generate a unique Group ID for this checkout session
      const orderGroupId = crypto.randomUUID();

      // 2. Map cart items into individual rows for the database (NOT an 'items' array)
      const orderRows = cart.map((item) => ({
        user_id: user.id,
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total_amount: item.product.price * item.quantity,
        shipping_address: address,
        phone: phone,
        payment_method: paymentMethod,
        order_group_id: orderGroupId,
        status: "pending",
      }));

      // 3. Insert the array of rows
      const { error } = await supabase.from("orders").insert(orderRows);

      if (error) throw error;

      // 4. Clear cart on success
      localStorage.removeItem("influencex_cart");
      
      // Redirect to orders page
      router.push("/orders?success=true");
    } catch (err: any) {
      console.error(err);
      alert("Failed to place order: " + err.message);
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#FDFBFD] flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/cart" className="flex items-center gap-2 text-gray-500 hover:text-[#D91C9A] transition-colors mb-6 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: Shipping & Payment */}
          <div className="space-y-6">
            
            {/* Shipping Details */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#D91C9A]" /> Shipping Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no, Street, Area, City, Pincode"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D91C9A]/20 focus:border-[#D91C9A] outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D91C9A]/20 focus:border-[#D91C9A] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#D91C9A]" /> Payment Method
              </h2>
              
              <div className="space-y-3">
                {/* UPI Option */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "UPI" ? "border-[#D91C9A] bg-pink-50/50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="payment" value="UPI" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} className="mt-1 w-4 h-4 text-[#D91C9A] focus:ring-[#D91C9A]" />
                  <div>
                    <span className="block font-bold text-gray-900">UPI Payment</span>
                    <span className="block text-sm text-gray-500 mt-1">Google Pay, PhonePe, Paytm</span>
                    {paymentMethod === "UPI" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 p-3 bg-white rounded-lg border border-pink-100 text-sm">
                        <p className="text-gray-600 mb-2">Pay to UPI ID:</p>
                        <div className="flex items-center justify-between font-mono font-bold text-lg text-gray-900 bg-gray-50 p-2 rounded">
                          {storeUpi || "Loading..."}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">* Please complete the payment and place the order. We will verify it manually.</p>
                      </motion.div>
                    )}
                  </div>
                </label>

                {/* COD Option */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "COD" ? "border-[#D91C9A] bg-pink-50/50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="mt-1 w-4 h-4 text-[#D91C9A] focus:ring-[#D91C9A]" />
                  <div>
                    <span className="block font-bold text-gray-900">Cash on Delivery</span>
                    <span className="block text-sm text-gray-500 mt-1">Pay when you receive the order.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 p-2">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">{formatINR(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-[#D91C9A]">{formatINR(subtotal)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? "Processing..." : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}