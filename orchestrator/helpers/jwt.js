const jwt = require("jsonwebtoken");

module.exports = {
  jwtVerify(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
  },
};
