const mongoose = require("mongoose");
const Joi = require("joi");

let stitchedSchema = mongoose.Schema({
  details: String,
  color: String,
  price: Number,
  size: String,
  image: {
    type: {
      data: Buffer, // Store binary image data
      contentType: String,
    },
    required: true, // Store the content type (e.g., image/jpeg, image/png)
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
stitchedSchema.statics.validate = function (data) {
  const stitchedSchema = Joi.object({
    details: Joi.string().min(10).required(),
    color: Joi.string().min(3).required(),
    size: Joi.string().min(1).required(),
    price: Joi.number().required(),
  });

  const result = stitchedSchema.validate(data, { abortEarly: false });

  if (result.error) {
    return result.error.details.map((error) => error.message);
  }

  return null;
};

const stitched = mongoose.model("Stitched", stitchedSchema); //a class will be created name=Stitched
module.exports = stitched;
