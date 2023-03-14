const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 1 },
    comment: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "scs_reviews"
  }
);

const ReviewModel =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
