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

    // Log the API response
    const response = await fetch(url, getData);
    const json = await response.json();
    console.log("API Response:", json);
    return json;
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  try {
    // Get the profile name from localStorage
    const profileName = localStorage.getItem("user");

    if (!profileName) {
      console.error("Profile name not found in localStorage");
      return;
    }

    // Use the correct endpoint for fetching profile data
    const profileUrl = `${API_BASE_URL}/auction/profiles/${profileName}`;
    const profileData = await getProfileInfo(profileUrl);

    // Retrieve the avatar URL from localStorage
    const savedAvatarUrl = localStorage.getItem("avatar");

    // Update the HTML with the profile information, including the avatar URL
    updateProfileHTML(profileData, savedAvatarUrl);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

document
  .getElementById("saveAvatarChanges")
  .addEventListener("click", function () {
    // Retrieve the value entered in the URL field
    var avatarUrl = document.getElementById("avatarUrl").value;

    // Perform actions with the avatar URL, for example, update the profile picture
    updateProfilePicture(avatarUrl);

    // Close the modal
    var modal = new bootstrap.Modal(
      document.getElementById("changeAvatarModal")
    );
    modal.hide();
  });

function updateProfileHTML(profileData, savedAvatarUrl) {
  // Assuming you have a <div> with id "userCreditsContainer" in your HTML
  const userCreditsContainer = document.getElementById("profileCredits");
  const testContainer = document.getElementById("test");
  const avatarContainer = document.getElementById("mini-avatar-placeholder");

  // Update the HTML content with the profile information
  userCreditsContainer.textContent = `Credits: ${profileData.credits}`;

  testContainer.innerHTML = `
      <p>${profileData.name}</p>
    `;

  // Set the avatar URL from localStorage or use the default avatar URL from the profile data
  const avatarUrl = savedAvatarUrl || profileData.avatar;

  // Set the src attribute directly
  document.getElementById("mini-avatar-placeholder").src = avatarUrl;

  // Save the avatar URL in localStorage
  localStorage.setItem("avatar", avatarUrl);

  // Save credits in localStorage
  localStorage.setItem("credits", profileData.credits);
}

// Call the main function to start the process
console.log(localStorage);

main();
