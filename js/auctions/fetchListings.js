import { API_BASE } from "../constants/api.js";
import { displayListings } from "./displayListings.js";
import { displayPagination } from "./displayPagination.js";

const listingsContainer = document.getElementById("listings");

const LIMIT = 24;
let currentPage = 1;
let totalPages = 1;
let lastSearch = "";
let lastTag = "";
let lastActiveOnly = true;

function buildEndpoint({ search, tag, page, activeOnly, sort, sortOrder }) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: LIMIT.toString(),
    _seller: "true",
  });

  if (activeOnly) {
    params.append("_active", "true");
  }

  if (sort) {
    params.append("sort", sort);
    params.append("sortOrder", sortOrder || "desc");
  }

  if (search) {
    params.append("q", search);
    return `/auction/listings/search?${params.toString()}`;
  }

  if (tag) {
    params.append("_tag", tag);
  }

  return `/auction/listings?${params.toString()}`;
}

export async function fetchListings({
  search = "",
  tag = "",
  page = 1,
  activeOnly = true,
  sort = "created",
  sortOrder = "desc",
} = {}) {
  window.showLoader?.();

  try {
    listingsContainer.innerHTML = `<p>Loading...</p>`;

    lastSearch = search;
    lastTag = tag;
    lastActiveOnly = activeOnly;
    currentPage = page;

    const endpoint = buildEndpoint({ search, tag, page, activeOnly, sort, sortOrder });
    const response = await fetch(`${API_BASE}${endpoint}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || "Failed to fetch listings.");
    }

    totalPages = result.meta.pageCount || 1;

    displayListings(result.data);
    displayPagination({ currentPage, totalPages, lastSearch, lastTag, lastActiveOnly });
  } catch (error) {
    listingsContainer.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
    console.error(error);
  } finally {
    window.hideLoader?.();
  }
}