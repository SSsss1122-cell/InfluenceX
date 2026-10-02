"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

import InfluencerMarker from "@/components/map/InfluencerMarker";
import { createClusterIcon } from "@/components/map/ClusterIcon";
import { resolveInfluencerCoordinates } from "@/lib/cityCoordinates";
import type { InfluencerMapRecord } from "@/lib/supabaseQueries";

function MapBoundsFitter({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 10);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
  }, [points, map]);

  return null;
}

// ─── Prop is OPTIONAL with a safe default ───
interface DynamicMapProps {
  influencers?: InfluencerMapRecord[];
}

export default function DynamicMap({ influencers = [] }: DynamicMapProps) {
  // Extra guard: if the parent somehow passes null, coerce to []
  const safeInfluencers = Array.isArray(influencers) ? influencers : [];

  const markers = useMemo(
    () =>
      safeInfluencers.map((inf) => {
        const coords = resolveInfluencerCoordinates(inf);
        return { influencer: inf, lat: coords.lat, lng: coords.lng };
      }),
    [safeInfluencers]
  );

  const points = useMemo(
    () => markers.map((m) => [m.lat, m.lng] as [number, number]),
    [markers]
  );

  return (
    <div className="relative h-[420px] sm:h-[500px] lg:h-[560px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl
      >
        <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        />
        <MapBoundsFitter points={points} />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          zoomToBoundsOnClick
        >
          {markers.map(({ influencer, lat, lng }) => (
            <InfluencerMarker
              key={influencer.id}
              influencer={influencer}
              lat={lat}
              lng={lng}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}