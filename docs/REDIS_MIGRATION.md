# Redis Migration Guide

This guide explains how to migrate from the in-memory cache to Redis for persistent, production-grade caching.

## Why Migrate to Redis?

The current MVP uses in-memory caching, which has limitations:

- **No persistence**: Cache is lost on server restart or redeployment
- **Not scalable**: Each server instance has its own cache (no sharing in multi-instance deployments)
- **Memory constraints**: Limited by Node.js process memory

Redis provides:

- **Persistent caching**: Survives restarts and deployments
- **Shared cache**: Multiple server instances share the same cache
- **Better performance**: Optimized for caching workloads
- **Advanced features**: TTL management, LRU eviction, and more

## Free Redis Options

### 1. Upstash Redis (Recommended)

[Upstash](https://upstash.com/) offers a generous free tier perfect for this application:

- **10,000 commands/day** (plenty for MVP)
- **Global edge caching**
- **REST API** (works in serverless environments)
- **No credit card required**

### 2. Redis Cloud

[Redis Cloud](https://redis.com/try-free/) free tier:

- **30MB storage**
- **30 connections**
- **Good for development and small apps**

## Migration Steps

### Step 1: Install Redis Client

```bash
npm install @upstash/redis
```

### Step 2: Create Redis Client

Create a new file `src/lib/redis-cache.ts`:

```typescript
import { Redis } from '@upstash/redis';
import { CACHE_TTL } from './cache';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class RedisCache {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get<T>(key);
      if (data) {
        console.log(`[Redis Cache HIT] ${key}`);
      } else {
        console.log(`[Redis Cache MISS] ${key}`);
      }
      return data;
    } catch (error) {
      console.error('[Redis Error]', error);
      return null;
    }
  }

  async set<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    try {
      await redis.set(key, data, { ex: ttlSeconds });
    } catch (error) {
      console.error('[Redis Error]', error);
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await redis.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('[Redis Error]', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key);
      return result === 1;
    } catch (error) {
      console.error('[Redis Error]', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await redis.flushdb();
    } catch (error) {
      console.error('[Redis Error]', error);
    }
  }

  async getStats() {
    try {
      const info = await redis.info();
      return { info };
    } catch (error) {
      console.error('[Redis Error]', error);
      return { error: 'Failed to get stats' };
    }
  }
}

// Export singleton
export const redisCache = new RedisCache();

// Re-export cache keys and TTL for consistency
export { CacheKeys, CACHE_TTL } from './cache';
```

### Step 3: Update Setlist.fm Client

In `src/lib/setlistfm-client.ts`, replace the cache import:

```typescript
// Old:
import { cache, CacheKeys, CACHE_TTL } from "./cache";

// New:
import { redisCache as cache, CacheKeys, CACHE_TTL } from "./redis-cache";
```

The rest of the code remains the same due to interface compatibility!

### Step 4: Add Environment Variables

Add to your `.env.local`:

```bash
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

And to `.env.example`:

```bash
# Redis Cache (Optional - for production)
# Get these from https://upstash.com/
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

### Step 5: Configure in Vercel

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Redeploy your application

## Alternative: Conditional Redis Usage

For flexibility, you can use Redis only when configured:

```typescript
// src/lib/cache-factory.ts
import { InMemoryCache } from './cache';
import { RedisCache } from './redis-cache';

export function getCacheInstance() {
  const useRedis =
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN;

  if (useRedis) {
    console.log('[Cache] Using Redis');
    return new RedisCache();
  }

  console.log('[Cache] Using In-Memory Cache');
  return new InMemoryCache();
}

export const cache = getCacheInstance();
```

Then update `setlistfm-client.ts`:

```typescript
import { cache } from './cache-factory';
```

This approach allows the app to work with or without Redis!

## Performance Comparison

### In-Memory Cache
- **Speed**: ~1-5ms (fastest)
- **Cost**: $0
- **Scalability**: Poor (per-instance)
- **Persistence**: None

### Upstash Redis
- **Speed**: ~10-50ms (very fast)
- **Cost**: $0 (free tier)
- **Scalability**: Excellent (shared)
- **Persistence**: Full

## Monitoring

After migration, monitor your Redis usage:

```bash
# View cache statistics
curl https://your-app.vercel.app/api/stats
```

You can create an admin route to check Redis stats:

```typescript
// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import { redisCache } from "@/lib/redis-cache";
import { rateLimiter } from "@/lib/rate-limiter";

export async function GET() {
  const stats = {
    redis: await redisCache.getStats(),
    rateLimiter: {
      dailyCallCount: rateLimiter.getDailyCallCount(),
      remainingDailyCalls: rateLimiter.getRemainingDailyCalls(),
    },
  };

  return NextResponse.json(stats);
}
```

## Rollback

If you need to rollback to in-memory cache:

1. Remove Redis environment variables
2. Revert cache imports in `setlistfm-client.ts`
3. Redeploy

## Support

- **Upstash Docs**: https://upstash.com/docs/redis
- **Redis Commands**: https://redis.io/commands

## Next Steps

Once migrated, consider:

1. **Cache warming**: Pre-populate cache for popular users
2. **Analytics**: Track cache hit rates
3. **Advanced TTL**: Different TTLs based on data freshness needs
4. **Multi-layer caching**: Combine in-memory + Redis for optimal performance
