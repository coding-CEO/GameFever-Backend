const router = require("express").Router();
const db = require("../../../db");
const multer = require("multer");
const fs = require("fs");
const fsExtra = require("fs-extra");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = `./public/users/${req.user.userId}/profile`;
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
}).single("profilePic");

router.get("/", (req, res) => {
  let userId = req.user.userId;
  let qry =
    "SELECT userProfilePicUrl FROM general_profile WHERE userId = ? LIMIT 1";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

router.patch("/", (req, res) => {
  let dir = `./public/users/${req.user.userId}/profile`;
  if (fs.existsSync(dir)) {
    fsExtra.emptyDirSync(dir);
  }

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }

    let file = req.file;
    let qry2 =
      "UPDATE general_profile SET userProfilePicUrl = ? WHERE userId = ?";
    try {
      db.query(qry2, [file.path, req.user.userId], (err, rows) => {
        if (err) return res.status(500).send("internal error 22 =>" + err);
        res.send(true);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Error");
    }
  });
});

module.exports = router;
