const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send(" Access Denied: Token not provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    // req.user._id can be used in the route handlers
    next();
  } catch (err) {
    res.status(400).send("Invlaid token.");
  }
};
