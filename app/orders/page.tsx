"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Package, Clock, MapPin, Phone, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch orders for the logged-in user
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", session.user.id) // Extra safety
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          // Group the flat rows by order_group_id
          const groupedOrders = data.reduce((acc: any, row: any) => {
            // Fallback to row.id if group_id is missing (for older orders)
            const groupId = row.order_group_id || row.id;
            
            if (!acc[groupId]) {
              acc[groupId] = {
                id: groupId,
                created_at: row.created_at,
                status: row.status,
                total_amount: 0,
                shipping_address: row.shipping_address,
                phone: row.phone,
                payment_method: row.payment_method,
                items: [] // Initialize the items array here
              };
            }
            
            // Push the product details into the items array
            acc[groupId].items.push({
              id: row.id,
              product_name: row.product_name,
              quantity: row.quantity,
              price: row.price,
              total_amount: row.total_amount
            });
            
            // Add to the grand total for this order group
            acc[groupId].total_amount += Number(row.total_amount);
            
            return acc;
          }, {});

          setOrders(Object.values(groupedOrders));
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  const formatINR = (price: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#D91C9A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFD] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-[#D91C9A]" /> My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
            <Link href="/products" className="px-6 py-3 bg-gradient-to-r from-[#8B2BE2] to-[#D91C9A] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-bold text-gray-900 text-sm">#{order.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-[#D91C9A]">{formatINR(order.total_amount)}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold capitalize">
                    <Clock className="w-4 h-4" /> {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {/* Added optional chaining (?) to prevent undefined map error */}
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatINR(item.price)}</p>
                        </div>
                        <p className="font-bold text-gray-900">{formatINR(item.total_amount)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Details */}
                  <div className="bg-gray-50 p-4 rounded-xl flex flex-col md:flex-row gap-4 text-sm mt-4">
                    <div className="flex-1 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-700">Shipping Address</p>
                        <p className="text-gray-600">{order.shipping_address}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <p className="text-gray-700 font-medium">{order.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <p className="text-gray-700 font-medium uppercase">{order.payment_method}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}