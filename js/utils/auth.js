// Get the current user's name
export function getUsername() {
  return localStorage.getItem("username");
}

// Get the stored access token
export function getToken() {
  return localStorage.getItem("accessToken");
}

// Store login credentials
export function saveAuth({ accessToken, name }) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("username", name);
}

// Clear credentials (for logout)
export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
}
