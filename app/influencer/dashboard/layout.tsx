
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  ChartNoAxesCombined,
  Handshake,
  Search,
  Wallet,
  Images,
  Package,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

const menuItems = [
  { label: "Overview", href: "/influencer/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/influencer/dashboard/profile", icon: UserRound },
  { label: "Social Analytics", href: "/influencer/dashboard/analytics", icon: ChartNoAxesCombined },
  { label: "Collaborations", href: "/influencer/dashboard/collaborations", icon: Handshake },
  { label: "Discover Brands", href: "/influencer/dashboard/brands", icon: Search },
  { label: "Earnings & Payments", href: "/influencer/dashboard/earnings", icon: Wallet },
  { label: "My Portfolio", href: "/influencer/dashboard/portfolio", icon: Images },
  { label: "PR Products & Resale", href: "/influencer/dashboard/products", icon: Package },
  { label: "Messages & Notifications", href: "/influencer/dashboard/messages", icon: MessageCircle },
];

export default function InfluencerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="w-full shrink-0 border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-72 md:overflow-y-auto md:border-b-0 md:border-r">
        <Link
          href="/influencer/dashboard"
          className="flex items-center gap-3 border-b border-slate-100 px-6 py-6"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Sparkles size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              InfluenceX
            </h1>
            <p className="text-xs text-slate-500">
              Creator Dashboard
            </p>
          </div>
        </Link>

        <div className="px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/influencer/dashboard"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-violet-100 text-violet-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mx-4 mb-5 rounded-xl bg-violet-50 p-4">
          <p className="text-sm font-semibold text-violet-900">
            Grow with InfluenceX
          </p>
          <p className="mt-1 text-xs leading-5 text-violet-700">
            Showcase your work and connect with brands that match your audience.
          </p>
          <Link
            href="/influencer/dashboard/brands"
            className="mt-3 inline-block text-sm font-semibold text-violet-800 underline underline-offset-4"
          >
            Explore brands
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Influencer Workspace
            </p>
            <p className="text-xs text-slate-500">
              Manage your creator journey
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Visit Website
          </Link>
        </header>

        <div className="p-5 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
