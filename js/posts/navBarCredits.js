async function getProfile(url) {
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
    console.log(response);
    const json = await response.json();
    console.log(json);
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
    const profileData = await getProfile(profileUrl);

    // Update the HTML with the profile information
    updateProfileHTML(profileData);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

function updateProfileHTML(profileData) {
  // Assuming you have a <div> with id "userCreditsContainer" in your HTML
  const userCreditsContainer = document.getElementById("userCreditsContainer");

  // Update the HTML content with the profile information
  userCreditsContainer.innerHTML = `
      <p>Credits: ${profileData.credits}</p>
    `;
}

// Call the main function to start the process
main();
