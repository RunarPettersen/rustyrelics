export function setupHamburgerMenu() {
  const toggleBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("menu-mobile");
  const icon = document.getElementById("menu-icon");

  if (!toggleBtn || !mobileMenu || !icon) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");

    mobileMenu.classList.toggle("hidden");

    // Toggle between hamburger and X
    icon.classList.replace(
      isOpen ? "fa-times" : "fa-bars",
      isOpen ? "fa-bars" : "fa-times"
    );
  });
}
