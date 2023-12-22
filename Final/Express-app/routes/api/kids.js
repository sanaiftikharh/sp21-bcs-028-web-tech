const express = require("express");
let router = express.Router();
let kid = require("../../models/kids");
const upload = require("../../middlewares/upload");
//to read records
router.get("/api/kid", async function (req, res) {
  let c_kid = await kid.find();
  res.send(c_kid);
});
//to read record by specific id
router.get("/api/kid/:id", async function (req, res) {
  let c_kid = await kid.findById(req.params.id);
  res.send(c_kid);
});
router.delete("/api/kid/:id", async function (req, res) {
  let c_kid = await kid.findByIdAndDelete(req.params.id);
  res.send(c_kid);
});

router.post("/api/kid", upload.single("image"), async function (req, res) {
  const { details, color, price } = req.body;

  if (!details || !color || !price) {
    return res.status(400).send("Details, color, and price are required");
  }

  // Access the uploaded image data from req.file
  const image = {
    data: req.file.buffer, // The binary image data
    contentType: req.file.mimetype, // The content type of the image
  };

  const newkid = new kid({ details, color, price, image });

  try {
    await newkid.save();
    return res.send(newkid);
  } catch (error) {
    console.error("Error saving kid document:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.put("/api/kid/:id", async function (req, res) {
  // return res.send(req.params);
  let c_kid = await kid.findById(req.params.id);
  c_kid.details = req.body.details;
  c_kid.color = req.body.color;
  c_kid.price = req.body.price;
  c_kid.image = req.body.image;
  await c_kid.save();
  res.send(c_kid);
});

// ...

// Serve uploaded images
router.get("/uploads/:imageId", async (req, res) => {
  try {
    const image = await kid.findById(req.params.imageId);

    if (!image) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", image.image.contentType);
    res.send(image.image.data);
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/kidscart/:id", async (req, res) => {
  try {
    console.log("Reached /cart/:id route");

    const productId = String(req.params.id);
    console.log("Add product to cart");

    // Get existing cart from cookies
    let cart = req.cookies.cart || [];

    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array:", cart);
      cart = []; // Set cart to an empty array if it's not an array
    }

    model = "unstitched";
    if (userId) {
      cart.push({ userId, productId, model });
    }

    console.log(req.session.user);

    console.log("Updated cart:", cart);

    res.cookie("cart", cart, { maxAge: 900000, httpOnly: true });

    res.redirect("/cart");
  } catch (error) {
    console.error("Error in /cart/:id route:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/kidscart/remove/:id", async (req, res, next) => {
  try {
    let product = await unstitched.findById(String(req.params.id));
    //console.log("Add product to cart");
    let cart = req.cookies.cart || [];

    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array:", cart);
      cart = []; // Set cart to an empty array if it's not an array
    }
    if (req.cookies.cart) cart = req.cookies.cart;
    cart.splice(
      cart.findIndex((c) => c._id == req.params.id),
      1
    );
    res.cookie("cart", cart);
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
});

// ...

module.exports = router;
