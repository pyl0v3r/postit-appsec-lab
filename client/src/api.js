const API_BASE = 'http://127.0.0.1:5000/api';

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return res.json();
}

export async function createPost(data, token) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
const postRes = await res.json();
  if (res.status === 201) {
    return { success: true, message: postRes.message || 'Post added successfully' };
  } else {
    return { success: false, message: postRes.message };
  }
}

export async function updatePost(postId, data, token) {
  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const postRes = await res.json();
  if (res.status === 200) {
    return { success: true, message: postRes.message || 'Post updated successfully' };
  } else {
    return { success: false, message: postRes.message };
  }
}

export async function deletePost(postId, token) {
  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const postRes = await res.json();
  if (res.status === 200) {
    return { success: true, message: postRes.message || 'Post deleted successfully' };
  } else {
    return { success: false, message: postRes.message };
  }
}

export async function createComment(postId, content, token) {
  const res = await fetch(`${API_BASE}/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  });
  const commentRes = await res.json();
  if (res.status === 201) {
    return { success: true, message: commentRes.message || 'Comment added successfully' };
  } else {
    return { success: false, message: commentRes.message };
  }
}

export async function deleteComment(commentId, token) {
  const res = await fetch(`${API_BASE}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const commentRes = await res.json();
  if (res.status === 200) {
    return { success: true, message: commentRes.message || 'Comment deleted successfully' };
  } else {
    return { success: false, message: commentRes.message };
  }
}
