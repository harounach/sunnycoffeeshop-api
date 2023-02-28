const mongoose = require("mongoose");
const { Request, Response } = require("express");
const ProductModel = require("../models/product.model");
const { seedData } = require("../utils/data");

/**
 * Get products
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getProducts = async (req, res) => {
  let { q, perpage = 8, page = 1, filter, order = -1 } = req.query;

  page = Number(page);
  perpage = Number(perpage);
  order = Number();

  const searchFilter = q
    ? {
        title: {
          $regex: q,
          $options: "i",
        },
      }
    : {};

  const products = await ProductModel.find(searchFilter)
    .sort({ createdAt: order })
    .limit(perpage * 1)
    .skip((page - 1) * perpage)
    .lean()
    .exec();
  const count = await ProductModel.countDocuments(searchFilter);
  const pages = Math.ceil(count / perpage);
  res.json({
    message: "Get products",
    pages,
    page,
    data: products,
    count,
  });
};

/**
 * Get single product
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;

  // Validate data
  if (!id) {
    return res.status(400).json({ error: "Product id is required" });
  }

  try {
    // Find the product with this id
    const product = await ProductModel.findById(id).lean().exec();

    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    res.json({ message: "Get product", data: product });
  } catch (error) {
    res.status(400).json({ error: "Invalid product data received" });
  }
};

/**
 * Create product
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.createProduct = async (req, res) => {
  const { title, description, price, image, slug } = req.body;

  // Validate data
  if (!title || !description || !price || !image || !slug) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Create product
  const newProduct = await ProductModel.create({
    title,
    description,
    price,
    image,
    slug,
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
  const { id } = req.params;
  const { title, description, price, image, slug } = req.body;

  // Validate data
  if (!id || !title || !description || !price || !image || !slug) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Find the product with this id
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
    productToUpdate.slug = slug;
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
  const { id } = req.params;

  // Validate data
  if (!id) {
    return res.status(400).json({ error: "Product id is required" });
  }

  try {
    // Find the product with this id
    const productToDelete = await ProductModel.findById(id).exec();

    // Check if product exists
    if (!productToDelete) {
      return res.status(400).json({ error: "Product not found" });
    }

    const deletedProduct = await productToDelete.deleteOne();
    res.json({ message: "Product deleted successfully", data: deletedProduct });
  } catch (error) {
    res.json({ error: "Unable to delete product" });
  }
};

/**
 * Get favorite products
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getFavoriteProducts = async (req, res) => {
  const { userId } = req.params;
  try {
    const favoriteProducts = await ProductModel.find({
      favoritedBy: userId,
    })
      .lean()
      .exec();

    res
      .status(200)
      .json({ message: "Get favorite products", data: favoriteProducts });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Unable to get favoirte products" });
  }
};

/**
 * Add favorite product
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.addFavoriteProduct = async (req, res) => {
  const { productId, userId } = req.params;
  try {
    const favoredProduct = await ProductModel.findById(productId);
    // Check if the user already favored this product
    if (favoredProduct.favoritedBy.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You already favored this product" });
    }
    favoredProduct.favoritedBy.push(userId);
    await favoredProduct.save();
    res.status(200).json({ message: "Product added to favoirte" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Unable to add product to favoirte" });
  }
};

/**
 * Delete favorite product
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.deleteFavoriteProduct = async (req, res) => {
  const { productId, userId } = req.params;
  try {
    const favoredProduct = await ProductModel.findById(productId);
    // Check if the user already favored this product
    if (!favoredProduct.favoritedBy.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You did not favored this product before" });
    }

    // filter favoritedBy array to exlude userId
    favoredProduct.favoritedBy = favoredProduct.favoritedBy.filter((id) => {
      return id.toString() !== userId;
    });

    favoredProduct.save();
    res
      .status(200)
      .json({ message: "Product deleted from favorite successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json("Unable to delete product from favorite");
  }
};

/**
 * Seed products
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.seedProducts = async (req, res) => {
  // Create products
  const newProducts = await ProductModel.insertMany(seedData);

  if (newProducts) {
    res.status(201).json({ message: "Products created successfuly" });
  } else {
    res.status(400).json({ error: "Invalid product data received" });
  }
};
