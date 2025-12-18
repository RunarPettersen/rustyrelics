import { fetchListings } from "./fetchListings.js";

/**
 * Renders pagination controls and wires up page navigation.
 *
 * - Disables Previous on the first page and Next on the last page
 * - Calls fetchListings with the latest search/tag/filter state
 *
 * @param {Object} params
 * @param {number} params.currentPage - The current page number (1-based).
 * @param {number} params.totalPages - Total number of pages available.
 * @param {string} [params.lastSearch] - The last search query used (if any).
 * @param {string} [params.lastTag] - The last tag filter used (if any).
 * @param {boolean} [params.lastActiveOnly] - Whether "active only" filter is enabled.
 * @returns {void}
 */
export function displayPagination({
  currentPage,
  totalPages,
  lastSearch,
  lastTag,
  lastActiveOnly,
}) {
  /** @type {HTMLElement|null} */
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  pagination.innerHTML = "";
  if (totalPages <= 1) return;

  const baseBtn =
    "px-4 py-2 rounded text-white transition cursor-pointer bg-rust-500 hover:bg-rust-600";
  const disabledBtn =
    "px-4 py-2 rounded text-white opacity-50 cursor-not-allowed bg-rust-500";

  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  const prevBtn = `
    <button
      class="${prevDisabled ? disabledBtn : baseBtn}"
      ${prevDisabled ? "disabled aria-disabled='true'" : ""}
      ${prevDisabled ? "" : `data-page="${currentPage - 1}"`}
      type="button"
    >
      Previous
    </button>`;

  const nextBtn = `
    <button
      class="${nextDisabled ? disabledBtn : baseBtn}"
      ${nextDisabled ? "disabled aria-disabled='true'" : ""}
      ${nextDisabled ? "" : `data-page="${currentPage + 1}"`}
      type="button"
    >
      Next
    </button>`;

  pagination.innerHTML = `
    ${prevBtn}
    <span class="px-4 py-2 font-medium">Page ${currentPage} of ${totalPages}</span>
    ${nextBtn}
  `;

  pagination.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = Number(btn.getAttribute("data-page"));
      if (!Number.isFinite(page)) return;

      fetchListings({
        search: lastSearch,
        tag: lastTag,
        page,
        activeOnly: lastActiveOnly,
      });
    });
  });
}