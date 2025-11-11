import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { FestivalLineup, ArtistNode } from '@/lib/wrapped-stats';
import ModernFestivalTemplate from '@/components/festival-templates/ModernFestivalTemplate';
import VintageFestivalTemplate from '@/components/festival-templates/VintageFestivalTemplate';
import MinimalistFestivalTemplate from '@/components/festival-templates/MinimalistFestivalTemplate';

export const runtime = 'edge';

// Size configurations
const SIZES = {
  full: { width: 1200, height: 1600 },
  preview: { width: 500, height: 667 },
  thumbnail: { width: 200, height: 267 },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const style = searchParams.get('style') || 'modern';
    const sizeParam = searchParams.get('size') || 'full';
    const artistsParam = searchParams.get('artists');
    const totalArtistsParam = searchParams.get('total');

    const { username } = params;

    if (!username) {
      return new Response('Username is required', { status: 400 });
    }

    if (!artistsParam) {
      return new Response('Artists data is required', { status: 400 });
    }

    // Validate size parameter and fallback to 'full' if invalid
    const validSize = (sizeParam in SIZES) ? sizeParam as keyof typeof SIZES : 'full';

    // Parse artist names from pipe-separated string
    const artistNames = artistsParam.split('|').filter(name => name.trim());
    const totalArtists = totalArtistsParam ? parseInt(totalArtistsParam, 10) : artistNames.length;

    if (artistNames.length === 0) {
      return new Response('No artists provided', { status: 400 });
    }

    // Reconstruct lineup from artist names
    // We don't need the full ArtistNode data for rendering, just names
    const artistNodes: ArtistNode[] = artistNames.map((name, index) => ({
      id: name,
      name: name.trim(),
      count: 0, // Not needed for rendering
      percentage: 0, // Not needed for rendering
      hasTour: false, // Not needed for rendering (already prioritized in lineup)
    }));

    // Recreate lineup hierarchy
    const lineup: FestivalLineup = {
      headliners: artistNodes.slice(0, 3),
      subHeadliners: artistNodes.slice(3, 8),
      lineup: artistNodes.slice(8),
      festivalName: `${username.toUpperCase()}'S 2025 FESTIVAL`,
      totalArtists,
    };

    // Get dimensions for requested size
    const { width, height } = SIZES[validSize];

    // Load fonts based on template style
    // Each font must support Unicode characters like ★ (U+2605)
    let fonts;
    switch (style) {
      case 'vintage': {
        // Courier Prime for typewriter aesthetic (supports Unicode)
        const courierPrimeFont = await fetch(
          "https://github.com/google/fonts/raw/main/ofl/courierprime/CourierPrime-Regular.ttf"
        ).then((res) => res.arrayBuffer());
        const courierPrimeBoldFont = await fetch(
          "https://github.com/google/fonts/raw/main/ofl/courierprime/CourierPrime-Bold.ttf"
        ).then((res) => res.arrayBuffer());
        fonts = [
          { name: "Courier Prime", data: courierPrimeFont, style: "normal" as const, weight: 400 as const },
          { name: "Courier Prime", data: courierPrimeBoldFont, style: "normal" as const, weight: 700 as const },
        ];
        break;
      }
      case 'minimalist': {
        // Inter for minimalist style
        const interFont = await fetch(
          "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf"
        ).then((res) => res.arrayBuffer());
        const interBoldFont = await fetch(
          "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf"
        ).then((res) => res.arrayBuffer());
        fonts = [
          { name: "Inter", data: interFont, style: "normal" as const, weight: 400 as const },
          { name: "Inter", data: interBoldFont, style: "normal" as const, weight: 700 as const },
        ];
        break;
      }
      case 'modern':
      default: {
        // Inter for modern style (good Unicode support)
        const interFont = await fetch(
          "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf"
        ).then((res) => res.arrayBuffer());
        const interBoldFont = await fetch(
          "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf"
        ).then((res) => res.arrayBuffer());
        fonts = [
          { name: "Inter", data: interFont, style: "normal" as const, weight: 400 as const },
          { name: "Inter", data: interBoldFont, style: "normal" as const, weight: 700 as const },
        ];
        break;
      }
    }

    // Render template based on style
    let template;
    switch (style) {
      case 'vintage':
        template = (
          <VintageFestivalTemplate lineup={lineup} width={width} height={height} />
        );
        break;
      case 'minimalist':
        template = (
          <MinimalistFestivalTemplate lineup={lineup} width={width} height={height} />
        );
        break;
      case 'modern':
      default:
        template = (
          <ModernFestivalTemplate lineup={lineup} width={width} height={height} />
        );
        break;
    }

    // Generate image
    return new ImageResponse(template, {
      width,
      height,
      fonts,
    });
  } catch (error) {
    console.error('Error generating festival poster:', error);
    return new Response(
      `Failed to generate poster: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}
