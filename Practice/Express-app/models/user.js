const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
  name: String,
  email: String,
  phoneNo: Number,
  password: String,
  role: String,
});
userSchema.statics.validate = function (data) {
  const Joi = require("joi");
  const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    password: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().min(3).max(10).required(),
  });
  let result = userSchema.validate(data, { abortEarly: false });
  return result.error;
};
const user = mongoose.model("User", userSchema); //a class will be created name=Stitched
module.exports = user;
