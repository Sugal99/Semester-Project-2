// Function to scroll to the main content with a smooth effect
function scrollToMainContent() {
  const mainContent = document.getElementById("mainContent");
  if (mainContent) {
    window.scrollTo({
      top: mainContent.offsetTop,
      behavior: "smooth",
    });
  }
}
