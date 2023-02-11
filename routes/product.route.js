const { Router } = require("express");
const productController = require("../controllers/product.controller");
const router = Router();

router.route("/").get(productController.getProducts);

router.route("/create").post(productController.createProduct);

router.route("/update").post(productController.updateProduct);

router.route("/delete").post(productController.deleteProduct);

module.exports = router;
