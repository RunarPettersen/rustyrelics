export function renderProfileForm(formWrap, profile) {
  const { name, bio, avatar, banner } = profile;

  const heading = document.createElement("h2");
  heading.textContent = "Edit Profile";
  heading.className = "text-lg font-bold mb-4";

  const form = document.createElement("form");
  form.id = "profile-update-form";
  form.className = "space-y-4";

  // Fields
  const nameInput = document.createElement("input");
  nameInput.name = "name";
  nameInput.placeholder = "Name";
  nameInput.required = true;
  nameInput.className = "w-full p-2 border rounded";

  const bioInput = document.createElement("textarea");
  bioInput.name = "bio";
  bioInput.placeholder = "Bio";
  bioInput.className = "w-full p-2 border rounded";

  const avatarInput = document.createElement("input");
  avatarInput.name = "avatar";
  avatarInput.placeholder = "Avatar URL";
  avatarInput.type = "url";
  avatarInput.className = "w-full p-2 border rounded";

  const bannerInput = document.createElement("input");
  bannerInput.name = "banner";
  bannerInput.placeholder = "Banner URL";
  bannerInput.type = "url";
  bannerInput.className = "w-full p-2 border rounded";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Save Changes";
  submitBtn.className = "bg-rust-500 text-white px-4 py-2 rounded hover:bg-rust-600 cursor-pointer";

  form.append(nameInput, bioInput, avatarInput, bannerInput, submitBtn);
  formWrap.append(heading, form);

  // Populate values
  nameInput.value = name;
  bioInput.value = bio || "";
  avatarInput.value = avatar?.url || "";
  bannerInput.value = banner?.url || "";

  return form;
}