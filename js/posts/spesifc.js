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
    const json = await response.json();
    return json;
  } catch (error) {}
}

async function main() {
  try {
    // Get the id parameter from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const itemID = urlParams.get("id");

    if (!itemID) {
      return;
    }

    const recentListingsUrl = `${API_BASE_URL}/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=desc&_active=true`;
    const oldListingsUrl = `${API_BASE_URL}/auction/listings?_seller=true&_bids=true&sort=created&sortOrder=asc&_active=true`;

    // Make parallel requests using Promise.all
    const [recentListings, oldListings] = await Promise.all([
      fetchWithToken(recentListingsUrl),
      fetchWithToken(oldListingsUrl),
    ]);

    // Combine the results if needed
    const combinedListings = [...recentListings, ...oldListings];

    // Find the corresponding listing in the combined data based on the itemID
    const matchingListing = combinedListings.find(
      (listing) => listing.id === itemID
    );

    const formattedCreatedDate = new Date(
      matchingListing.created
    ).toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    const formattedCreatedTime = new Date(
      matchingListing.created
    ).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

    const formattedDeadlineDate = new Date(
      matchingListing.endsAt
    ).toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    const formattedDeadlineTime = new Date(
      matchingListing.endsAt
    ).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

    if (matchingListing) {
      const carouselInnerElement = document.getElementById("carouselInner");
      const carouselIndicatorsElement =
        document.getElementById("carouselIndicators");

      carouselInnerElement.innerHTML = "";
      carouselIndicatorsElement.innerHTML = "";

      const auctionImages = matchingListing.media;

      if (auctionImages && auctionImages.length > 0) {
        for (let index = 0; index < auctionImages.length; index++) {
          const imageUrl = auctionImages[index];

          // Create carousel item
          const carouselItem = document.createElement("div");
          carouselItem.className = `carousel-item${
            index === 0 ? " active" : ""
          }`;

          // Create image element
          const imageElement = document.createElement("img");
          imageElement.src = imageUrl;
          imageElement.className = "d-block w-100 ";

          // Append image to carousel item
          carouselItem.appendChild(imageElement);

          // Create carousel indicator
          const indicatorElement = document.createElement("button");
          indicatorElement.type = "button";
          indicatorElement.setAttribute("data-bs-target", "#demo");
          indicatorElement.setAttribute("data-bs-slide-to", index.toString());
          indicatorElement.className = index === 0 ? "active" : "";

          // Append indicator to carousel indicators
          carouselIndicatorsElement.appendChild(indicatorElement);

          // Append carousel item to carousel inner
          carouselInnerElement.appendChild(carouselItem);
        }

        const sellerElement = document.getElementById("seller");
        const sellerAvatarElement = document.getElementById(
          "mini-avatar-placeholder"
        );
        const auctionNameElement = document.getElementById("auctionTitle");
        const auctionDescElement =
          document.getElementById("auctionDescription");
        const auctionCreatedElement = document.getElementById("auctionCreated");
        const auctionEndsAtElement = document.getElementById("auctionEndsAt");

        sellerElement.innerHTML = `Seller: ${matchingListing.seller.name}`;
        sellerAvatarElement.style.backgroundImage = `url(${matchingListing.seller.avatar})`;
        sellerAvatarElement.style.backgroundSize = "cover";
        sellerAvatarElement.style.backgroundPosition = "center";
        sellerAvatarElement.style.backgroundRepeat = "no-repeat";
        auctionNameElement.innerHTML = `${matchingListing.title}`;
        auctionDescElement.innerHTML = `"<i>${matchingListing.description}</i>"`;
        auctionCreatedElement.innerHTML = ` Date added: ${formattedCreatedDate}, ${formattedCreatedTime}`;
        auctionEndsAtElement.innerHTML = ` Date added: ${formattedDeadlineDate}, ${formattedDeadlineTime}`;

        currentBidElement = document.getElementById("currentBid");
        const bidderName = document.getElementById("bids-container");
        // Clear existing content in the bidderName container
        bidderName.innerHTML = "";
        // Check if bids are present in matchingListing
        if (matchingListing.bids && matchingListing.bids.length > 0) {
          // Iterate through all bids
          for (const bid of matchingListing.bids) {
            const formattedBidDate = new Date(bid.created).toLocaleDateString(
              "en-us",
              {
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              }
            );

            bidderName.innerHTML += `
              <div class="row mb-3 rounded bg-danger py-1">
                <div class="col">
                  <p>Bidder Name: ${bid.bidderName}</p>
                  <p>Date: ${formattedBidDate}</p>
                  <p>Amount: ${bid.amount}</p>
                </div>
              </div>
            `;
          }
        } else {
          bidderName.innerHTML += `
            <div class="row mb-3 ">
              <div class="col">
              </div>
            </div>
          `;
        }

        // Assuming you have a container element for the registration text
        const registrationContainer =
          document.getElementById("registrationText");

        // Check if the user is logged in (you can modify this condition based on your authentication logic)
        const isLoggedIn = localStorage.getItem("accessToken") !== null;

        // Show or hide the registration text based on the user's login status
        if (!isLoggedIn) {
          registrationContainer.style.display = "block"; // Show the text
        } else {
          registrationContainer.style.display = "none"; // Hide the text
        }
      } else {
      }
    } else {
    }
  } catch (error) {}
}

document.addEventListener("DOMContentLoaded", () => {
  // Add an event listener to the "Bid" button
  const bidButton = document.getElementById("bid-button");
  bidButton.addEventListener("click", async () => {
    const bidInput = document.querySelector(".form-control");
    const bidAmount = bidInput.value;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const itemID = urlParams.get("id");

    // Construct the bid update URL
    const bidUpdateUrl = `${API_BASE_URL}/auction/listings/${itemID}/bids`;

    // Prepare the request method
    const token = localStorage.getItem("accessToken");
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: parseFloat(bidAmount),
      }),
    };

    // Call the sendBidToAPI function to send the bid
    await sendBidToAPI(bidUpdateUrl, postData);

    // After placing the bid, re-fetch and update the current bid
    await main();
  });
});

async function sendBidToAPI(url, method) {
  try {
    const response = await fetch(url, method);
    const json = await response.json();

    if (response.ok) {
      const bidForm = document.querySelector("#bid-form");
      const bidAmount = document.querySelector("#bid-amount");
      bidForm.innerHTML = `
        <h4>${bidAmount.value} Credits spent on this item:
          <button type="button" class="bid-button btn btn bg-primary ms-2 text-white" id="bid-higher-button" onclick="window.location.reload()"><strong>Higher?</strong></button></h4>
      `;
    } else {
      const errorMessage = document.querySelector("#error-message");

      // Check if errorMessage element exists before trying to modify its style
      if (errorMessage) {
        errorMessage.style.display = "block";
        errorMessage.innerText = `${json.errors[0].message}`;
      } else {
      }
    }
  } catch (error) {}
}

document.addEventListener("DOMContentLoaded", main);
