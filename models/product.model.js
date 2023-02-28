const mongoose = require("mongoose");
const reviewModel = require("./review.model");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    slug: { type: String, required: true },
    favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

productSchema.pre("deleteOne", { document: true }, async function (next) {
  await reviewModel.deleteMany({ product: this._id });
  next();
});

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = productModel;
