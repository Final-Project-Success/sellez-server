const jwt = require("jsonwebtoken");

module.exports = {
  jwtSign(payload) {
    return jwt.sign(payload, process.env.SECRET_KEY);
  },
  jwtVerify(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
  },
};
