# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Setlist Visualizer is a Next.js 14 application that displays concert history from Setlist.fm. It features infinite scroll, year filtering, and two view modes (grouped cards and compact list) for browsing concert timelines.

**Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS

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

Two display modes for concert timeline (persisted to sessionStorage):
1. **Grouped Cards** (`viewMode: 'grouped'`): Date headers with bordered card containers
2. **Compact List** (`viewMode: 'compact'`): Minimal list with gradient separators

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

## File Structure

```
src/
├── app/
│   ├── api/                          # Server-side API routes
│   │   ├── setlist/[id]/route.ts    # GET /api/setlist/:id
│   │   └── user/[username]/concerts/route.ts  # GET /api/user/:username/concerts?page=N
│   ├── setlist/[id]/page.tsx        # Setlist detail page (client-side)
│   ├── user/[username]/page.tsx     # User timeline (client-side, infinite scroll)
│   ├── layout.tsx                   # Root layout with dark mode support
│   └── page.tsx                     # Home page with username form
├── components/
│   ├── ConcertCard.tsx              # Individual concert card
│   ├── ConcertSkeleton.tsx          # Loading skeleton states
│   ├── UsernameForm.tsx             # Username input form
│   └── YearFilter.tsx               # Year dropdown filter (sticky on mobile)
├── lib/
│   ├── cache.ts                     # In-memory cache with TTL
│   ├── rate-limiter.ts              # Queue-based rate limiter
│   └── setlistfm-client.ts          # Setlist.fm API client (singleton)
└── types/
    └── setlistfm.ts                 # TypeScript interfaces for API data
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

### Adjusting Rate Limits

Modify `src/lib/rate-limiter.ts`:
- Constructor params: `requestsPerSecond`, `maxDailyCalls`
- Current: 1 qps (line 104) - increase cautiously to avoid 429 errors

### Changing Cache Durations

Edit `CACHE_TTL` constants in `src/lib/cache.ts` (lines 106-110).

## Deployment

Optimized for Vercel free tier:
- Set `SETLISTFM_API_KEY` in Vercel environment variables
- Framework auto-detected as Next.js
- Security headers configured in `vercel.json`

## Testing Notes

- Use `DEV_MODE=true` in `.env.local` to limit API calls during development
- Test with users who have many concerts to verify pagination
- Test year filter behavior (disables infinite scroll)
- Test scroll restoration when navigating between timeline and setlist detail

## Important Constraints

- **Rate limiting is critical**: Never bypass the `SetlistFMClient` singleton
- **Cache keys must be consistent**: Use `CacheKeys` helpers
- **Pagination is required**: API returns max 20 concerts per page
- **Date parsing is fragile**: Always use `parseSetlistDate()` for Setlist.fm dates
