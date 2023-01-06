const axios = require("axios");
const { jwtVerify } = require("../helpers/jwt");

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
      const { data } = await axios.get(
        `${process.env.BASE_URL_USER}/${payload.id}`
      );

      if (!data) {
        throw {
          name: "Unauthorized",
        };
      }

      req.User = {
        id: data.id,
        email: data.email,
      };

      next();
    } catch (err) {
      next(err);
    }
  },
};
