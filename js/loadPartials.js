import { showUserCredits } from "./utils/showUserCredits.js";
import { highlightActiveNav } from "./utils/highlightNav.js";
import { setupHamburgerMenu } from "./utils/hamburgerMenu.js";

async function loadPartial(id, url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const content = await response.text();
      document.getElementById(id).innerHTML = content;
    } else {
      console.error(`Failed to load ${url}:`, response.statusText);
    }
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err);
  }
}

function loadFontAwesome() {
  if (document.getElementById("font-awesome")) return;

  const link = document.createElement("link");
  link.id = "font-awesome";
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
  document.head.appendChild(link);
}

// ✅ Dynamic Base Path Detection
function getBasePath() {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "./partials/";
  } else {
    return "/partials/"; // Absolute path for Netlify
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const basePath = getBasePath();

  await loadPartial("header", `${basePath}header.html`);
  await loadPartial("footer", `${basePath}footer.html`);
  await loadPartial("loader", `${basePath}loader.html`);

  window.showLoader = () => {
    const loader = document.getElementById("global-loader");
    if (loader) loader.classList.remove("hidden");
  };

  window.hideLoader = () => {
    const loader = document.getElementById("global-loader");
    if (loader) loader.classList.add("hidden");
  };

  setupHamburgerMenu();
  loadFontAwesome();
  highlightActiveNav();
  await showUserCredits();
});
