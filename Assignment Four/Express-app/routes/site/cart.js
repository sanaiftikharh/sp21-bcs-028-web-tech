// routes/buyNow.js

const express = require("express");
const router = express.Router();
const authenticateUser = require("../../middlewares/tokenauth");
const Order = require("../../models/order");
// /cart route
router.get("/cart", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId; // Access user ID from the authenticated user
    let cart = req.cookies[`cart_${userId}`];

    if (!cart) cart = [];

    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array:", cart);
      cart = [];
    }

    // Create an array to store promises for fetching product details
    const productPromises = [];

    for (const item of cart) {
      const Model = require(`../../models/${item.model}`);

      productPromises.push(Model.findById(item.productId).lean());
    }

    // Wait for all promises to resolve
    const cartDetails = await Promise.all(productPromises);

    res.render("cart", { cart: cartDetails });
  } catch (error) {
    console.error("Error in server /cart route:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/buy-now", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = req.cookies[`cart_${userId}`];
    console.log("buy-now");
    console.log(cart);

    if (!cart || !Array.isArray(cart)) {
      console.error("Invalid cart:", cart);
      return res.status(400).send("Invalid Cart");
    }

    // Fetch product details from the database for each item in the cart
    const productPromises = cart.map(async (item) => {
      const Model = require(`../../models/${item.model}`);
      const product = await Model.findById(item.productId).lean();
      return {
        ...item,
        details: product ? product.details : "Product details not available",
        price: product ? product.price : 0,
      };
    });

    // Wait for all promises to resolve
    const cartDetails = await Promise.all(productPromises);

    // Calculate totalAmount based on the fetched details
    const totalAmount = cartDetails.reduce(
      (total, item) => total + item.price,
      0
    );
    console.log(totalAmount);

    // Render the "Buy Now" page with the cart details
    res.render("buy-now", { cart: cartDetails, totalAmount });
  } catch (error) {
    console.error("Error in server /cart/buy-now route:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/buy-now", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Retrieve productId array from cookies
    const cartFromCookies = req.cookies[`cart_${userId}`];

    // Create an array of product objects
    const productsArray = cartFromCookies.map(({ productId, model }) => ({
      productId: productId,
      model: model,
    }));
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
    console.log(productsArray);
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
    res.clearCookie(`cart_${userId}`);
    // Render to a thank you page
    res.render("thank-you");
  } catch (error) {
    console.error("Error in server /cart/buy-now route:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
