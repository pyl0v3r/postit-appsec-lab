# Security Finding: Security Misconfiguration

## OWASP Category

A02 – Security Misconfiguration

---

## Severity

Medium

---

## Affected Component

Express API Server

---

## Description

The application was running with default Express security settings and permissive cross-origin configuration.

The following security misconfigurations were identified:

- Express framework fingerprint disclosure
- Overly permissive CORS policy
- Missing security headers

---

## Finding 1: Express Framework Disclosure

### Evidence

Response headers:

`x-powered-by: Express`

---

### Risk

Exposing the backend framework helps attackers identify:

- Technology stack
- Potential framework-specific vulnerabilities
- Attack surface information

---

### Impact

An attacker can use this information during reconnaissance to target known Express vulnerabilities.

---

## Finding 2: Permissive CORS Configuration

### Evidence

Response header:

`access-control-allow-origin: *`

---

### Risk

The API accepts requests from any origin.

This increases the possibility of:

- Cross-origin abuse
- Unauthorized API usage
- Browser-based attacks

---

### Impact

Malicious websites may interact with the API depending on authentication design.

---

## Finding 3: Missing Security Headers

### Evidence

Missing headers:

- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

---

### Risk

Missing browser security controls can increase exposure to:

- Clickjacking
- MIME sniffing attacks
- Content injection
- Transport security downgrade

---

## Recommendation

Implement secure Express configuration:

- Disable framework fingerprinting
- Restrict CORS origins
- Add security headers
- Follow secure production defaults

---

## Related Files
- `server/app.js`
- [Response Headers before remediation](./Response_Headers.png)