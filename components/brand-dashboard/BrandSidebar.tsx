
"use client";

import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Settings,
  Store,
} from "lucide-react";

const items = [
  { label: "Overview", icon: LayoutDashboard, href: "#overview" },
  { label: "Brand Profile", icon: Building2, href: "#brand-profile" },
  { label: "Influencer Preferences", icon: Users, href: "#influencers" },
  { label: "Products & Services", icon: Package, href: "#services" },
  { label: "Settings", icon: Settings, href: "#settings" },
];

export default function BrandSidebar() {
  return (
    <aside className="flex w-full flex-col border-r border-gray-200 bg-white p-5 md:min-h-screen md:w-64">
      <a href="/brand-dashboard" className="mb-8 flex items-center gap-2">
        <div className="rounded-xl bg-indigo-600 p-2 text-white">
          <Store size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">InfluenceX</h2>
          <p className="text-xs text-gray-500">Brand Workspace</p>
        </div>
      </a>

      <nav className="flex flex-row flex-wrap gap-2 md:flex-col">
        {items.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Icon size={19} />
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-8 rounded-xl bg-indigo-50 p-4 md:mt-auto">
        <p className="font-semibold text-indigo-900">Grow with InfluenceX</p>
        <p className="mt-1 text-sm text-indigo-700">
          Connect your brand with relevant creators.
        </p>
      </div>
    </aside>
  );
}
