const router = require("express").Router();
const db = require("../../../db");

router.get("/", (req, res) => {
  let userId = req.user.userId;
  let qry = "SELECT * FROM cart WHERE userId = ?";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

router.delete("/:productId", (req, res) => {
  let userId = req.user.userId;
  let productId = req.params.productId;
  let qry = "DELETE FROM cart WHERE userId = ? AND productId = ?";

  db.query(qry, [userId, productId], (err) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(true);
  });
});

router.patch("/:productId", (req, res) => {
  let userId = req.user.userId;
  let productId = req.params.productId;
  let change = req.body.quantity;
  let qry = "SELECT * FROM cart WHERE userId = ? AND productId = ?";

  db.query(qry, [userId, productId], (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    if (rows.length > 0) {
      let quantity = rows[0].quantity;
      quantity += change;

      if (quantity <= 0) {
        let qry1 = "DELETE FROM cart WHERE userId = ? AND productId = ?";
        db.query(qry1, [userId, productId], (err) => {
          if (err) return res.status(500).send("Internal Error");
          return res.send(true);
        });
      } else {
        let qry1 =
          "UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?";

        db.query(qry1, [quantity, userId, productId], (err) => {
          if (err) return res.status(500).send("Internal Error");
          return res.send(true);
        });
      }
    } else {
      return res.send(false);
    }
  });
});

router.get("/quantity", (req, res) => {
  let userId = req.user.userId;
  let qry = "SELECT SUM(quantity) AS cartQuantity FROM cart WHERE userId = ?";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

module.exports = router;
