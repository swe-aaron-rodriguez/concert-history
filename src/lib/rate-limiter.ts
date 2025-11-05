/**
 * Rate Limiter for Setlist.fm API
 * Limits: 2 queries per second, 1000 calls per day
 */

export class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private lastRequestTime = 0;
  private readonly minInterval: number; // Minimum time between requests in ms
  private dailyCallCount = 0;
  private dailyResetTime: number;
  private readonly maxDailyCalls: number;
  private processing = false;

  constructor(
    requestsPerSecond: number = 2,
    maxDailyCalls: number = 1000
  ) {
    this.minInterval = 1000 / requestsPerSecond; // 500ms for 2 qps
    this.maxDailyCalls = maxDailyCalls;
    this.dailyResetTime = this.getNextDayTimestamp();
  }

  private getNextDayTimestamp(): number {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    return tomorrow.getTime();
  }

  private resetDailyCountIfNeeded(): void {
    const now = Date.now();
    if (now >= this.dailyResetTime) {
      this.dailyCallCount = 0;
      this.dailyResetTime = this.getNextDayTimestamp();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      this.resetDailyCountIfNeeded();

      // Check daily limit
      if (this.dailyCallCount >= this.maxDailyCalls) {
        throw new Error(
          `Daily API call limit of ${this.maxDailyCalls} exceeded. Resets at midnight.`
        );
      }

      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.minInterval) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.minInterval - timeSinceLastRequest)
        );
      }

      const execute = this.queue.shift();
      if (execute) {
        this.lastRequestTime = Date.now();
        this.dailyCallCount++;
        await execute();
      }
    }

    this.processing = false;
  }

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  getRemainingDailyCalls(): number {
    this.resetDailyCountIfNeeded();
    return this.maxDailyCalls - this.dailyCallCount;
  }

  getDailyCallCount(): number {
    this.resetDailyCountIfNeeded();
    return this.dailyCallCount;
  }
}

// Singleton instance
// Use 1 qps instead of 2 to add safety buffer and avoid 429 errors from Setlist.fm API
// The API docs say 2 qps, but in practice it seems stricter
export const rateLimiter = new RateLimiter(1, 1000);
