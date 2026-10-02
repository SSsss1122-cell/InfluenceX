'use client';

import { useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa6';

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export default function InstagramPosts() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch('/api/instagram');

        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }

        const data = await response.json();

        setPosts(data.data || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load Instagram posts.');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <section className="mt-16 text-left">
        <div className="flex items-center gap-3">
        <FaInstagram className="text-3xl text-pink-500" />

        <h2 className="text-2xl font-bold">
        Instagram
        </h2>
      </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="aspect-square animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-16 text-left">
        <h2 className="text-2xl font-bold">
          Instagram
        </h2>

        <div className="mt-6 rounded-xl bg-gray-50 p-8 text-center">
          <p className="text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="mt-16 text-left">
        <h2 className="text-2xl font-bold">
          Instagram
        </h2>

        <div className="mt-6 rounded-xl bg-gray-50 p-8 text-center">
          <p className="text-gray-500">
            No Instagram posts found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 text-left">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Instagram
          </h2>

          <p className="mt-1 text-gray-500">
            Latest posts from Instagram
          </p>
        </div>

        <a
          href="https://www.instagram.com/officialsiddu1020/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
        >
          View Instagram
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {posts.map((post) => {
          const image =
            post.media_type === 'VIDEO'
              ? post.thumbnail_url || post.media_url
              : post.media_url;

          return (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
            >
              <img
                src={image}
                alt={post.caption || 'Instagram post'}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                <p className="line-clamp-2 text-sm text-white">
                  {post.caption || 'View Instagram post'}
                </p>
              </div>

              {post.media_type === 'VIDEO' && (
                <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                  ▶
                </div>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}