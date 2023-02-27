const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    slug: { type: String, required: true },
    favoritedBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true,
  }
);

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = productModel;
