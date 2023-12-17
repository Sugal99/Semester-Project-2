// Destructure the formData object to get the postId
const formData = new FormData(event.target);
const { postId } = Object.fromEntries(formData);

if (!postId) {
  console.error("Post ID is missing.");
  return;
}

const token = localStorage.getItem("accessToken");

try {
  const response = await fetch(
    `${API_BASE_URL}/auction/listings/${listingsId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    console.log("Post deleted successfully.");
    alert("Post deleted successfully.");
  } else {
    console.error("Failed to delete the post.");
  }
} catch (error) {
  console.error("An error occurred:", error);
}

export { deletePost };

const cardContainer = document.querySelector(".card-container");

// Function to create a delete button for a card
function createDeleteButton(postId) {
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", async () => {
    try {
      // Call the deletePost function
      await deletePost(postId);
      // Optionally, you can remove the card from the UI after successful deletion
      const cardToRemove = document.getElementById(`card-${postId}`);
      if (cardToRemove) {
        cardToRemove.remove();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
  return deleteButton;
}

// Loop through the posts and create cards with delete buttons
posts.forEach((post) => {
  const card = document.createElement("div");
  card.className = "card";
  card.id = `card-${post.id}`; // Unique identifier for each card

  const cardTitle = document.createElement("h3");
  cardTitle.innerText = post.title;

  // Create a delete button for each card
  const deleteButton = createDeleteButton(post.id);

  card.appendChild(cardTitle);
  card.appendChild(deleteButton);
  cardContainer.appendChild(card);
});
