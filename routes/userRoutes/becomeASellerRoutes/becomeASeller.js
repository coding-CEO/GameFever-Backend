const router = require("express").Router();
const db = require("../../../db");
const { becomeASellerStatuses } = require("../../../const");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const imgUpload = require("../../../uploadImages");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // let dir = `./public/users/${req.user.userId}/shopApplication`;
    let dir = "./public/temp";
    if (fs.existsSync(dir)) {
      cb(null, dir);
    } else {
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    }
  },
  filename: (req, file, cb) => {
    let paths = path.parse(file.originalname);
    if (paths.ext.trim().length > 0) {
      cb(null, Date.now() + file.originalname);
    } else {
      let ext = getFileType(file.mimetype);
      if (ext) {
        cb(null, Date.now() + file.originalname + ext);
      } else {
        // NO EXTENSION
        console.error("No extension found");
      }
    }
  },
});
let upload = multer({
  storage: storage,
}).array("aadhar");

getFileType = (type) => {
  switch (type) {
    case "image/jpeg":
      return ".jpeg";
    case "image/png":
      return ".png";
    case "image/jpg":
      return ".jpg";
    default:
      return null;
  }
};

router.get("/", (req, res) => {
  let userId = req.user.userId;
  let qry = "SELECT * FROM become_a_seller WHERE userId = ? LIMIT 1";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");

    return res.send(rows);
  });
});

router.post("/", (req, res) => {
  let userId = req.user.userId;

  // let dir = `./public/users/${req.user.userId}/shopApplication`;
  // if (fs.existsSync(dir)) {
  //   fsExtra.emptyDirSync(dir);
  // }

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }

    let files = req.files;
    if (files.length >= 2) {
      let qry =
        "INSERT INTO shop_application (userId, frontAadharCardImgUrl, backAadharCardImgUrl, firstName, lastName, age, isMale, phoneNumber, whatsappNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

      try {
        let frontAadharPath = await imgUpload(files[0].path);
        let backAadharPath = await imgUpload(files[1].path);

        db.query(
          qry,
          [
            userId,
            frontAadharPath,
            backAadharPath,
            req.body.firstName,
            req.body.lastName,
            parseInt(req.body.age),
            req.body.isMale === "true" ? true : false,
            req.body.phoneNumber,
            req.body.whatsappNumber,
          ],
          (err) => {
            if (err) return res.status(500).send("Internal Error");

            let qry1 = "UPDATE become_a_seller SET status = ? WHERE userId = ?";
            db.query(
              qry1,
              [becomeASellerStatuses.BECOME_A_SELLER_STATUS_PENDING, userId],
              (err) => {
                if (err) return res.status(500).send("Internal Error");
                res.send("Application uploaded");
              }
            );
          }
        );
      } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Error");
      }
    }
  });
});

module.exports = router;
