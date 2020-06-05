const router = require("express").Router();
const db = require("../../db");
const bcrypt = require("bcryptjs");
const { becomeASellerStatuses } = require("../../const");
const fs = require("fs");

router.post("/", (req, res) => {
  let userEmail = req.body.userEmail;
  let userPassword = req.body.userPassword;

  let qry = "SELECT * FROM user WHERE userEmail = ? LIMIT 1";
  db.query(qry, userEmail, async (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    if (rows.length > 0) {
      return res.status(400).send("User Already Exists");
    }

    try {
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(userPassword, salt);

      let qry1 = `INSERT INTO user (userEmail, userPassword) VALUES (?, ?);`;
      db.query(qry1, [userEmail, hashedPassword], (err, rows) => {
        if (err) return res.status(500).send("Internal Error 222 => " + err);

        let uid = rows.insertId;
        if (rows.affectedRows > 0) {
          let qry2 =
            "INSERT INTO general_profile (userId) VALUES (?); INSERT INTO become_a_seller (userId, status) VALUES (?, ?);";
          db.query(
            qry2,
            [uid, uid, becomeASellerStatuses.BECOME_A_SELLER_STATUS_NOT],
            (err) => {
              if (err)
                return res.status(500).send("Internal Error 333 =>" + err);
              let dir = `./public/users/${uid}`;
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                res.send("SignUp Success !");
              } else {
                res.send("SignUp Success !");
              }
            }
          );
        } else {
          res.status(400).send("SignUp Failed");
        }
      });
    } catch (err) {
      return res.status(500).send("Internal Error");
    }
  });
});

module.exports = router;
