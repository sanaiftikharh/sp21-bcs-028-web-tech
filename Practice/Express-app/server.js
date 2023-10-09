const express = require("express");
const app = express();
//const port = process.env.PORT || 3000;

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));

// Set up routes (You can create separate route files in the "routes" folder)
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
