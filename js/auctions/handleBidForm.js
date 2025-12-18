import { apiFetch } from "../utils/apiFetch.js";
import { showMessage } from "../utils/showMessage.js";

/**
 * Handles bid form submit, shows feedback, and calls onSuccess to refresh listing.
 * @param {HTMLFormElement} form
 * @param {HTMLInputElement} input
 * @param {string | null} token
 * @param {string} id
 * @param {() => void | Promise<void>} onSuccess
 */
export function handleBidForm(form, input, token, id, onSuccess) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = Number.parseInt(input.value, 10);

    if (!token) {
      showMessage("You must be logged in to place a bid.", "error");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      showMessage("Please enter a valid bid amount.", "error");
      return;
    }

    try {
      await apiFetch(`/auction/listings/${id}/bids`, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });

      showMessage(`Bid of ${amount} credits placed successfully!`, "success");
      input.value = "";
      await onSuccess();
    } catch (err) {
      console.error(err);

      const msg = err?.message || "Failed to place bid.";

      if (msg.includes("Forbidden:")) {
        showMessage("You cannot bid on your own listing.", "error");
      } else {
        showMessage(msg, "error");
      }
    }
  });
}