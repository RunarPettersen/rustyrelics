import { apiFetch } from "../utils/apiFetch.js";

export function handleBidForm(form, input, token, id, onSuccess) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = parseInt(input.value);
    if (!token) return showPopup("You must be logged in to place a bid.", "error");
    if (!amount || amount <= 0) return showPopup("Please enter a valid bid amount.", "error");

    try {
      await apiFetch(`/auction/listings/${id}/bids`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      showPopup(`Bid of ${amount} credits placed successfully!`, "success");
      input.value = "";
      onSuccess();
    } catch (err) {
      console.error(err.message);

      // ✅ Handle the "Forbidden" error correctly
      if (err.message.includes("Forbidden:")) {
        showPopup("You cannot bid on your own listing.", "error");
      } else {
        showPopup(err.message || "Failed to place bid.", "error");
      }
    }
  });
}

function showPopup(message, type = "success") {
  const existing = document.getElementById("bid-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "bid-popup";
  popup.className = `
    fixed bottom-6 right-6 z-50 px-6 py-3 rounded shadow text-white
    ${type === "success" ? "bg-rust-500 text-white border-4 border-gold-500" : "bg-red-600"}
  `;
  popup.textContent = message;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("opacity-0");
    setTimeout(() => popup.remove(), 300);
  }, 2500);
}
