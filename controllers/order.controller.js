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
  const orders = await OrderModel.find().lean().exec();
  res.status(200).json({ message: "Get orders", data: orders });
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

    if (newOrder) {
      res.status(201).json({ message: "Order created successfuly" });
    } else {
      res.status(400).json({ error: "Invalid order data received" });
    }
  } catch (error) {
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
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.json({ error: "Unable to delete order" });
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
    res.json({ message: "Order paid successfully" });
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
    res.json({ message: "Order delivered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Unable to deliver order" });
  }
};
