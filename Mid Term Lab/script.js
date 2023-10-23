// script.js
document.addEventListener("DOMContentLoaded", function () {
  var logo = document.querySelector(".logo a");
  var navbar = document.querySelector(".navbar");

  logo.addEventListener("click", function (e) {
    e.preventDefault();
    navbar.style.display = "none";
  });
});
