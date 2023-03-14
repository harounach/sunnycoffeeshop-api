const { Router } = require("express");
const paymentController = require("../controllers/payment.controller");
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");
const router = Router();

/** @route /api/payments/stripe */
router.route("/stripe").post(isAuth, paymentController.payWithStripe);

module.exports = router;
