const router = require("express").Router();
const shopProduct = require("./shopProduct");
const shopProfile = require("./shopProfile");
const db = require("../../../db");

router.get("/", (req, res) => {
  let userId = req.user.userId;
  let qry =
    "SELECT shopProfilePicUrl, shopName FROM shop_profile WHERE userId = ? LIMIT 1";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

router.use("/profile", shopProfile);
router.use("/products", shopProduct);

module.exports = router;
