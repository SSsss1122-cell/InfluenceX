
"use client";

import { Building2, Globe, MapPin, Users } from "lucide-react";
import type { BrandProfile } from "./BrandProfileForm";

export default function BrandOverview({
  profile,
}: {
  profile: BrandProfile;
}) {
  const details = [
    {
      label: "Brand Category",
      value: profile.brand_type || "Not specified",
      icon: Building2,
    },
    {
      label: "Service Type",
      value: profile.service_type || "Not specified",
      icon: Globe,
    },
    {
      label: "Influencer Types",
      value: profile.influencer_types?.length
        ? profile.influencer_types.join(", ")
        : "Not selected",
      icon: Users,
    },
    {
      label: "Location",
      value: profile.location || "Not specified",
      icon: MapPin,
    },
  ];

  return (
    <section id="overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {details.map(({ label, value, icon: Icon }) => (
        <article
          key={label}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">{label}</p>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Icon size={20} />
            </div>
          </div>
          <p className="mt-4 break-words text-lg font-bold text-gray-900">
            {value}
          </p>
        </article>
      ))}
    </section>
  );
}
