// routes/buyNow.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authenticateUser = require("../../middlewares/tokenauth");
const Stitched = require("../../models/stitched");
const Unstitched = require("../../models/unstitched");
const Order = require("../../models/order");

// /cart route
router.get("/buy/:id", authenticateUser, async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  const searchTerm = req.params.id;
  console.log(searchTerm);

  try {
    // Check if searchTerm is a valid ObjectId
    if (!ObjectId.isValid(searchTerm)) {
      console.log("invalid object id");
      return res.render("buy", { results: [] });
    }

    // Search in Stitched model by _id
    const stitchedResult = await Stitched.findById(searchTerm);

    // If a result is found in Stitched model, return it
    if (stitchedResult) {
      console.log("sana");
      return res.render("buy", { results: stitchedResult });
    }

    // Search in Unstitched model by _id
    const unstitchedResult = await Unstitched.findById(searchTerm);

    // If a result is found in Unstitched model, return it
    if (unstitchedResult) {
      return res.render("buy", { results: unstitchedResult });
    }
  } catch (error) {
    console.error("Error in search route:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/buy/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const searchTerm = req.params.id;
    console.log(searchTerm);

    // // Create an array of product objects
    const productsArray = [
      {
        productId: searchTerm,
      },
    ];
    console.log("Form Data:", req.body);

    // Extract shippingAddress properties from the nested structure
    // const shippingAddress = req.body.shippingAddress || {};
    const {
      totalAmount,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      paymentMethod,
    } = req.body;

    const orderData = {
      userId: userId,
      products: productsArray,
      totalAmount: parseFloat(totalAmount), // Convert to a number
      shippingAddress: {
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
      },
      paymentMethod: paymentMethod,
    };
    // console.log(productsArray);
    let errors = Order.validate(orderData);

    if (errors) {
      // If there are validation errors, flash the first error message
      req.session.flash = { type: "danger", message: errors[0] };
      console.log(errors);
      return res.redirect("back");
    }

    // Save the order to the database
    const order = new Order(orderData);
    await order.save();

    console.log("order placed successfully");

    // Render to a thank you page
    res.render("thank-you");
  } catch (error) {
    console.error("Error in server /cart/buy-now route:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
