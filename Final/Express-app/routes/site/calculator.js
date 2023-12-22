const express = require("express");
const router = express.Router();

router.post("/calculate", (req, res) => {
  const operand1 = parseFloat(req.body.operand1);
  const operand2 = parseFloat(req.body.operand2);
  const operation = req.body.operation;

  let result = null;

  switch (operation) {
    case "+":
      result = operand1 + operand2;
      break;
    case "-":
      result = operand1 - operand2;
      break;
    case "*":
      result = operand1 * operand2;
      break;
    case "/":
      result = operand2 !== 0 ? operand1 / operand2 : "Cannot divide by zero";
      break;
    default:
      result = "Invalid operation";
  }

  // Store form data and result in session
  const formData = { operand1, operand2, operation, result };
  req.session.results = [formData, ...(req.session.results || [])];

  // Redirect back to the form
  res.redirect("/calculator");
});
router.get("/calculator", (req, res) => {
  // Retrieve results from session
  const results = req.session.results || [];

  // Render the calculator page with the results
  res.render("calculator", { results });
});
module.exports = router;
