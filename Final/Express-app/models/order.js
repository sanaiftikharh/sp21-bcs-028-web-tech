const mongoose = require("mongoose");
const Joi = require("joi");
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
  totalAmount: {
    type: Number,
  },
  shippingAddress: {
    addressLine1: {
      type: String,
    },
    addressLine2: String,
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  paymentMethod: {
    type: String,
    enum: ["Cash on Delivery"], // Adjust as needed
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  // Add other fields as needed
});
orderSchema.statics.validate = function (data) {
  const orderSchema = Joi.object({
    userId: Joi.string().required(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        model: Joi.string(),
      })
    ),
    totalAmount: Joi.number().required(),
    shippingAddress: Joi.object({
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }),
    paymentMethod: Joi.string().valid("Cash on Delivery").required(),
    orderDate: Joi.date(),
  });

  const result = orderSchema.validate(data, { abortEarly: false });

  if (result.error) {
    return result.error.details.map((error) => error.message);
  }

  return null;
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
