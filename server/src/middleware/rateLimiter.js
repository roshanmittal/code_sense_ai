const rateLimit = require('express-rate-limit');

// General API rate limiter: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// Stricter rate limiter for AI generation / optimization: 40 requests per 5 minutes
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI request limit reached. Please wait a few minutes before submitting another AI request.',
  },
});

// Stricter rate limiter for code execution: 30 runs per 3 minutes
const executionLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 45,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Execution rate limit reached. Please wait a moment before running more code.',
  },
});

module.exports = { apiLimiter, aiLimiter, executionLimiter };
