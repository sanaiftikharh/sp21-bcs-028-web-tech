const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
  name: String,
  email: String,
  phoneNo: Number,
  password: String,
  role: String,
});
const user = mongoose.model("User", userSchema); //a class will be created name=Stitched
module.exports = user;
