export function renderListings(items = [], container) {
    if (!items.length) {
      container.innerHTML = `<p class="text-gray-500 text-sm">No items found.</p>`;
      return;
    }
  
    container.innerHTML = items.map(item => `
      <a href="/auctions/listing.html?id=${item.id}" class="block bg-white rounded shadow p-4 hover:shadow-md transition">
        <img src="${item.media?.[0]?.url || "/images/no-image.jpg"}" alt="${item.media?.[0]?.alt || item.title}" class="w-full h-40 object-cover rounded mb-2" />
        <h3 class="font-semibold text-lg">${item.title}</h3>
        <p class="text-sm text-gray-600">${item.description || ""}</p>
      </a>
    `).join("");
  }
  