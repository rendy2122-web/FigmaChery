/**
 * Simple in-memory rate limiter for API routes
 * Note: For production, use Redis-based rate limiting
 */

const rateMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 30,
  windowMs: number = 60 * 1000 // 1 minute window
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { success: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateMap.entries()) {
      if (now > value.resetTime) {
        rateMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}