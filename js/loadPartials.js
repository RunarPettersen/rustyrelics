import { showUserCredits } from "./utils/showUserCredits.js";
import { highlightActiveNav } from "./utils/highlightNav.js";
import { setupHamburgerMenu } from "./utils/hamburgerMenu.js";

async function loadPartial(id, url) {
  const response = await fetch(url);
  const content = await response.text();
  document.getElementById(id).innerHTML = content;
}

function loadFontAwesome() {
  if (document.getElementById("font-awesome")) return;

  const link = document.createElement("link");
  link.id = "font-awesome";
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
  document.head.appendChild(link);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("header", "./partials/header.html");
  await loadPartial("footer", "./partials/footer.html");
  await loadPartial("loader", "./partials/loader.html");

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
