# PostIt – Application Security Engineering Portfolio Project

## Overview

**PostIt** is a deliberately vulnerable, full-stack MERN web application designed to demonstrate **real-world Application Security (AppSec) engineering skills**.

The project simulates a typical user-generated content platform where users can:
- Register and authenticate
- Create, edit, and delete posts
- Comment on posts
- View public content

The primary goal of this project is **not feature richness**, but to showcase how security is:
- Designed (threat modeling)
- Tested (manual & automated)
- Exploited (to validate risk)
- Fixed (secure coding)
- Detected (logging & monitoring mindset)

This mirrors how AppSec teams operate in modern SaaS and product companies.

---

## Why This Project Exists

Most security portfolios focus on tools or CTF-style challenges.  
This project focuses on **how real production vulnerabilities occur in everyday applications** and how an Application Security Engineer works with developers to reduce risk.

It demonstrates:
- Secure design thinking
- Code-level vulnerability analysis
- Manual testing and validation
- Practical remediation
- Security tooling integration
- Detection and monitoring awareness

---

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js (Express)
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **CI/CD:** GitHub Actions
- **Security Tooling:** Burp Suite, Semgrep, OWASP ZAP

---

## Application Security Focus Areas

This project intentionally includes realistic security flaws commonly seen in production systems, then demonstrates how they are identified and fixed.

## Key Security Areas Covered

- JWT security validation
- NoSQL injection (MongoDB-specific)
- CI/CD security integration

## Security Controls Implemented

### Authentication & Abuse Prevention
- Rate limiting on authentication endpoints (login/register)
- Brute-force protection via request throttling
- Secure logging and detection strategies

### Input Validation & Injection Prevention
- Server-side input validation on all user-controlled fields
- MongoDB query sanitization to prevent NoSQL injection
- Schema-level validation using Mongoose

---

## Threat Modeling

A full threat model is included in [`THREATMODEL.md`](./Threat_Model.md).

The threat model covers:
- System assets and trust boundaries
- STRIDE-based threat analysis
- High-risk abuse cases
- Security assumptions and trade-offs

Threat modeling was performed **before** implementing features to reflect a secure-by-design approach.

---

## Implemented Vulnerabilities (Intentional)

The following vulnerabilities are intentionally present at different stages of the project lifecycle for demonstration and testing purposes:

- Insecure Direct Object References (IDOR)
- Broken authorization checks
- Stored XSS in user-generated content
- NoSQL Injection vulnerabilities
- Missing rate limiting on authentication endpoints
- Weak JWT configuration

Each vulnerability includes:
- Steps to reproduce
- Impact assessment
- Root cause analysis
- Secure remediation
- Detection and logging considerations

---

## Security Findings Summary

| Finding | OWASP Category | Severity | Status |
|---|---|---|---|
| IDOR in post access | A01 Broken Access Control | High | Fixed |
| IDOR in comments | A01 Broken Access Control | High | Fixed |
| Stored XSS | A05 Injection | High | Fixed |
| NoSQL Injection | A05 Injection | High | Fixed |
| JWT Weak Configuration | A07 Authentication | Medium | Fixed |
| Brute Force Risk | A07 Authentication | Medium | Fixed |
| Insufficient Logging | A09 Logging | Medium | Fixed |

## Security Testing Approach

### Manual Testing
- Burp Suite used to intercept, modify, and replay requests
- Manual validation of authorization logic and abuse cases
- HTTP-level analysis of authentication flows

### Automated Testing
- SAST using Semgrep
- DAST using OWASP ZAP
- CI/CD integration with GitHub Actions
- False-positive triage and risk-based prioritization

---

## Secure Remediation

For each identified issue, the project demonstrates:
- Secure coding fixes
- Defense-in-depth controls
- Trade-offs between usability and security
- Developer-friendly remediation guidance

---

## Logging & Detection

The project also focuses on **detectability**, not just prevention.

For each major vulnerability, the project documents:
- Relevant application logs
- Indicators of abuse
- Sample detection logic (SIEM-style thinking)
- Alerting considerations

---

## Who This Project Is For

This project is intended to demonstrate readiness for roles such as:
- Application Security Engineer
- Product Security Engineer
- Secure Software Engineer
- DevSecOps Engineer

It is especially relevant for teams building modern web applications and APIs.

---

## About Me

I am a software engineer with several years of industry experience who transitioned into cybersecurity, with a focus on **application security and secure software design**.

This project represents how I approach security problems:
- Understand the system
- Anticipate abuse
- Validate risk through testing
- Fix issues pragmatically
- Improve long-term security posture

---

## Disclaimer

This application is intentionally vulnerable and **must not be deployed to production environments**.  
It exists solely for educational and demonstration purposes.

---

## Contact

If you’d like to discuss this project or application security in general, feel free to reach out via GitHub or LinkedIn.
