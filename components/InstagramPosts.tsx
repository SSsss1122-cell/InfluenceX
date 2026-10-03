"use client";

import { useEffect, useState } from "react";

type InstagramPost = {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  media_type?: string;
  thumbnail_url?: string;
  timestamp?: string;
};

type InstagramApiResponse = {
  success?: boolean;
  data?: InstagramPost[];
  error?: string;
  detail?: string;
  status?: number;
  instagramError?: {
    error?: {
      message?: string;
      type?: string;
      code?: number;
      error_subcode?: number;
    };
  };
};

export default function InstagramPosts() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/instagram", {
          cache: "no-store",
        });

        const body: InstagramApiResponse = await res.json();

        console.log("Instagram API response:", body);

        if (!res.ok) {
          const instagramError =
            body?.instagramError?.error;

          const message =
            instagramError?.message ||
            body?.error ||
            body?.detail ||
            `Instagram API error ${res.status}`;

          console.error("Instagram error:", {
            status: res.status,
            message,
            type: instagramError?.type,
            code: instagramError?.code,
            subcode: instagramError?.error_subcode,
          });

          throw new Error(message);
        }

        setPosts(body?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch Instagram posts:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Could not load Instagram posts."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return <p>Loading Instagram posts...</p>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: "16px",
          borderRadius: "8px",
          background: "#fff1f2",
          color: "#be123c",
          fontSize: "14px",
        }}
      >
        <strong>Instagram error:</strong>
        <p>{error}</p>
      </div>
    );
  }

  if (!posts.length) {
    return <p>No Instagram posts found.</p>;
  }

  return (
    <div>
      {/* Heading with Instagram icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#ig-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#feda75" />
              <stop offset="25%" stopColor="#fa7e1e" />
              <stop offset="50%" stopColor="#d62976" />
              <stop offset="75%" stopColor="#962fbf" />
              <stop offset="100%" stopColor="#4f5bd5" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>

        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          Instagram Posts
        </h2>
      </div>

      {/* Existing posts grid (unchanged) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {posts.map((post) => {
          const isVideo =
            post.media_type === "VIDEO" ||
            post.media_type === "REELS";

          const src = isVideo
            ? post.thumbnail_url || post.media_url
            : post.media_url;

          return (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={src}
                alt={post.caption || "Instagram post"}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              {post.caption && (
                <p
                  style={{
                    fontSize: "13px",
                    marginTop: "6px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {post.caption}
                </p>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}