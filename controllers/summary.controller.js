const { Request, Response } = require("express");
const ProductModel = require("../models/product.model");
const OrderModel = require("../models/order.model");
const UserModel = require("../models/user.model");

/**
 * Get products
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getSummary = async (req, res) => {
  try {
    const productCount = await ProductModel.countDocuments();
    const orderCount = await OrderModel.countDocuments();
    const userCount = await UserModel.countDocuments();
    // const orders = await OrderModel.find()
    //   .sort({ itemsPrice: 1 })
    //   .select({
    //     _id: 1,
    //     orderItems: 1,
    //   })
    //   .limit(5);

    // const orderItems = orders.map((order) => {
    //   return order.orderItems;
    // });

    // const items = [].concat(...orderItems);

    // console.log(items);

    // // const orderProducts = await ProductModel.find({ orders[0].orderItems })

    // // console.log(orders[0]);

    const ordersPriceGroup = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          sales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const ordersPrice =
      ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

    const salesData = await OrderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      message: "Get summary successfully",
      data: {
        productCount,
        orderCount,
        userCount,
        ordersPrice,
        salesData,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Unable to get summary" });
  }
};
