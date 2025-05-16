import { startCountdown } from "../utils/countdownTimer.js";

const listingsContainer = document.getElementById("listings");

export function displayListings(listings) {
  listingsContainer.innerHTML = "";

  if (listings.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No listings found.";
    listingsContainer.appendChild(emptyMsg);
    return;
  }

  listings.forEach((listing) => {
    const imageUrl = listing.media?.[0]?.url || "/images/fallback.jpg";
    const altText = listing.media?.[0]?.alt || listing.title;

    // <a>
    const link = document.createElement("a");
    link.href = `listing.html?id=${listing.id}`;
    link.className = "block";

    // <article>
    const article = document.createElement("article");
    article.className =
      "bg-white shadow-md rounded-lg overflow-hidden relative";

    // Image wrapper
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "relative";

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = altText;
    image.className = "w-full h-48 object-cover";

    // Countdown Badge
    const badge = document.createElement("span");
    badge.className =
      "absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded";
    
    imageWrapper.append(image, badge);

    if (listing.endsAt) {
      startCountdown(badge, new Date(listing.endsAt));
    } else {
      badge.textContent = "No end date";
    }

    // Content <div>
    const content = document.createElement("div");
    content.className = "p-4";

    const title = document.createElement("h2");
    title.className = "text-xl font-bold mb-2";
    title.textContent = listing.title;

    const description = document.createElement("p");
    description.className = "text-sm text-gray-700 line-clamp-3 mb-4";
    description.textContent = listing.description || "No description provided.";

    const ends = document.createElement("p");
    ends.className = "text-sm text-gray-500";
    ends.textContent = `Ends at: ${new Date(listing.endsAt).toLocaleString()}`;

    const seller = document.createElement("p");
    seller.className = "text-sm text-gray-500";
    seller.textContent = `Seller: ${listing.seller?.name || "Unknown"}`;

    const bids = document.createElement("p");
    bids.className = "text-sm text-gray-600 mt-2";
    bids.textContent = `${listing._count?.bids || 0} bids`;

    content.append(title, description, ends, seller, bids);
    article.append(imageWrapper, content);
    link.appendChild(article);
    listingsContainer.appendChild(link);
  });
}