const router = require("express").Router();
const db = require("./db");
const userAuth = require("./tokenValidations/userTokenValidation");

router.get("/", (req, res) => {
  let productId = req.productId;
  let qry =
    "SELECT userId, rateNumber, rateMessage FROM rating WHERE productId = ?";

  db.query(qry, productId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error =>" + err);
    return res.send(rows);
  });
});

router.get("/:userId", (req, res) => {
  let userId = req.params.userId;
  let qry =
    "SELECT userFirstName, userLastName FROM general_profile WHERE userId = ? LIMIT 1";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");

    return res.send(rows);
  });
});

router.post("/", userAuth, (req, res) => {
  let userId = req.user.userId;
  let productId = req.productId;
  let rating = req.body.rating;

  let qry = "SELECT * FROM rating WHERE userId = ? AND productId = ?";
  db.query(qry, [userId, productId], (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    if (rows.length > 0) {
      let qry1 =
        "UPDATE rating SET rateNumber = ?, rateMessage = ? WHERE userId = ? AND productId = ?";
      db.query(
        qry1,
        [rating.rateNumber, rating.rateMessage, userId, productId],
        (err) => {
          if (err) return res.status(500).send("Internal Error");
          return res.send(userId.toString());
        }
      );
    } else {
      let qry1 =
        "INSERT INTO rating (userId, productId, rateNumber, rateMessage) VALUES (?, ?, ?, ?)";
      db.query(
        qry1,
        [userId, productId, rating.rateNumber, rating.rateMessage],
        (err) => {
          if (err) return res.status(500).send("Internal Error");
          return res.send(userId.toString());
        }
      );
    }
  });
});

module.exports = router;
