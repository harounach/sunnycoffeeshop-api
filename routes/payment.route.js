const { Router } = require("express");
const paymentController = require("../controllers/payment.controller");
const router = Router();

/** @route /api/payments/stripe */
router.route("/stripe").post(paymentController.payWithStripe);

module.exports = router;
