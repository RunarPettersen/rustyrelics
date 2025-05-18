import { apiFetch } from "../utils/apiFetch.js";
import { getToken, getUsername } from "../utils/auth.js";
import { renderListing } from "./renderListing.js";
import { renderBids } from "./renderBids.js";
import { handleBidForm } from "./handleBidForm.js";
import { startCountdown } from "../utils/countdownTimer.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const listingContainer = document.getElementById("listing-details");
const bidForm = document.getElementById("bid-form");
const bidAmount = document.getElementById("bid-amount");
const bidHistory = document.getElementById("bid-history");

const username = getUsername();
const token = getToken();

async function loadListing() {
  try {
    const data = await apiFetch(`/auction/listings/${id}?_seller=true&_bids=true`);
    
    document.title = `${data.title} | Rusty Relics`;
    renderListing(data, listingContainer, username);
    renderBids(data.bids || [], bidHistory, bidAmount);

    // Disable the form if you are the seller
    if (data.seller.name === username) {
      bidForm.innerHTML = `<p class="text-red-800">You cannot bid on your own listing.</p>`;
      bidForm.classList.add("opacity-90", "pointer-events-none");
    } else {
      // If not the seller, start countdown
      const countdownBadge = document.createElement("span");
      countdownBadge.className =
        "absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded";
      
      document.querySelector(".listing-image-wrapper")?.appendChild(countdownBadge);

      if (data.endsAt) {
        startCountdown(new Date(data.endsAt), countdownBadge);
      }
    }
  } catch (error) {
    listingContainer.textContent = "Error loading listing.";
    console.error(error);
  }
}

handleBidForm(bidForm, bidAmount, token, id, loadListing);
loadListing();
