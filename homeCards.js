const router = require("express").Router();
const adminTokenValidation = require("./tokenValidations/adminTokenValidation");
const db = require("./db");

// GETTING ALL HOME CARDS
getProducts = (qry1, result) => {
  return new Promise((resolve, reject) => {
    db.query(qry1, result.homeCardId, (error, rows) => {
      if (error) return reject(new Error("Internal Error"));
      let products = [];
      for (let item of rows) {
        let obj = {};
        obj.productId = item.productId;
        products.push(obj);
      }
      resolve(products);
    });
  });
};

router.get("/", (req, res) => {
  let qry = "SELECT * FROM home_card_info";
  let homeCards = [];
  db.query(qry, async (err, results) => {
    if (err) return res.status(500).send("Internal Error");
    try {
      for (let result of results) {
        let homeCard = {};
        homeCard.id = result.homeCardId;
        homeCard.title = result.homeCardTitle;
        homeCard.products = [];
        let qry1 = "SELECT productId FROM home_card WHERE homeCardId = ?";
        try {
          homeCard.products = await getProducts(qry1, result);
        } catch (error) {
          return res.status(500).send("Internal Error 111 =>" + error);
        }
        homeCards.push(homeCard);
      }
      return res.send(homeCards);
    } catch (error) {
      return res.status(500).send("Internal Error 222 =>" + error);
    }
  });
});

getPostProducts = (qry2, homeCard) => {
  return new Promise((resolve, reject) => {
    db.query(qry2, homeCard.title, (err, result) => {
      if (err) return reject(err);
      if (result.insertId) {
        let homeCardId = result.insertId;
        let qry3 = "INSERT INTO home_card (homeCardId, productId) VALUES ?";
        let values = [];
        for (let product of homeCard.products) {
          let proId = parseInt(product.productId);
          if (!isNaN(proId)) values.push([homeCardId, proId]);
        }

        if (values.length > 0) {
          db.query(qry3, [values], (err) => {
            if (err) return reject(err);
            resolve(true);
          });
        }
      }
    });
  });
};

router.post("/", adminTokenValidation, (req, res) => {
  let qry1 =
    "DELETE home_card, home_card_info FROM home_card INNER JOIN home_card_info";
  db.query(qry1, async (err) => {
    if (err) return res.status(500).send("Internal Error");
    try {
      let homeCards = req.body.homeCards;
      for (let homeCard of homeCards) {
        let qry2 = "INSERT INTO home_card_info (homeCardTitle) VALUES (?)";
        await getPostProducts(qry2, homeCard);
      }
      return res.send("Home cards saved successful");
    } catch (error) {
      return res.status(500).send("Internal Error" + error);
    }
  });
});

module.exports = router;
