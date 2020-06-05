const router = require("express").Router();
const db = require("./db");

router.get("/:categoryId", (req, res) => {
  let categoryId = req.params.categoryId;
  let qry = "SELECT * FROM category WHERE categoryId = ?";

  db.query(qry, [categoryId], (err, rows) => {
    if (err) return res.status(500).send("Internal Error => " + err);
    if (rows.length > 0) {
      return res.send(rows);
    } else {
      return res.status(400).send("No product in this Category");
    }
  });
});

module.exports = router;
