const API_BASE_URL = "https://api.noroff.dev";
let filteredData = []; // Store the fetched and filtered data

async function fetchWithToken(url) {
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
function createPostHTML(post) {
  const container = document.querySelector(".auctionContainer");

  // Create a Bootstrap column div
  const col = document.createElement("div");
  col.classList.add("col", "mb-3", "col-md-4");

  // Create a Bootstrap card div
  const card = document.createElement("div");
  card.classList.add("card", "bg-info", "p-0", "h-100");

  // Check if post.media is not null and has at least one item
  if (post.media !== null && post.media.length > 0) {
    const imgData = post.media[0];

    // Create an anchor element for the card
    const cardLink = document.createElement("a");
    cardLink.href = `/spesificItemPage.html?id=${post.id}&seller=${post.seller.name}`;
    cardLink.classList.add("card-link");

    // Create an image element
    const img = document.createElement("img");
    img.src = imgData;
    img.classList.add("card-img-top");
    img.alt = "Item Image";

    // Add error handling for the image
    img.addEventListener("error", function (event) {
      event.preventDefault();
      img.src =
        "images/—Pngtree—bidding auction and placard competition_6696447.png";
    });

    // Append the image to the card link
    cardLink.appendChild(img);

    // Append the anchor element to the card
    card.appendChild(cardLink);
  } else {
    // If post.media is null or empty, use a placeholder image
    const placeholderImg = document.createElement("img");
    placeholderImg.src =
      "images/—Pngtree—bidding auction and placard competition_6696447.png";
    placeholderImg.classList.add("card-img-top");
    placeholderImg.alt = "Item Image";

    // Append the placeholder image to the card
    card.appendChild(placeholderImg);
  }

  // Create a card body div
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "d-flex", "flex-column");

  // Create a card title element
  const cardTitle = document.createElement("h5");
  cardTitle.innerText = post.title;

  // Create a card description element
  const cardDescription = document.createElement("p");
  cardDescription.innerText =
    post.description || "Place your bids before you regret it!";

  // Append the card title and description to the card body
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardDescription);

  // Create a Bootstrap card div for the hr line
  const hrLine = document.createElement("hr");
  hrLine.classList.add("hrLine");

  // Append the hr line to the card body
  cardBody.appendChild(hrLine);

  // Append the card body to the card
  card.appendChild(cardBody);

  // Create a Bootstrap card div for the card footer
  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer", "border-0", "bg-info");

  // Create "Bids" element
  const cardInfo = document.createElement("p");
  cardInfo.innerText = `Bids: ${post._count.bids}`;

  // Create "Created" element
  const formattedCreatedDate = new Date(post.created).toLocaleDateString(
    "en-us",
    { month: "short", day: "numeric", timeZone: "UTC" }
  );
  const formattedCreatedTime = new Date(post.created).toLocaleTimeString(
    "en-GB",
    { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }
  );
  const cardCreated = document.createElement("p");
  cardCreated.innerText = `Created: ${formattedCreatedDate}, ${formattedCreatedTime}`;

  // Format "Ends At" timestamp
  const formattedDeadlineDate = new Date(post.endsAt).toLocaleDateString(
    "en-us",
    { month: "short", day: "numeric", timeZone: "UTC" }
  );
  const formattedDeadlineTime = new Date(post.endsAt).toLocaleTimeString(
    "en-GB",
    { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }
  );
  const cardendsAt = document.createElement("p");
  cardendsAt.innerText = `Ends At: ${formattedDeadlineDate}, ${formattedDeadlineTime}`;

  // Append the "Bids," "Created," and "Ends At" elements to the card footer
  cardFooter.appendChild(hrLine);
  cardFooter.appendChild(cardInfo);
  cardFooter.appendChild(cardCreated);
  cardFooter.appendChild(cardendsAt);

  // Append the card footer to the card
  card.appendChild(cardFooter);

  // Add a click event listener to the card to handle navigation
  card.addEventListener("click", function () {
    // Redirect to the specific item page when the card is clicked
    window.location.href = `/spesificItemPage.html?id=${post.id}`;
  });

  // Append the card to the container
  col.appendChild(card);
  container.appendChild(col);

  // Add event listeners to change cursor on hover
  card.addEventListener("mouseover", function () {
    card.style.cursor = "pointer";
  });

  card.addEventListener("mouseout", function () {
    card.style.cursor = "auto";
  });
}

function displayListings(json) {
  const container = document.querySelector(".auctionContainer");
  container.innerHTML = ""; // Clear existing listings

  // Add loading spinner
  const spinner = document.createElement("div");
  spinner.classList.add("spinner-border", "text-primary", "my-5"); // You can adjust the margin ('my-5') or change 'text-primary' to the desired color
  spinner.setAttribute("role", "status");
  container.appendChild(spinner);

  filteredData = json; // Store the filtered data

  for (const post of json) {
    createPostHTML(post);
  }

  // Remove loading spinner
  spinner.remove();
}

const auctionListingsASC = `${API_BASE_URL}/api/v1/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=asc&_active=true`;
const auctionListingsDESC = `${API_BASE_URL}/api/v1/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=desc&_active=true`;

async function filterListings(criteria) {
  try {
    let url;

    // Select the appropriate URL based on the criteria
    if (criteria === "oldest") {
      url = auctionListingsASC;
    } else if (criteria === "recent") {
      url = auctionListingsDESC;
    } else {
      // Handle other criteria or use a default URL
      url = auctionListingsASC;
    }

    // Fetch the listings data from the selected URL
    const json = await fetchWithToken(url);

    // Filter based on criteria
    let filteredListings = json;
    if (criteria === "oldest") {
      filteredListings = json.sort(
        (a, b) => new Date(a.created) - new Date(b.created)
      );
    } else if (criteria === "recent") {
      filteredListings = json.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
    }

    displayListings(filteredListings);
  } catch (error) {}
}

// Call the filterListings function with the desired criteria
filterListings("recent"); // or filterListings("oldest");
