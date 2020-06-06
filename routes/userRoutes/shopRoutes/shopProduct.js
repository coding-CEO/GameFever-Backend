const router = require("express").Router();
const db = require("../../../db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// TODO: delete product from whole website.

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = `./public/products`;
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
      "INSERT INTO product (productTitle, productPrice, productMRP, productDescription, productPosterImgUrl, productStock, categoryId, productTags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      qry,
      [
        req.body.title,
        parseFloat(req.body.price),
        parseFloat(req.body.mrp),
        req.body.description,
        poster.path,
        parseInt(req.body.stock),
        parseInt(req.body.categoryId),
        req.body.tags,
      ],
      async (err, rows) => {
        if (err) return res.status(500).send("Internal Error");

        let productId = rows.insertId;
        for (let i = 1; i < files.length; i++) {
          let otherImgUrl = files[i].path;
          let qry1 =
            "INSERT INTO other_images (productId, otherImgUrl) VALUES (?, ?)";
          try {
            await uploadImages(qry1, productId, otherImgUrl);
          } catch (error) {
            return res.status(500).send("Internal Error =>" + error.message);
          }
        }

        let qry2 =
          "INSERT INTO shop (userId, productId) VALUES (?, ?); INSERT INTO category (categoryId, productId) VALUES (?, ?);";
        db.query(qry2, [userId, productId, categoryId, productId], (err) => {
          if (err) return res.status(500).send("Internal Error");

          res.send("Product Inserted");
        });
      }
    );
  });
});

router.patch("/:productId", (req, res) => {
  let productId = req.params.productId;

  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }

    let files = req.files;
    let poster = files[0];
    let categoryId = parseInt(req.body.categoryId);

    let qry =
      "UPDATE product SET productTitle = ?, productPrice = ?, productMRP = ?, productDescription = ?, productPosterImgUrl = ?, productStock = ?, categoryId = ?, productTags = ? WHERE productId = ?";
    db.query(
      qry,
      [
        req.body.title,
        parseFloat(req.body.price),
        parseFloat(req.body.mrp),
        req.body.description,
        poster.path,
        parseInt(req.body.stock),
        parseInt(req.body.categoryId),
        req.body.tags,
        productId,
      ],
      async (err) => {
        if (err) return res.status(500).send("Internal Error");

        let qry0 = "DELETE FROM other_images WHERE productId = ?";
        await deleteImages(qry0, productId);

        for (let i = 1; i < files.length; i++) {
          let otherImgUrl = files[i].path;
          let qry1 =
            "INSERT INTO other_images (productId, otherImgUrl) VALUES (?, ?)";
          try {
            await uploadImages(qry1, productId, otherImgUrl);
          } catch (error) {
            return res.status(500).send("Internal Error =>" + error.message);
          }
        }

        let qry2 = "DELETE FROM category WHERE productId = ?";
        await deleteImages(qry2, productId);

        let qry3 = "INSERT INTO category (categoryId, productId) VALUES (?, ?)";
        db.query(qry3, [categoryId, productId], (err) => {
          if (err) return res.status(500).send("Internal Error");

          res.send("Product Updated");
        });
      }
    );
  });
});

module.exports = router;
