const API_BASE_URL = "https://api.noroff.dev";

/**
 * @description Log in a user using provided data and store access token and user name in local storage.
 *
 *
 * @function loginUser
 * @param {string} url - The URL for the login API endpoint.
 * @param {Object} data - User login data including email and password.
 *  @throws {Error} If an error occurs during the post creation process.
 * @example
 * // Log in a user and handle the result
 * const loginData = {
 *   email: "user@example.com",
 *   password: "secretPassword",
 * };
 *
 */
async function loginUser(url, data) {
  try {
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, postData);
    console.log(response);
    const json = await response.json();
    console.log(json);

    if (json.accessToken) {
      localStorage.setItem("accessToken", json.accessToken);
      localStorage.setItem("user", json.name); // Store the user's name
      localStorage.setItem("email", json.email); // Store the user's email

      window.location.href = "/index.html"; // Redirect after successful login
    } else {
      console.log("Login failed. Handle the error as needed.");
    }

    return json;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @description Handle the form submission to log in a user.
 *
 * @function handleSubmit
 * @param {Event} event - The form submission event.
 *
 * @example
 * // Example of how to attach this handler to a login form
 * const loginForm = document.getElementById("loginForm");
 * loginForm.addEventListener("submit", handleSubmit);
 */

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault(); // Prevent the form from actually submitting

  // Get values from form fields
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  const userToLogin = {
    email,
    password,
  };

  loginUser(loginUrl, userToLogin);
}

const loginUrl = `${API_BASE_URL}/api/v1/auction/auth/login`;

const formID2 = document.getElementById("formID");
formID2.addEventListener("submit", handleSubmit);
