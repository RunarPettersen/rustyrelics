import { apiFetch } from "../utils/apiFetch.js";
import { showMessage } from "../utils/showMessage.js";

export function handleProfileUpdate(form, username) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updated = {
      name: form.name.value.trim(),
      bio: form.bio.value.trim(),
    };

    const avatarUrl = form.avatar.value.trim();
    const bannerUrl = form.banner.value.trim();

    if (avatarUrl) {
      updated.avatar = { url: avatarUrl, alt: `${updated.name}'s avatar` };
    }
    if (bannerUrl) {
      updated.banner = { url: bannerUrl, alt: `${updated.name}'s banner` };
    }

    try {
      await apiFetch(`/auction/profiles/${username}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });

      showMessage("Profile updated!", "success");
      setTimeout(() => location.reload(), 1500);
    } catch (err) {
      console.error(err);
      showMessage("Failed to update profile", "error");
    }
  });
}