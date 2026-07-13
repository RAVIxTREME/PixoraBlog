const BASE_URL = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Something went wrong");
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  register: (email, password) =>
    request("/register/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (username, password) =>
    request("/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: () => request("/logout/", { method: "POST" }),

  getMe: () => request("/me/"),

  setUsername: (username) =>
    request("/set-username/", {
      method: "POST",
      body: JSON.stringify({ username }),
    }),

  saveLocation: (lat, lng, city) =>
    request("/save-location/", {
      method: "POST",
      body: JSON.stringify({ lat, lng, city }),
    }),

  getPeopleSuggestions: () => request("/people-suggestions/"),

  // ... baaki sab same rakho (getPosts, createPost, etc.)

  logout: () => request("/logout/", { method: "POST" }),

  getMe: () => request("/me/"),

  getPosts: () => request("/posts/"),

  getHomeFeed: () => request("/home/"),

  getPost: (id) => request(`/posts/${id}/`),

  createPost: (formData) =>
    request("/posts/", { method: "POST", body: formData }),

  deletePost: (id) => request(`/posts/${id}/`, { method: "DELETE" }),

  toggleLike: (postId) => request(`/posts/${postId}/like/`, { method: "POST" }),

  addComment: (postId, text) =>
    request(`/posts/${postId}/comment/`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  deleteComment: (id) => request(`/comments/${id}/`, { method: "DELETE" }),

  getProfile: (username) => request(`/profile/${username}/`),

  toggleFollow: (username) =>
    request(`/profile/${username}/follow/`, { method: "POST" }),
};
