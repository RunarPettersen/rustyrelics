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

// ✅ Fix for trailing slashes
function ensureTrailingSlash() {
  const currentPath = window.location.pathname;

  // List of paths that should always have a trailing slash
  const paths = ["/about", "/auctions", "/user"];

  if (paths.includes(currentPath)) {
    console.log("🔄 Redirecting to add trailing slash...");
    window.location.replace(`${currentPath}/`);
  }
}

// Smarter path detection
function getBasePath() {
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (isLocal) {
    // Get the current path and count the depth
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean);

    // Fix: auctions should go one level up
    if (pathParts.includes("auctions")) {
      return "../partials/";
    }

    if (pathParts.includes("about")) {
      return "../partials/";
    }

    if (pathParts.includes("user")) {
      return "../partials/";
    }

    // If we are at the root (like index.html)
    if (pathParts.length === 1) {
      return "./partials/";
    }

    // If we are inside a subfolder like `/user/profile.html`
    if (pathParts.length === 2) {
      return "../partials/";
    }

    // If we are even deeper (like /auctions/edit/)
    if (pathParts.length > 2) {
      return "../../partials/";
    }

    // Default case
    return "./partials/";
  }

  // If we are on Netlify or GitHub Pages, we need absolute
  return "/partials/";
}

// Ensure the trailing slash before loading partials
ensureTrailingSlash();

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
