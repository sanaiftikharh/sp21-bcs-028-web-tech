const mongoose = require("mongoose");
let unstitchedSchema = mongoose.Schema({
  details: String,
  color: String,
  price: Number,
  image: {
    data: Buffer, // Store binary image data
    contentType: String, // Store the content type (e.g., image/jpeg, image/png)
  },
});
const unstitched = mongoose.model("Unstitched", unstitchedSchema); //a class will be created name=Stitched
module.exports = unstitched;
