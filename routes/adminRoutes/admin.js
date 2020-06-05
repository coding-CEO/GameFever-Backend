const router = require("express").Router();
const shopApplicationRoute = require("./shopApplication");

router.get("/", (req, res) => {
  // CAN GET ACCESS TO ADMIN PAGE...
  res.send(true);
});

router.use("/shop-applications", shopApplicationRoute);

module.exports = router;
