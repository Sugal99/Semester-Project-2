async function addListing(url, data) {
  try {
    const token = localStorage.getItem("accessToken");

    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

async function addListingButtonClick() {
  try {
    // Get values from input fields
    const itemName = document.getElementById("itemName").value;
    const itemDescription = document.getElementById("itemDescription").value;
    const dateTime = document.getElementById("dateTime").value;
    const imageUrl = document.getElementById("imageUrl").value;

    // Validate if required fields are not empty
    if (!itemName || !dateTime) {
      alert("Please enter the required fields.");
      return;
    }

    const data = {
      title: itemName,
      description: itemDescription,
      tags: [],
      media: imageUrl ? [imageUrl] : [],
      endsAt: new Date(dateTime).toISOString(),
    };

    const url = `${API_BASE_URL}/auction/listings`;
    const token = localStorage.getItem("accessToken"); // Retrieve the token here

    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, postData);
    console.log(response);

    const json = await response.json();
    console.log(json);

    $("#addListingModal").modal("hide");
  } catch (error) {
    console.log(error);
  }
}
