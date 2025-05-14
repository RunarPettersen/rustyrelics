export function setupLightbox(images) {
  if (images.length === 0) return;

  // Avoid duplicate overlay
  if (document.getElementById("lightbox-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";
  overlay.className =
    "fixed inset-0 bg-black/80 z-50 flex items-center justify-center hidden";

  const img = document.createElement("img");
  img.className = "max-h-[90%] max-w-[90%] rounded shadow";
  overlay.appendChild(img);

  const leftArrow = document.createElement("button");
  leftArrow.innerHTML = "&#10094;";
  leftArrow.className =
    "absolute left-4 text-white text-4xl font-bold hover:text-gray-400";
  overlay.appendChild(leftArrow);

  const rightArrow = document.createElement("button");
  rightArrow.innerHTML = "&#10095;";
  rightArrow.className =
    "absolute right-4 text-white text-4xl font-bold hover:text-gray-400";
  overlay.appendChild(rightArrow);

  const closeOverlay = () => {
    overlay.classList.add("hidden");
    img.src = "";
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  document.body.appendChild(overlay);

  // Track index
  let currentIndex = 0;

  const showImage = (index) => {
    const validIndex = (index + images.length) % images.length;
    img.src = images[validIndex].src;
    currentIndex = validIndex;
    overlay.classList.remove("hidden");
  };

  images.forEach((image, index) => {
    image.style.cursor = "zoom-in";
    image.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(index);
    });
  });

  leftArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  rightArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });
}
