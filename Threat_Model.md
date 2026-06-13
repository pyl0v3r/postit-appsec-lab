# Threat Model – PostIt Application

## 1. Overview

**PostIt** is a web-based user-generated content application that allows users to:
- Register and authenticate
- Create, edit, and delete posts
- Comment on posts
- View public posts and comments

The application is built using the **MERN stack**:
- Frontend: React
- Backend: Node.js (Express)
- Database: MongoDB
- Authentication: JWT-based authentication

This threat model identifies potential security threats to the application, evaluates risk using the STRIDE methodology, and highlights high-risk areas that require security controls.

---

## 2. Security Goals

The primary security goals of the application are:

- Prevent unauthorized access to user accounts
- Ensure users can only modify their own posts and comments
- Protect user-generated content from tampering
- Prevent common web application attacks (OWASP Top 10)
- Ensure abuse and malicious activity can be detected via logs

---

## 3. Assets

| Asset | Description | Impact if Compromised |
|-----|------------|-----------------------|
| User credentials | Email & password | Account takeover |
| JWT tokens | Session authentication tokens | Privilege abuse |
| Posts | User-created content | Data integrity loss |
| Comments | User-generated content | Stored XSS / abuse |
| User IDs | MongoDB ObjectIds | IDOR attacks |
| API endpoints | REST APIs | Abuse & automation |
| MongoDB database | Persistent data storage | Data exfiltration |

---

## 4. Actors

### Legitimate Actors
- Unauthenticated user
- Authenticated user
- Post owner
- Comment owner

### Malicious Actors
- External attacker (no account)
- Authenticated attacker (low-privilege user)
- Automated bot

---

## 5. Architecture and Data Flow

```text
+-------------+
|  Attacker   |
+-------------+
       |
       v
+----------------+
| React Frontend |
| Untrusted Data |
+----------------+
       |
       | HTTPS / JWT
       v
+----------------+
|  Express API   |
| AuthZ Checks   |
| Validation     |
+----------------+
       |
       | Mongoose
       v
+----------------+
|   MongoDB      |
|  User Data     |
+----------------+ 
```

---


## 6. Trust Boundaries

Trust boundaries indicate where security checks are required:

1. **Client → API**
   - All user input must be validated and authorized
2. **API → Database**
   - Queries must be protected against NoSQL injection
3. **Authentication → Authorization**
   - JWT authentication does not imply authorization
   - Ownership checks must be enforced server-side

---

## 7. Entry Points

### API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/posts`
- `PUT /api/posts/:postId`
- `DELETE /api/posts/:postId`
- `POST /api/posts/:postId/comments`
- `DELETE /api/comments/:commentId`

### Attacker-Controlled Inputs
- Request body (JSON)
- URL parameters (`postId`, `commentId`)
- HTTP headers (`Authorization`)
- Query parameters

---

## 8. STRIDE Threat Analysis

### 8.1 Authentication

| STRIDE | Threat |
|------|-------|
| Spoofing | Credential stuffing, JWT theft |
| Tampering | JWT payload manipulation |
| Repudiation | No logging of failed login attempts |
| Information Disclosure | Verbose authentication errors |
| Denial of Service | Brute-force login attempts |
| Elevation of Privilege | Weak JWT secret |

---

### 8.2 Posts Management

| STRIDE | Threat |
|------|-------|
| Spoofing | Use of stolen JWT tokens |
| Tampering | NoSQL injection in Mongo queries |
| Repudiation | No audit logs for post deletion |
| Information Disclosure | Unauthorized access to other users’ posts |
| Denial of Service | Mass post creation |
| Elevation of Privilege | IDOR allowing modification of others’ posts |

---

### 8.3 Comments

| STRIDE | Threat |
|------|-------|
| Spoofing | Impersonation using stolen tokens |
| Tampering | Stored XSS via comment content |
| Repudiation | No logging for comment edits |
| Information Disclosure | Comment enumeration |
| Denial of Service | Comment spam |
| Elevation of Privilege | Deleting others’ comments |

---

## 9. Threat -> Control Mapping
### Security Controls Mapping

| Threat | Security Control |
|---|---|
| IDOR | Server-side ownership checks |
| XSS | Output encoding + sanitization |
| NoSQL Injection | Query validation |
| Brute Force | Rate limiting + monitoring |
| JWT Abuse | Secure token validation |
| Abuse | Logging + detection |

---
## 10. High-Risk Threats (Prioritized)

The following threats are considered **high risk** and are intentionally included in the application for security testing and remediation:

1. Insecure Direct Object Reference (IDOR)
2. Broken authorization checks
3. Stored Cross-Site Scripting (XSS)
4. NoSQL Injection
5. Missing rate limiting
6. JWT misconfiguration

---

## 11. Security Assumptions

- The application is served over HTTPS
- MongoDB is not directly exposed to the internet
- JWT tokens are stored securely on the client
- No admin functionality is included in scope

---

## 12. Out of Scope

- Image uploads
- Admin panel
- Notifications
- Third-party integrations
- Infrastructure-level security

---

## 13. Future Improvements

- Role-based access control (RBAC)
- Centralized logging and alerting
- Web Application Firewall (WAF)
- CSP and advanced browser security headers
- Security monitoring dashboards

---

## 14. Conclusion

This threat model highlights common and realistic attack scenarios affecting modern MERN-based applications. The identified threats align with real-world vulnerabilities observed in production environments and serve as the foundation for secure design, testing, and remediation activities.
