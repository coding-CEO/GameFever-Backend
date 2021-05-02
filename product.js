const router = require("express").Router();
const db = require("./db");
const ratingRoute = require("./rating");
// const userAuth = require("./tokenValidations/userTokenValidation");

router.use("/:productId/rating", getParams, ratingRoute);

function getParams(req, res, next) {
  req.productId = req.params.productId;
  next();
}

router.get("/:productId", (req, res) => {
  let productId = req.params.productId;
  let qry = "SELECT * FROM product WHERE productId = ? LIMIT 1";
  db.query(qry, productId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");

    return res.send(rows);
  });
});

// router.post("/:productId/add-to-cart", userAuth, (req, res) => {
//   let userId = req.user.userId;
//   let productId = req.params.productId;
//   let qry = "SELECT * FROM cart WHERE userId = ? AND productId = ?";

//   db.query(qry, [userId, productId], (err, rows) => {
//     if (err) return res.status(500).send("Internal Error");
//     if (rows.length > 0) {
//       return res.status(400).send({ userId: userId });
//     } else {
//       let qry1 =
//         "INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)";
//       db.query(qry1, [userId, productId, 1], (err, rows) => {
//         if (err) return res.status(500).send("Internal Error");
//         return res.send({ userId: userId });
//       });
//     }
//   });
// });

router.get("/:productId/other-imgs", (req, res) => {
  let productId = req.params.productId;
  let qry =
    "SELECT otherImgId, otherImgUrl FROM other_images WHERE productId = ?";

  db.query(qry, productId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");
    return res.send(rows);
  });
});

router.get("/:productId/short", (req, res) => {
  let productId = req.params.productId;
  let qry =
    "SELECT productTitle, productPrice, productPosterImgUrl, productMRP FROM product WHERE productId = ? LIMIT 1";
  db.query(qry, productId, (err, rows) => {
    if (err) return res.status(500).send("Internal Error");

    return res.send(rows);
  });
});

module.exports = router;
