const { Request, Response } = require("express");
const mongoose = require("mongoose");
const ReviewModel = require("../models/review.model");
const ProductModel = require("../models/product.model");

/**
 * Get reviews
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getReviews = async (req, res) => {
  const { id } = req.params;

  // Validate data
  if (!id) {
    return res.status(400).json({ error: "Product id is required" });
  }

  try {
    // Find the product with this id
    const productWithReviews = await ProductModel.findById(id).exec();

    // Check if product exists
    if (!productWithReviews) {
      return res.status(400).json({ error: "Product not found" });
    }

    const reviews = await ReviewModel.find({
      product: mongoose.Types.ObjectId(id),
    })
      .lean()
      .exec();

    const count = reviews.length;
    const ratingSum = reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0);

    const rating = (ratingSum / count).toFixed(2);

    res.json({ message: "Get reviews", data: reviews, count, rating });
  } catch (error) {
    res.status(400).json({ error: "Unable to get reviews for this product" });
  }
};

/**
 * Create review
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.createReview = async (req, res) => {
  const { name, comment, rating, productId } = req.body;

  // Validate data
  if (!name || !comment || !rating || !productId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find the product with this id
    const productWithReviews = await ProductModel.findById(productId).exec();

    // Check if product exists
    if (!productWithReviews) {
      return res.status(400).json({ error: "Product not found" });
    }

    const newReview = await ReviewModel.create({
      name,
      rating,
      comment,
      product: mongoose.Types.ObjectId(productId),
    });

    if (newReview) {
      res
        .status(201)
        .json({ message: "Review created successfuly", data: newReview });
    } else {
      res.status(400).json({ error: "Invalid review data received" });
    }
  } catch (error) {
    res.status(400).json({ error: "Unable to create review" });
  }
};

/**
 * Delete review
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  // Validate data
  if (!id) {
    return res.status(400).json({ error: "Review id is required" });
  }

  try {
    // Find the review with this id
    const reviewToDelete = await ReviewModel.findById(id).exec();

    // Check if review exists
    if (!reviewToDelete) {
      return res.status(400).json({ error: "Review not found" });
    }

    const deletedReview = await reviewToDelete.deleteOne();
    res.json({ message: "Review deleted successfully", data: deletedReview });
  } catch (error) {
    res.json({ error: "Unable to delete review" });
  }
};
