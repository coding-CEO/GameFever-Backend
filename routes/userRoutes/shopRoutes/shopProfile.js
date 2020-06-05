const router = require("express").Router();
const db = require("../../../db");
const multer = require("multer");
const fs = require("fs");
const fsExtra = require("fs-extra");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = `./public/users/${req.user.userId}/shopProfile`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } else {
      cb(null, dir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
let upload = multer({
  storage: storage,
}).single("shopProfilePic");

router.get("/", (req, res) => {
  let userId = req.user.userId;
  let qry = "SELECT * FROM shop_profile WHERE userId = ? LIMIT 1";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

router.patch("/", (req, res) => {
  let dir = `./public/users/${req.user.userId}/shopProfile`;
  if (fs.existsSync(dir)) {
    fsExtra.emptyDirSync(dir);
  }
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }

    let file = req.file;
    let qry2 = "UPDATE shop_profile SET shopProfilePicUrl = ? WHERE userId = ?";
    try {
      db.query(qry2, [file.path, req.user.userId], (err) => {
        if (err) return res.status(500).send("internal error 22 =>" + err);
        res.send(true);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Error");
    }
  });
});

router.patch("/shop-name", (req, res) => {
  let userId = req.user.userId;
  let shopName = req.body.shopName;
  let qry = "UPDATE shop_profile SET shopName = ? WHERE userId = ?";

  db.query(qry, [shopName, userId], (err) => {
    if (err) return res.status(500).send("Internal Error");
    res.send("Shop Name Updated");
  });
});

router.patch("/shop-description", (req, res) => {
  let userId = req.user.userId;
  let shopDescription = req.body.shopDescription;
  let qry = "UPDATE shop_profile SET shopDescription = ? WHERE userId = ?";

  db.query(qry, [shopDescription, userId], (err) => {
    if (err) return res.status(500).send("Internal Error");
    res.send("Shop Name Updated");
  });
});

module.exports = router;
