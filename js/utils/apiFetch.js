import { API_BASE, API_KEY } from "../constants/api.js";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No access token found. User might not be logged in.");
  }

  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
    "Content-Type": "application/json",
  };

  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    const message = json.errors?.[0]?.message || response.statusText;
    throw new Error(`API error: ${message}`);
  }

  return json.data; // ✅ Return only the data part
}