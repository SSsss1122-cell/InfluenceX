// src/components/map/ClusterIcon.tsx
"use client";

import L from "leaflet";

/**
 * Minimal shape of the object Leaflet passes to `iconCreateFunction`.
 * We only need `getChildCount()` for rendering the badge.
 *
 * We define this locally instead of relying on `L.MarkerCluster`
 * because that type lives in the `leaflet.markercluster` package,
 * which `react-leaflet-cluster` bundles internally but does not
 * re-export to consumers.
 */
interface MarkerClusterLike {
  getChildCount: () => number;
}

/**
 * Custom cluster icon matching the red dotted marker aesthetic.
 * Shows the number of influencers in the cluster.
 */
export function createClusterIcon(cluster: MarkerClusterLike) {
  const count = cluster.getChildCount();

  // Size scales slightly with count
  const size = count < 10 ? 36 : count < 100 ? 42 : 48;
  const fontSize = count < 10 ? 12 : count < 100 ? 13 : 14;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: #ef4444;
        color: white;
        font-weight: 700;
        font-size: ${fontSize}px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4), 0 0 0 4px rgba(239, 68, 68, 0.15);
        border: 2px solid white;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        ${count}
      </div>
    `,
    className: "influencer-cluster-icon",
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  });
}