"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Clock,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

// ─── Sample Data ──────────────────────────────────────────
const STATS = [
  { label: "Total Products", value: "24", icon: Package, change: "+3", changeType: "up" },
  { label: "Products Sold", value: "87", icon: ShoppingBag, change: "+12", changeType: "up" },
  { label: "Revenue", value: "$8,429", icon: DollarSign, change: "+18.5%", changeType: "up" },
  { label: "Orders", value: "56", icon: Users, change: "+5", changeType: "up" },
];

const RECENT_ACTIVITY = [
  { id: 1, action: "New order #INV-1024 for Headphones", time: "2 hours ago", type: "order" },
  { id: 2, action: "Product 'Wireless Earbuds' listed", time: "5 hours ago", type: "product" },
  { id: 3, action: "Review received: 5 stars on Smart Watch", time: "1 day ago", type: "review" },
  { id: 4, action: "Payment of $142.50 processed", time: "2 days ago", type: "payment" },
];

const RECENT_PRODUCTS = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", price: 199.99, sold: 28, status: "Active" },
  { id: 2, name: "Smart Fitness Tracker Watch", price: 89.99, sold: 15, status: "Active" },
  { id: 3, name: "Portable Bluetooth Speaker", price: 49.99, sold: 12, status: "Inactive" },
  { id: 4, name: "Premium Yoga Mat (Non-Slip)", price: 59.99, sold: 9, status: "Active" },
];

// ─── Helper: get status color ──────────────────────────────
const statusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-emerald-500/20 text-emerald-400";
    case "Inactive": return "bg-gray-500/20 text-gray-400";
    default: return "bg-gray-500/20 text-gray-400";
  }
};

// ─── Main Component ──────────────────────────────────────
export default function InfluencerDashboard() {
  // ─── Theme ──────────────────────────────────────────
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("influencex-theme") as "dark" | "light" | null;
    if (stored) setTheme(stored);
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("influencex-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // ─── Sidebar state ──────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ─── Theme icon ────────────────────────────────────
  const ThemeIcon = () =>
    theme === "dark" ? (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 dark:from-[#0b0d15] dark:via-[#1a1d2e] dark:to-[#0b0d15] transition-colors duration-300 flex">
      {/* ─── Background Orbs ────────────────────────── */}
      <div className="fixed w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-500/15 rounded-full blur-[140px] -top-40 -right-40 pointer-events-none" />
      <div className="fixed w-[400px] h-[400px] bg-purple-300/20 dark:bg-purple-500/15 rounded-full blur-[140px] -bottom-40 -left-40 pointer-events-none" />

      {/* ─── Mobile overlay ──────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ──────────────────────────────────── */}
      <aside
        className={`
          fixed lg:sticky top-0 z-50 h-screen w-64 bg-white/70 dark:bg-white/6 backdrop-blur-2xl border-r border-white/30 dark:border-white/8 shadow-xl transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={Package} label="My Products" />
            <NavItem icon={ShoppingBag} label="Orders" />
            <NavItem icon={BarChart3} label="Analytics" />
            <NavItem icon={Users} label="Community" />
            <NavItem icon={Settings} label="Settings" />
          </nav>

          {/* Bottom actions */}
          <div className="px-4 py-4 border-t border-white/20 dark:border-white/8 space-y-2">
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-white/60 hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <div className="text-xs text-gray-400 dark:text-white/30 px-3">
              v2.0.1
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main content ────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* ─── Top bar ────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/70 dark:bg-white/6 backdrop-blur-2xl border-b border-white/30 dark:border-white/8 px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white/30 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white hover:scale-105 transition-transform"
              aria-label="Toggle theme"
            >
              <ThemeIcon />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md shadow-indigo-500/20">
              JD
            </div>
          </div>
        </header>

        {/* ─── Page content ────────────────────────────── */}
        <main className="p-4 sm:p-6 space-y-6">
          {/* ─── Stats Grid ──────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/70 dark:bg-white/6 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-white/8 shadow-sm p-5 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-white/50">{stat.label}</span>
                  <stat.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                  <span
                    className={`text-xs font-medium ${
                      stat.changeType === "up" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Two‑column layout ─────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ─── Recent Activity ────────────────────── */}
            <div className="lg:col-span-1 bg-white/70 dark:bg-white/6 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-white/8 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <Clock className="w-4 h-4 text-gray-400 dark:text-white/40" />
              </div>
              <ul className="space-y-3">
                {RECENT_ACTIVITY.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-indigo-400" />
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-white/80">{item.action}</p>
                      <span className="text-xs text-gray-400 dark:text-white/40">{item.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── Sales Chart Placeholder ────────────── */}
            <div className="lg:col-span-2 bg-white/70 dark:bg-white/6 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-white/8 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Sales Overview</h2>
                <TrendingUp className="w-4 h-4 text-gray-400 dark:text-white/40" />
              </div>
              <div className="h-40 flex items-end gap-3 pt-4">
                {[65, 45, 80, 55, 90, 70, 60].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-xs text-gray-400 dark:text-white/40">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* ─── Add Product & Recent Products ────────── */}
          <div className="bg-white/70 dark:bg-white/6 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-white/8 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Products</h2>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20 dark:border-white/8 text-left text-xs font-medium text-gray-500 dark:text-white/40 uppercase tracking-wider">
                    <th className="py-3 px-2">Product Name</th>
                    <th className="py-3 px-2">Price</th>
                    <th className="py-3 px-2">Sold</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 dark:divide-white/5">
                  {RECENT_PRODUCTS.map((product) => (
                    <tr key={product.id} className="hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{product.name}</td>
                      <td className="py-3 px-2 text-gray-600 dark:text-white/70">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-2 text-gray-600 dark:text-white/70">{product.sold}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button className="text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Sidebar NavItem helper ──────────────────────────────
function NavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`
        flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all
        ${
          active
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20"
            : "text-gray-600 dark:text-white/60 hover:bg-white/20 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
        }
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}