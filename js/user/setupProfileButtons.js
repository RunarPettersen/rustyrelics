import { showMessage } from "../utils/showMessage.js";

export function setupProfileButtons(container) {
  // Edit button
  const editBtn = document.createElement("button");
  editBtn.id = "edit-profile-btn";
  editBtn.textContent = "Edit Profile";
  editBtn.className = "bg-gold-500 text-white px-3 py-1 rounded hover:bg-gold-600 cursor-pointer";

  // Logout button
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.className = "bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer";
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    showMessage("You are now logged out.", "success", 2000);

    void document.body.offsetHeight;

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  });

  // Append buttons to container
  const buttonRow = document.createElement("div");
  buttonRow.className = "flex gap-4 mb-4";
  buttonRow.append(editBtn, logoutBtn);

  container.appendChild(buttonRow);

  return editBtn;
}