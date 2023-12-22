const mongoose = require("mongoose");
const Joi = require("joi");

let userSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true, // Enforce uniqueness
  },
  password: String,
  role: String,
});

userSchema.statics.validate = function (data) {
  const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    email: Joi.string().email().min(3).required(),
  });

  const result = userSchema.validate(data, { abortEarly: false });

  if (result.error) {
    return result.error.details.map((error) => error.message);
  }

  return null;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
