const jwt = require("jsonwebtoken");
//require("dotenv").config();
module.exports = function (req, res, next) {
  const token = req.header("Authorization")
  if (!token) return res.status(401).json({
    message: "No Token Found"
  });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ""), process.env.SECRET_KEY);
    req.userinfo = decoded;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: "Invalid Token"
    });
  }
};