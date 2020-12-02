const router = require("express").Router();
const adminTokenValidation = require("./tokenValidations/adminTokenValidation");
const db = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const imgUpload = require('./uploadImages');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // let dir = "./public/banners";
    let dir = "./public/temp";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } else {
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
}).array("banners");

// =========>
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

// GETTING ALL BANNERS
router.get("/", (req, res) => {
  let qry = "SELECT * FROM banners";
  db.query(qry, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

getBanners = (qry2, values) => {
  return new Promise((resolve, reject) => {
    db.query(qry2, [values], (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
};

router.post("/", adminTokenValidation, (req, res) => {
  let qry1 = "DELETE FROM banners";
  db.query(qry1, (err) => {
    if (err) return res.status(500).send("Internal Error");

    // let dir = "/public/banners";
    // if (fs.existsSync(dir)) {
    //   fsExtra.emptyDirSync(dir);
    // }

    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err.message);
      }

      let files = req.files;
      let qry2 = "INSERT INTO banners(bannerImgUrl) VALUES ?";
      let values = [];

      try {

        for (let file of files) {
          let path = await imgUpload(file.path);
          values.push([path]);
        }

        await getBanners(qry2, values);
        return res.send("Success");
      } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error");
      }
    });
  });
});

module.exports = router;
