const { Router } = require("express");
const router = Router();

/** @route /api/test */
router.route("/").get((req, res) => {
	console.log(req.headers.origin);
	res.status(200).json({message: "Test route visited!"});
});

module.exports = router;