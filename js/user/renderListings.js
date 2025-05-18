import { apiFetch } from "../utils/apiFetch.js";
import { startCountdown } from "../utils/countdownTimer.js";

export function renderListings(items = [], container, currentUsername) {
  if (!items.length) {
    container.innerHTML = `<p class="text-gray-500 text-sm">No items found.</p>`;
    return;
  }

  container.innerHTML = "";

  const modal = document.getElementById("confirm-modal");
  const confirmBtn = document.getElementById("confirm-delete");
  const cancelBtn = document.getElementById("cancel-delete");

  let pendingDeleteCard = null;
  let pendingItemId = null;

  cancelBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    pendingDeleteCard = null;
    pendingItemId = null;
  });

  confirmBtn?.addEventListener("click", async () => {
    if (!pendingItemId || !pendingDeleteCard) return;

    try {
      await apiFetch(`/auction/listings/${pendingItemId}`, { method: "DELETE" });
      pendingDeleteCard.remove();
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }

    modal.classList.add("hidden");
    pendingDeleteCard = null;
    pendingItemId = null;
  });

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded shadow p-4 hover:shadow-md transition relative";

    const link = document.createElement("a");
    link.href = `/auctions/listing.html?id=${item.id}`;
    link.className = "block mb-2";

    // Image wrapper to contain the badge
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "relative";

    const image = document.createElement("img");
    image.src = item.media?.[0]?.url || "/images/no-image.jpg";
    image.alt = item.media?.[0]?.alt || item.title;
    image.className = "w-full h-40 object-cover rounded mb-2";

    const badge = document.createElement("span");
    badge.className = "absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded";
    imageWrapper.appendChild(image);
    imageWrapper.appendChild(badge);

    // Start Countdown if endsAt is available
    if (item.endsAt) {
      startCountdown(badge, new Date(item.endsAt));
    } else {
      badge.textContent = "No end date";
    }

    // Add image wrapper to the link
    link.append(imageWrapper);

    const title = document.createElement("h3");
    title.className = "font-semibold text-lg";
    title.textContent = item.title;

    const description = document.createElement("p");
    description.className = "text-sm text-gray-600";
    description.textContent = item.description || "";

    link.append(title, description);
    card.appendChild(link);

    if (item.seller?.name === currentUsername) {
      const actions = document.createElement("div");
      actions.className = "flex gap-2 mt-2";

      const editBtn = document.createElement("a");
      editBtn.href = `/auctions/edit.html?id=${item.id}`;
      editBtn.className = "text-sm bg-rust-500 text-white px-3 py-1 rounded hover:bg-rust-600";
      editBtn.textContent = "Edit";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer";
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", () => {
        pendingDeleteCard = card;
        pendingItemId = item.id;
        modal.classList.remove("hidden");
      });

      actions.append(editBtn, deleteBtn);
      card.appendChild(actions);
    }

    container.appendChild(card);
  });
}