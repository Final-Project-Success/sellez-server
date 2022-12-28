const axios = require("axios");

class Controller {
  static async register(req, res, next) {
    try {
      const { data } = await axios.post(process.env.BASE_URL_USER, {
        ...req.body,
      });

      res.status(201).json(data);
    } catch (err) {
      res.status(err.response.status).json({ msg: err.response.data.msg });
    }
  }
  static async login(req, res, next) {
    try {
      const { data } = await axios.post(process.env.BASE_URL_USER, {
        ...req.body,
      });

      res.status(201).json(data);
    } catch (err) {
      res.status(err.response.status).json({ msg: err.response.data.msg });
    }
  }
  static async editBalance(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.put(`${process.env.BASE_URL_USER}/${id}`, {
        ...req.body,
      });

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json({ msg: err.response.data.msg });
    }
  }
}

module.exports = Controller;
