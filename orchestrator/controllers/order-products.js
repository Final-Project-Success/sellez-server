const axios = require("axios");

const redis = require("../config/connectRedis");

class Controller {
  static async postOrderProduct(req, res, next) {
    try {
      const { data } = await axios.post(process.env.BASE_URL_ORDERPRODUCT, {
        ...req.body,
      });
      await redis.del("orderProducts");

      res.status(201).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async getOrderProduct(req, res, next) {
    try {
      const chaceData = await redis.get("orderProducts");

      if (chaceData) {
        return res.status(200).json(JSON.parse(chaceData));
      }

      const { data } = await axios.get(process.env.BASE_URL_ORDERPRODUCT);

      await redis.set("orderProducts", JSON.stringify(data));

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async getDetailOrderProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.get(
        `${process.env.BASE_URL_ORDERPRODUCT}/${id}`
      );

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async deleteOrderProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.delete(
        `${process.env.BASE_URL_ORDERPRODUCT}/${id}`
      );
      await redis.del("orderProducts");

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
}

module.exports = Controller;
