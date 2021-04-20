const router = require("express").Router();
const db = require("../../db");
const { becomeASellerStatuses } = require("../../const");

router.get("/", (req, res) => {
  let qry =
    "SELECT shopApplicationId, firstName, lastName, age FROM shop_application";

  db.query(qry, (err, rows) => {
    if (err) return res.send("Internal Error");

    return res.send(rows);
  });
});

router.get("/:shopApplicationId", (req, res) => {
  let shopApplicationId = req.params.shopApplicationId;
  let qry =
    "SELECT * FROM shop_application WHERE shopApplicationId = ? LIMIT 1";

  db.query(qry, shopApplicationId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");

    if (rows.length > 0) return res.send(rows);
    else return res.status(404).send("Content Not Found");
  });
});

router.patch("/:shopApplicationId", (req, res) => {
  let shopApplicationId = req.params.shopApplicationId;
  let qry = "DELETE FROM shop_application WHERE shopApplicationId = ?";
  let becomeASeller = req.body.becomeASeller;

  db.query(qry, shopApplicationId, (err) => {
    if (err) return res.status(500).send("Internal Error");

    let qry1 =
      "UPDATE become_a_seller SET status = ?, message = ? WHERE userId = ?";
    db.query(
      qry1,
      [becomeASeller.status, becomeASeller.message, becomeASeller.userId],
      (err) => {
        if (err) return res.status(500).send("Internal Error");

        if (
          becomeASeller.status ===
          becomeASellerStatuses.BECOME_A_SELLER_STATUS_ACCEPTED
        ) {
          let qry2 =
            "INSERT INTO shop_profile (userId, shopName, phoneNumber, whatsappNumber) VALUES (?, ?, ?, ?)";
          db.query(
            qry2,
            [
              becomeASeller.userId,
              becomeASeller.name,
              becomeASeller.phoneNumber,
              becomeASeller.whatsappNumber,
            ],
            (err) => {
              if (err) return res.status(500).send("Internal Error");

              return res.send("Application accepted");
            }
          );
        } else {
          return res.send("application Rejected");
        }
      }
    );
  });
});

module.exports = router;
