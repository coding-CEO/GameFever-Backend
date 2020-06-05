const router = require("express").Router();
const userSignUp = require("./userSignUp");

// USE USER SIGNUP HERE...
router.use("/user", userSignUp);

module.exports = router;
