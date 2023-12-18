const express = require("express");
let router = express.Router();
let Stitched = require("../../models/stitched");
const upload = require("../../middlewares/upload");

//route to deliver an edit form
router.get("/stitched/edit/:id", async (req, res) => {
  let stitched = await Stitched.findById(req.params.id);
  res.render("admin/stitched/edit", { layout: "adminlayout", stitched });
});
router.post("/stitched/edit/:id", upload.single("image"), async (req, res) => {
  try {
    let errors = Stitched.validate(req.body);

    if (errors) {
      req.session.flash = { type: "danger", message: errors[0] };
      return res.redirect("back");
    }

    // Find the existing stitched document by ID
    let stitched = await Stitched.findById(req.params.id);

    // Update details, color, and price
    stitched.details = req.body.details;
    stitched.color = req.body.color;
    stitched.price = req.body.price;

    // Check if a new image is being uploaded
    if (req.file) {
      // If yes, update the image property
      stitched.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Save the updated stitched document
    await stitched.save();

    req.session.flash = { type: "success", message: "Stitched Updated!" };
    res.redirect("/admin/stitched/index");
  } catch (error) {
    console.error("Error updating stitched document:", error);
    req.session.flash = { type: "danger", message: "Internal Server Error" };
    res.redirect("/admin/stitched/index");
  }
});

//route to delete a Stitched
router.get("/stitched/delete/:id", async (req, res) => {
  let stitched = await Stitched.findByIdAndDelete(req.params.id);
  req.session.flash = { type: "danger", message: "Stitched Deleted!" };
  res.redirect("/admin/stitched/index");
});

router.get("/stitched/add", async (req, res) => {
  res.render("admin/stitched/add", { layout: "adminlayout" });
});
router.post("/stitched/add", upload.single("image"), async (req, res) => {
  // Validate user input
  let errors = Stitched.validate(req.body);

  if (errors) {
    // If there are validation errors, flash the first error message
    req.session.flash = { type: "danger", message: errors[0] };
    return res.redirect("back");
  }
  const { details, color, price } = req.body;

  if (!details || !color || !price) {
    return res.status(400).send("Details, color, and price are required");
  }

  // Access the uploaded image data from req.file
  const image = {
    data: req.file.buffer, // The binary image data
    contentType: req.file.mimetype, // The content type of the image
  };

  const newStitched = new Stitched({ details, color, price, image });

  await newStitched.save();
  req.session.flash = { type: "success", message: "Stitched Saved!" };
  res.redirect("/admin/stitched/:page?");
});
router.get("/stitched", async (req, res) => {
  res.render("products/stitched");
});
router.get("/stitched/:page?", async (req, res) => {
  let page = req.params.page ? req.params.page : 1;
  page = Number(page);
  let pageSize = 3;
  let stitched = await Stitched.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);
  let StitchedCount = await Stitched.countDocuments();
  let totalPages = Math.ceil(StitchedCount / pageSize);
  res.render("admin/stitched/index", {
    layout: "adminlayout",
    stitched,
    page,
    totalPages,
  });
});
module.exports = router;
