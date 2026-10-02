"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { supabase } from "@/lib/supabase";
import type { InfluencerMapRecord } from "@/lib/supabaseQueries";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-2xl bg-gray-100">
      <p className="text-gray-500">
        Loading influencer map...
      </p>
    </div>
  ),
});

export default function InfluencerMap() {
  const [influencers, setInfluencers] = useState<InfluencerMapRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfluencers() {
      const { data, error } = await supabase
        .from("influencers")
        .select("*");

      if (error) {
        console.error(
          "[InfluencerMap] Supabase error:",
          error
        );
        setLoading(false);
        return;
      }

      console.log(
        "[InfluencerMap] Loaded influencers:",
        data
      );

      setInfluencers(
        (data || []) as InfluencerMapRecord[]
      );

      setLoading(false);
    }

    fetchInfluencers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl bg-gray-100">
        <p className="text-gray-500">
          Loading influencer map...
        </p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full">
      <DynamicMap influencers={influencers} />
    </div>
  );
}