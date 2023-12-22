const express = require("express");
let router = express.Router();
let stitched = require("../../models/stitched");
const upload = require("../../middlewares/upload");
const tokenauth = require("../../middlewares/tokenauth");
//to read records
router.get("/api/stitched", async (req, res) => {
  try {
    let c_stitched = await stitched.find();

    // Modify each stitched object to include Base64-encoded image data
    const stitchedWithImages = c_stitched.map((stitched) => ({
      _id: stitched._id,
      details: stitched.details,
      color: stitched.color,
      price: stitched.price,
      image: {
        data: stitched.image.data.toString("base64"), // Convert Buffer to Base64
        contentType: stitched.image.contentType,
      },
    }));

    res.send(stitchedWithImages);
  } catch (error) {
    console.error("Error fetching stitched data:", error);
    res.status(500).send("Internal Server Error");
  }
});

//to read record by specific id
router.get("/api/stitched/:id", async function (req, res) {
  let c_stitched = await stitched.findById(req.params.id);
  res.send(c_stitched);
});

router.delete("/api/stitched/:id", async function (req, res) {
  let c_stitched = await stitched.findByIdAndDelete(req.params.id);
  res.send(c_stitched);
});

router.post("/api/stitched", upload.single("image"), async function (req, res) {
  const { details, color, price } = req.body;

  if (!details || !color || !price) {
    return res.status(400).send("Details, color, and price are required");
  }

  // Access the uploaded image data from req.file
  const image = {
    data: req.file.buffer, // The binary image data
    contentType: req.file.mimetype, // The content type of the image
  };

  const newStitched = new stitched({ details, color, price, image });

  try {
    await newStitched.save();
    return res.send(newStitched);
  } catch (error) {
    console.error("Error saving stitched document:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.put("/api/stitched/:id", async function (req, res) {
  // return res.send(req.params);
  let c_stitched = await stitched.findById(req.params.id);
  c_stitched.details = req.body.details;
  c_stitched.color = req.body.color;
  c_stitched.price = req.body.price;
  c_stitched.image = req.body.image;
  await c_stitched.save();
  res.send(c_stitched);
});

router.get("/cart/:id", tokenauth, async (req, res) => {
  try {
    console.log("Reached /cart/:id route");

    const productId = String(req.params.id);
    console.log("Add product to cart");

    const userId = req.user.userId;
    const model = "stitched";

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

    res.redirect("/stitched");
  } catch (error) {
    console.error("Error in /cart/:id route:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/cart/remove/:id", tokenauth, async (req, res, next) => {
  try {
    const itemId = req.params.id;
    console.log("Removing item with ID:", itemId);

    const userId = req.user.userId; // Access user ID from the authenticated user

    // Get the user-specific cart from cookies
    let cart = req.cookies[`cart_${userId}`] || [];

    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array:", cart);
      cart = []; // Set cart to an empty array if it's not an array
    }

    // Find the index of the item in the cart
    const itemIndex = cart.findIndex((c) => c.productId == itemId);

    if (itemIndex !== -1) {
      // Remove the item from the cart
      cart.splice(itemIndex, 1);

      // Set the updated cart as a cookie
      res.cookie(`cart_${userId}`, cart);
    }

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ...

module.exports = router;
