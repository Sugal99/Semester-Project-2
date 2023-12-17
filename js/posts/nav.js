function logout() {
  // Clear user-related data from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("credits");
  localStorage.removeItem("email");
  localStorage.removeItem("avatar");
  localStorage.removeItem("user");
}

// Function to update the navigation bar based on login status
function updateNavbar() {
  const navItemsContainer = document.getElementById("navItems");

  // Get user login status from localStorage
  const isLoggedIn = !!localStorage.getItem("accessToken");

  // Clear existing items
  navItemsContainer.innerHTML = "";

  if (isLoggedIn) {
    // If logged in, show logout link
    navItemsContainer.innerHTML += `
        <li class="nav-item">
          <a class="nav-link text-secondary" id="logoutButton" href="/login.html">Logout</a>
          <a class="nav-link text-secondary" id="About" href="/profile.html">Profile</a>
          <a class="nav-link text-secondary" id="About" href="/about.html">About</a>
          <a class="nav-link text-secondary" id="About" href="/contact.html">Contact</a>



          </li>
      `;
    // Add event listener for logout
    document.getElementById("logoutButton").addEventListener("click", logout);
  } else {
    // If not logged in, show login and signup links
    navItemsContainer.innerHTML += `
        <li class="nav-item">
          <a class="nav-link text-secondary" href="/login.html">Login</a>
        </li>
        <li class="nav-item ms-1">
          <a class="nav-link text-secondary" href="/register.html">Sign Up</a>
        </li>
      `;
  }
}

// Call updateNavbar on page load
updateNavbar();
