import { apiFetch } from "../utils/apiFetch.js";

const form = document.getElementById("listing-form");
const imageContainer = document.getElementById("image-fields");
const addImageBtn = document.getElementById("add-image-btn");

// Handle "Add another image" button
addImageBtn.addEventListener("click", () => {
  const wrapper = document.createElement("div");
  wrapper.className = "mb-4";

  const urlInput = document.createElement("input");
  urlInput.type = "url";
  urlInput.name = "media-url";
  urlInput.placeholder = "Image URL";
  urlInput.className = "bg-white w-full mb-2 p-2 border rounded";

  const altInput = document.createElement("input");
  altInput.type = "text";
  altInput.name = "media-alt";
  altInput.placeholder = "Image ALT";
  altInput.className = "bg-white w-full p-2 border rounded";

  wrapper.append(urlInput, altInput);
  imageContainer.appendChild(wrapper);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = form.title.value.trim();
  const description = form.description.value.trim();
  const tags = form.tags.value.split(",").map(tag => tag.trim()).filter(Boolean);
  const endsAt = form.endsAt.value;

  if (!title || !endsAt) {
    alert("Title and end date are required.");
    return;
  }

  const listingData = {
    title,
    description,
    tags,
    endsAt: new Date(endsAt).toISOString(),
  };

  // Collect all image URL and ALT pairs
  const mediaUrls = Array.from(form.querySelectorAll('input[name="media-url"]'));
  const mediaAlts = Array.from(form.querySelectorAll('input[name="media-alt"]'));

  const media = mediaUrls.map((input, index) => {
    const url = input.value.trim();
    const alt = mediaAlts[index]?.value.trim() || "Listing image";
    return url ? { url, alt } : null;
  }).filter(Boolean);

  if (media.length > 0) {
    listingData.media = media;
  }

  try {
    const response = await apiFetch("/auction/listings", {
      method: "POST",
      body: JSON.stringify(listingData),
    });

    if (response?.id) {
      window.location.href = `/auctions/listing.html?id=${response.id}`;
    } else {
      console.error("No listing ID found in response:", response);
      alert("Listing created, but no ID returned. Please check manually.");
    }
  } catch (error) {
    console.error("Error creating listing:", error);
    alert("Something went wrong while creating the listing.");
  }
});
