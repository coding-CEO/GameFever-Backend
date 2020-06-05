const router = require("express").Router();
const db = require("../../../db");

router.get("/", (req, res) => {
  let userId = req.user.userId;
  let qry = "SELECT * FROM payment_info WHERE userId = ?";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");

    return res.send(rows);
  });
});

router.post("/", (req, res) => {
  let userId = req.user.userId;
  let paymentInfo = req.body.paymentInfo;
  let qry =
    "INSERT INTO payment_info (userId, paymentNumber, paymentName, paymentExpiryMonth, paymentExpiryYear) VALUES (?, ?, ?, ?, ?)";

  db.query(
    qry,
    [
      userId,
      paymentInfo.paymentNumber,
      paymentInfo.paymentName,
      paymentInfo.paymentExpiryMonth,
      paymentInfo.paymentExpiryYear,
    ],
    (err) => {
      if (err) return res.status(500).send("Internal Error");

      return res.send("payment card inserted !");
    }
  );
});

router.get("/:paymentInfoId", (req, res) => {
  let paymentInfoId = req.params.paymentInfoId;
  let qry = "SELECT * FROM payment_info WHERE paymentInfoId = ? LIMIT 1";

  db.query(qry, paymentInfoId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

router.delete("/:paymentInfoId", (req, res) => {
  let paymentInfoId = req.params.paymentInfoId;
  let qry = "DELETE FROM payment_info WHERE paymentInfoId = ?";

  db.query(qry, paymentInfoId, (err) => {
    if (err) return res.status(500).send("Internal Error");

    res.send("payment card deleted");
  });
});

router.patch("/:paymentInfoId", (req, res) => {
  let paymentInfoId = req.params.paymentInfoId;
  let paymentInfo = req.body.paymentInfo;

  let qry =
    "UPDATE payment_info SET paymentNumber = ?, paymentName = ?, paymentExpiryMonth = ?, paymentExpiryYear = ? WHERE paymentInfoId = ?";

  db.query(
    qry,
    [
      paymentInfo.paymentNumber,
      paymentInfo.paymentName,
      paymentInfo.paymentExpiryMonth,
      paymentInfo.paymentExpiryYear,
      paymentInfoId,
    ],
    (err) => {
      if (err) return res.status(500).send("Internal Error");
      res.send("Payment Card updated");
    }
  );
});

module.exports = router;
