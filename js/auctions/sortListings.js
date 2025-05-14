import { fetchListings } from "./fetchListings.js";

const sortSelect = document.getElementById("sort-select");

export function initSorting() {
  if (!sortSelect) return;

  sortSelect.addEventListener("change", () => {
    const value = sortSelect.value;
    let sort = "created";
    let sortOrder = "desc";

    if (value === "oldest") {
      sortOrder = "asc";
    }

    fetchListings({ sort, sortOrder });
  });

  // Trigger default sort on page load
  fetchListings({ sort: "created", sortOrder: "desc" });
}