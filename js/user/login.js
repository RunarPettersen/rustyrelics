import { API_BASE } from "../constants/api.js";
import { saveAuth } from "../utils/auth.js";

const form = document.getElementById("login-form");

function showMessage(message, type = "success", duration = 3000) {
  const existing = document.getElementById("login-message");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "login-message";
  div.className = `
    fixed bottom-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-lg
    ${type === "success" ? "bg-rust-500 text-white border-4 border-gold-500" : "bg-red-600 text-white"}
  `;
  div.textContent = message;

  document.body.appendChild(div);

  setTimeout(() => {
    div.classList.add("opacity-0");
    setTimeout(() => div.remove(), 300);
  }, duration);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  const payload = { email, password };

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      saveAuth({
        accessToken: result.data.accessToken,
        name: result.data.name,
      });

      showMessage("Login successful!", "success");
      setTimeout(() => {
        window.location.href = "/user/profile.html";
      }, 1500);
    } else {
      showMessage(result.errors?.[0]?.message || "Login failed", "error");
    }
  } catch (err) {
    console.error(err);
    showMessage("Something went wrong.", "error");
  }
});