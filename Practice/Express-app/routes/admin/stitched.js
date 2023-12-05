const express = require("express");
let router = express.Router();
let Stitched = require("../../models/stitched");

//route to deliver an edit form
router.get("/stitched/edit/:id", async (req, res) => {
  let stitched = await Stitched.findById(req.params.id);
  res.render("admin/stitched/edit", { layout: "adminlayout", stitched });
});
router.post("/stitched/edit/:id", async (req, res) => {
  let error = Stitched.validate(req.body);
  if (error) {
    req.session.flash = { type: "success", message: error.details[0].message };
    return res.redirect("back");
  }
  let stitched = await Stitched.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/admin/stitched");
});

//route to delete a Stitched
router.get("/stitched/delete/:id", async (req, res) => {
  let stitched = await Stitched.findByIdAndDelete(req.params.id);
  req.session.flash = { type: "danger", message: "Stitched Deleted!" };
  res.redirect("/admin/stitched");
});

router.get("/stitched/add", async (req, res) => {
  res.render("admin/stitched/add", { layout: "adminlayout" });
});
router.post("/stitched/add", async (req, res) => {
  let error = Stitched.validate(req.body);
  if (error) {
    req.session.flash = { type: "success", message: error.details[0].message };
    return res.redirect("back");
  }
  let stitched = new Stitched(req.body);
  await stitched.save();
  req.session.flash = { type: "success", message: "Stitched Saved!" };
  res.redirect("/admin/stitched");
});
router.get("/stitched", async (req, res) => {
  res.render("products/stitched");
});
router.get("/stitched/:page?", async (req, res) => {
  let page = req.params.page ? req.params.page : 1;
  page = Number(page);
  let pageSize = 3;
  let Stitcheds = await Stitched.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);
  let StitchedCount = await Stitched.countDocuments();
  let totalPages = Math.ceil(StitchedCount / pageSize);
  res.render("admin/stitched/index", {
    layout: "adminlayout",
    Stitcheds,
    page,
    totalPages,
  });
});
module.exports = router;
