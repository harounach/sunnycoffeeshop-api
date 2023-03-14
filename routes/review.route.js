const { Router } = require("express");
const reviewController = require("../controllers/review.controller");
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");
const router = Router();

/** @route /reviews */
router.route("/").post(isAuth, reviewController.createReview);

/** @route /reviews/:id */
router.route("/:id").delete(isAuth, isAdmin, reviewController.deleteReview);

module.exports = router;
