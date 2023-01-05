const axios = require("axios");

const redis = require("../config/connectRedis");

class Controller {
  static async addProduct(req, res, next) {
    try {
      const { data } = await axios.post(process.env.BASE_URL_PRODUCT, {
        ...req.body,
      });

      await axios.post(process.env.BASE_URL_IMAGE, {
        ...req.body,
      });

      await redis.del("products");

      res.status(201).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async readAllProducts(req, res, next) {
    try {
      const chaceData = await redis.get("products");
      if (chaceData) {
        return res.status(200).json(JSON.parse(chaceData));
      }
      const { data } = await axios.get(process.env.BASE_URL_PRODUCT);
      await redis.set("products", JSON.stringify(data));

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async readDetailProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.get(`${process.env.BASE_URL_PRODUCT}/${id}`);

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async editProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.put(
        `${process.env.BASE_URL_PRODUCT}/${id}`,
        { ...req.body }
      );

      await redis.del("products");

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.delete(
        `${process.env.BASE_URL_PRODUCT}/${id}`
      );
      await redis.del("products");

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
}

module.exports = Controller;
