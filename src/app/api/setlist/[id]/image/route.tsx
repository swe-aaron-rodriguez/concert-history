import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getSetlistFMClient } from "@/lib/setlistfm-client";
import ScrapbookTemplate from "@/components/setlist-templates/ScrapbookTemplate";
import VintageTemplate from "@/components/setlist-templates/VintageTemplate";
import BackstageTemplate from "@/components/setlist-templates/BackstageTemplate";
import MinimalistTemplate from "@/components/setlist-templates/MinimalistTemplate";

const VALID_STYLES = [
  "scrapbook",
  "vintage",
  "backstage",
  "minimalist",
] as const;
type TemplateStyle = (typeof VALID_STYLES)[number];

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const style = searchParams.get("style") as TemplateStyle | null;
    const size = searchParams.get("size") || "full"; // 'full', 'preview', 'thumbnail'

    // Validate style parameter
    if (!style || !VALID_STYLES.includes(style)) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid style parameter. Must be one of: scrapbook, vintage, backstage, minimalist",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch setlist data
    const client = getSetlistFMClient();
    const setlist = await client.getSetlist(params.id);

    if (!setlist) {
      return new Response(JSON.stringify({ error: "Setlist not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Load fonts based on template style
    // Note: @vercel/og only supports TTF and OTF formats, not WOFF/WOFF2 or variable fonts
    let fonts: Array<{ name: string; data: ArrayBuffer; style: "normal" | "italic"; weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 }> = [];

    switch (style) {
      case "scrapbook": {
        // Caveat from cdn.jsdelivr.net (static TTF)
        const caveatFont = await fetch(
          "https://cdn.jsdelivr.net/fontsource/fonts/caveat@latest/latin-400-normal.ttf"
        ).then((res) => res.arrayBuffer());
        fonts = [{ name: "Caveat", data: caveatFont, style: "normal", weight: 400 }];
        break;
      }
      case "vintage": {
        // Special Elite - already working
        const specialEliteFont = await fetch(
          "https://github.com/google/fonts/raw/main/apache/specialelite/SpecialElite-Regular.ttf"
        ).then((res) => res.arrayBuffer());
        fonts = [{ name: "Special Elite", data: specialEliteFont, style: "normal", weight: 400 }];
        break;
      }
      case "backstage": {
        // Using cdn.jsdelivr.net for static TTF fonts
        const [robotoMonoFont, bebasNeueFont] = await Promise.all([
          fetch(
            "https://cdn.jsdelivr.net/fontsource/fonts/roboto-mono@latest/latin-400-normal.ttf"
          ).then((res) => res.arrayBuffer()),
          fetch(
            "https://github.com/google/fonts/raw/main/ofl/bebasneue/BebasNeue-Regular.ttf"
          ).then((res) => res.arrayBuffer()),
        ]);
        fonts = [
          { name: "Roboto Mono", data: robotoMonoFont, style: "normal", weight: 400 },
          { name: "Bebas Neue", data: bebasNeueFont, style: "normal", weight: 400 },
        ];
        break;
      }
      case "minimalist": {
        // Inter from cdn.jsdelivr.net (static TTF)
        const interFont = await fetch(
          "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf"
        ).then((res) => res.arrayBuffer());
        fonts = [{ name: "Inter", data: interFont, style: "normal", weight: 400 }];
        break;
      }
    }

    // Determine dimensions based on size
    let width = 1000;
    let height = 1400;

    if (size === "preview") {
      width = 500;
      height = 700;
    } else if (size === "thumbnail") {
      width = 200;
      height = 280;
    }

    // Select template based on style
    let TemplateComponent;
    switch (style) {
      case "scrapbook":
        TemplateComponent = ScrapbookTemplate;
        break;
      case "vintage":
        TemplateComponent = VintageTemplate;
        break;
      case "backstage":
        TemplateComponent = BackstageTemplate;
        break;
      case "minimalist":
        TemplateComponent = MinimalistTemplate;
        break;
    }

    // Generate image using @vercel/og
    return new ImageResponse(<TemplateComponent setlist={setlist} />, {
      width,
      height,
      fonts,
    });
  } catch (error) {
    console.error("Error generating setlist image:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
