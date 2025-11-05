import { NextRequest, NextResponse } from "next/server";
import { getSetlistFMClient } from "@/lib/setlistfm-client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const setlistId = params.id;

    if (!setlistId) {
      return NextResponse.json(
        { error: "Setlist ID is required" },
        { status: 400 }
      );
    }

    const client = getSetlistFMClient();
    const setlist = await client.getSetlist(setlistId);

    return NextResponse.json({
      success: true,
      data: setlist,
    });
  } catch (error) {
    console.error("Error fetching setlist:", error);

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Setlist not found" },
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
      { error: "Failed to fetch setlist. Please try again." },
      { status: 500 }
    );
  }
}
