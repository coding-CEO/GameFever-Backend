const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { tokenHeaders } = require("../../const");

router.post("/", (req, res) => {
  const adminId = req.body.adminId;
  const adminPass = req.body.adminPass;

  if (
    adminId === process.env.ADMIN_ID &&
    adminPass === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { iAdmin: "TRUE", time: Date.now() },
      process.env.ADMIN_TOKEN_SECRET
    );
    res.header(tokenHeaders.ADMIN_TOKEN_HEADER, token).send(token);
  } else {
    res.status(400).send("Invalid Credentials");
  }
});

module.exports = router;
