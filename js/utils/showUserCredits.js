import { API_BASE, API_KEY } from "../constants/api.js";
import { getToken, getUsername } from "./auth.js";

export async function showUserCredits() {
  const desktopEl = document.getElementById("user-info");
  const mobileEl = document.getElementById("user-credits-mobile");

  const token = getToken();
  const username = getUsername();

  if (!desktopEl && !mobileEl) return;

  if (token && username) {
    try {
      const res = await fetch(`${API_BASE}/auction/profiles/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      const { data } = await res.json();
      const html = `Credits: <span class="text-green-600 font-semibold">${data.credits}</span>`;

      // Mobile
      if (mobileEl) {
        mobileEl.innerHTML = html;
      }

      // Desktop with avatar
      if (desktopEl) {
        desktopEl.innerHTML = "";

        const credits = document.createElement("span");
        credits.innerHTML = html;

        const avatar = document.createElement("img");
        avatar.src = data.avatar?.url || "/images/default-avatar.jpg";
        avatar.alt = data.avatar?.alt || username;
        avatar.className = "w-8 h-8 rounded-full border-2 border-white";

        desktopEl.append(credits, avatar);
      }
    } catch (err) {
      console.error("Failed to load credits", err);
      const fallback = `<a href="/user/login.html" class="text-antique underline hover:text-gold-500 transition">Sign in</a>`;

      if (mobileEl) mobileEl.innerHTML = fallback;
      if (desktopEl) desktopEl.innerHTML = fallback;
    }
  } else {
    const fallback = `<a href="/user/login.html" class="text-antique underline hover:text-gold-500 transition">Sign in</a>`;
    if (mobileEl) mobileEl.innerHTML = fallback;
    if (desktopEl) desktopEl.innerHTML = fallback;
  }
}
