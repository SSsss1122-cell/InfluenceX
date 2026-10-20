import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This wildcard allows any HTTPS domain
      },
      {
        protocol: "http",
        hostname: "**", // This allows any HTTP domain (just in case)
      },
    ],
  },
};

export default nextConfig;