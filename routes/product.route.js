const { Router } = require("express");
const productController = require("../controllers/product.controller");
const reviewController = require("../controllers/review.controller");
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");
const router = Router();

/** @route /api/products */
router.route("/").get(productController.getProducts);

/** @route /api/products/:id */
router.route("/:id").get(productController.getSingleProduct);

/** @route /api/products */
router.route("/").post(isAuth, isAdmin, productController.createProduct);

/** @route /api/products/:id */
router.route("/:id").put(isAuth, isAdmin, productController.updateProduct);

/** @route /api/products/:id */
router.route("/:id").delete(isAuth, isAdmin, productController.deleteProduct);

/** @route /api/products/:id/reviews */
router.route("/:id/reviews").get(reviewController.getReviews);

/** @route /api/products/seed */
router.route("/seed").post(isAuth, isAdmin, productController.seedProducts);

module.exports = router;
