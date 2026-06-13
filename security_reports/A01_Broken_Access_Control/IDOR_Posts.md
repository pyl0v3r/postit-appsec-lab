### Vulnerability: Insecure Direct Object Reference (IDOR) allows users to modify other user's posts

## Summary
An Insecure Direct Object Reference (IDOR) vulnerability was identified in the post management functionality. Any authenticated user can update or delete posts belonging to other users by modifying the postId parameter in API requests. This allows unauthorized modification or deletion of user-generated content and could lead to content abuse, data integrity issues, and loss of user trust.

## Affected Endpoints: 
```
PUT /api/posts/{postId}
DELETE /api/posts/{postId}
```
```
Authentication: Required
Authorization: Not enforced
```

## Severity and Risk: 
```
Severity: High
OWASP: Broken Access Control (A01:2021)
CWE: CWE-639 (Authorization Bypass Through User-Controlled Key)
```
Justification:
- Exploitable by any authenticated user
- No special privileges required
- Direct impact on integrity of user data
- High likelihood in real-world scenarios

## Steps to Reproduce
- Register and authenticate as User A
- Create a new post and note the returned postId
- Capture a PUT `/api/posts/{postId}` request for updating the post
- Authenticate as User B and obtain a valid JWT
- Replace the Authorization header in the captured request with User B’s JWT
- Send the modified request
- Observe that the post owned by User A is successfully updated by User B

## Impact
An attacker could arbitrarily modify or delete posts belonging to other users. This could be used to deface content, remove legitimate user posts, harass users, or undermine trust in the platform. In a production environment, this could lead to reputational damage and potential compliance concerns depending on the nature of the content.

## Root cause analysis
The application does not perform server-side authorization checks to verify that the authenticated user is the owner of the targeted post. The backend trusts the postId provided in the request without validating the relationship between the requesting user and the resource being accessed.

## Remidiation
Implement server-side authorization checks to ensure that only the owner of a post can update or delete it. Before performing any modification, the application should validate that the author of the post matches the authenticated user’s identity. Consider centralizing authorization logic to avoid similar issues across other endpoints.

## Detection and Monitoring
Log attempts where the authenticated user ID does not match the post owner ID during update or delete operations. Monitor for repeated access attempts across multiple postId values from the same user. Alert on abnormal rates of post modification or deletion.

## Fix Validation:
Object-level authorization is now enforced through a centralized middleware that validates post ownership before any update or delete operation is executed. When an authenticated user attempts to modify or delete a post they do not own, the request is blocked at the authorization layer and a `403 Forbidden` response is returned. Legitimate users are still able to modify or delete their own posts successfully. This approach ensures consistent enforcement of access controls across all post-related endpoints.