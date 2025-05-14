import { renderProfileForm } from "./renderProfileForm.js";
import { handleProfileUpdate } from "./handleProfileUpdate.js";
import { setupProfileButtons } from "./setupProfileButtons.js";

export function setupProfileEditing(username, profile) {
  const container = document.createElement("div");
  container.className = "mt-4";

  // Create buttons and append to the container
  const editBtn = setupProfileButtons(container);

  // Form wrapper
  const formWrap = document.createElement("div");
  formWrap.id = "edit-profile-form";
  formWrap.className = "hidden mt-4 bg-white p-4 rounded shadow";

  // Build the form
  const form = renderProfileForm(formWrap, profile);
  container.append(formWrap);

  // Edit button toggles form visibility
  editBtn.addEventListener("click", () => {
    formWrap.classList.toggle("hidden");
  });

  // Handle form submission
  handleProfileUpdate(form, username);

  // Append to DOM
  document.getElementById("profile-header").appendChild(container);
}