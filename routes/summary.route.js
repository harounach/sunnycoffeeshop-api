const { Router } = require("express");
const summaryController = require("../controllers/summary.controller");
const router = Router();

/** @route /api/summary */
router.route("/").get(summaryController.getSummary);

module.exports = router;
