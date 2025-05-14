import { API_BASE, API_KEY } from "../constants/api.js";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "X-Noroff-API-Key": API_KEY,
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;

  // Show loader if available
  if (typeof window.showLoader === "function") {
    window.showLoader();
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    const json = await response.json();

    if (!response.ok) {
      const message = json.errors?.[0]?.message || response.statusText;
      throw new Error(`API error: ${message}`);
    }

    return json.data;
  } finally {
    if (typeof window.hideLoader === "function") {
      window.hideLoader();
    }
  }
}