const express = require("express");
const User = require("../../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});
router.get("/logout", (req, res) => {
  req.session.user = null;
  req.session.flash = { type: "info", message: "Logged Out" };
  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) return res.redirect("/register");
  const isvalid = await bcrypt.compare(password, user.password);
  if (isvalid) {
    req.session.user = user;
    req.session.flash = { type: "success", message: "Logged in Successfully" };
    return res.redirect("/");
  } else {
    req.session.flash = { type: "danger", message: "Try Again" };
    res.redirect("/login");
  }
});

router.post("/register", async (req, res) => {
  let error = User.validate(req.body);
  if (error) {
    req.session.flash = { type: "success", message: error.details[0].message };
    return res.redirect("back");
  }
  let user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  req.session.flash = { type: "success", message: "Registered Successfully" };
  return res.redirect("/");
});

module.exports = router;
