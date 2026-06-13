# Brute Force Protection via Rate Limiting (Login Endpoint)

## OWASP Category
A07 – Identification and Authentication Failures

---

## Severity
High

---

## Overview

Rate limiting has been implemented on the authentication endpoint to mitigate brute-force and credential stuffing attacks.

The mechanism restricts the number of login attempts allowed within a fixed time window. Once the limit is exceeded, further requests are blocked with a `429 Too Many Requests` response.

This ensures that automated attacks are slowed down or prevented while allowing legitimate users to authenticate under normal usage patterns.

---

## Affected Endpoint

`POST /api/auth/login`

---

## Threat Scenario

Before mitigation, an attacker could:

- Perform unlimited password guessing attempts
- Run credential stuffing attacks using leaked credentials
- Automate login attempts without restriction
- Exploit weak passwords at scale

Impact:

- Account takeover risk
- Authentication system abuse
- Increased server load from malicious traffic

---

## Root Cause

- No restriction on number of login attempts per IP/user
- No correlation between repeated authentication failures
- No enforcement of time-based lockouts or throttling

---

## Remediation Implemented

### 1. Rate Limiting Middleware

The login endpoint is protected using `express-rate-limit`.

```js
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts per window

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
```
---

### 2. Enforcement Behavior

When the limit is exceeded:

- Server returns HTTP 429 Too Many Requests
- Further authentication attempts are blocked temporarily
- Rate limit resets after the configured time window (15 minutes)
---

### Security Improvements
- Prevents brute-force password guessing
- Mitigates credential stuffing attacks
- Reduces automated login abuse
- Adds per-IP and per-account throttling
- Improves overall authentication resilience
- Key Design Decisions
- IP + Email Based Keying

Rate limiting is applied using a combined key:

- Normalized IP address
- Lowercased email address

This improves protection by:

- Blocking repeated attacks on a single account
- Preventing distributed IP attacks against multiple accounts
- Reducing false negatives from IP rotation alone
---
### Limitations

While effective, this approach has known limitations:

- Attackers can rotate IP addresses (botnets/proxies)
- Email enumeration is still possible under some conditions
- Shared NAT environments may affect legitimate users
--- 
### Recommended Enhancements

To further strengthen protection:

- Account lockout after repeated failures
- CAPTCHA after suspicious activity
- Device fingerprinting
- Behavioral anomaly detection
- Centralized logging + SIEM alerts
- Progressive delays (exponential backoff)
---
### Before vs After
#### Before
- Unlimited login attempts
- No throttling or restrictions
- High brute-force risk
#### After
- 5 attempts per 15 minutes per IP/email
- Automatic request blocking (HTTP 429)
- Reduced attack surface for authentication abuse
---
### Related Files
- `middleware/loginRateLimiter.js`
- `controllers/authController.js`
- `utils/securityLogger.js`
- `THREATMODEL.md`