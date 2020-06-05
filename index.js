const express = require("express");
const dotenv = require("dotenv");
const banners = require("./banners");
const homeCards = require("./homeCards");
const adminRoute = require("./routes/adminRoutes/admin");
const userRoute = require("./routes/userRoutes/user");
const loginRoute = require("./routes/loginRoutes/login");
const productRoute = require("./product");
const categoryRoute = require("./category");
const searchRoute = require("./search");
const signUpRoute = require("./routes/signUpRoutes/signUp");
const adminTokenValidation = require("./tokenValidations/adminTokenValidation");
const userTokenValidation = require("./tokenValidations/userTokenValidation");
const cors = require("cors");

const app = express();

///////////////////////
// OTHER STUFF HERE...
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Credentials", true);
  // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
dotenv.config();
app.use("/public", express.static("public"));

///////////////////////
// MIDDLEWARES HERE...
app.get("/user/", userTokenValidation, (req, res) => {
  res.send(req.user);
});
app.use("/user/:userName", userTokenValidation, userRoute);
app.use("/admin", adminTokenValidation, adminRoute);
app.use("/login", loginRoute);
app.use("/signUp", signUpRoute);
app.use("/banners", banners);
app.use("/homeCards", homeCards);
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/search", searchRoute);

///////////////////////
// DIRECT CODE HERE...

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});
