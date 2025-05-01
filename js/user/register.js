import { API_BASE } from "../constants/api.js";

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

  const payload = {
    name,
    email,
    password,
    bio,
    avatar: avatarUrl ? { url: avatarUrl, alt: avatarAlt } : undefined,
    banner: bannerUrl ? { url: bannerUrl, alt: bannerAlt } : undefined,
  };

  try {
    const response = await fetch(`${API_BASE}auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Registration successful!");
      window.location.href = "/user/login.html";
    } else {
      console.error(result);
      alert(result.errors?.[0]?.message || "Registration failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
});