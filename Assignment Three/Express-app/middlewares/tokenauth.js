module.exports = function (req, res, next) {
  const jwt = require("jsonwebtoken");
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decodedToken = jwt.verify(token, "your-secret-key");
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send("Unauthorized");
  }
};
