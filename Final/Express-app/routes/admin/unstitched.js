const express = require("express");
let router = express.Router();
let Unstitched = require("../../models/unstitched");
const upload = require("../../middlewares/upload");

//route to deliver an edit form
router.get("/unstitched/edit/:id", async (req, res) => {
  let unstitched = await Unstitched.findById(req.params.id);
  res.render("admin/unstitched/edit", { layout: "adminlayout", unstitched });
});
router.post(
  "/unstitched/edit/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      let errors = Unstitched.validate(req.body);

      if (errors) {
        req.session.flash = { type: "danger", message: errors[0] };
        return res.redirect("back");
      }

      // Find the existing unstitched document by ID
      let unstitched = await Unstitched.findById(req.params.id);

      // Update details, color, and price
      unstitched.details = req.body.details;
      unstitched.color = req.body.color;
      unstitched.price = req.body.price;

      // Check if a new image is being uploaded
      if (req.file) {
        // If yes, update the image property
        unstitched.image = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      // Save the updated unstitched document
      await unstitched.save();

      req.session.flash = { type: "success", message: "Unstitched Updated!" };
      res.redirect("/admin/unstitched/index");
    } catch (error) {
      console.error("Error updating unstitched document:", error);
      req.session.flash = { type: "danger", message: "Internal Server Error" };
      res.redirect("/admin/unstitched/index");
    }
  }
);

//route to delete a Unstitched
router.get("/unstitched/delete/:id", async (req, res) => {
  let unstitched = await Unstitched.findByIdAndDelete(req.params.id);
  req.session.flash = { type: "danger", message: "Unstitched Deleted!" };
  res.redirect("/admin/unstitched/index");
});

router.get("/unstitched/add", async (req, res) => {
  res.render("admin/unstitched/add", { layout: "adminlayout" });
});
router.post("/unstitched/add", upload.single("image"), async (req, res) => {
  // Validate user input
  let errors = Unstitched.validate(req.body);

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

  const newStitched = new Unstitched({ details, color, price, image });

  await newStitched.save();
  req.session.flash = { type: "success", message: "Unstitched Saved!" };
  res.redirect("/admin/unstitched/:page?");
});
router.get("/unstitched", async (req, res) => {
  res.render("products/unstitched");
});
router.get("/unstitched/:page?", async (req, res) => {
  let page = req.params.page ? req.params.page : 1;
  page = Number(page);
  let pageSize = 3;
  let unstitched = await Unstitched.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);
  let StitchedCount = await Unstitched.countDocuments();
  let totalPages = Math.ceil(StitchedCount / pageSize);
  res.render("admin/unstitched/index", {
    layout: "adminlayout",
    unstitched,
    page,
    totalPages,
  });
});
module.exports = router;
