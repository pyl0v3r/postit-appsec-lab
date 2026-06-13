# Remediation: Security Misconfiguration

## OWASP Category

A02 – Security Misconfiguration

---

## Summary

The identified Express security configuration issues have been remediated by applying secure server defaults and restricting unsafe configurations.

---

## Fix 1: Disable Express Fingerprinting

### Implementation

Added:

`app.disable('x-powered-by');`

Result

### Before:

`x-powered-by: Express`

### After:

Header removed

## Fix 2: Restrict CORS Policy

### Previous Configuration

`app.use(cors());`

### Allowed:

`access-control-allow-origin: *`

### Updated Configuration
```js
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
```

### Result

Only trusted frontend origins can access the API.

Example:

`access-control-allow-origin: http://localhost:3000`
---
## Fix 3: Add Security Headers
Implementation

Installed Helmet:

`npm install helmet`

Configured:
```js
const helmet = require('helmet');

app.use(helmet());
```
Security Headers Added

Example:
```
X-Content-Type-Options: nosniff

X-Frame-Options: SAMEORIGIN

Content-Security-Policy

Strict-Transport-Security
```
### Verification

Security headers verified using:

- Browser DevTools
- OWASP ZAP scan

### Security Improvements
- Reduced information disclosure
- Hardened browser security controls
- Reduced cross-origin attack surface
- Improved production readiness
---

## Related Files
- `server/app.js`
- [Response Headers after remediation](./Response_Headers.png)