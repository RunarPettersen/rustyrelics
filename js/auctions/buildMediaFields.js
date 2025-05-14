export function buildMediaFields(form, mediaList = []) {
  const container = document.createElement("div");
  container.id = "image-fields";
  container.className = "mb-4";

  mediaList.forEach(({ url, alt = "" }) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-4";

    const urlInput = Object.assign(document.createElement("input"), {
      type: "url",
      name: "media-url",
      value: url,
      placeholder: "Image URL",
      className: "w-full mb-2 p-2 border rounded",
    });

    const altInput = Object.assign(document.createElement("input"), {
      type: "text",
      name: "media-alt",
      value: alt,
      placeholder: "Image ALT",
      className: "w-full p-2 border rounded",
    });

    wrapper.append(urlInput, altInput);
    container.appendChild(wrapper);
  });

  form.appendChild(container);

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.id = "add-image-btn";
  addBtn.className = "mb-4 bg-gray-200 px-4 py-2 rounded";
  addBtn.textContent = "Add another image";

  addBtn.addEventListener("click", () => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-4";

    const urlInput = document.createElement("input");
    urlInput.type = "url";
    urlInput.name = "media-url";
    urlInput.placeholder = "Image URL";
    urlInput.className = "w-full mb-2 p-2 border rounded";

    const altInput = document.createElement("input");
    altInput.type = "text";
    altInput.name = "media-alt";
    altInput.placeholder = "Image ALT";
    altInput.className = "w-full p-2 border rounded";

    wrapper.append(urlInput, altInput);
    container.appendChild(wrapper);
  });

  form.appendChild(addBtn);
}
