const API_BASE_URL = "https://api.noroff.dev";

/**
 *  @description Register a user by making a POST request to the specified URL with user data.
 *
 *
 * @function registerUser
 * @param {string} url - The URL where the registration request will be sent.
 * @param {object} data - The user data to be sent in the request body.
 * @throws {Error} If an error occurs during the post creation process.
 * @example
 * // Define user data
 * const user = {
 *   name: "John Doe",
 *   email: "johndoe@example.com",
 *   password: "securepassword",
 * };
 *
 * // Register the user by calling the function
 * registerUser("https://api.noroff.dev/api/v1/social/auth/register", user)
 *   .then((response) => {
 *     console.log("User registered:", response);
 *   })
 *   .catch((error) => {
 *     console.error("Registration failed:", error);
 *   });
 */

async function registerUser(url, data) {
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
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  // Create the user object
  const user = {
    name,
    email,
    password,
  };

  // Register the user
  registerUser(`${API_BASE_URL}/api/v1/auction/auth/register`, user);
}

// Attach the handleSubmit function to the form's submit event
const formID = document.getElementById("formID");
formID.addEventListener("submit", handleSubmit);
