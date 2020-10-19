const router = require("express").Router();
const db = require("../../../db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const fsExtra = require("fs-extra");
const ftpclient = require("../../../ftpClient");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // let dir = `./public/users/${req.user.userId}/profile`;
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
}).single("profilePic");

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
  let qry =
    "SELECT userProfilePicUrl FROM general_profile WHERE userId = ? LIMIT 1";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

createUserProfilePicFolder = (userId) => {
  return new Promise((resolve, reject) => {
    ftpclient.rmdir(`./users/${userId}/profilePic`, true, (err) => {
      if (err) return reject(err);
      ftpclient.mkdir(`./users/${userId}/profilePic`, (err) => {
        if (err) return reject(err);
        return resolve(true);
      });
    });
  });
};

uploadProfilePic = (userId, filepath, filename) => {
  return new Promise((resolve, reject) => {
    let databasePath = `users/${userId}/profilePic/` + filename;
    let remotePath = "./" + databasePath;
    ftpclient.put(filepath, remotePath, (err) => {
      if (err) return reject(err);
      return resolve(databasePath);
    });
  });
};

router.patch("/", (req, res) => {
  const userId = req.user.userId;

  // let dir = `./public/users/${req.user.userId}/profile`;
  // if (fs.existsSync(dir)) {
  //   fsExtra.emptyDirSync(dir);
  // }

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }

    let file = req.file;
    let qry2 =
      "UPDATE general_profile SET userProfilePicUrl = ? WHERE userId = ?";

    try {
      await createUserProfilePicFolder();
      let filepath = await uploadProfilePic(userId, file.path, file.filename);

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

module.exports = router;
