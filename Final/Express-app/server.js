const express = require("express");
let cookieParser = require("cookie-parser");
var session = require("express-session");
var expressLayouts = require("express-ejs-layouts");
const commonMiddleware = require("./middlewares/common");
const Stitched = require("./models/stitched");
const Unstitched = require("./models/unstitched");
const app = express();

//const port = process.env.PORT || 3000;

// Middleware to serve static files from the "public" directory
app.use(cookieParser());
// app.use(session({ secret: "Shh, its a secret!" }));
app.use(
  session({
    secret: "your_secret_key",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(commonMiddleware);

app.set("view engine", "ejs");

const sessionauth = require("./middlewares/sessionauth");
const admin = require("./middlewares/admin");

const ITEMS_PER_PAGE = 6; // Adjust this value as needed

app.get("/stitched/:page?", async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
    const skipCount = (page - 1) * ITEMS_PER_PAGE; // Calculate the number of items to skip

    // Fetch total count of stitched items for pagination
    let totalCount;

    // Determine if a color filter is applied
    const colorFilter = req.query.colorFilter || "";

    if (colorFilter) {
      // If a color filter is applied, fetch the total count with the filter
      totalCount = await Stitched.countDocuments({ color: colorFilter });
    } else {
      // If no color filter, fetch the total count without filtering
      totalCount = await Stitched.countDocuments();
    }

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Fetch stitched items with pagination and color filter if applied
    const stitched = colorFilter
      ? await Stitched.find({ color: colorFilter })
          .skip(skipCount)
          .limit(ITEMS_PER_PAGE)
      : await Stitched.find().skip(skipCount).limit(ITEMS_PER_PAGE);

    res.render("products/stitched", {
      stitched,
      currentPage: page,
      totalPages,
      colorFilter,
    });
  } catch (error) {
    console.error("Error in /stitched route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/unstitched/:page?", async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
    const skipCount = (page - 1) * ITEMS_PER_PAGE; // Calculate the number of items to skip

    // Fetch total count of stitched items for pagination
    let totalCount;

    // Determine if a color filter is applied
    const colorFilter = req.query.colorFilter || "";

    if (colorFilter) {
      // If a color filter is applied, fetch the total count with the filter
      totalCount = await Unstitched.countDocuments({ color: colorFilter });
    } else {
      // If no color filter, fetch the total count without filtering
      totalCount = await Unstitched.countDocuments();
    }

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Fetch stitched items with pagination and color filter if applied
    const stitched = colorFilter
      ? await Unstitched.find({ color: colorFilter })
          .skip(skipCount)
          .limit(ITEMS_PER_PAGE)
      : await Unstitched.find().skip(skipCount).limit(ITEMS_PER_PAGE);

    res.render("products/unstitched", {
      stitched,
      currentPage: page,
      totalPages,
      colorFilter,
    });
  } catch (error) {
    console.error("Error in /stitched route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/all/:page?", async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
    const itemsPerPage = 3; // Set the number of items per page

    const skipCount = (page - 1) * itemsPerPage; // Calculate the number of items to skip

    // Fetch total count of unstitched items for pagination
    const totalCountUnstitched = await Unstitched.countDocuments();

    // Fetch total count of stitched items for pagination
    const totalCountStitched = await Stitched.countDocuments();

    // Calculate combined total pages
    const totalPages = Math.ceil(
      (totalCountUnstitched + totalCountStitched) / itemsPerPage
    );

    // Fetch unstitched items with pagination
    const unstitched = await Unstitched.find()
      .skip(skipCount)
      .limit(itemsPerPage);

    // Fetch stitched items with pagination
    const stitched = await Stitched.find().skip(skipCount).limit(itemsPerPage);

    // Combine stitched and unstitched into a single array
    const combinedItems = [...unstitched, ...stitched];

    res.render("products/all", {
      items: combinedItems,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in /all route:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/", async function (req, res) {
  let stitched = await Stitched.find();
  res.render("landing-page", { stitched });
});
app.get("/orders", admin, async function (req, res) {
  const Order = require("./models/order");
  try {
    let orders = await Order.find();
    res.render("admin/orders", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/search", async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  const searchTerm = req.query.q;

  try {
    // Check if searchTerm is a valid ObjectId
    if (!ObjectId.isValid(searchTerm)) {
      return res.render("search-results", { results: [] });
    }

    // Search in Stitched model by _id
    const stitchedResult = await Stitched.findById(searchTerm);

    // If a result is found in Stitched model, return it
    if (stitchedResult) {
      return res.render("search-results", { results: [stitchedResult] });
    }

    // Search in Unstitched model by _id
    const unstitchedResult = await Unstitched.findById(searchTerm);

    // If a result is found in Unstitched model, return it
    if (unstitchedResult) {
      return res.render("search-results", { results: [unstitchedResult] });
    }

    res.render("search-results", { results: [] });
  } catch (error) {
    console.error("Error in search route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/new-arrival", function (req, res) {
  res.render("products/new-arrival");
});
app.get("/kids", function (req, res) {
  res.render("products/kids");
});

app.get("/contact-us", function (req, res) {
  res.render("contact-us");
});
app.get("/calculator.html", function (req, res) {
  res.render("calculator");
});

let stitchedApiRouter = require("./routes/api/stitched");

let unstitchedApiRouter = require("./routes/api/unstitched");

let kidApiRouter = require("./routes/api/kids");
let registerApiRouter = require("./routes/site/auth");
let loginApiRouter = require("./routes/site/auth");
let cartRouter = require("./routes/site/cart");
let buyRouter = require("./routes/site/buy");
let calculatorRouter = require("./routes/site/calculator");

app.use(stitchedApiRouter);
app.use(unstitchedApiRouter);
app.use(kidApiRouter);
app.use(registerApiRouter);
app.use(loginApiRouter);
app.use(cartRouter);
app.use(buyRouter);
app.use(calculatorRouter);

app.use("/admin", sessionauth, admin, require("./routes/admin/stitched"));
app.use("/admin", sessionauth, admin, require("./routes/admin/unstitched"));

// const cartApiRouter = require("./routes/api/cart");
// app.use("/", cartApiRouter);

var cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
const { cookie } = require("express/lib/response");
mongoose
  .connect("mongodb://127.0.0.1/unique", { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo"))
  .catch((error) => console.log(error.message));

// Start the server
app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
