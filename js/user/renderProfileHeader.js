export function renderProfileHeader(profile, container) {
  const { name, bio, avatar, banner, credits } = profile;

  container.innerHTML = `
      <div class="rounded overflow-hidden shadow">
        <div class="h-48 bg-cover bg-center" style="background-image: url('${
          banner?.url || ""
        }')"></div>
        <div class="p-4 bg-white">
          <div class="flex items-center space-x-4">
            <img src="${avatar?.url || "/images/default-avatar.jpg"}" alt="${
    avatar?.alt || name
  }" class="w-20 h-20 rounded-full border-2 border-white -mt-12 bg-white" />
            <div>
              <h1 class="text-2xl font-bold">${name}</h1>
              <p class="text-sm text-gray-600">${bio || "No bio yet"}</p>
              <p class="text-sm mt-2 font-medium">Credits: <span class="text-green-700 font-semibold">${credits}</span></p>
            </div>
          </div>
        </div>
      </div>
    `;
}
