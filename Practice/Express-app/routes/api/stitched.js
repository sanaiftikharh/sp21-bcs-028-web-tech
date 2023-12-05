const express = require("express");
let router = express.Router();
let stitched = require("../../models/stitched");
const upload = require("../../middlewares/upload");
//to read records
router.get("/api/stitched", async function (req, res) {
  let c_stitched = await stitched.find();
  res.send(c_stitched);
});
//to read record by specific id
router.get("/api/stitched/:id", async function (req, res) {
  let c_stitched = await stitched.findById(req.params.id);
  res.send(c_stitched);
});
router.get("/posts/:month/:day", function (req, res) {
  return res.send(req.params);
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

// ...

// Serve uploaded images
router.get("/uploads/:imageId", async (req, res) => {
  try {
    const image = await stitched.findById(req.params.imageId);

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
