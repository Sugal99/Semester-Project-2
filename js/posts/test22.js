document.addEventListener("DOMContentLoaded", function () {
  // Find all dropdown items
  var dropdownItems = document.querySelectorAll(".dropdown-item");

  // Attach a click event handler to each dropdown item
  dropdownItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      // Prevent the default anchor behavior
      e.preventDefault();

      // Get the target section ID from the href attribute
      var targetId = item.getAttribute("href");

      // Scroll to the target section using smooth scrolling
      document.querySelector(targetId).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
});
