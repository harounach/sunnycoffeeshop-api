const { Request, Response } = require("express");
const OrderModel = require("../models/order.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Get single product
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.payWithStripe = async (req, res) => {
  const { orderId, redirectUrl } = req.body;

  const order = await OrderModel.findById(orderId).exec();
  const lineItems = order.orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
        },
        unit_amount: Number(item.price) * 100
      },
      quantity: item.qty,
    };
  });
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer_email: order.shipping.email,
      line_items: lineItems,
      // amount_subtotal: order.itemsPrice,
      // amount_total: order.totalPrice,
      mode: "payment",
      success_url: `${redirectUrl}/?success=true`,
      cancel_url: `${redirectUrl}/?canceled=true`,
    });

    console.log(session);

    res.status(200).json({url: session.url, sessionId: session.id});
  } catch (err) {
    res.status(err.statusCode || 500).json({error: err.message});
  }
};
