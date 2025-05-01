import { apiFetch } from "../utils/apiFetch.js";
import { renderListings } from "./renderListings.js";
import { loadBids } from "./loadBids.js";

export async function loadProfile(username) {
  const profileHeader = document.getElementById("profile-header");
  const listingsContainer = document.getElementById("profile-listings");
  const winsContainer = document.getElementById("profile-wins");

  try {
    const profile = await apiFetch(`/auction/profiles/${username}?_listings=true&_wins=true`);
    const { name, bio, avatar, banner, credits, listings, wins } = profile;

    profileHeader.innerHTML = `
      <div class="rounded overflow-hidden shadow">
        <div class="h-48 bg-cover bg-center" style="background-image: url('${banner?.url || ""}')"></div>
        <div class="p-4 bg-white">
          <div class="flex items-center space-x-4">
            <img src="${avatar?.url || "/images/default-avatar.jpg"}" alt="${avatar?.alt || name}" class="w-20 h-20 rounded-full border-2 border-white -mt-12 bg-white" />
            <div>
              <h1 class="text-2xl font-bold">${name}</h1>
              <p class="text-sm text-gray-600">${bio || "No bio yet"}</p>
              <p class="text-sm mt-2 font-medium">Credits: <span class="text-green-700 font-semibold">${credits}</span></p>
            </div>
          </div>
        </div>
      </div>
    `;

    renderListings(listings, listingsContainer);
    renderListings(wins, winsContainer);
    await loadBids(username);
  } catch (error) {
    profileHeader.innerHTML = `<p class="text-red-600">Error loading profile: ${error.message}</p>`;
    console.error(error);
  }
}
