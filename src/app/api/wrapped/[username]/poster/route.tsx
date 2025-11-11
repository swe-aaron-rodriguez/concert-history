import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getSetlistFMClient } from '@/lib/setlistfm-client';
import { ProcessedConcert } from '@/types/setlistfm';
import {
  filterConcertsByYear,
  getArtistNodes,
  generateFestivalLineup,
} from '@/lib/wrapped-stats';
import ModernFestivalTemplate from '@/components/festival-templates/ModernFestivalTemplate';
import VintageFestivalTemplate from '@/components/festival-templates/VintageFestivalTemplate';
import MinimalistFestivalTemplate from '@/components/festival-templates/MinimalistFestivalTemplate';

export const runtime = 'edge';

const WRAPPED_YEAR = 2025;

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
    const size = (searchParams.get('size') || 'full') as keyof typeof SIZES;

    const { username } = params;

    if (!username) {
      return new Response('Username is required', { status: 400 });
    }

    // Fetch all concerts for the user
    const client = getSetlistFMClient();
    const allConcerts: ProcessedConcert[] = [];
    let page = 1;
    let hasMore = true;

    // Fetch all pages
    while (hasMore) {
      const result = await client.getUserConcertsPage(username, page);
      allConcerts.push(...result.concerts);
      hasMore = result.hasMore;
      page++;

      // Safety limit to prevent infinite loops
      if (page > 100) break;
    }

    // Filter to 2025 concerts
    const concerts2025 = filterConcertsByYear(allConcerts, WRAPPED_YEAR);

    if (concerts2025.length === 0) {
      return new Response('No concerts found for 2025', { status: 404 });
    }

    // Generate festival lineup
    const artistNodes = getArtistNodes(concerts2025);
    const lineup = generateFestivalLineup(artistNodes, username);

    // Get dimensions for requested size
    const { width, height } = SIZES[size];

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
    });
  } catch (error) {
    console.error('Error generating festival poster:', error);
    return new Response(
      `Failed to generate poster: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}
