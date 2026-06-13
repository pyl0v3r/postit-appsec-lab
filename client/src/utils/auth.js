export async function getUserFromToken(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    payload.user = await fetchUser(payload.userId);
    return payload; // contains userId, email, etc.
  } catch {
    return null;
  }
}
const API_BASE = 'http://127.0.0.1:5000/api';

export async function fetchUser(userId) {
  const res = await fetch(`${API_BASE}/auth/${userId}`);
  return res.json();
}