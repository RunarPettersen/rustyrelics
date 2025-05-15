import { fetchListings } from "./fetchListings.js";
import { initSorting } from "./sortListings.js";

await window.loaderReady;

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const tagSelect = document.getElementById("tag");
  const filterBtn = document.getElementById("filterBtn");
  const activeToggle = document.getElementById("activeToggle");

  // Apply filter on button click
  filterBtn.addEventListener("click", () => {
    const search = searchInput.value.trim();
    const tag = tagSelect.value;
    const activeOnly = activeToggle.checked;
    fetchListings({ search, tag, page: 1, activeOnly });
  });

  // Apply filter on Enter key
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      filterBtn.click();
    }
  });

  // Apply filter on Enter key for the tag selector
  tagSelect.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      filterBtn.click();
    }
  });

  fetchListings({ activeOnly: activeToggle.checked });
  initSorting();
});