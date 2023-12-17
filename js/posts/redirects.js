document.addEventListener("DOMContentLoaded", function () {
  // Select the button by its ID
  const registerButton = document.getElementById("registerButton");

  // Add a click event listener to the button
  registerButton.addEventListener("click", function () {
    // Redirect to the login page
    window.location.href = "/login.html";
  });
});
