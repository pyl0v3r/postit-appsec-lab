# Stored XSS Remediation Report

## Vulnerability

Stored Cross-Site Scripting (XSS)

## OWASP Category

A05 - Injection

## Severity

High

## Affected Component

Comment creation endpoint

```
POST /api/posts/:postId/comments
```

---

## Description

The application allowed users to submit comment content that was stored in the database and later rendered to other users.

An attacker could inject malicious JavaScript into a comment, causing the payload to execute when another user viewed the affected post.

Example payload:

```html
<script>
  fetch('/api/user')
</script>
```

---

## Impact

A successful attack could allow an attacker to:

- Execute JavaScript in another user's browser
- Perform actions using the victim's session
- Modify page content
- Steal sensitive information accessible to the browser
- Perform phishing attacks through trusted content

---

## Root Cause

User-controlled input was stored without proper sanitization.

The application trusted comment content received from the client:

```javascript
const { content } = req.body;

await Comment.create({
  content,
  post: postId,
  author: req.user.userId
});
```

The server did not verify whether the submitted HTML contained unsafe content.

---

# Remediation Implemented

## 1. Input Validation

Comments must contain valid content before processing.

```javascript
if (!content || content.trim().length === 0) {
  return res.status(400).json({
    message: 'Comment content is required'
  });
}
```

This prevents:

- Empty comments
- Whitespace-only input
- Invalid requests

---

## 2. HTML Sanitization

User-generated content is sanitized before storage.

Implementation:

```javascript
const cleanContent = sanitizeHtml(content, {
  allowedTags: [
    'b',
    'i',
    'em',
    'strong',
    'p',
    'br'
  ],
  allowedAttributes: {}
});
```

The sanitizer:

- Removes scripts
- Removes unsafe HTML attributes
- Allows only approved formatting tags

Example:

Before:

```html
<script>alert(1)</script>
Hello
```

After:

```html
Hello
```

---

## 3. Content Length Restriction

A maximum comment length is enforced:

```javascript
if (cleanContent.length > 500) {
  return res.status(400).json({
    message: 'Comment too long'
  });
}
```

This reduces:

- Abuse
- Storage exhaustion
- Extremely large payloads

---

## 4. Store Sanitized Content

Only sanitized content is stored:

```javascript
const comment = await Comment.create({
  content: cleanContent,
  post: postId,
  author: req.user.userId
});
```

The database now contains validated data instead of raw user input.

---

# Security Controls Added

| Control | Purpose |
|---|---|
| Server-side validation | Prevent invalid input |
| HTML sanitization | Remove malicious markup |
| Allowlist approach | Only permit safe HTML |
| Length limits | Prevent abuse |
| Authentication check | Link content to valid users |

---

# Verification

## Before Fix

Payload:

```html
<img src=x onerror=alert(1)>
```

Result:

- Stored successfully
- Executed when viewed

---

## After Fix

Payload:

```html
<img src=x onerror=alert(1)>
```

Result:

- Unsafe attributes removed
- Script execution prevented
### Evidence
[▶ Watch Evidence Video](./Stored_XSS_Remediation.mp4)

---

# Defense-in-Depth Improvements

Additional recommended controls:

- Content Security Policy (CSP)
- Security headers using Helmet
- Frontend output escaping
- Automated XSS testing with OWASP ZAP
- Security regression tests

---

# Status

Fixed

---

# Related Files

- `controllers/commentController.js`
- `THREATMODEL.md`
- `A05_Injection.md`