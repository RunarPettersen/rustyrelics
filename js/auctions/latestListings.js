import { API_BASE } from "../constants/api.js";

export async function loadLatestListings(containerId = "latest-listings") {
  const container = document.getElementById(containerId);
  if (!container) return console.warn(`#${containerId} not found`);

  container.textContent = "Loading latest auctions...";

  try {
    const response = await fetch(
      `${API_BASE}/auction/listings?sort=created&sortOrder=desc&limit=6&_bids=true&_seller=true`
    );
    const { data } = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.textContent = "No auctions found.";
      return;
    }

    container.textContent = ""; // Clear loading message

    data.forEach((item) => {
      const imageUrl = item.media?.[0]?.url || "/images/no-image.jpg";
      const altText = item.media?.[0]?.alt || item.title;
      const lastBid = item.bids?.[item.bids.length - 1]?.amount ?? "No bids";
      const bidCount = item._count?.bids ?? 0;
      const endsAt = new Date(item.endsAt);
      const daysLeft = Math.ceil((endsAt - new Date()) / (1000 * 60 * 60 * 24));

      // Create card
      const card = document.createElement("div");
      card.className = "bg-white shadow rounded p-4";

      const link = document.createElement("a");
      link.href = `/auctions/listing.html?id=${item.id}`;
      link.className = "block";

      // Image wrapper with badge
      const imageWrapper = document.createElement("div");
      imageWrapper.className = "relative";

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = altText;
      img.className = "w-full h-50 object-cover rounded mb-2";

      const diffMs = endsAt - new Date();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const timeLeft =
        diffHours < 24
          ? `${diffHours}h left`
          : `${Math.ceil(diffHours / 24)}d left`;

      const badge = document.createElement("span");
      badge.textContent = timeLeft;
      badge.className =
        "absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded";

      imageWrapper.append(img, badge);

      // Content
      const title = document.createElement("h3");
      title.className = "text-lg font-semibold";
      title.textContent = item.title;

      const seller = document.createElement("p");
      seller.className = "text-sm text-gray-500";
      seller.textContent = `Seller: ${item.seller?.name || "Unknown"}`;

      const description = document.createElement("p");
      description.className = "text-sm text-gray-600";
      description.textContent = item.description || "No description";

      const bid = document.createElement("p");
      bid.className = "text-sm mt-1";
      bid.innerHTML = `Last bid: <span class="text-green-700 font-bold">${lastBid}</span>`;

      const bids = document.createElement("p");
      bids.className = "text-sm text-gray-600";
      bids.textContent = `Bids: ${bidCount}`;

      const ends = document.createElement("p");
      ends.className = "text-sm text-gray-600";
      ends.textContent = `Ends in: ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;

      // Append content to card
      link.append(imageWrapper, title, seller, description, bid, bids, ends);
      card.appendChild(link);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading latest auctions:", error);
    container.textContent = "Failed to load auctions.";
    container.classList.add("text-red-600");
  }
}