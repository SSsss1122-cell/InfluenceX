// app/api/instagram/route.ts

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing Instagram credentials",
        hasToken: Boolean(accessToken),
        hasUserId: Boolean(userId),
      },
      { status: 500 }
    );
  }

  try {
    const url = new URL(
      `https://graph.instagram.com/${userId}/media`
    );

    url.searchParams.set(
      "fields",
      "id,caption,media_url,permalink,media_type,thumbnail_url,timestamp"
    );

    url.searchParams.set("access_token", accessToken);

    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    const text = await response.text();

    console.log("Instagram HTTP status:", response.status);
    console.log("Instagram raw response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        raw: text,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          instagramError: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        ...data,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Instagram server error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Instagram",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}