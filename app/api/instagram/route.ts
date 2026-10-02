import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Instagram access token is missing" },
        { status: 500 }
      );
    }

    const url = new URL(
      "https://graph.instagram.com/v23.0/me/media"
    );

    url.searchParams.set(
      "fields",
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
    );

    url.searchParams.set("limit", "20");
    url.searchParams.set("access_token", accessToken);

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Instagram media request failed",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Instagram media error:", error);

    return NextResponse.json(
      { error: "Failed to fetch Instagram posts" },
      { status: 500 }
    );
  }
}