import { API_KEY } from "../constants/api.js";

export function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No access token found in localStorage.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
    "Content-Type": "application/json",
  };
}