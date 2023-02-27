const { Router } = require("express");
const productController = require("../controllers/product.controller");
const reviewController = require("../controllers/review.controller");
const router = Router();

/** @route /api/products */
router.route("/").get(productController.getProducts);

/** @route /api/products/:id */
router.route("/:id").get(productController.getSingleProduct);

/** @route /api/products */
router.route("/").post(productController.createProduct);

/** @route /api/products/:id */
router.route("/:id").put(productController.updateProduct);

/** @route /api/products/:id */
router.route("/:id").delete(productController.deleteProduct);

/** @route /api/products/:id/reviews */
router.route("/:id/reviews").get(reviewController.getReviews);

/** @route /api/products/:productId/users/:userId */
router.route("/").patch(productController.addFavoriteProduct);

/** @route /api/products/seed */
router.route("/seed").post(productController.seedProducts);

module.exports = router;
