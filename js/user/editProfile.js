import { renderProfileForm } from "./renderProfileForm.js";
import { handleProfileUpdate } from "./handleProfileUpdate.js";
import { setupProfileButtons } from "./setupProfileButtons.js";

export function setupProfileEditing(username, profile) {
  const container = document.createElement("div");
  container.className = "mt-4";

  const editBtn = setupProfileButtons(container);

  const formWrap = document.createElement("div");
  formWrap.id = "edit-profile-form";
  formWrap.className = "hidden mt-4 bg-white p-4 rounded shadow";

  const form = renderProfileForm(formWrap, profile);
  container.append(formWrap);

  editBtn.addEventListener("click", () => {
    formWrap.classList.toggle("hidden");
  });

  handleProfileUpdate(form, username);

  document.getElementById("profile-header").appendChild(container);
}