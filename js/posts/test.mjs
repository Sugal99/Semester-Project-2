const searchInput = document.getElementById("searchInput"); // Replace with the actual ID of your search input element
const dropdownMenuButton = document.getElementById("dropdownMenuButton"); // Replace with the actual ID of your filter dropdown
const filterButton = document.getElementById("button");

// Initialize allListings as an empty array
let allListings = [];

// Event listeners
searchInput.addEventListener("input", debounce(handleSearch, 300));
dropdownMenuButton.addEventListener("change", handleFilterChange);
filterButton.addEventListener("click", toggleFilter);

// Function to fetch and display listings
async function fetchAndDisplayListings() {
  try {
    allListings = await fetchWithToken(
      API_BASE_URL + "/api/v1/auction/listings"
    );
    applyFilter(); // Apply the current filter
  } catch (error) {
    console.error(error);
  }
}

// Function to debounce input events
function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Initial fetching and displaying of listings
fetchAndDisplayListings();

// Function to handle the search
function handleSearch() {
  applyFilter(); // Reapply the current filter when the search term changes
}

// Function to handle the filter change
function handleFilterChange() {
  fetchAndDisplayListings(); // Fetch new data when the filter dropdown changes
}

// Function to apply the current filter
function applyFilter() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Filter listings based on the search term
  const filteredListings = allListings.filter((post) =>
    post.title.toLowerCase().includes(searchTerm)
  );

  // Display filtered listings
  displayListings(filteredListings);
}

// Function to toggle filtering
function toggleFilter() {
  // Your toggle filter logic here
  // Example: Reverse the posts when filtering is active
  const isFiltering = filterButton.innerText === "Go Back To New Posts";

  if (isFiltering) {
    filterButton.innerText = "Filter";
    // Reverse the posts only when filtering is active
    displayListings(allListings.reverse());
  } else {
    filterButton.innerText = "Go Back To New Posts";
    // Show all posts without clearing the container
    displayListings(allListings);
  }
}
