# Broken Access Control (IDOR) Remediation – Posts & Comments

## OWASP Category
A01 – Broken Access Control

---

## Severity
High

---

## Overview

Object-level authorization has been implemented to prevent unauthorized modification or deletion of user-generated content.

Previously, users could potentially access or modify resources (posts and comments) that they did not own due to missing ownership validation.

This vulnerability has now been remediated by enforcing centralized authorization middleware that validates resource ownership before performing any sensitive operation.

---

## Affected Endpoints

### Posts
- `PUT /api/posts/:postId`
- `DELETE /api/posts/:postId`

### Comments
- `PUT /api/comments/:commentId`
- `DELETE /api/comments/:commentId`

---

## Threat Scenario

Before remediation, an authenticated user could:

- Modify another user's post or comment
- Delete content they do not own
- Exploit predictable resource IDs (IDOR)
- Bypass UI restrictions by directly calling APIs

### Impact

- Unauthorized data modification
- Data integrity loss
- Privilege abuse between users
- Trust breakdown in user-generated content system

---

## Root Cause

- Missing object-level authorization checks
- Reliance only on authentication (JWT) without ownership validation
- No centralized access control middleware

---

## Remediation Implemented

### 1. Centralized Post Ownership Middleware

Ownership is validated before allowing post modifications:

```js
const Post = require('../models/Post');

module.exports = async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.author.toString() !== req.user.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  req.post = post;
  next();
};
```
---
### 2. Centralized Comment Ownership Middleware

A similar authorization layer is applied to comments:

```js
const Comment = require('../models/Comment');

module.exports = async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  if (comment.author.toString() !== req.user.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  req.comment = comment;
  next();
};
```
--- 
### 3. Enforcement Strategy
 -Middleware is applied to all sensitive routes
- Ownership validation happens before controller logic
- Unauthorized access is blocked early in the request lifecycle
---
### Security Improvements
- Enforced object-level authorization (OLA)
- Eliminated IDOR vulnerabilities
- Centralized access control logic
- Reduced duplication of authorization checks
- Improved maintainability and consistency
---
### Before vs After
#### Before
- Authentication only (JWT-based)
- No ownership validation
- Direct object access possible via API calls

#### After
- Ownership verified for every sensitive operation
- Unauthorized requests blocked with 403 Forbidden
- Consistent enforcement across posts and comments
- Defense-in-Depth Enhancements
---
### Recommended additional improvements:

- Role-Based Access Control (RBAC)
- Policy-based authorization layer (e.g., CASL-style)
- Audit logging for unauthorized access attempts
- Rate limiting on sensitive endpoints
- Centralized authorization service layer
---
### Related Files
- `middleware/postOwnership.js`
- `middleware/commentOwnership.js`
- `controllers/postController.js`
- `controllers/commentController.js`
- `THREATMODEL.md`