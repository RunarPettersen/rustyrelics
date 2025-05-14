export function showMessage(message, type = "success", duration = 3000) {
  const existing = document.getElementById("profile-message");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "profile-message";
  div.className = `
      fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-lg
      ${
        type === "success"
          ? "bg-rust-500 text-white border-4 border-gold-500"
          : "bg-red-600 text-white"
      }
    `;
  div.textContent = message;

  document.body.appendChild(div);

  setTimeout(() => {
    div.classList.add("opacity-0");
    setTimeout(() => div.remove(), 300);
  }, duration);
}
