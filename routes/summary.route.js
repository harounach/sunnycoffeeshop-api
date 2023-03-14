const { Router } = require("express");
const summaryController = require("../controllers/summary.controller");
const { isAuth, isAdmin } = require("../middlewares/auth.middleware");
const router = Router();

/** @route /api/summary */
router.route("/").get(isAuth, isAdmin, summaryController.getSummary);

module.exports = router;
