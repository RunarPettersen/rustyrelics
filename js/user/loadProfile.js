import { apiFetch } from "../utils/apiFetch.js";
import { renderListings } from "./renderListings.js";
import { loadBids } from "./loadBids.js";
import { setupProfileEditing } from "./editProfile.js";

export async function loadProfile(username) {
  const profileHeader = document.getElementById("profile-header");
  const listingsContainer = document.getElementById("profile-listings");
  const winsContainer = document.getElementById("profile-wins");

  try {
    const profile = await apiFetch(`/auction/profiles/${username}?_listings=true&_wins=true`);
    const { name, bio, avatar, banner, credits, listings, wins } = profile;

    // Ensure own listings get a seller field for logic later
    listings.forEach(listing => {
      listing.seller = { name };
    });

    profileHeader.innerHTML = "";

    const card = document.createElement("div");
    card.className = "rounded overflow-hidden shadow";

    const bannerDiv = document.createElement("div");
    bannerDiv.className = "h-48 bg-cover bg-center";
    bannerDiv.style.backgroundImage = `url('${banner?.url || ""}')`;

    const infoWrapper = document.createElement("div");
    infoWrapper.className = "p-4 bg-white";

    const flexContainer = document.createElement("div");
    flexContainer.className = "flex items-center space-x-4";

    const avatarImg = document.createElement("img");
    avatarImg.src = avatar?.url || "/images/default-avatar.png";
    avatarImg.alt = avatar?.alt || name;
    avatarImg.className = "w-20 h-20 rounded-full border-2 border-white -mt-12 bg-white";

    // Info block
    const info = document.createElement("div");

    const nameEl = document.createElement("h1");
    nameEl.className = "text-2xl font-bold";
    nameEl.textContent = name;

    const bioEl = document.createElement("p");
    bioEl.className = "text-sm text-gray-600";
    bioEl.textContent = bio || "No bio yet";

    const creditsEl = document.createElement("p");
    creditsEl.className = "text-sm mt-2 font-medium";
    creditsEl.innerHTML = `Credits: <span class="text-green-700 font-semibold">${credits}</span>`;

    // Append elements
    info.append(nameEl, bioEl, creditsEl);
    flexContainer.append(avatarImg, info);
    infoWrapper.appendChild(flexContainer);
    card.append(bannerDiv, infoWrapper);
    profileHeader.appendChild(card);

    setupProfileEditing(username, profile);
    renderListings(listings, listingsContainer, username);
    renderListings(wins, winsContainer, username);
    await loadBids(username);
  } catch (error) {
    profileHeader.innerHTML = `<p class="text-red-600">Error loading profile: ${error.message}</p>`;
    console.error(error);
  }
}