const express = require("express");
const User = require("../../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.session.user = null;
  req.session.flash = { type: "info", message: "Logged Out" };
  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    req.session.flash = {
      type: "danger",
      message: "Email not registered. Please sign up.",
    };
    return res.redirect("/register");
  }

  const isvalid = await bcrypt.compare(password, user.password);
  if (isvalid) {
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

    req.session.user = user.toObject();
    req.session.flash = { type: "success", message: "Logged in Successfully" };
    return res.redirect("/");
  } else {
    req.session.flash = { type: "danger", message: "Try Again" };
    res.redirect("/login");
  }
});

router.post("/register", async (req, res) => {
  // Validate user input
  let errors = User.validate(req.body);

  if (errors) {
    // If there are validation errors, flash the first error message
    req.session.flash = { type: "danger", message: errors[0] };
    return res.redirect("back");
  }

  try {
    // If validation passes, create a new user
    let user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    // Flash success message and redirect
    req.session.flash = { type: "success", message: "Registered Successfully" };
    return res.redirect("/");
  } catch (error) {
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      req.session.flash = { type: "danger", message: "Email already in use" };
      return res.redirect("back");
    }

    // Handle other errors, e.g., database save error
    console.error("Error saving user:", error);
    req.session.flash = {
      type: "danger",
      message: "An error occurred during registration.",
    };
    return res.redirect("back");
  }
});

module.exports = router;
