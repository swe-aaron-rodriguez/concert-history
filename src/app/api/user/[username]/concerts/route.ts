import { NextRequest, NextResponse } from "next/server";
import { getSetlistFMClient } from "@/lib/setlistfm-client";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const client = getSetlistFMClient();
    const concerts = await client.getUserConcerts(username);

    return NextResponse.json({
      success: true,
      data: concerts,
      count: concerts.length,
    });
  } catch (error) {
    console.error("Error fetching user concerts:", error);

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "User not found or has no attended concerts" },
          { status: 404 }
        );
      }

      if (error.message.includes("Rate limit")) {
        return NextResponse.json(
          { error: "API rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }

      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "API configuration error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch concerts. Please try again." },
      { status: 500 }
    );
  }
}
