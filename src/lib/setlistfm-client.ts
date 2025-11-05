/**
 * Setlist.fm API Client
 * Documentation: https://api.setlist.fm/docs/1.0/index.html
 */

import { rateLimiter } from "./rate-limiter";
import { cache, CacheKeys, CACHE_TTL } from "./cache";
import type {
  SetlistResponse,
  Setlist,
  ProcessedConcert,
  ProcessedSetlist,
} from "@/types/setlistfm";

const SETLISTFM_API_BASE = "https://api.setlist.fm/rest/1.0";

export class SetlistFMClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Setlist.fm API key is required");
    }
    this.apiKey = apiKey;
  }

  private async fetchWithRateLimit<T>(
    endpoint: string,
    cacheKey?: string,
    cacheTTL?: number
  ): Promise<T> {
    // Check cache first
    if (cacheKey) {
      const cached = cache.get<T>(cacheKey);
      if (cached) {
        console.log(`[Cache HIT] ${cacheKey}`);
        return cached;
      }
      console.log(`[Cache MISS] ${cacheKey}`);
    }

    // Make rate-limited API request
    const data = await rateLimiter.throttle(async () => {
      const url = `${SETLISTFM_API_BASE}${endpoint}`;

      const response = await fetch(url, {
        headers: {
          "x-api-key": this.apiKey,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Resource not found");
        }
        if (response.status === 403) {
          throw new Error("Invalid API key or access forbidden");
        }
        if (response.status === 429) {
          throw new Error("Rate limit exceeded");
        }
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return response.json() as Promise<T>;
    });

    // Cache the response
    if (cacheKey && cacheTTL) {
      cache.set(cacheKey, data, cacheTTL);
    }

    return data;
  }

  /**
   * Get all attended concerts for a user
   * Handles pagination automatically
   * In DEV_MODE, only fetches first page for faster testing
   */
  async getUserConcerts(username: string): Promise<ProcessedConcert[]> {
    const cacheKey = CacheKeys.userAllConcerts(username);
    const isDevMode = process.env.DEV_MODE === 'true';

    // Check if we have all concerts cached
    const cached = cache.get<ProcessedConcert[]>(cacheKey);
    if (cached) {
      console.log(`[Cache HIT] All concerts for ${username}`);
      return cached;
    }

    const allSetlists: Setlist[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const pageCacheKey = CacheKeys.userConcerts(username, page);

      const response = await this.fetchWithRateLimit<SetlistResponse>(
        `/user/${encodeURIComponent(username)}/attended?p=${page}`,
        pageCacheKey,
        CACHE_TTL.USER_CONCERTS
      );

      allSetlists.push(...response.setlist);

      // Check if there are more pages
      const totalPages = Math.ceil(response.total / response.itemsPerPage);
      hasMore = page < totalPages;

      // In dev mode, only fetch first page
      if (isDevMode) {
        console.log(`[DEV MODE] Stopping after page 1 of ${totalPages}`);
        hasMore = false;
      }

      page++;
    }

    // Process and sort concerts
    const concerts = this.processSetlistsToConcerts(allSetlists);

    // Cache the complete list
    cache.set(cacheKey, concerts, CACHE_TTL.USER_CONCERTS);

    if (isDevMode) {
      console.log(`[DEV MODE] Returned ${concerts.length} concerts (first page only)`);
    }

    return concerts;
  }

  /**
   * Get a specific setlist by ID
   */
  async getSetlist(setlistId: string): Promise<ProcessedSetlist> {
    const cacheKey = CacheKeys.setlist(setlistId);

    const response = await this.fetchWithRateLimit<any>(
      `/setlist/${encodeURIComponent(setlistId)}`,
      cacheKey,
      CACHE_TTL.SETLIST
    );

    // Debug logging to see actual API response structure
    console.log("[API Response Structure]", JSON.stringify(response, null, 2).substring(0, 500));

    // The API might return the setlist directly or wrapped
    let setlist: Setlist;

    if (!response) {
      throw new Error("Setlist not found - no response from API");
    }

    // Handle different response structures
    if (response.setlist) {
      // Response is wrapped: { setlist: {...} }
      setlist = response.setlist;
    } else if (response.id) {
      // Response is the setlist directly
      setlist = response as Setlist;
    } else {
      console.error("[API Error] Unexpected response structure:", response);
      throw new Error("Unexpected API response structure");
    }

    return this.processSetlist(setlist);
  }

  /**
   * Process raw setlist data into concert format for timeline
   */
  private processSetlistsToConcerts(setlists: Setlist[]): ProcessedConcert[] {
    return setlists
      .map((setlist) => this.processConcert(setlist))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private processConcert(setlist: Setlist): ProcessedConcert {
    const date = this.parseSetlistDate(setlist.eventDate);
    const location = this.formatLocation(setlist.venue);

    return {
      id: setlist.id,
      date: date.toISOString(),
      displayDate: this.formatDisplayDate(date),
      artist: {
        name: setlist.artist.name,
        mbid: setlist.artist.mbid,
      },
      venue: {
        name: setlist.venue.name,
        location,
      },
      tour: setlist.tour?.name,
      year: date.getFullYear(),
    };
  }

  /**
   * Process a full setlist for detail view
   */
  private processSetlist(setlist: Setlist): ProcessedSetlist {
    // Validate required fields
    if (!setlist) {
      throw new Error("Setlist data is missing");
    }
    if (!setlist.eventDate) {
      throw new Error("Setlist is missing event date");
    }
    if (!setlist.artist || !setlist.artist.name) {
      throw new Error("Setlist is missing artist information");
    }
    if (!setlist.venue || !setlist.venue.name) {
      throw new Error("Setlist is missing venue information");
    }

    const date = this.parseSetlistDate(setlist.eventDate);
    const location = this.formatLocation(setlist.venue);

    return {
      id: setlist.id,
      date: date.toISOString(),
      displayDate: this.formatDisplayDate(date),
      artist: {
        name: setlist.artist.name,
        url: setlist.artist.url,
      },
      venue: {
        name: setlist.venue.name,
        location,
      },
      tour: setlist.tour?.name,
      sets: setlist.sets.set.map((set) => {
        let setName = set.name || "Main Set";
        if (set.encore) {
          setName = `Encore ${set.encore}`;
        }

        return {
          name: setName,
          songs: set.song.map((song) => ({
            name: song.name,
            info: song.info,
            isCover: !!song.cover,
            coverArtist: song.cover?.name,
            isTape: song.tape || false,
          })),
        };
      }),
      info: setlist.info,
    };
  }

  /**
   * Parse Setlist.fm date format (dd-MM-yyyy) to Date object
   */
  private parseSetlistDate(dateString: string): Date {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Format date for display (e.g., "January 15, 2024")
   */
  private formatDisplayDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Format venue location (City, State, Country or City, Country)
   */
  private formatLocation(venue: any): string {
    const parts: string[] = [venue.city.name];

    if (venue.city.state) {
      parts.push(venue.city.state);
    }

    parts.push(venue.city.country.name);

    return parts.join(", ");
  }

  /**
   * Get cache and rate limiter stats (for debugging)
   */
  getStats() {
    return {
      cache: cache.getStats(),
      rateLimiter: {
        dailyCallCount: rateLimiter.getDailyCallCount(),
        remainingDailyCalls: rateLimiter.getRemainingDailyCalls(),
      },
    };
  }
}

// Singleton instance factory
let clientInstance: SetlistFMClient | null = null;

export function getSetlistFMClient(): SetlistFMClient {
  if (!clientInstance) {
    const apiKey = process.env.SETLISTFM_API_KEY;
    if (!apiKey) {
      throw new Error(
        "SETLISTFM_API_KEY environment variable is not set. Please add it to your .env.local file."
      );
    }
    clientInstance = new SetlistFMClient(apiKey);
  }
  return clientInstance;
}
