import { apiFetch } from "../utils/apiFetch.js";
import { getToken, getUsername } from "../utils/auth.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const listingContainer = document.getElementById("listing-details");
const bidForm = document.getElementById("bid-form");
const bidAmount = document.getElementById("bid-amount");
const bidHistory = document.getElementById("bid-history");

async function loadListing() {
  try {
    const data = await apiFetch(`/auction/listings/${id}?_seller=true&_bids=true`);
    displayListing(data);
    displayBids(data.bids || []);
  } catch (error) {
    listingContainer.innerHTML = `<p class="text-red-600">Error loading listing</p>`;
    console.error(error);
  }
}

function displayListing(item) {
  const image = item.media?.[0]?.url || "/images/no-image.jpg";
  const alt = item.media?.[0]?.alt || item.title;

  listingContainer.innerHTML = `
    <div class="bg-white rounded shadow p-6">
      <img src="${image}" alt="${alt}" class="w-full max-h-96 object-cover rounded mb-4" />
      <h1 class="text-2xl font-bold mb-2">${item.title}</h1>
      <p class="mb-4">${item.description || "No description"}</p>
      <p class="text-sm text-gray-500">Ends: ${new Date(item.endsAt).toLocaleString()}</p>
      <p class="text-sm text-gray-500">Seller: ${item.seller?.name || "Unknown"}</p>
      <p class="text-sm text-gray-500">Tags: ${item.tags?.join(", ") || "None"}</p>
    </div>
  `;
}

function displayBids(bids) {
  if (bids.length === 0) {
    bidHistory.innerHTML = `<li class="text-gray-500">No bids yet</li>`;
    return;
  }

  bidHistory.innerHTML = bids
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .map(
      (bid) => `
      <li class="border-b pb-2">
        <p><strong>${bid.bidder.name}</strong> bid <span class="text-green-600">${bid.amount} credits</span></p>
        <p class="text-xs text-gray-500">${new Date(bid.created).toLocaleString()}</p>
      </li>`
    )
    .join("");
}

bidForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = getToken();
  const amount = parseInt(bidAmount.value);

  if (!token) {
    alert("You must be logged in to place a bid.");
    return;
  }

  if (!amount || amount <= 0) {
    alert("Please enter a valid bid amount.");
    return;
  }

  try {
    await apiFetch(`/auction/listings/${id}/bids`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });

    alert("Bid placed successfully!");
    loadListing(); // Refresh bid history
    bidForm.reset();
  } catch (err) {
    console.error(err);
    alert("Failed to place bid.");
  }
});

loadListing();