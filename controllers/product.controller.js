const { Request, Response } = require("express");
const ProductModel = require("../models/product.model");

/**
 * Get products
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getProducts = async (req, res) => {
  const products = await ProductModel.find().lean().exec();
  res.json({ message: "Get products", data: products });
};

/**
 * Create product
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.createProduct = async (req, res) => {
  const { title, description, price, image } = req.body;

  // Validate data
  if (!title || !description || !price || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Create product
  const newProduct = await ProductModel.create({
    title,
    description,
    price,
    image,
  });

  if (newProduct) {
    res.status(201).json({ message: "Product created successfuly" });
  } else {
    res.status(400).json({ error: "Invalid product data received" });
  }
};

/**
 * Update product
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.updateProduct = async (req, res) => {
  const { id, title, description, price, image } = req.body;

  // Validate data
  if (!title || !description || !price || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find the product with this is
    const productToUpdate = await ProductModel.findById(id).exec();

    // Check if product exists
    if (!productToUpdate) {
      return res.status(400).json({ error: "Product not found" });
    }

    // Now update the product
    productToUpdate.title = title;
    productToUpdate.description = description;
    productToUpdate.price = price;
    productToUpdate.image = image;
    await productToUpdate.save();

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(400).json({ error: "Unable to update product" });
  }
};

/**
 * Delete product
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.deleteProduct = async (req, res) => {
  const { id } = req.body;

  // Validate data
  if (!id) {
    return res.status(400).json({ error: "Product id is required" });
  }

  try {
    // Find the product with this is
    const productToDelete = await ProductModel.findById(id).exec();

    // Check if product exists
    if (!productToDelete) {
      return res.status(400).json({ error: "Product not found" });
    }

    await productToDelete.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.json({ error: "Unable to delete product" });
  }
};
