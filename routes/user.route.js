const { Router } = require("express");
const userController = require("../controllers/user.controller");
const orderController = require("../controllers/order.controller");
const productController = require("../controllers/product.controller");
const router = Router();

/** @route /api/users/register */
router.route("/register").post(userController.register);

/** @route /api/users/login */
router.route("/login").post(userController.login);

/** @route /api/users */
router.route("/").get(userController.getUsers);

/** @route /api/users/:id/orders */
router.route("/:id/orders").get(orderController.getUserOrders);

/** @route /api/users/:userId/products */
router.route("/:userId/products").get(productController.getFavoriteProducts);

/** @route /api/users/:userId/products/:productId */
router.route("/:userId/products/:productId").patch(productController.addFavoriteProduct);

/** @route /api/users/:userId/products/:productId */
router.route("/:userId/products/:productId").delete(productController.deleteFavoriteProduct);

module.exports = router;
