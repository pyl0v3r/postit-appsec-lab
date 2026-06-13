## Stored Cross-Site Scripting (XSS) in Comments, Posts, Updates leads to JWT Token Theft and Account Takeover

### Summary
A stored Cross-Site Scripting (XSS) vulnerability exists in the comments functionality of the application.
User-supplied input is rendered directly in the browser without proper sanitization or encoding.

An attacker can inject malicious JavaScript into a comment, which executes automatically when any user views the affected post. This allows the attacker to access sensitive client-side data such as JWT authentication tokens stored in localStorage, resulting in full account compromise.

### Affected Component

- Feature: Post Comments
- Frontend: React client (dangerouslySetInnerHTML)
- Backend: Comment creation API
- Storage: MongoDB (unsanitized comment content)
- Authentication: JWT stored in browser localStorage

### Steps to reproduce

- Register and log in as a normal user.
- Create or open an existing post.
- Add the following payload as a comment:

```
<img src=x onerror="console.log('Stolen token:', localStorage.getItem('token'))">
```
- Log in as a different user.
- Navigate to the post containing the malicious comment.
- Open the browser developer console.

**Observed Results**
The victim’s JWT token stored in localStorage is printed to the console, demonstrating unauthorized access to authentication credentials.

**Expected Result**  
User-supplied content should be safely rendered without executing arbitrary JavaScript.

### Impact

This vulnerability allows an attacker to execute arbitrary JavaScript in the context of authenticated users.

Potential real-world impacts include:

- Theft of JWT authentication tokens stored in localStorage
- Full account takeover by replaying stolen tokens
- Performing unauthorized actions (create, edit, delete posts/comments)
- Persistent compromise affecting all users who view the malicious content
- Because the payload is stored, the attack executes automatically for every viewer, significantly increasing the blast radius.

**Severity: High**

### Root Cause Analysis

- User-generated comment content is stored without sanitization.
- The frontend renders comment content using dangerouslySetInnerHTML.
- No output encoding or HTML sanitization is applied before rendering.
- JWT tokens are stored in localStorage, making them accessible to injected scripts.

### Recommended Remidiation

#### Short Term Fix
- Sanitize comment content on the server side using a trusted HTML sanitizer (e.g. DOMPurify).
- Avoid rendering raw HTML where possible.

#### Long-Term Improvements
- Store authentication tokens in HTTP-only cookies instead of localStorage.
- Implement a strict Content Security Policy (CSP) to reduce XSS impact.
- Apply centralized input validation and output encoding.
- Avoid use of dangerouslySetInnerHTML unless absolutely required.

### Security Classification
- OWASP Top 10: A05 – Injection (XSS)
- CWE: CWE-79 – Improper Neutralization of Input During Web Page Generation

### Fixed Validation
Attempts to submit malicious HTML payloads result in the content being
fully stripped during server-side sanitization. Requests containing
only disallowed content are rejected with a 400 response and a clear
validation message, preventing storage of unsafe or empty comments.

### Evidence Screenshots
- [Stored XSS Account Takeover](./Stored_XSS_POC_Token_Theft.png)
- [POC XSS](./POC_XSS.png)