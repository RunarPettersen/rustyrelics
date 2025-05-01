async function loadPartial(id, url) {
  const response = await fetch(url);
  const content = await response.text();
  document.getElementById(id).innerHTML = content;
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "/partials/header.html");
  loadPartial("footer", "/partials/footer.html");
});
