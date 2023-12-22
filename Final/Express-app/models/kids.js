const mongoose = require("mongoose");
let kidSchema = mongoose.Schema({
  details: String,
  color: String,
  price: Number,
  size: String,
  image: {
    data: Buffer, // Store binary image data
    contentType: String, // Store the content type (e.g., image/jpeg, image/png)
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const kid = mongoose.model("Kid", kidSchema); //a class will be created name=Stitched
module.exports = kid;
