const router = require("express").Router();
const db = require("../../../db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const imgUpload = require("../../../uploadImages");

// TODO: delete product from whole website.

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // let dir = `./public/products`;
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
}).array("productImg");

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
  let qry = "SELECT * FROM shop WHERE userId = ?";

  db.query(qry, userId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

deleteImages = (qry0, productId) => {
  return new Promise((resolve, reject) => {
    db.query(qry0, productId, (err) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};
uploadImages = (qry1, productId, otherImgUrl) => {
  return new Promise((resolve, reject) => {
    db.query(qry1, [productId, otherImgUrl], (err) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};

router.post("/", (req, res) => {
  let userId = req.user.userId;

  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }

    let files = req.files;
    let poster = files[0];
    let categoryId = parseInt(req.body.categoryId);

    let qry =
      "INSERT INTO product (productTitle, productPrice, productMRP, productDescription, productPosterImgUrl, categoryId, productTags, phoneNumber, whatsappNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      qry,
      [
        req.body.title,
        parseFloat(req.body.price),
        parseFloat(req.body.mrp),
        req.body.description,
        poster.path,
        parseInt(req.body.categoryId),
        req.body.tags,
        req.body.phoneNumber,
        req.body.whatsappNumber,
      ],
      async (err, rows) => {
        if (err) return res.status(500).send("Internal Error");

        let productId = rows.insertId;

        try {
          for (let i = 1; i < files.length; i++) {
            let qry1 =
              "INSERT INTO other_images (productId, otherImgUrl) VALUES (?, ?)";

            let path = await imgUpload(files[i].path);
            await uploadImages(qry1, productId, path);
          }

          let posterpath = await imgUpload(poster.path);

          let qry2 =
            "INSERT INTO shop (userId, productId) VALUES (?, ?); INSERT INTO category (categoryId, productId) VALUES (?, ?); UPDATE product SET productPosterImgUrl = ? WHERE productId = ?;";
          db.query(
            qry2,
            [userId, productId, categoryId, productId, posterpath, productId],
            (err) => {
              if (err) return res.status(500).send("Internal Error");
              res.send("Product Inserted");
            }
          );
        } catch (error) {
          return res.status(500).send("Internal Error =>" + error.message);
        }
      }
    );
  });
});

router.patch("/:productId", (req, res) => {
  let productId = req.params.productId;

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }

    let files = req.files;
    let poster = files[0];
    let categoryId = parseInt(req.body.categoryId);

    try {
      let posterpath = await imgUpload(poster.path);

      let qry =
        "UPDATE product SET productTitle = ?, productPrice = ?, productMRP = ?, productDescription = ?, productPosterImgUrl = ?, categoryId = ?, productTags = ? WHERE productId = ?";
      db.query(
        qry,
        [
          req.body.title,
          parseFloat(req.body.price),
          parseFloat(req.body.mrp),
          req.body.description,
          posterpath,
          parseInt(req.body.categoryId),
          req.body.tags,
          productId,
        ],
        async (err) => {
          if (err) return res.status(500).send("Internal Error");

          try {
            let qry0 = "DELETE FROM other_images WHERE productId = ?";
            await deleteImages(qry0, productId);

            for (let i = 1; i < files.length; i++) {
              let qry1 =
                "INSERT INTO other_images (productId, otherImgUrl) VALUES (?, ?)";
              let path = await imgUpload(files[i].path);
              await uploadImages(qry1, productId, path);
            }

            let qry2 = "DELETE FROM category WHERE productId = ?";
            await deleteImages(qry2, productId);

            let qry3 =
              "INSERT INTO category (categoryId, productId) VALUES (?, ?)";
            db.query(qry3, [categoryId, productId], (err) => {
              if (err) return res.status(500).send("Internal Error");
              res.send("Product Updated");
            });
          } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Error");
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Error");
    }
  });
});

module.exports = router;
