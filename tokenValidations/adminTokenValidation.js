const jwt = require("jsonwebtoken");
const { tokenHeaders } = require("../const");
const LIMIT = 1000 * 60 * 30; //30 Minutes

// TOKEN VALIDATION HERE...
function adminAuth(req, res, next) {
  const token = req.header(tokenHeaders.ADMIN_TOKEN_HEADER);
  try {
    const varified = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
    if (Date.now() - varified.time > LIMIT) {
      return res.status(401).send("ACCESS DENIED");
    }
    req.user = varified;
    next();
  } catch (error) {
    res.status(401).send("ACCESS DENIED");
  }
}

module.exports = adminAuth;
