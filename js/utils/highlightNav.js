export function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    // 🔹 If it matches exactly, highlight it
    if (currentPath === linkPath) {
      link.classList.add("border-b-2", "border-gold-500");
    }

    // 🔹 Special case for subpages
    if (currentPath.startsWith("/auctions/") && currentPath !== "/auctions/create.html") {
      if (linkPath === "/auctions/") {
        link.classList.add("border-b-2", "border-gold-500");
      }
    }

    // 🔹 Special case for Create Auction
    if (currentPath === "/auctions/create.html") {
      if (linkPath === "/auctions/create.html") {
        link.classList.add("border-b-2", "border-gold-500");
      }
    }
  });
}