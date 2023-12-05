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

// ...

module.exports = router;
