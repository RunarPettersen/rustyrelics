import { API_BASE } from "../constants/api.js";
import { saveAuth } from "../utils/auth.js";

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  const payload = { email, password };

  try {
    const response = await fetch(`${API_BASE}auth/login`, {
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

      alert("Login successful!");
      window.location.href = "/"; // redirect as needed
    } else {
      alert(result.errors?.[0]?.message || "Login failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
});

