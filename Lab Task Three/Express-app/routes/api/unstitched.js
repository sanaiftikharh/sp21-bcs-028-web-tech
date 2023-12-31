const express = require("express");
let router = express.Router();
let unstitched = require("../../models/unstitched");
const upload = require("../../middlewares/upload");
const tokenauth = require("../../middlewares/tokenauth");
//to read records
router.get("/api/unstitched", async function (req, res) {
  let c_unstitched = await unstitched.find();
  res.send(c_unstitched);
});
//to read record by specific id
router.get("/api/unstitched/:id", async function (req, res) {
  let c_unstitched = await unstitched.findById(req.params.id);
  res.send(c_unstitched);
});
router.delete("/api/unstitched/:id", async function (req, res) {
  let c_unstitched = await unstitched.findByIdAndDelete(req.params.id);
  res.send(c_unstitched);
});

router.post(
  "/api/unstitched",
  upload.single("image"),
  async function (req, res) {
    const { details, color, price } = req.body;

    if (!details || !color || !price) {
      return res.status(400).send("Details, color, and price are required");
    }

    // Access the uploaded image data from req.file
    const image = {
      data: req.file.buffer, // The binary image data
      contentType: req.file.mimetype, // The content type of the image
    };

    const newunStitched = new unstitched({ details, color, price, image });

    try {
      await newunStitched.save();
      return res.send(newunStitched);
    } catch (error) {
      console.error("Error saving unstitched document:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

router.put("/api/unstitched/:id", async function (req, res) {
  // return res.send(req.params);
  let c_unstitched = await unstitched.findById(req.params.id);
  c_unstitched.details = req.body.details;
  c_unstitched.color = req.body.color;
  c_unstitched.price = req.body.price;
  c_unstitched.image = req.body.image;
  await c_unstitched.save();
  res.send(c_unstitched);
});

// ...

router.get("/unstitchedcart/:id", tokenauth, async (req, res) => {
  try {
    console.log("Reached /cart/:id route");

    const productId = String(req.params.id);
    console.log("Add product to cart");

    const userId = req.user.userId;
    const model = "unstitched";

    // Get existing cart from cookies
    let cart = req.cookies[`cart_${userId}`] || [];

    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array:", cart);
      cart = []; // Set cart to an empty array if it's not an array
    }

    if (userId) {
      cart.push({ productId, model });
    }

    console.log("Updated cart:", cart);

    // Set the updated cart as a separate cookie
    res.cookie(`cart_${userId}`, cart, { maxAge: 900000, httpOnly: true });

    res.redirect("/unstitched");
  } catch (error) {
    console.error("Error in /cart/:id route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// // ...

module.exports = router;
