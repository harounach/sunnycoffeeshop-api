const { Router } = require("express");
const userController = require("../controllers/user.controller");
const orderController = require("../controllers/order.controller");
const productController = require("../controllers/product.controller");
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");
const router = Router();

/** @route /api/users/register */
router.route("/register").post(userController.registerUser);

/** @route /api/users/login */
router.route("/login").post(userController.loginUser);

/** @route /api/users/:id/updatename */
router.route("/:id/updatename").patch(isAuth, userController.updateUserName);

/** @route /api/users/:id/updateemail */
router.route("/:id/updateemail").patch(isAuth, userController.updateUserEmail);

/** @route /api/users/:id/updatepassword */
router.route("/:id/updatepassword").patch(isAuth, userController.updateUserPassword);

/** @route /api/users */
router.route("/").get(isAuth, isAdmin, userController.getUsers);

/** @route /api/users/:id/orders */
router.route("/:id/orders").get(isAuth, orderController.getUserOrders);

/** @route /api/users/:userId/products */
router.route("/:userId/products").get(isAuth, productController.getFavoriteProducts);

/** @route /api/users/:userId/products/:productId */
router.route("/:userId/products/:productId").patch(isAuth, productController.addFavoriteProduct);

/** @route /api/users/:userId/products/:productId */
router.route("/:userId/products/:productId").delete(isAuth, productController.deleteFavoriteProduct);

/** @route /api/users/seed */
router.route("/seed").post(userController.seedAdminUser);

module.exports = router;
