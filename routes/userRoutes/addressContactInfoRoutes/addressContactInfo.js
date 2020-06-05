const router = require("express").Router();
const db = require("../../../db");

router.get("/", (req, res) => {
  let userId = req.user.userId;
  let qry = "SELECT * FROM address_contact WHERE userId = ?";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

router.get("/:addConInfoId", (req, res) => {
  let addConInfoId = req.params.addConInfoId;
  let qry = "SELECT * FROM address_contact WHERE addressContactId = ? LIMIT 1";

  db.query(qry, addConInfoId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");

    res.send(rows);
  });
});

router.delete("/:addConInfoId", (req, res) => {
  let addConInfoId = req.params.addConInfoId;
  let qry = "DELETE FROM address_contact WHERE addressContactId = ?";

  db.query(qry, addConInfoId, (err) => {
    if (err) return res.status(500).send("Internal Error");

    return res.send("delete success");
  });
});

router.patch("/:addConInfoId", (req, res) => {
  let addConInfo = req.body.addressContactInfo;
  let qry =
    "UPDATE address_contact SET addressContactTitle = ?, addressContactAddress = ?, phoneNumber = ?, pinCode = ?, city = ?, district = ?, state = ?, country = ? WHERE addressContactId = ?";

  db.query(
    qry,
    [
      addConInfo.addressContactTitle,
      addConInfo.addressContactAddress,
      addConInfo.phoneNumber,
      addConInfo.pinCode,
      addConInfo.city,
      addConInfo.district,
      addConInfo.state,
      addConInfo.country,
      addConInfo.addressContactId,
    ],
    (err) => {
      if (err) return res.status(500).send("Internal Error");
      res.send("update success");
    }
  );
});

router.post("/", (req, res) => {
  let userId = req.user.userId;
  let addConInfo = req.body.addressContactInfo;
  let qry =
    "INSERT INTO address_contact (userId, addressContactTitle, addressContactAddress, phoneNumber, pinCode, city, district, state, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    qry,
    [
      userId,
      addConInfo.addressContactTitle,
      addConInfo.addressContactAddress,
      addConInfo.phoneNumber,
      addConInfo.pinCode,
      addConInfo.city,
      addConInfo.district,
      addConInfo.state,
      addConInfo.country,
    ],
    (err) => {
      if (err) return res.status(500).send("Internal Error");
      res.send("Insertion success");
    }
  );
});

module.exports = router;
