/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests
 */

import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter (for development)
// In production, use redis-based rate limiter
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

/**
 * Rate limiter middleware
 * @param windowMs - Time window in milliseconds
 * @param maxRequests - Max requests per window
 */
export const rateLimit = (windowMs: number, maxRequests: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    // Initialize or check existing entry
    if (!store[key] || now > store[key].resetTime) {
      store[key] = { count: 0, resetTime: now + windowMs };
    }

    // Increment request count
    store[key].count++;

    // Set rate limit headers
    res.set('X-RateLimit-Limit', maxRequests.toString());
    res.set('X-RateLimit-Remaining', Math.max(0, maxRequests - store[key].count).toString());
    res.set('X-RateLimit-Reset', store[key].resetTime.toString());

    // Check if limit exceeded
    if (store[key].count > maxRequests) {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
        },
      });
      return;
    }

    next();
  };
};

/**
 * Auth rate limiter - stricter for login/register
 * Max 30 attempts per 15 minutes (permissive for testing)
 */
export const authRateLimiter = rateLimit(15 * 60 * 1000, 30);

/**
 * API rate limiter - standard for all other endpoints
 * Max 200 requests per minute (permissive for testing)
 */
export const apiRateLimiter = rateLimit(60 * 1000, 200);

/**
 * Cleanup old entries (run periodically)
 */
export const cleanupRateLimitStore = () => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
