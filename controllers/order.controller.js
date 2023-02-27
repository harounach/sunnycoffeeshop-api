const { Request, Response } = require("express");
const mongoose = require("mongoose");
const OrderModel = require("../models/order.model");
const { calculateItemsPrice } = require("../utils/orderUtils");

/**
 * Get orders
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getOrders = async (req, res) => {
  const { perpage = 8, page = 1, order = -1 } = req.query;

  const orders = await OrderModel.find()
    .sort({ createdAt: order })
    .limit(perpage * 1)
    .skip((page - 1) * perpage)
    .lean()
    .exec();

  const count = await OrderModel.countDocuments();
  const pages = Math.ceil(count / perpage);

  res.status(200).json({
    message: "Get orders",
    pages,
    page,
    data: orders,
    count,
  });
};

/**
 * Get single order
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getSingleOrder = async (req, res) => {
  const { id } = req.params;

  // Validate data
  if (!id) {
    return res.status(400).json({ error: "Order id is required" });
  }

  try {
    // Find the order with this id
    const order = await OrderModel.findById(id).lean().exec();

    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }

    res.json({ message: "Get order", data: order });
  } catch (error) {
    res.status(400).json({ error: "Invalid order data received" });
  }
};

/**
 * Get user orders
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getUserOrders = async (req, res) => {
  const { id } = req.params;
  const { perpage = 8, page = 1, order = -1 } = req.query;

  const orders = await OrderModel.find({ user: mongoose.Types.ObjectId(id) })
    .sort({ createdAt: order })
    .limit(perpage * 1)
    .skip((page - 1) * perpage)
    .lean()
    .exec();

  const count = await OrderModel.countDocuments({
    user: mongoose.Types.ObjectId(id),
  });
  const pages = Math.ceil(count / perpage);

  res.status(200).json({
    message: "Get user orders",
    pages,
    page,
    data: orders,
    count,
  });
};

/**
 * Create order
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.createOrder = async (req, res) => {
  const { shippingInfo, paymentInfo, orderItems, user } = req.body;

  // Validate data
  if (!shippingInfo || !paymentInfo || !orderItems || !user) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Order data
  const itemsPrice = calculateItemsPrice(orderItems);
  const taxPrice = 10;
  const shippingPrice = 0;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  try {
    // Create order
    const newOrder = await OrderModel.create({
      user: mongoose.Types.ObjectId(user),
      orderItems,
      shipping: shippingInfo,
      payment: paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    console.log(newOrder);

    if (newOrder) {
      res
        .status(201)
        .json({ message: "Order created successfuly", data: newOrder });
    } else {
      res.status(400).json({ error: "Invalid order data received" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Unable to create order" });
  }
};

/**
 * Delete order
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  // Validate date
  if (!id) {
    return res.status(400).json({ error: "Order id is required" });
  }

  try {
    // Find the order with this id
    const orderToDelete = await OrderModel.findById(id).exec();

    // Check if order exists
    if (!orderToDelete) {
      return res.status(400).json({ error: "Order not found" });
    }

    await orderToDelete.deleteOne();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Unable to delete order" });
  }
};

/**
 * Mark order as paid
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.markOrderAsPaid = async (req, res) => {
  const { id } = req.params;

  // Validate data
  if (!id) {
    return res.status(400).json({ error: "Order id is required" });
  }

  try {
    // Find the order with this id
    const orderToPay = await OrderModel.findById(id).exec();

    // Check if order exists
    if (!orderToPay) {
      return res.status(400).json({ error: "Order not found" });
    }

    // Now mark the order as paid and save it
    orderToPay.isPaid = true;
    orderToPay.paidAt = new Date();
    await orderToPay.save();
    res.status(200).json({ message: "Order paid successfully" });
  } catch (error) {
    res.status(400).json({ error: "Unable to pay order" });
  }
};

/**
 * Mark order as delivered
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.markOrderAsDelivered = async (req, res) => {
  const { id } = req.params;

  // Validate data
  if (!id) {
    return res.status(400).json({ error: "Order id is required" });
  }

  try {
    // Find the order with this id
    const orderToDeliver = await OrderModel.findById(id).exec();

    // Check if order exists
    if (!orderToDeliver) {
      return res.status(400).json({ error: "Order not found" });
    }

    // Now mark the order as delivered and save it
    orderToDeliver.isDelivered = true;
    orderToDeliver.deliveredAt = new Date();
    await orderToDeliver.save();
    res.status(200).json({ message: "Order delivered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Unable to deliver order" });
  }
};
