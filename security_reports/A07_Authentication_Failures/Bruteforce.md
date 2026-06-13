## Lack of Brute-Force Protection on Authentication Endpoint

### Summary 
An authentication weakness was identified in the login functionality where the application does not implement any brute-force protection mechanisms. An attacker can repeatedly attempt login requests with different password combinations without restriction, enabling brute-force or credential stuffing attacks. This could lead to unauthorized account access and compromise of user data.

### Affected Endpoints
```
POST /api/auth/login
```
```
Authentication: Public
Authorization: N/A
Rate Limiting: Not implemented
```

### Severity and Risk
```
Severity: High
OWASP: Identification and Authentication Failures (A07:2021)
CWE: CWE-307 (Improper Restriction of Excessive Authentication Attempts)
```

Justification:
- No limit on authentication attempts
- Exploitable remotely without authentication
- Can lead to full account takeover
- High likelihood when weak or reused passwords exist
- Common real-world attack vector

### Steps to Reproduce

- Identify a valid user email address (e.g., via registration or predictable email format)
- Send repeated POST requests to /api/auth/login with incorrect passwords
- Observe that the application responds consistently with 401 Invalid credentials
- No temporary lockout, CAPTCHA, delay, or IP throttling is triggered
- Continue attempts until the correct password is guessed or found via a password list

### Impact

An attacker could brute-force user passwords or perform credential stuffing attacks using leaked password databases from other breaches. Successful exploitation results in unauthorized access to user accounts, exposure of personal data, and potential further abuse of application functionality. In a production environment, this could lead to widespread account compromise and reputational damage.

### Root Cause Analysis

The authentication system does not enforce any controls to limit repeated failed login attempts. There is no rate limiting, account lockout policy, or monitoring of abnormal authentication behavior. The backend processes every login request equally, regardless of frequency or failure history.

### Remediation

Implement brute-force protection mechanisms such as:

- Rate limiting on authentication endpoints
- Temporary account lockout after multiple failed attempts
- Progressive delays after failed logins
- CAPTCHA enforcement after suspicious activity
- Monitoring and alerting for abnormal login patterns

These controls should be enforced server-side to ensure consistent protection.

### Detection and Monitoring

Log failed login attempts along with IP address and user identifiers. Monitor for excessive authentication failures targeting a single account or originating from a single IP. Generate alerts when thresholds are exceeded to enable rapid response to credential-based attacks.

### Fix Validation

Rate limiting has been implemented on the login endpoint to restrict excessive authentication attempts. When the allowed threshold is exceeded, the server responds with a 429 Too Many Requests error, effectively blocking further attempts for a defined cooldown period. Legitimate users can still authenticate normally, while automated brute-force attacks are prevented.