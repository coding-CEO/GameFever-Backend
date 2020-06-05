const router = require("express").Router();
const db = require("./db");

router.get("/:query", (req, res) => {
  let query = req.params.query;
  let qry =
    "SELECT productId FROM product WHERE productTitle LIKE ? OR productDescription LIKE ? OR productTags LIKE ?";

  let val = "%" + query + "%";

  db.query(qry, [val, val, val], (err, rows) => {
    if (err) return res.status(500).send("Internal Error");

    if (rows.length > 0) {
      return res.send(rows);
    } else {
      return res.status(400).send("No product Found");
    }
  });
});

module.exports = router;
