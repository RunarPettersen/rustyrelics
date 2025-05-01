const listingsContainer = document.getElementById("listings");

export function displayListings(listings) {
  if (listings.length === 0) {
    listingsContainer.innerHTML = `<p>No listings found.</p>`;
    return;
  }

  listingsContainer.innerHTML = listings
    .map(
      (listing) => `
      <a href="listing.html?id=${listing.id}" class="block">
      <article class="bg-white shadow-md rounded-lg overflow-hidden">
        <img src="${listing.media?.[0]?.url || '/images/fallback.jpg'}"
             alt="${listing.media?.[0]?.alt || listing.title}"
             class="w-full h-48 object-cover" />
        <div class="p-4">
          <h2 class="text-xl font-bold mb-2">${listing.title}</h2>
          <p class="text-sm text-gray-700 line-clamp-3 mb-4">${listing.description || "No description provided."}</p>
          <p class="text-sm text-gray-500">Ends at: ${new Date(listing.endsAt).toLocaleString()}</p>
          <p class="text-sm text-gray-600 mt-2">${listing._count?.bids || 0} bids</p>
        </div>
      </article>
      </a>
    `
    )
    .join("");
}