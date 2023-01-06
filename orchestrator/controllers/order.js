const axios = require("axios");

const redis = require("../config/connectRedis");

class Controller {
  static async addOrder(req, res, next) {
    try {
      const { data } = await axios.post(process.env.BASE_URL_ORDER, {
        ...req.body,
      });
      await redis.del("orders");

      res.status(201).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async readAllOrders(req, res, next) {
    try {
      const chaceData = await redis.get("orders");
      if (chaceData) {
        return res.status(200).json(JSON.parse(chaceData));
      }
      const { data } = await axios.get(process.env.BASE_URL_ORDER);
      await redis.set("orders", JSON.stringify(data));

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async readDetailOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.get(`${process.env.BASE_URL_ORDER}/${id}`);

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async editOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.patch(
        `${process.env.BASE_URL_ORDER}/${id}`,
        { ...req.body }
      );

      await redis.del("orders");

      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(err.response.status).json(err.response.data);
    }
  }
}

module.exports = Controller;
