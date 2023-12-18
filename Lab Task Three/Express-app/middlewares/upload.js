const multer = require("multer");

// Configure multer to handle file uploads
const storage = multer.memoryStorage(); // Store files in memory as Buffers
const upload = multer({ storage: storage });

module.exports = upload;
