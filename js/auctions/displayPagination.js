import { fetchListings } from "./fetchListings.js";

export function displayPagination({ currentPage, totalPages, lastSearch, lastTag, lastActiveOnly }) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  const prevBtn = `<button class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" ${currentPage === 1 ? "disabled" : ""}
    data-page="${currentPage - 1}">Previous</button>`;

  const nextBtn = `<button class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" ${currentPage === totalPages ? "disabled" : ""}
    data-page="${currentPage + 1}">Next</button>`;

  pagination.innerHTML =
    prevBtn + `<span class="px-4 py-2 font-medium">Page ${currentPage} of ${totalPages}</span>` + nextBtn;

  pagination.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.getAttribute("data-page"));
      fetchListings({
        search: lastSearch,
        tag: lastTag,
        page,
        activeOnly: lastActiveOnly,
      });
    });
  });
}