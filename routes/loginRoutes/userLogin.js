const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { tokenHeaders } = require("../../const");
const db = require("../../db");
const bcrypt = require("bcryptjs");

router.post("/", (req, res) => {
  let userEmail = req.body.userEmail;
  let userPassword = req.body.userPassword;

  let qry = "SELECT * FROM user WHERE userEmail = ? LIMIT 1";
  db.query(qry, userEmail, async (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    if (rows.length > 0) {
      let hashedPass = rows[0].userPassword;
      let valid = await bcrypt.compare(userPassword, hashedPass);
      if (!valid) return res.status(400).send("Invalid pass");

      const token = jwt.sign(
        { userId: rows[0].userId, userEmail: userEmail, time: Date.now() },
        process.env.USER_TOKEN_SECRET
      );
      let data = {
        uid: rows[0].userId,
        token: token,
      };
      return res.header(tokenHeaders.USER_TOKEN_HEADER, token).send(data);
    }
    res.status(400).send("No user with these credentials");
  });
});

module.exports = router;
