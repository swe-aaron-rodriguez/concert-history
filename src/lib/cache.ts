/**
 * Simple in-memory cache with TTL support
 * For MVP: Caches API responses to minimize Setlist.fm API calls
 *
 * Future: Migrate to Redis for persistent caching across deployments
 * See /docs/REDIS_MIGRATION.md for migration guide
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(cleanupIntervalMs: number = 60000) {
    // Run cleanup every minute to remove expired entries
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, cleanupIntervalMs);
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;

    this.cache.set(key, {
      data,
      expiresAt,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (entry.expiresAt >= now) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
    };
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  USER_CONCERTS: 3600, // 1 hour - user's concert list changes infrequently
  SETLIST: 86400, // 24 hours - setlists rarely change once created
  SEARCH: 1800, // 30 minutes
} as const;

// Singleton cache instance
export const cache = new InMemoryCache();

// Cache key generators
export const CacheKeys = {
  userConcerts: (username: string, page: number = 1) =>
    `user:${username}:concerts:page:${page}`,
  setlist: (id: string) => `setlist:${id}`,
  userAllConcerts: (username: string) => `user:${username}:all-concerts`,
} as const;
