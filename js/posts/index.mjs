const API_BASE_URL = "https://api.noroff.dev/api/v1";

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
    console.log(response);
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(error);
  }
}
export function createPostHTML(post) {
  const container = document.querySelector(".auctionContainer");

  // Create a Bootstrap column div
  const col = document.createElement("div");
  col.classList.add("col", "mb-3", "col-md-4");

  // Create a Bootstrap card div
  const card = document.createElement("div");
  card.classList.add("card", "bg-info", "p-0", "h-100");

  // Check if post.media is not null and has at least one item
  if (post.media !== null && post.media.length > 0) {
    const imgData = post.media[0]; // Assuming you want to use the first image in the array

    // Create an image element
    const img = document.createElement("img");
    img.src = imgData;
    img.classList.add("card-img-top");
    img.alt = "Item Image";

    // Add error handling for the image
    img.addEventListener("error", function (event) {
      // Prevent the default error behavior (logging to the console)
      event.preventDefault();

      // Set a placeholder image source if the image fails to load
      img.src =
        "images/—Pngtree—bidding auction and placard competition_6696447.png";
    });

    // Append the image to the card
    card.appendChild(img);
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
    { month: "short", day: "numeric" }
  );
  const formattedDeadlineTime = new Date(post.endsAt).toLocaleTimeString(
    "en-GB",
    { hour: "2-digit", minute: "2-digit" }
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

  // Append the card to the container
  col.appendChild(card);
  container.appendChild(col);
}

function createPostsHTML(json) {
  for (let i = 0; i < json.length; i++) {
    const post = json[i];
    createPostHTML(post);
  }
}
async function main() {
  try {
    const url = `${API_BASE_URL}/auction/listings`;
    const json = await fetchWithToken(url);
    createPostsHTML(json);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
