import { NextRequest, NextResponse } from "next/server";
import { getSetlistFMClient } from "@/lib/setlistfm-client";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (page < 1) {
      return NextResponse.json(
        { error: "Page must be greater than 0" },
        { status: 400 }
      );
    }

    const client = getSetlistFMClient();
    const result = await client.getUserConcertsPage(username, page);

    return NextResponse.json({
      success: true,
      data: result.concerts,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        total: result.total,
        hasMore: result.hasMore,
      },
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
