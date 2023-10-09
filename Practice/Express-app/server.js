const express = require("express");
const app = express();
var expressLayouts = require("express-ejs-layouts");
//const port = process.env.PORT || 3000;

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);
// Set up routes (You can create separate route files in the "routes" folder)
app.get("/", function (req, res) {
  res.render("landing-page");
});
app.get("/stitched", function (req, res) {
  res.render("products/stitched");
});
app.get("/unstitched", function (req, res) {
  res.render("products/unstitched");
});
app.get("/all", function (req, res) {
  res.render("products/all");
});
app.get("/new-arrival", function (req, res) {
  res.render("products/new-arrival");
});
app.get("/cart", function (req, res) {
  res.render("cart");
});
app.get("/contact-us", function (req, res) {
  res.render("contact-us");
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
