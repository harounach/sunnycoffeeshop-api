const { Router } = require("express");
const orderController = require("../controllers/order.controller");
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");

const router = Router();

/** @route /orders */
router.route("/").get(isAuth, isAdmin, orderController.getOrders);

/** @route /orders/:id */
router.route("/:id").get(isAuth, orderController.getSingleOrder);

/** @route /orders */
router.route("/").post(isAuth, orderController.createOrder);

/** @route /orders/:id */
router.route("/:id").delete(isAuth, isAdmin, orderController.deleteOrder);

/** @route /orders/:id/pay */
router.route("/:id/pay").patch(isAuth, orderController.markOrderAsPaid);

/** @route /orders/:id/deliver */
router.route("/:id/deliver").patch(isAuth, isAdmin, orderController.markOrderAsDelivered);

/** @route /orders/:id/session */
router.route("/:id/session").patch(isAuth, orderController.saveSession);


module.exports = router;
