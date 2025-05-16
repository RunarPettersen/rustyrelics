import { apiFetch } from "../utils/apiFetch.js";
import { startCountdown } from "../utils/countdownTimer.js";

export async function loadBids(username) {
  const bidsContainer = document.getElementById("profile-bids");

  try {
    const bids = await apiFetch(`/auction/profiles/${username}/bids?_listings=true`);

    if (!Array.isArray(bids) || bids.length === 0) {
      bidsContainer.innerHTML = `<p class="text-gray-500 text-sm">No bids found.</p>`;
      return;
    }

    bidsContainer.innerHTML = "";

    bids.forEach((bid) => {
      const listing = bid.listing || {};

      const card = document.createElement("a");
      card.href = `/auctions/listing.html?id=${listing.id}`;
      card.className = "block bg-white rounded shadow p-4 hover:shadow-md transition relative";

      const imageWrapper = document.createElement("div");
      imageWrapper.className = "relative";

      const image = document.createElement("img");
      image.src = listing.media?.[0]?.url || "/images/no-image.jpg";
      image.alt = listing.media?.[0]?.alt || listing.title;
      image.className = "w-full h-40 object-cover rounded mb-2";

      // Countdown Badge
      const badge = document.createElement("span");
      badge.className = "absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded";
      imageWrapper.appendChild(image);
      imageWrapper.appendChild(badge);

      // Start Countdown if endsAt is available
      if (listing.endsAt) {
        startCountdown(badge, new Date(listing.endsAt));
      } else {
        badge.textContent = "No end date";
      }

      // Content
      const title = document.createElement("h3");
      title.className = "font-semibold text-lg";
      title.textContent = listing.title;

      const description = document.createElement("p");
      description.className = "text-sm text-gray-600";
      description.textContent = listing.description || "";

      const bidAmount = document.createElement("p");
      bidAmount.className = "text-sm mt-2 font-medium";
      bidAmount.innerHTML = `Your bid: <span class="text-blue-700 font-semibold">${bid.amount}</span>`;

      const placedAt = document.createElement("p");
      placedAt.className = "text-xs text-gray-400";
      placedAt.textContent = `Placed: ${new Date(bid.created).toLocaleString()}`;

      card.append(imageWrapper, title, description, bidAmount, placedAt);
      bidsContainer.appendChild(card);
    });
  } catch (error) {
    bidsContainer.innerHTML = `<p class="text-red-600">Error loading bids: ${error.message}</p>`;
    console.error(error);
  }
}