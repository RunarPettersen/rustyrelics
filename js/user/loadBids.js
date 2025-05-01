import { apiFetch } from "../utils/apiFetch.js";

export async function loadBids(username) {
  const bidsContainer = document.getElementById("profile-bids");

  try {
    const bids = await apiFetch(`/auction/profiles/${username}/bids?_listings=true`);

    if (!Array.isArray(bids) || bids.length === 0) {
      bidsContainer.innerHTML = `<p class="text-gray-500 text-sm">No bids found.</p>`;
      return;
    }

    bidsContainer.innerHTML = bids.map(bid => {
      const listing = bid.listing || {};
      return `
        <a href="/auctions/listing.html?id=${listing.id}" class="block bg-white rounded shadow p-4 hover:shadow-md transition">
          <img src="${listing.media?.[0]?.url || "/images/no-image.jpg"}" alt="${listing.media?.[0]?.alt || listing.title}" class="w-full h-40 object-cover rounded mb-2" />
          <h3 class="font-semibold text-lg">${listing.title}</h3>
          <p class="text-sm text-gray-600">${listing.description || ""}</p>
          <p class="text-sm mt-2 font-medium">Your bid: <span class="text-blue-700 font-semibold">${bid.amount}</span></p>
          <p class="text-xs text-gray-400">Placed: ${new Date(bid.created).toLocaleString()}</p>
        </a>
      `;
    }).join("");
  } catch (error) {
    bidsContainer.innerHTML = `<p class="text-red-600">Error loading bids: ${error.message}</p>`;
    console.error(error);
  }
}
