// components/map/InfluencerMarker.tsx
"use client";

import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  X,
  BadgeCheck,
  MapPin,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import type { InfluencerMapRecord } from "@/lib/supabaseQueries";

// ─── Create the circular avatar marker HTML ───
function buildAvatarIconHtml(influencer: InfluencerMapRecord): string {
  const initial = (influencer.name ?? "?").charAt(0).toUpperCase();
  const image = influencer.profile_image?.trim();
  const verified = influencer.verified;

  // We render the img first and let it sit above the initial fallback.
  // If the image fails to load, onerror hides it, revealing the initial.
  const imgTag = image
    ? `<img
        src="${escapeHtml(image)}"
        alt=""
        class="influencer-avatar-img"
        onerror="this.style.display='none';"
      />`
    : "";

  const verifiedBadge = verified
    ? `<span class="influencer-avatar-verified" aria-hidden="true">
         <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
           <polyline points="20 6 9 17 4 12"></polyline>
         </svg>
       </span>`
    : "";

  return `
    <div class="influencer-avatar-marker">
      <span class="influencer-avatar-initial">${escapeHtml(initial)}</span>
      ${imgTag}
      ${verifiedBadge}
    </div>
  `;
}

// Prevent HTML injection from user-provided strings
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const AVATAR_SIZE = 44;
const AVATAR_ANCHOR = AVATAR_SIZE / 2;

export const createInfluencerIcon = (influencer: InfluencerMapRecord) =>
  divIcon({
    html: buildAvatarIconHtml(influencer),
    className: "influencer-avatar-icon",
    iconSize: [AVATAR_SIZE, AVATAR_SIZE],
    iconAnchor: [AVATAR_ANCHOR, AVATAR_ANCHOR],
    popupAnchor: [0, -AVATAR_ANCHOR - 4],
  });

// ─── Formatting helpers ───
function formatFollowers(n: number | null | undefined): string {
  if (!n || n < 0) return "N/A";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function formatEngagement(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "N/A";
  // assume stored as percentage number (e.g. 6 means 6%)
  return `${Number(n).toFixed(1).replace(/\.0$/, "")}%`;
}

// ─── Marker component ───
interface InfluencerMarkerProps {
  influencer: InfluencerMapRecord;
  lat: number;
  lng: number;
}

export default function InfluencerMarker({
  influencer,
  lat,
  lng,
}: InfluencerMarkerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleViewProfile = () => {
    router.push(`/influencers/${influencer.id}`);
  };

  const followers = formatFollowers(influencer.followers);
  const engagement = formatEngagement(influencer.engagement_rate);

  const locationLine = [influencer.city, influencer.state]
    .filter(Boolean)
    .join(", ");

  return (
    <Marker
      position={[lat, lng]}
      icon={createInfluencerIcon(influencer)}
      eventHandlers={{ click: () => setOpen(true) }}
    >
      {open && (
        <Popup
          autoPan
          closeButton={false}
          className="influencer-popup"
          minWidth={260}
          maxWidth={300}
          eventHandlers={{ remove: () => setOpen(false) }}
        >
          <div className="relative bg-white rounded-2xl p-4 font-sans shadow-xl">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2.5 right-2.5 h-7 w-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
              aria-label="Close"
            >
              <X size={13} strokeWidth={2.5} />
            </button>

            {/* Header: avatar + name */}
            <div className="flex items-center gap-3 mb-3 pr-6">
              <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-red-500/30">
                {influencer.profile_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={influencer.profile_image}
                    alt={influencer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-lg font-semibold">
                    {(influencer.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {influencer.name}
                  </h4>
                  {influencer.verified && (
                    <BadgeCheck size={14} className="text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  @{influencer.username}
                </p>
                {influencer.category && (
                  <span className="inline-block mt-1 text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {influencer.category}
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            {influencer.bio && (
              <p className="text-xs text-gray-600 leading-snug mb-3 line-clamp-2">
                {influencer.bio}
              </p>
            )}

            {/* Location */}
            {locationLine && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
                <MapPin size={12} className="text-gray-400" />
                <span className="truncate">{locationLine}</span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
              <span className="inline-flex items-center gap-1">
                <Users size={12} className="text-gray-400" />
                <strong className="text-gray-800">{followers}</strong>
              </span>
              <span className="inline-flex items-center gap-1">
                <TrendingUp size={12} className="text-gray-400" />
                <strong className="text-gray-800">{engagement}</strong>
              </span>
              {influencer.rating != null && (
                <span className="inline-flex items-center gap-1">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <strong className="text-gray-800">
                    {Number(influencer.rating).toFixed(1)}
                  </strong>
                </span>
              )}
            </div>

            {/* View profile */}
            <button
              onClick={handleViewProfile}
              className="w-full py-2 px-3 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-semibold transition-colors duration-150"
            >
              View Profile
            </button>
          </div>
        </Popup>
      )}
    </Marker>
  );
}