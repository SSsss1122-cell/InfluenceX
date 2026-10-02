import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import InstagramPosts from '@/components/InstagramPosts';
import { FaInstagram } from 'react-icons/fa';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InfluencerProfilePage({
  params,
}: PageProps) {
  const { id } = await params;

  const { data: influencer, error } = await supabase
    .from('influencers')
    .select(`
      *,
      products (*)
    `)
    .eq('id', id)
    .single();

  if (error || !influencer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Cover Section */}
      <section className="relative">

        <div className="h-72 w-full overflow-hidden bg-gray-200">
          {influencer.cover_image && (
            <Image
              src={influencer.cover_image}
              alt={`${influencer.name} cover`}
              width={1600}
              height={500}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Profile Image */}
        <div className="absolute left-1/2 top-48 -translate-x-1/2">
          <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
            {influencer.profile_image && (
              <Image
                src={influencer.profile_image}
                alt={influencer.name}
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

      </section>

      {/* Profile Information */}
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-24 text-center">

        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {influencer.name}
          </h1>

          {influencer.verified && (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-600">
              ✓ Verified
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
        <FaInstagram className="text-2xl text-pink-500" />

        <a
        href={`https://www.instagram.com/${String(influencer.username).replace(/^@/, '')}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 transition hover:text-pink-500 hover:underline"
      >
       {influencer.username}
      </a>
      </div>

        <p className="mt-4 text-gray-600">
          {influencer.bio}
        </p>

        <p className="mt-3 text-gray-500">
          📍 {influencer.location}
        </p>

        {/* Stats */}
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-2xl font-bold">
              {influencer.followers?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Followers
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-2xl font-bold">
              {influencer.engagement_rate}%
            </p>
            <p className="text-sm text-gray-500">
              Engagement
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-2xl font-bold">
              ⭐ {influencer.rating}
            </p>
            <p className="text-sm text-gray-500">
              Rating
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-2xl font-bold">
              ₹{influencer.starting_price}
            </p>
            <p className="text-sm text-gray-500">
              Starting Price
            </p>
          </div>

        </div>

        {/* Categories */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {influencer.categories?.map(
            (category: string) => (
              <span
                key={category}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm"
              >
                {category}
              </span>
            )
          )}
        </div>

        {/* Collaboration */}
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border p-6 text-left">

          <h2 className="text-xl font-semibold">
            Collaboration Details
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Influencer Type
              </p>
              <p className="font-medium">
                {influencer.influencer_type}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Availability
              </p>
              <p className="font-medium">
                {influencer.available ? 'Available' : 'Unavailable'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Category
              </p>
              <p className="font-medium">
                {influencer.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Starting Price
              </p>
              <p className="font-medium">
                ₹{influencer.starting_price}
              </p>
            </div>

          </div>

          <button className="mt-6 w-full rounded-xl bg-black px-6 py-3 font-medium text-white">
            Contact Influencer
          </button>

        </div>

        {/* Instagram */}
        <InstagramPosts />

        {/* Products */}
        <section className="mt-16 text-left">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Products from {influencer.name}
            </h2>

            <p className="mt-1 text-gray-500">
              PR products assigned to this influencer
            </p>
          </div>

          {influencer.products?.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-10 text-center">
              <p className="text-gray-500">
                No products assigned yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {influencer.products?.map((product: any) => (

                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="h-56 overflow-hidden bg-gray-100">
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-5">

                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-lg font-bold">
                      ₹{product.price}
                    </p>

                    <Link
                      href={`/products/${product.id}`}
                      className="mt-4 block rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white"
                    >
                      View Product
                    </Link>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </section>

    </main>
  );
}