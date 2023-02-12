const { Router } = require("express");
const reviewController = require("../controllers/review.controller");
const router = Router();

/** @route /reviews */
router.route("/").post(reviewController.createReview);

/** @route /reviews/:id */
router.route("/:id").delete(reviewController.deleteReview);

module.exports = router;
