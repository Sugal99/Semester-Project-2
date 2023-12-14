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

    if (matchingListing) {
      const sellerElement = document.getElementById("seller");
      const sellerAvatarElement = document.getElementById(
        "mini-avatar-placeholder"
      );

      const sellerName = matchingListing.seller.name;
      const sellerAvatar = matchingListing.seller.avatar;

      sellerElement.innerHTML = `Seller: ${sellerName}`;
      sellerAvatarElement.style.backgroundImage = `url(${sellerAvatar})`;
      sellerAvatarElement.style.backgroundSize = "cover";
      sellerAvatarElement.style.backgroundPosition = "center";
      sellerAvatarElement.style.backgroundRepeat = "no-repeat";
    } else {
      console.error("Listing not found in the combined data");
    }
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
