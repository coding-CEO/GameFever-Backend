const jwt = require("jsonwebtoken");
const { tokenHeaders } = require("../const");
const LIMIT = 1000 * 60 * 60 * 24 * 7; // 7 Days

// TOKEN VALIDATION HERE...
function userAuth(req, res, next) {
  const userName = req.params.userName;
  const token = req.header(tokenHeaders.USER_TOKEN_HEADER);
  try {
    const varified = jwt.verify(token, process.env.USER_TOKEN_SECRET);
    if (Date.now() - varified.time > LIMIT) {
      return res.status(401).send("ACCESS DENIED TOKEN EXPIRED");
    }
    if (!userName || varified.userId == userName) {
      req.user = varified;
      next();
    } else {
      return res.status(400).send("You are logged in with another user ID");
    }
  } catch (error) {
    res.status(401).send("ACCESS DENIED");
  }
}

module.exports = userAuth;
