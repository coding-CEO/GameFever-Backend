const router = require("express").Router();
const profilePicRoute = require("./profilePic");
const db = require("../../../db");

router.get("/", (req, res) => {
  let userId = req.user.userId;
  let qry = "SELECT * FROM general_profile WHERE userId = ? LIMIT 1";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

router.use("/profilePic", profilePicRoute);

router.patch("/firstName", (req, res) => {
  let userId = req.user.userId;
  let first_name = req.body.first_name;
  let qry = "UPDATE general_profile SET userFirstName = ? WHERE userId = ?";
  db.query(qry, [first_name, userId], (err) => {
    if (err) return res.status(500).send("Internal Error =>" + err);
    res.send("first name success");
  });
});

router.patch("/lastName", (req, res) => {
  let userId = req.user.userId;
  let last_name = req.body.last_name;
  let qry = "UPDATE general_profile SET userLastName = ? WHERE userId = ?";
  db.query(qry, [last_name, userId], (err) => {
    if (err) return res.status(500).send("Internal Error =>" + err);
    res.send("last name success");
  });
});

router.patch("/age", (req, res) => {
  let userId = req.user.userId;
  let age = req.body.age;
  let qry = "UPDATE general_profile SET userAge = ? WHERE userId = ?";
  db.query(qry, [age, userId], (err) => {
    if (err) return res.status(500).send("Internal Error =>" + err);
    res.send("age success");
  });
});

router.patch("/gender", (req, res) => {
  let userId = req.user.userId;
  let isMale = req.body.isMale;
  let qry = "UPDATE general_profile SET userIsMale = ? WHERE userId = ?";
  db.query(qry, [isMale, userId], (err) => {
    if (err) return res.status(500).send("Internal Error =>" + err);
    res.send("gender success");
  });
});

module.exports = router;
