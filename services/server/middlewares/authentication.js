const { jwtVerify } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = {
  async authentication(req, res, next) {
    try {
      const { access_token } = req.headers;

      if (!access_token) {
        throw {
          name: "Unauthorized",
        };
      }

      const payload = jwtVerify(access_token);
      const user = await User.findByPk(payload.id);

      if (!user) {
        throw {
          name: "Unauthorized",
        };
      }

      req.User = {
        id: user.id,
        email: user.email,
      };

      next();
    } catch (err) {
      next(err);
    }
  },
  async authenticationAdmin(req, res, next) {
    try {
      const { access_token } = req.headers;

      if (!access_token) {
        throw {
          name: "Unauthorized",
        };
      }

      const payload = jwtVerify(access_token);
      const user = await User.findByPk(payload.id);

      if (!user || !user.role === "admin") {
        throw {
          name: "Unauthorized",
        };
      }

      req.User = {
        id: user.id,
        email: user.email,
      };

      next();
    } catch (err) {
      next(err);
    }
  },
};
