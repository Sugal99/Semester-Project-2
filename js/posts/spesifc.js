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

async function main() {
  try {
    // Get the id parameter from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const itemID = urlParams.get("id");

    if (!itemID) {
      console.error("Item ID not found in the URL");
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
    console.log("Combined Listings:", combinedListings);

    // Find the corresponding listing in the combined data based on the itemID
    const matchingListing = combinedListings.find(
      (listing) => listing.id === itemID
    );
    console.log(matchingListing);

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
          imageElement.className = "d-block w-100";

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
        auctionCreatedElement.innerHTML = ` Date added:  ${formattedCreatedDate}, ${formattedCreatedTime}`;
        auctionEndsAtElement.innerHTML = ` Date added:  ${formattedDeadlineDate}, ${formattedDeadlineTime}`;
      } else {
        console.error("No images found in the auction listing");
      }
    } else {
      console.error("Listing not found in the combined data");
    }
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
