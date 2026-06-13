const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req.ip);
    const email = req.body.email?.toLowerCase() || 'unknown';
    return `${ip}:${email}`;
  },
  message: {
    message: 'Too many login attempts. Please try again later.'
  }
});

module.exports = loginRateLimiter;
