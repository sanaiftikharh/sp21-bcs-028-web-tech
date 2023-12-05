const mongoose = require("mongoose");
let stitchedSchema = mongoose.Schema({
  details: String,
  color: String,
  price: Number,
  image: {
    data: Buffer, // Store binary image data
    contentType: String, // Store the content type (e.g., image/jpeg, image/png)
  },
});
const stitched = mongoose.model("Stitched", stitchedSchema); //a class will be created name=Stitched
module.exports = stitched;
