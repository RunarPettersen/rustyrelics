export function buildTextFields(form, listing) {
  const fields = [
    {
      label: "Title*",
      type: "input",
      name: "title",
      required: true,
      value: listing.title,
    },
    {
      label: "Description",
      type: "textarea",
      name: "description",
      value: listing.description || "",
    },
    {
      label: "Tags",
      type: "input",
      name: "tags",
      value: listing.tags?.join(", ") || "",
    },
  ];

  fields.forEach(({ label, type, name, required, value }) => {
    const wrapper = document.createElement("label");
    wrapper.className = "block mb-4";

    const labelText = document.createElement("span");
    labelText.textContent = label;
    wrapper.appendChild(labelText);

    const input =
      type === "textarea"
        ? Object.assign(document.createElement("textarea"), { rows: 4 })
        : Object.assign(document.createElement("input"), { type });

    Object.assign(input, {
      name,
      required: required || false,
      value,
      className: "w-full p-2 border rounded",
    });

    wrapper.appendChild(input);
    form.appendChild(wrapper);
  });
}
