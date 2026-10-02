// lib/supabaseQueries.ts
import { supabase } from "@/lib/supabase"; // your existing client

export interface InfluencerMapRecord {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  location: string | null;
  state: string | null;
  city: string | null;
  category: string | null;
  categories: string[] | null;
  platforms: string[] | null;
  followers: number | null;
  engagement_rate: number | null;
  influencer_type: string | null;
  starting_price: number | null;
  profile_image: string | null;
  cover_image: string | null;
  verified: boolean | null;
  available: boolean | null;
  rating: number | null;
  gender: string | null;
  latitude: number | null;
  longitude: number | null;
}

const MAP_COLUMNS = `
  id, name, username, bio, location, state, city,
  category, categories, platforms, followers,
  engagement_rate, influencer_type, starting_price,
  profile_image, cover_image, verified, available,
  rating, gender, latitude, longitude
`;

const MAP_COLUMNS_NO_LATLNG = `
  id, name, username, bio, location, state, city,
  category, categories, platforms, followers,
  engagement_rate, influencer_type, starting_price,
  profile_image, cover_image, verified, available,
  rating, gender
`;

/**
 * Fetch ALL influencers for the map.
 * Falls back if latitude/longitude columns do not exist yet.
 */
export async function fetchInfluencersForMap(): Promise<{
  data: InfluencerMapRecord[];
  error: string | null;
}> {
  // Supabase caps response at 1000 rows by default. If you have more, paginate.
  const { data, error } = await supabase
    .from("influencers")
    .select(MAP_COLUMNS)
    .order("followers", { ascending: false })
    .limit(1000);

  if (error) {
    // Retry without latitude/longitude if those columns don't exist
    if (
      error.message?.includes("latitude") ||
      error.message?.includes("longitude") ||
      (error.message?.includes("column") && error.message?.includes("does not exist"))
    ) {
      const retry = await supabase
        .from("influencers")
        .select(MAP_COLUMNS_NO_LATLNG)
        .order("followers", { ascending: false })
        .limit(1000);

      if (retry.error) {
        return { data: [], error: retry.error.message };
      }

      const records: InfluencerMapRecord[] = (retry.data ?? []).map((item: any) => ({
        ...item,
        latitude: null,
        longitude: null,
      }));

      return { data: records, error: null };
    }

    return { data: [], error: error.message };
  }

  return { data: (data ?? []) as InfluencerMapRecord[], error: null };
}