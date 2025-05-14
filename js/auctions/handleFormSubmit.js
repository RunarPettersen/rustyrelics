import { apiFetch } from "../utils/apiFetch.js";

export function handleFormSubmit(form, listingId) {
  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className =
    "bg-rust-500 text-white px-4 py-2 rounded hover:bg-rust-600 cursor-pointer mb-4";
  saveBtn.textContent = "Save Changes";
  form.appendChild(saveBtn);

  const message = document.createElement("p");
  message.id = "update-message";
  message.textContent = "Listing updated! Redirecting...";
  message.className =
    "text-antique bg-green-600 px-4 py-2 rounded border-2 border-solid border-rust-500 mt-4 hidden";
  form.appendChild(message);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updated = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      tags: form.tags.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const mediaUrls = Array.from(
      form.querySelectorAll('input[name="media-url"]')
    );
    const mediaAlts = Array.from(
      form.querySelectorAll('input[name="media-alt"]')
    );

    const media = mediaUrls
      .map((input, index) => {
        const url = input.value.trim();
        const alt = mediaAlts[index]?.value.trim() || "Listing image";
        return url ? { url, alt } : null;
      })
      .filter(Boolean);

    if (media.length > 0) {
      updated.media = media;
    }

    try {
      await apiFetch(`/auction/listings/${listingId}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });

      message.classList.remove("hidden");

      setTimeout(() => {
        window.location.href = `/auctions/listing.html?id=${listingId}`;
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  });
}
