const { Router } = require("express");
const productController = require("../controllers/product.controller");
const reviewController = require("../controllers/review.controller");
const router = Router();

/** @route /products */
router.route("/").get(productController.getProducts);

/** @route /products/:id */
router.route("/:id").get(productController.getSingleProduct);

/** @route /products */
router.route("/").post(productController.createProduct);

/** @route /products/:id */
router.route("/:id").put(productController.updateProduct);

/** @route /products/:id */
router.route("/:id").delete(productController.deleteProduct);

/** @route /products/:id/reviews */
router.route("/:id/reviews").get(reviewController.getReviews);

module.exports = router;
