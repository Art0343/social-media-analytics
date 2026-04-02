interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Simple in-memory rate limiter (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,    // 100 requests per minute
};

const STRICT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,     // 30 requests per minute for write operations
};

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  const existing = rateLimitStore.get(identifier);

  if (!existing || existing.resetTime < now) {
    // New window
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(identifier, newEntry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Existing window
  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime,
    };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetTime: existing.resetTime,
  };
}

export function getRateLimitHeaders(
  allowed: boolean,
  remaining: number,
  resetTime: number,
  maxRequests: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(maxRequests),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
    ...(allowed ? {} : { 'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)) }),
  };
}

export { DEFAULT_CONFIG, STRICT_CONFIG };
