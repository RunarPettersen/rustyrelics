import { apiFetch } from "../utils/apiFetch.js";
import { getToken, getUsername } from "../utils/auth.js";
import { renderListing } from "./renderListing.js";
import { renderBids } from "./renderBids.js";
import { handleBidForm } from "./handleBidForm.js";

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
  } catch (error) {
    listingContainer.textContent = "Error loading listing.";
    console.error(error);
  }
}

handleBidForm(bidForm, bidAmount, token, id, loadListing);
loadListing();