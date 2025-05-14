import { API_BASE } from "../constants/api.js";
import { showMessage } from "../utils/showMessage.js";

const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const bio = form.bio.value.trim();
  const avatarUrl = form["avatar-url"].value.trim();
  const avatarAlt = form["avatar-alt"].value.trim();
  const bannerUrl = form["banner-url"].value.trim();
  const bannerAlt = form["banner-alt"].value.trim();

  // Client-side validation
  if (!email.endsWith("@stud.noroff.no")) {
    showMessage("Email must end with @stud.noroff.no", "error");
    return;
  }

  if (password.length < 8) {
    showMessage("Password must be at least 8 characters long", "error");
    return;
  }

  const payload = {
    name,
    email,
    password,
    bio,
    avatar: avatarUrl ? { url: avatarUrl, alt: avatarAlt } : undefined,
    banner: bannerUrl ? { url: bannerUrl, alt: bannerAlt } : undefined,
  };

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      showMessage("Registration successful!", "success");
      setTimeout(() => {
        window.location.href = "./user/login.html";
      }, 2000);
    } else {
      console.error(result);
      showMessage(result.errors?.[0]?.message || "Registration failed.", "error");
    }
  } catch (err) {
    console.error(err);
    showMessage("Something went wrong.", "error");
  }
});
