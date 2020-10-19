const router = require("express").Router();
const db = require("../../../db");
const multer = require("multer");
const fs = require("fs");
// const fsExtra = require("fs-extra");
const path = require("path");
const ftpclient = require("./ftpClient");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // let dir = `./public/users/${req.user.userId}/shopProfile`;
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
}).single("shopProfilePic");

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
  let qry = "SELECT * FROM shop_profile WHERE userId = ? LIMIT 1";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

createUserShopProfilePicFolder = (userId) => {
  return new Promise((resolve, reject) => {
    ftpclient.rmdir(`./users/${userId}/shopProfilePic`, true, (err) => {
      if (err) return reject(err);
      ftpclient.mkdir(`./users/${userId}/shopProfilePic`, (err) => {
        if (err) return reject(err);
        return resolve(true);
      });
    });
  });
};

uploadShopProfilePic = (userId, filepath, filename) => {
  return new Promise((resolve, reject) => {
    let databasePath = `users/${userId}/shopProfilePic/` + filename;
    let remotePath = "./" + databasePath;
    ftpclient.put(filepath, remotePath, (err) => {
      if (err) return reject(err);
      return resolve(databasePath);
    });
  });
};

router.patch("/", (req, res) => {
  const userId = req.user.userId;

  // let dir = `./public/users/${req.user.userId}/shopProfile`;
  // if (fs.existsSync(dir)) {
  //   fsExtra.emptyDirSync(dir);
  // }

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }

    let file = req.file;
    let qry2 = "UPDATE shop_profile SET shopProfilePicUrl = ? WHERE userId = ?";
    try {
      await createUserShopProfilePicFolder(userId);
      let filepath = await uploadShopProfilePic(
        userId,
        file.path,
        file.filename
      );

      db.query(qry2, [filepath, userId], (err) => {
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
