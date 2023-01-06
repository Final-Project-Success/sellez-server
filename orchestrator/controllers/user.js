const axios = require("axios");

class Controller {
  static async register(req, res, next) {
    try {
      console.log(req.body);
      const { data } = await axios.post(
        `${process.env.BASE_URL_USER}/register`,
        {
          ...req.body,
        }
      );

      res.status(201).json(data);
    } catch (err) {
      console.log(err);
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async login(req, res, next) {
    try {
      const { data } = await axios.post(`${process.env.BASE_URL_USER}/login`, {
        ...req.body,
      });

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(err.response.status).json(err.response.data);
    }
  }
}

module.exports = Controller;
