import { setupLightbox } from "../utils/lightbox.js";
import { startCountdown } from "../utils/countdownTimer.js";

/**
 * Renders a single listing with a main image + thumbnails gallery.
 * @param {object} item
 * @param {HTMLElement} container
 */
export function renderListing(item, container) {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "bg-white rounded shadow p-6";

  // LAYOUT: gallery left, text right (stack on mobile)
  const layout = document.createElement("div");
  layout.className = "grid grid-cols-1 lg:grid-cols-2 gap-6";

  // -------- MEDIA / GALLERY --------
  const gallery = document.createElement("div");
  gallery.className = "space-y-3";

  /** @type {{url: string, alt?: string}[]} */
  const mediaList = Array.isArray(item.media)
    ? item.media
        .map((m) => ({
          url: String(m?.url || "").trim(),
          alt: String(m?.alt || "").trim(),
        }))
        .filter((m) => m.url)
    : [];

  const fallbackUrl = "/images/no-image.jpg";
  const hasMedia = mediaList.length > 0;

  const main = document.createElement("div");
  main.className =
    "relative overflow-hidden rounded border border-gray-200 bg-gray-50";

  const mainImg = document.createElement("img");
  mainImg.className =
    "w-full max-h-[520px] object-cover cursor-zoom-in";

  // Main image initial
  const first = hasMedia ? mediaList[0] : { url: fallbackUrl, alt: "" };
  mainImg.src = first.url;
  mainImg.alt = first.alt || item.title || "Listing image";

  main.appendChild(mainImg);

  // Countdown badge (always on main image)
  if (item.endsAt) {
    const badge = document.createElement("span");
    badge.className =
      "absolute top-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded text-center min-w-[60px]";
    badge.textContent = "Loading...";

    const endDate = new Date(item.endsAt);
    if (!Number.isNaN(endDate.getTime())) {
      startCountdown(badge, endDate);
    } else {
      console.error("Invalid end date. Cannot start countdown.");
      badge.textContent = "Invalid Date";
    }

    main.appendChild(badge);
  }

  gallery.appendChild(main);

  // Thumbnails (skip if only 0/1 image)
  if (mediaList.length > 1) {
    const thumbsWrap = document.createElement("div");
    thumbsWrap.className =
      "grid grid-cols-4 sm:grid-cols-6 gap-2";

    mediaList.slice(0).forEach((m, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "group rounded overflow-hidden border border-gray-200 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer";

      btn.setAttribute("aria-label", `View image ${index + 1}`);

      const tImg = document.createElement("img");
      tImg.src = m.url;
      tImg.alt = m.alt || item.title || "Listing thumbnail";
      tImg.className =
        "h-16 w-full object-cover group-hover:opacity-90";

      // Mark first as "active" visually
      if (index === 0) {
        btn.classList.add("ring-2", "ring-black");
      }

      btn.appendChild(tImg);

      btn.addEventListener("click", () => {
        // update main
        mainImg.src = m.url;
        mainImg.alt = m.alt || item.title || "Listing image";

        // update active ring
        thumbsWrap.querySelectorAll("button").forEach((b) => {
          b.classList.remove("ring-2", "ring-black");
        });
        btn.classList.add("ring-2", "ring-black");
      });

      thumbsWrap.appendChild(btn);
    });

    gallery.appendChild(thumbsWrap);
  }

  // -------- TEXT INFO --------
  const info = document.createElement("div");

  const title = document.createElement("h1");
  title.className = "text-2xl font-bold mb-2";
  title.textContent = item.title || "Untitled listing";

  const desc = document.createElement("p");
  desc.className = "mb-4";
  desc.textContent = item.description || "No description";

  const ends = document.createElement("p");
  ends.className = "text-sm text-gray-500";
  ends.textContent = item.endsAt
    ? `Ends: ${new Date(item.endsAt).toLocaleString()}`
    : "Ends: Unknown";

  const seller = document.createElement("p");
  seller.className = "text-sm text-gray-500";
  seller.textContent = `Seller: ${item.seller?.name || "Unknown"}`;

  const tags = document.createElement("p");
  tags.className = "text-sm text-gray-500";
  tags.textContent = `Tags: ${item.tags?.join(", ") || "None"}`;

  info.append(title, desc, ends, seller, tags);

  // Put into layout
  layout.append(gallery, info);
  wrapper.appendChild(layout);
  container.appendChild(wrapper);

  // Enable lightbox on images (main + any thumbs)
  const images = wrapper.querySelectorAll("img");
  setupLightbox(images);
}