# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Setlist Visualizer is a Next.js 14 application that displays concert history from Setlist.fm. It features infinite scroll, year filtering, three view modes (grouped cards, compact list, and interactive map), and the ability to share setlists as beautiful custom-designed images.

**Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Leaflet (maps), Vercel OG (image generation)

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Production server (after build)
npm start

# Linting
npm run lint
```

## Environment Setup

Required environment variable in `.env.local`:
- `SETLISTFM_API_KEY` - API key from https://api.setlist.fm/docs/1.0/index.html

Optional (testing only):
- `DEV_MODE=true` - Limits API calls to first page only (NEVER use in production)

## Architecture Overview

### API Layer & Rate Limiting

The application implements strict rate limiting to comply with Setlist.fm API constraints:

- **Rate limiter** (`src/lib/rate-limiter.ts`): 1 query per second (conservative, API allows 2)
- **Daily limit**: 1000 calls per day
- **Caching**: 1 hour for user concerts, 24 hours for setlists
- All API calls must go through the `SetlistFMClient` singleton to ensure rate limiting is applied

**Critical**: Never make direct fetch calls to Setlist.fm API. Always use `getSetlistFMClient()` from `src/lib/setlistfm-client.ts`.

### Caching Strategy

The app uses an in-memory cache (`src/lib/cache.ts`) with TTL support:
- Cache keys are generated via `CacheKeys` helpers
- Three TTL tiers: `USER_CONCERTS` (1hr), `SETLIST` (24hr), `SEARCH` (30min)
- For production with multiple server instances, migrate to Redis (see `docs/REDIS_MIGRATION.md`)

### Data Flow

1. **User Timeline** (`/user/[username]`):
   - Client-side React component fetches from API route `/api/user/[username]/concerts`
   - API route uses `SetlistFMClient.getUserConcertsPage(username, page)` for infinite scroll
   - Returns paginated concerts with `hasMore` flag for infinite scroll

2. **Setlist Detail** (`/setlist/[id]`):
   - Client-side component fetches from API route `/api/setlist/[id]`
   - API route uses `SetlistFMClient.getSetlist(id)`
   - Processes raw Setlist.fm data into structured sets and songs

### Infinite Scroll Implementation

User timeline uses IntersectionObserver for infinite scroll:
- Observer watches a target element at the bottom of the concert list
- When target is visible and `hasMore === true`, triggers fetch of next page
- Disabled when year filter is active (shows all concerts for that year)
- State managed via: `currentPage`, `totalPages`, `hasMore`, `isLoadingMore`

### View Modes

Three display modes for concert timeline (persisted to sessionStorage):
1. **Grouped Cards** (`viewMode: 'grouped'`): Date headers with bordered card containers
2. **Compact List** (`viewMode: 'compact'`): Minimal list with gradient separators
3. **Map View** (`viewMode: 'map'`): Interactive map showing all concert locations with clustering

**Map View Implementation** (`src/components/ConcertMap.tsx`):
- Built with React Leaflet and OpenStreetMap tiles (no API key required)
- Dynamically imported with SSR disabled for Leaflet compatibility
- Filters concerts to only show those with valid `venue.coords` data
- Uses `react-leaflet-cluster` for marker clustering (maxClusterRadius: 50px)
- Auto-fits map bounds to display all concert locations with 50px padding
- Marker popups show: artist, date, venue, tour, and "View setlist →" link
- Clustering features: chunked loading, spiderfy on max zoom
- Disables infinite scroll (shows all loaded concerts on map)
- Works with year filter to show filtered concerts

**Leaflet CSS**: Imported in `src/app/layout.tsx`:
```typescript
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
```

**Icon Loading**: Uses CDN for marker icons to resolve Next.js static asset issues

### Scroll Restoration

Navigation preserves scroll position when returning to timeline:
- Before navigating to setlist detail, saves `window.scrollY` to sessionStorage
- On return, restores scroll position after content renders
- Key format: `scroll-${username}`

### Date Handling

Setlist.fm uses `dd-MM-yyyy` format. The client:
- Parses dates in `parseSetlistDate()` method
- Stores as ISO strings in processed data
- Formats for display via `formatDisplayDate()` (e.g., "January 15, 2024")

### Image Sharing

Users can download setlists as high-quality PNG images in four custom design styles. This feature uses server-side image generation with `@vercel/og`.

**User Flow**:
1. "Share as Image" button on setlist detail page (`src/app/setlist/[id]/page.tsx`)
2. Modal opens showing 4 template options (`src/components/ShareImageModal.tsx`)
3. Template thumbnails load from API (200×280px)
4. User selects template to see live preview (500×700px)
5. "Download Image" generates full-size image (1000×1400px)
6. Browser downloads as `{artist}-{venue}-{date}.png`

**API Endpoint** (`src/app/api/setlist/[id]/image/route.tsx`):
- **Runtime**: Edge (for fast image generation)
- **Method**: GET
- **Query Params**:
  - `style`: scrapbook | vintage | backstage | minimalist (required)
  - `size`: full | preview | thumbnail (default: 'full')
- **Size Mapping**:
  - `full`: 1000×1400px (downloads)
  - `preview`: 500×700px (modal preview)
  - `thumbnail`: 200×280px (template grid)

**Template Styles** (`src/components/setlist-templates/`):
1. **ScrapbookTemplate.tsx** - "Personal Scrapbook"
   - Font: Caveat (handwritten)
   - Style: Warm beige/brown palette, textured paper aesthetic

2. **VintageTemplate.tsx** - "Vintage Poster"
   - Font: Special Elite (typewriter)
   - Style: 1960s/70s letterpress concert poster, vintage brown/sepia
   - Smart column layout for setlists with >15 songs

3. **BackstageTemplate.tsx** - "Backstage Pass"
   - Fonts: Roboto Mono + Bebas Neue
   - Style: Industrial gaffer tape/roadie aesthetic

4. **MinimalistTemplate.tsx** - "Modern Minimalist"
   - Font: Inter
   - Style: Clean, Spotify-chic typography

**Technical Details**:
- Uses `@vercel/og` (v0.8.5) with `ImageResponse` API
- Custom fonts loaded from CDN (Google Fonts, Font Source)
- Only supports TTF/OTF formats (no WOFF/WOFF2 or variable fonts)
- Templates use inline Flexbox styles (Tailwind not supported in OG)
- All templates include: artist, venue, date, tour, setlist by sets, cover song indicators
- Lazy loading for template previews to optimize performance

**Dependencies**:
```json
{
  "@vercel/og": "^0.8.5"
}
```

## File Structure

```
src/
├── app/
│   ├── api/                                    # Server-side API routes
│   │   ├── setlist/[id]/
│   │   │   ├── route.ts                       # GET /api/setlist/:id
│   │   │   └── image/route.tsx                # GET /api/setlist/:id/image (Edge runtime)
│   │   └── user/[username]/concerts/route.ts  # GET /api/user/:username/concerts?page=N
│   ├── setlist/[id]/page.tsx                  # Setlist detail page (client-side)
│   ├── user/[username]/page.tsx               # User timeline (client-side, infinite scroll, map view)
│   ├── layout.tsx                             # Root layout with dark mode + Leaflet CSS imports
│   └── page.tsx                               # Home page with username form
├── components/
│   ├── ConcertCard.tsx                        # Individual concert card
│   ├── ConcertMap.tsx                         # Interactive map with clustering (Leaflet)
│   ├── ConcertSkeleton.tsx                    # Loading skeleton states
│   ├── MapSkeleton.tsx                        # Loading skeleton for map
│   ├── ShareImageModal.tsx                    # Modal for selecting and downloading image templates
│   ├── SetlistTemplatePreview.tsx             # Lazy-loading template preview thumbnails
│   ├── UsernameForm.tsx                       # Username input form
│   ├── YearFilter.tsx                         # Year dropdown filter (sticky on mobile)
│   └── setlist-templates/                     # Image generation templates (for @vercel/og)
│       ├── BackstageTemplate.tsx              # "Backstage Pass" style
│       ├── MinimalistTemplate.tsx             # "Modern Minimalist" style
│       ├── ScrapbookTemplate.tsx              # "Personal Scrapbook" style
│       └── VintageTemplate.tsx                # "Vintage Poster" style
├── lib/
│   ├── cache.ts                               # In-memory cache with TTL
│   ├── rate-limiter.ts                        # Queue-based rate limiter
│   └── setlistfm-client.ts                    # Setlist.fm API client (singleton)
└── types/
    └── setlistfm.ts                           # TypeScript interfaces for API data
```

## Key Patterns

### API Client Usage

Always use the singleton instance:
```typescript
import { getSetlistFMClient } from '@/lib/setlistfm-client';

const client = getSetlistFMClient();
const { concerts, hasMore } = await client.getUserConcertsPage(username, page);
```

### Error Handling

API routes return structured errors:
```typescript
return NextResponse.json(
  { error: "User not found" },
  { status: 404 }
);
```

Client components catch and display errors in user-friendly UI.

### Type Safety

All Setlist.fm API responses are typed in `src/types/setlistfm.ts`:
- `SetlistResponse` - API paginated response
- `Setlist` - Raw setlist data
- `ProcessedConcert` - Concert for timeline display
- `ProcessedSetlist` - Full setlist with sets and songs

## Common Tasks

### Adding New API Endpoints

1. Create route handler in `src/app/api/`
2. Import and use `getSetlistFMClient()` for Setlist.fm calls
3. Implement caching with appropriate TTL from `CACHE_TTL`
4. Return structured JSON responses

### Modifying Concert Display

- Timeline layout: `src/app/user/[username]/page.tsx` (lines 402-502 for view modes)
- Concert cards: `src/components/ConcertCard.tsx`
- Date grouping logic: `groupConcertsByDate()` in user timeline page
- Map view: `src/components/ConcertMap.tsx` (marker popups, clustering config)

### Adding New Image Templates

1. Create new template component in `src/components/setlist-templates/`
2. Follow existing pattern: accept `ProcessedSetlist` as prop
3. Use inline styles with Flexbox (no Tailwind in `@vercel/og`)
4. Load custom fonts from CDN (TTF/OTF only)
5. Add template to `ShareImageModal.tsx` grid
6. Update image API route to handle new style parameter

**Important constraints for templates**:
- Fixed dimensions: 1000×1400px for full size
- Only inline styles supported (no external CSS)
- Font loading must be from URLs (no local files)
- No variable fonts or WOFF/WOFF2 formats
- All data must come from `ProcessedSetlist` type
- **CRITICAL**: ALL `<div>` and `<span>` elements MUST have explicit `display` property (either `display: 'flex'` or `display: 'none'`). Satori (the engine behind `@vercel/og`) will throw an error if any div/span lacks this. Even text-only divs need `display: 'flex'`. This applies to both setlist templates and festival templates.
- **No CSS calc()**: Satori doesn't support `calc()` in CSS. Use fixed percentage or pixel values instead (e.g., use `width: '48%'` instead of `width: 'calc(50% - 20px)'`).

### Customizing Map Behavior

Modify `src/components/ConcertMap.tsx`:
- Clustering: Adjust `maxClusterRadius` (default: 50)
- Map bounds: Change padding in `fitBounds()` call (default: 50px)
- Marker icons: Update CDN URLs or use custom icons
- Popup content: Edit popup HTML in marker rendering
- Tile layer: Change OpenStreetMap provider if needed

### Adjusting Rate Limits

Modify `src/lib/rate-limiter.ts`:
- Constructor params: `requestsPerSecond`, `maxDailyCalls`
- Current: 1 qps (line 104) - increase cautiously to avoid 429 errors

### Changing Cache Durations

Edit `CACHE_TTL` constants in `src/lib/cache.ts` (lines 106-110).

## Key Dependencies

### Map View
- `leaflet` (^1.9.4) - Core mapping library
- `react-leaflet` (^4.2.1) - React bindings for Leaflet
- `react-leaflet-cluster` (^3.1.1) - Marker clustering functionality

### Image Generation
- `@vercel/og` (^0.8.5) - Server-side image generation using Satori

### External Resources
- OpenStreetMap tiles - Free map tiles (no API key required)
- Google Fonts CDN - Custom font loading for image templates
- Font Source CDN - Additional font options
- Leaflet CDN - Default marker icons (Next.js static asset workaround)

## Deployment

Optimized for Vercel free tier:
- Set `SETLISTFM_API_KEY` in Vercel environment variables
- Framework auto-detected as Next.js
- Security headers configured in `vercel.json`

**Map view**: No additional configuration required (OpenStreetMap is free, no API key)

**Image generation**:
- Uses Edge runtime for fast image generation
- Fonts loaded from CDN (no local assets required)
- `@vercel/og` is optimized for Vercel Edge Functions
- Images generated on-demand (not cached long-term, regenerate each request)

## Testing Notes

- Use `DEV_MODE=true` in `.env.local` to limit API calls during development
- Test with users who have many concerts to verify pagination
- Test year filter behavior (disables infinite scroll)
- Test scroll restoration when navigating between timeline and setlist detail

### Map View Testing
- Test with users who have concerts in multiple locations
- Verify marker clustering works correctly (markers group/ungroup on zoom)
- Check map behavior with concerts missing coordinate data
- Test popup interactions and navigation to setlist detail
- Verify map bounds auto-fit shows all markers correctly
- Test year filter integration with map view

### Image Sharing Testing
- Test all 4 template styles generate correctly
- Verify font loading works (check for fallback fonts if CDN fails)
- Test with various setlist sizes (short, long, multiple encores)
- Check filename sanitization for special characters in artist/venue names
- Test image download across different browsers
- Verify template previews load lazily and show loading states
- Test edge cases: missing tour names, no cover songs, single-song sets

## Important Constraints

- **Rate limiting is critical**: Never bypass the `SetlistFMClient` singleton
- **Cache keys must be consistent**: Use `CacheKeys` helpers
- **Pagination is required**: API returns max 20 concerts per page
- **Date parsing is fragile**: Always use `parseSetlistDate()` for Setlist.fm dates
- **Map view requires SSR disabled**: Leaflet doesn't support SSR, must use dynamic import with `ssr: false`
- **Image templates can't use Tailwind**: `@vercel/og` only supports inline styles with Flexbox
- **Font formats for images**: Only TTF/OTF supported, no WOFF/WOFF2 or variable fonts
- **ALL divs/spans need explicit display**: Satori requires every `<div>` and `<span>` to have `display: 'flex'` or `display: 'none'` in their style object, even for simple text containers. Missing this will cause "Expected <div> to have explicit display" errors.
- **No CSS calc() in images**: Satori doesn't support `calc()` function. Use fixed percentages or pixels (e.g., `48%` not `calc(50% - 20px)`).
- **Coordinate data may be missing**: Not all concerts have `venue.coords`, map must filter these out
