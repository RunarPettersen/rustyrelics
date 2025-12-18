/**
 * Show a temporary toast message.
 * @param {string} message
 * @param {"success" | "error"} [type="success"]
 * @param {number} [duration=3000]
 */
export function showMessage(message, type = "success", duration = 3000) {
  const existing = document.getElementById("profile-message");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "profile-message";

  const base =
    "fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,520px)] " +
    "px-4 py-3 rounded shadow-lg text-lg text-center " +
    "opacity-0 transition-opacity duration-300";

  const variant =
    type === "success"
      ? "bg-rust-500 text-white border-4 border-gold-500"
      : "bg-red-600 text-white";

  div.className = `${base} ${variant}`;
  div.textContent = message;

  document.body.appendChild(div);

  // Fade in
  requestAnimationFrame(() => {
    div.classList.remove("opacity-0");
    div.classList.add("opacity-100");
  });

  // Fade out + remove
  setTimeout(() => {
    div.classList.remove("opacity-100");
    div.classList.add("opacity-0");
    setTimeout(() => div.remove(), 300);
  }, duration);
}