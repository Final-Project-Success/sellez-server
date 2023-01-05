const bcrypt = require("bcryptjs");

module.exports = {
  hashPassword(password) {
    return (hash = bcrypt.hashSync(password, 8));
  },
  comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  },
};
