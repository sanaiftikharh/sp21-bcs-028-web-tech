const express = require("express");
let cookieParser = require("cookie-parser");
var session = require("express-session");
var expressLayouts = require("express-ejs-layouts");
const commonMiddleware = require("./middlewares/common");
const app = express();

//const port = process.env.PORT || 3000;

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "Shh, its a secret!" }));
app.use(commonMiddleware);

app.set("view engine", "ejs");
// Set up routes (You can create separate route files in the "routes" folder)
// app.get("/", function (req, res) {
//   res.render("landing-page");
// });
// const maintenance = require("./middlewares/maintenance");
// app.use(maintenance);
const sessionauth = require("./middlewares/sessionauth");
const admin = require("./middlewares/admin");

app.get("/stitched", async function (req, res) {
  let Stitched = require("./models/stitched");
  let stitched = await Stitched.find();
  res.render("products/stitched", { stitched });
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
app.get("/cart", sessionauth, function (req, res) {
  res.render("cart");
});
app.get("/contact-us", function (req, res) {
  res.render("contact-us");
});
// app.get("/register", function (req, res) {
//   res.render("auth/register");
// });

let stitchedApiRouter = require("./routes/api/stitched");

let unstitchedApiRouter = require("./routes/api/unstitched");
app.use(stitchedApiRouter);
app.use(unstitchedApiRouter);

let kidApiRouter = require("./routes/api/kids");
app.use(kidApiRouter);

let registerApiRouter = require("./routes/site/auth");
app.use(registerApiRouter);

let loginApiRouter = require("./routes/site/auth");
app.use(loginApiRouter);

app.use("/admin", sessionauth, admin, require("./routes/admin/stitched"));

app.get("/", async function (req, res) {
  let Stitched = require("./models/stitched");
  let stitched = await Stitched.find();
  res.render("landing-page", { stitched });
});

const mongoose = require("mongoose");
const { cookie } = require("express/lib/response");
mongoose
  .connect("mongodb://localhost/unique", { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo"))
  .catch((error) => console.log(error.message));

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
