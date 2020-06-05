const router = require("express").Router();
const adminLogin = require("./adminLogin");
const userLogin = require("./userLogin");

// USE USER AND ADMIN LOGIN HERE...
router.use("/admin", adminLogin);
router.use("/user", userLogin);

module.exports = router;
