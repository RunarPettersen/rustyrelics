import { apiFetch } from "../utils/apiFetch.js";
import { setupLightbox } from "../utils/lightbox.js";

export function renderListing(item, container, username) {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "bg-white rounded shadow p-6";

  // MEDIA SECTION
  const mediaWrapper = document.createElement("div");
  mediaWrapper.className = "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4";

  if (Array.isArray(item.media) && item.media.length > 0) {
    item.media.forEach((media) => {
      const img = document.createElement("img");
      img.src = media.url;
      img.alt = media.alt || item.title;
      img.className = "w-full max-h-96 object-cover rounded cursor-zoom-in";
      mediaWrapper.appendChild(img);
    });
  } else {
    const fallback = document.createElement("img");
    fallback.src = "/images/no-image.jpg";
    fallback.alt = item.title;
    fallback.className = "w-full max-h-96 object-cover rounded";
    mediaWrapper.appendChild(fallback);
  }

  wrapper.appendChild(mediaWrapper);

  // TEXT INFO
  const title = document.createElement("h1");
  title.className = "text-2xl font-bold mb-2";
  title.textContent = item.title;

  const desc = document.createElement("p");
  desc.className = "mb-4";
  desc.textContent = item.description || "No description";

  const ends = document.createElement("p");
  ends.className = "text-sm text-gray-500";
  ends.textContent = `Ends: ${new Date(item.endsAt).toLocaleString()}`;

  const seller = document.createElement("p");
  seller.className = "text-sm text-gray-500";
  seller.textContent = `Seller: ${item.seller?.name || "Unknown"}`;

  const tags = document.createElement("p");
  tags.className = "text-sm text-gray-500";
  tags.textContent = `Tags: ${item.tags?.join(", ") || "None"}`;

  wrapper.append(title, desc, ends, seller, tags);

  // ACTIONS (Edit/Delete)
  if (item.seller?.name === username) {
    const actions = document.createElement("div");
    actions.className = "mt-4 flex gap-4";

    const editLink = document.createElement("a");
    editLink.href = `/auctions/edit.html?id=${item.id}`;
    editLink.className = "bg-gold-500 text-white px-4 py-2 rounded hover:bg-gold-600";
    editLink.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      const modal = document.getElementById("confirm-modal");
      modal.classList.remove("hidden", "opacity-0");
      modal.classList.add("flex");

      const confirmBtn = document.getElementById("confirm-delete");
      const cancelBtn = document.getElementById("cancel-delete");

      cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      });

      confirmBtn.addEventListener("click", async () => {
        try {
          await apiFetch(`/auction/listings/${item.id}`, { method: "DELETE" });
          container.innerHTML = `<p class="bg-green-100 text-green-800 p-4 rounded shadow">Listing deleted. Redirecting to listings...</p>`;
          modal.classList.add("hidden");
          setTimeout(() => {
            window.location.href = "./auctions/index.html";
          }, 2000);
        } catch (err) {
          console.error(err);
          alert("Failed to delete listing.");
        }
      });
    });

    actions.append(editLink, deleteBtn);
    wrapper.appendChild(actions);
  }

  container.appendChild(wrapper);

  // Enable lightbox on images
  const images = wrapper.querySelectorAll("img");
  setupLightbox(images);
}
