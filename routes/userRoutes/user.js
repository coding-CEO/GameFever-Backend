const router = require("express").Router();
const generalInfoRoute = require("./generalInfoRoutes/generalInfo");
// const cartRoute = require("./cartRoutes/cart");
// const addressContactInfoRoute = require("./addressContactInfoRoutes/addressContactInfo");
// const paymentInfoRoute = require("./paymentInfoRoutes/paymentInfo");
const becomeASellerRoute = require("./becomeASellerRoutes/becomeASeller");
const shopRoute = require("./shopRoutes/shop");

// router.use("/cart", cartRoute);
router.use("/generalProfile", generalInfoRoute);
// router.use("/address-contact-info", addressContactInfoRoute);
// router.use("/payment-info", paymentInfoRoute);
router.use("/become-a-seller", becomeASellerRoute);
router.use("/shop", shopRoute);

module.exports = router;
