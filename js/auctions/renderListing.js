import { setupLightbox } from "../utils/lightbox.js";
import { startCountdown } from "../utils/countdownTimer.js";

export function renderListing(item, container) {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "bg-white rounded shadow p-6";

  // MEDIA SECTION
  const mediaWrapper = document.createElement("div");
  mediaWrapper.className = "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4";

  if (Array.isArray(item.media) && item.media.length > 0) {
    item.media.forEach((media, index) => {
      const imageContainer = document.createElement("div");
      imageContainer.className = "relative";

      const img = document.createElement("img");
      img.src = media.url;
      img.alt = media.alt || item.title;
      img.className = "w-full max-h-96 object-cover rounded cursor-zoom-in";
      imageContainer.appendChild(img);

      if (index === 0 && item.endsAt) {

  const badge = document.createElement("span");
  badge.className =
    "absolute top-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded text-center min-w-[60px]";
  badge.textContent = "Loading...";

  const endDate = new Date(item.endsAt);

  if (!isNaN(endDate.getTime())) {
    startCountdown(badge, endDate);
  } else {
    console.error("Invalid end date. Cannot start countdown.");
    badge.textContent = "Invalid Date";
  }

  imageContainer.appendChild(badge);
}

      mediaWrapper.appendChild(imageContainer);
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

  container.appendChild(wrapper);

  // Enable lightbox on images
  const images = wrapper.querySelectorAll("img");
  setupLightbox(images);
}
