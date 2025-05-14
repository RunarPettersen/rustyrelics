import { apiFetch } from "../utils/apiFetch.js";
import { buildTextFields } from "./buildTextFields.js";
import { buildMediaFields } from "./buildMediaFields.js";
import { handleFormSubmit } from "./handleFormSubmit.js";

const form = document.getElementById("edit-form");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

async function loadListingForEdit() {
  try {
    const listing = await apiFetch(`/auction/listings/${id}`);
    form.innerHTML = "";

    buildTextFields(form, listing);
    buildMediaFields(form, listing.media);
    handleFormSubmit(form, id);
  } catch (err) {
    form.innerHTML = `<p class="text-red-600">Error loading listing for edit.</p>`;
    console.error(err);
  }
}

loadListingForEdit();