const { Router } = require("express");
const orderController = require("../controllers/order.controller");

const router = Router();

/** @route /orders */
router.route("/").get(orderController.getOrders);

/** @route /orders/:id */
router.route("/:id").get(orderController.getSingleOrder);

/** @route /orders */
router.route("/").post(orderController.createOrder);

/** @route /orders/:id */
router.route("/:id").delete(orderController.deleteOrder);

/** @route /orders/:id/pay */
router.route("/:id/pay").patch(orderController.markOrderAsPaid);

/** @route /orders/:id/deliver */
router.route("/:id/deliver").patch(orderController.markOrderAsDelivered);


module.exports = router;
