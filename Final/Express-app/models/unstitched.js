const mongoose = require("mongoose");
const Joi = require("joi");
let unstitchedSchema = mongoose.Schema({
  details: String,
  color: String,
  price: Number,
  image: {
    data: Buffer, // Store binary image data
    contentType: String, // Store the content type (e.g., image/jpeg, image/png)
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
unstitchedSchema.statics.validate = function (data) {
  const unstitchedSchema = Joi.object({
    details: Joi.string().min(10).required(),
    color: Joi.string().min(3).required(),
    price: Joi.number().required(),
  });

  const result = unstitchedSchema.validate(data, { abortEarly: false });

  if (result.error) {
    return result.error.details.map((error) => error.message);
  }

  return null;
};
const unstitched = mongoose.model("Unstitched", unstitchedSchema); //a class will be created name=Stitched
module.exports = unstitched;
