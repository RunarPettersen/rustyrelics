export function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (
      currentPath === linkPath ||
      (linkPath !== "/" && currentPath.startsWith(linkPath))
    ) {
      link.classList.add("border-b-2", "border-gold-500");
    }
  });
}
