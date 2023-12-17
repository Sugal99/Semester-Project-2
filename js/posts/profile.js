const API_BASE_URL = "https://api.noroff.dev/api/v1";

async function getProfileInfo(url) {
  try {
    const token = localStorage.getItem("accessToken");
    const getData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, getData);
    const json = await response.json();
    return json;
  } catch (error) {}
}

async function main() {
  try {
    const profileName = localStorage.getItem("user");

    if (!profileName) {
      return;
    }

    const profileUrl = `${API_BASE_URL}/auction/profiles/${profileName}`;
    const profileData = await getProfileInfo(profileUrl);

    const savedAvatarUrl = localStorage.getItem("avatar");

    updateProfileHTML(profileData, savedAvatarUrl);
  } catch (error) {}
}

document
  .getElementById("saveAvatarChanges")
  .addEventListener("click", function () {
    var avatarUrl = document.getElementById("avatarUrl").value;
    updateProfilePicture(avatarUrl);
    var modal = new bootstrap.Modal(
      document.getElementById("changeAvatarModal")
    );
    modal.hide();
  });

function updateProfileHTML(profileData, savedAvatarUrl) {
  const userCreditsContainer = document.getElementById("profileCredits");
  const testContainer = document.getElementById("test");
  const avatarContainer = document.getElementById("mini-avatar-placeholder");

  userCreditsContainer.textContent = `Credits: ${profileData.credits}`;

  testContainer.innerHTML = `
      <p>${profileData.name}</p>
    `;

  const avatarUrl = savedAvatarUrl || profileData.avatar;
  document.getElementById("mini-avatar-placeholder").src = avatarUrl;

  localStorage.setItem("avatar", avatarUrl);
  localStorage.setItem("credits", profileData.credits);
}

function updateProfilePicture(avatarUrl) {
  document.getElementById("mini-avatar-placeholder").src = avatarUrl;
  localStorage.setItem("avatar", avatarUrl);
}

main();
