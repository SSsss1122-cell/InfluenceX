// lib/cityCoordinates.ts

export interface CityCoord {
  lat: number;
  lng: number;
}

/**
 * Approximate city / state coordinates.
 * Keys must be lowercase and trimmed.
 */
export const CITY_COORDINATES: Record<string, CityCoord> = {
  // ─── Metro ───
  chennai: { lat: 13.0827, lng: 80.2707 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  bombay: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.209 },
  "new delhi": { lat: 28.6139, lng: 77.209 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  calcutta: { lat: 22.5726, lng: 88.3639 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },

  // ─── Tier 2 ───
  jaipur: { lat: 26.9124, lng: 75.7873 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  cochin: { lat: 9.9312, lng: 76.2673 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  indore: { lat: 22.7196, lng: 75.8577 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  surat: { lat: 21.1702, lng: 72.8311 },
  vadodara: { lat: 22.3072, lng: 73.1812 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  vizag: { lat: 17.6868, lng: 83.2185 },
  vijayawada: { lat: 16.5062, lng: 80.648 },
  mysuru: { lat: 12.2958, lng: 76.6394 },
  mysore: { lat: 12.2958, lng: 76.6394 },
  mangaluru: { lat: 12.9141, lng: 74.856 },
  mangalore: { lat: 12.9141, lng: 74.856 },
  thrissur: { lat: 10.5276, lng: 76.2144 },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  trivandrum: { lat: 8.5241, lng: 76.9366 },
  kozhikode: { lat: 11.2588, lng: 75.7804 },
  calicut: { lat: 11.2588, lng: 75.7804 },
  guwahati: { lat: 26.1445, lng: 91.7362 },
  bhubaneswar: { lat: 20.2961, lng: 85.8245 },
  patna: { lat: 25.5941, lng: 85.1376 },
  ranchi: { lat: 23.3441, lng: 85.3096 },
  raipur: { lat: 21.2514, lng: 81.6296 },
  dehradun: { lat: 30.3165, lng: 78.0322 },
  shimla: { lat: 31.1048, lng: 77.1734 },
  srinagar: { lat: 34.0837, lng: 74.7973 },
  jammu: { lat: 32.7266, lng: 74.857 },
  amritsar: { lat: 31.634, lng: 74.8723 },
  ludhiana: { lat: 30.901, lng: 75.8573 },
  jalandhar: { lat: 31.326, lng: 75.5762 },
  noida: { lat: 28.5355, lng: 77.391 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  ghaziabad: { lat: 28.6692, lng: 77.4538 },
  faridabad: { lat: 28.4089, lng: 77.3178 },
  agra: { lat: 27.1767, lng: 78.0081 },
  varanasi: { lat: 25.3176, lng: 82.9739 },
  kanpur: { lat: 26.4499, lng: 80.3319 },
  prayagraj: { lat: 25.4358, lng: 81.8463 },
  allahabad: { lat: 25.4358, lng: 81.8463 },
  nashik: { lat: 19.9975, lng: 73.7898 },
  aurangabad: { lat: 19.8762, lng: 75.3433 },
  kolhapur: { lat: 16.705, lng: 74.2433 },
  solapur: { lat: 17.6599, lng: 75.9064 },
  goa: { lat: 15.2993, lng: 74.124 },
  panaji: { lat: 15.4909, lng: 73.8278 },
  puducherry: { lat: 11.9416, lng: 79.8083 },
  pondicherry: { lat: 11.9416, lng: 79.8083 },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047 },
  trichy: { lat: 10.7905, lng: 78.7047 },
  salem: { lat: 11.6643, lng: 78.146 },
  tirunelveli: { lat: 8.7139, lng: 77.7567 },
  erode: { lat: 11.341, lng: 77.7172 },
  vellore: { lat: 12.9165, lng: 79.1325 },
  warangal: { lat: 17.9689, lng: 79.5941 },
  guntur: { lat: 16.3067, lng: 80.4365 },
  nellore: { lat: 14.4426, lng: 79.9865 },
  rajkot: { lat: 22.3039, lng: 70.8022 },
  jodhpur: { lat: 26.2389, lng: 73.0243 },
  udaipur: { lat: 24.5854, lng: 73.7125 },
  kota: { lat: 25.2138, lng: 75.8648 },
  ajmer: { lat: 26.4499, lng: 74.6399 },
  bikaner: { lat: 28.0229, lng: 73.3119 },
  jaisalmer: { lat: 26.9157, lng: 70.9083 },
  alwar: { lat: 27.553, lng: 76.6346 },

  // ─── State centroids ───
  "tamil nadu": { lat: 11.1271, lng: 78.6569 },
  karnataka: { lat: 15.3173, lng: 75.7139 },
  maharashtra: { lat: 19.7515, lng: 75.7139 },
  telangana: { lat: 18.1124, lng: 79.0193 },
  "andhra pradesh": { lat: 15.9129, lng: 79.74 },
  "west bengal": { lat: 22.9868, lng: 87.855 },
  gujarat: { lat: 22.2587, lng: 71.1924 },
  rajasthan: { lat: 27.0238, lng: 74.2179 },
  kerala: { lat: 10.8505, lng: 76.2711 },
  "uttar pradesh": { lat: 26.8467, lng: 80.9462 },
  "madhya pradesh": { lat: 22.9734, lng: 78.6569 },
  punjab: { lat: 31.1471, lng: 75.3412 },
  haryana: { lat: 29.0588, lng: 76.0856 },
  bihar: { lat: 25.0961, lng: 85.3131 },
  jharkhand: { lat: 23.6102, lng: 85.2799 },
  odisha: { lat: 20.9517, lng: 85.0985 },
  assam: { lat: 26.2006, lng: 92.9376 },
  uttarakhand: { lat: 30.0668, lng: 79.0193 },
  "himachal pradesh": { lat: 31.1048, lng: 77.1734 },
  "jammu and kashmir": { lat: 33.7782, lng: 76.5762 },
};

/**
 * Normalize a string for city lookup.
 * "  Chennai  " → "chennai"
 * "Bengaluru, Karnataka" → "bengaluru"
 * "Mumbai (Bombay)" → "mumbai"
 */
function normalize(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .trim()
    .split(",")[0]        // take first part before comma
    .split("(")[0]        // take first part before parenthesis
    .split("/")[0]        // take first part before slash
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

/**
 * Look up coordinates for a free-text location string.
 * Tries the full string, then each word against the city map.
 */
function lookupByText(text: string): CityCoord | null {
  if (!text) return null;

  // Full normalized string
  if (CITY_COORDINATES[text]) return CITY_COORDINATES[text];

  // Try each word
  const words = text.split(" ").filter(Boolean);
  for (const w of words) {
    if (CITY_COORDINATES[w]) return CITY_COORDINATES[w];
  }

  // Try two-word combinations (e.g. "new delhi", "tamil nadu")
  for (let i = 0; i < words.length - 1; i++) {
    const pair = `${words[i]} ${words[i + 1]}`;
    if (CITY_COORDINATES[pair]) return CITY_COORDINATES[pair];
  }

  return null;
}

/**
 * Resolve coordinates for an influencer.
 *
 * Priority:
 *   1. Real latitude/longitude columns (use as-is)
 *   2. city → lookup
 *   3. state → lookup
 *   4. location text → word-by-word lookup
 *   5. Country center fallback (never skipped!)
 */
export function resolveInfluencerCoordinates(influencer: {
  id?: string;
  latitude?: number | null;
  longitude?: number | null;
  city?: string | null;
  state?: string | null;
  location?: string | null;
}): CityCoord {
  // 1. Real DB coordinates — always trusted
  if (
    typeof influencer.latitude === "number" &&
    !isNaN(influencer.latitude) &&
    typeof influencer.longitude === "number" &&
    !isNaN(influencer.longitude)
  ) {
    return { lat: influencer.latitude, lng: influencer.longitude };
  }

  // 2. City lookup
  const city = normalize(influencer.city);
  if (city && CITY_COORDINATES[city]) {
    return applyJitter(influencer.id ?? city, CITY_COORDINATES[city]);
  }

  // 3. State lookup
  const state = normalize(influencer.state);
  if (state && CITY_COORDINATES[state]) {
    return applyJitter(influencer.id ?? state, CITY_COORDINATES[state]);
  }

  // 4. Free-text location
  const loc = normalize(influencer.location);
  const fromLoc = lookupByText(loc);
  if (fromLoc) return applyJitter(influencer.id ?? loc, fromLoc);

  // 5. Last resort: center of India
  // (guarantees the influencer still appears on the map)
  return applyJitter(influencer.id ?? "default", { lat: 20.5937, lng: 78.9629 });
}

/**
 * Deterministic offset (± ~1.5 km) so same-city influencers don't stack.
 * Stable across renders because it hashes the influencer id.
 */
function applyJitter(seed: string, coord: CityCoord): CityCoord {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
  const radius = 0.008 + (Math.abs(hash) % 15) * 0.0008;

  return {
    lat: coord.lat + Math.cos(angle) * radius,
    lng: coord.lng + Math.sin(angle) * radius,
  };
}