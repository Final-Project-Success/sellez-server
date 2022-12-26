const bcrypt = require("bcryptjs");

module.exports = {
  toHashPassword(password) {
    return (hash = bcrypt.hashSync(password, 8));
  },
  toComparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  },
};
