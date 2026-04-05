// ============================================================
// Q3 - middleware/rateLimiter.js
// Simple per-route rate limiting using express-rate-limit
// ============================================================

const rateLimit = require('express-rate-limit');

// Global rate limiter (applies to all routes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  }
});

// Stricter limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // only 20 requests allowed
  message: {
    success: false,
    error: 'Too many login/register attempts. Try again later.'
  }
});

// Moderate limiter for product routes
const productLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50,
  message: {
    success: false,
    error: 'Too many product requests.'
  }
});

module.exports = {
  globalLimiter,
  authLimiter,
  productLimiter
};