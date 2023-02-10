const { Router } = require("express");
const userController = require("../controllers/user.controller");
const router = Router();

router.route("/").get((req, res) => {
  res.send("User route");
});

/**
 * @route {"auth/register"}
 */
router.route("/register").post(userController.register);

router.route("/login").post(userController.login);

module.exports = router;
