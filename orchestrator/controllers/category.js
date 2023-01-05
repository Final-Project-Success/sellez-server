const axios = require("axios");

const redis = require("../config/connectRedis");

class Controller {
  static async addCategory(req, res, next) {
    try {
      const { data } = await axios.post(process.env.BASE_URL_CATEGORY, {
        ...req.body,
      });
      await redis.del("categories");

      res.status(201).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async readAllCategories(req, res, next) {
    try {
      const chaceData = await redis.get("categories");
      if (chaceData) {
        return res.status(200).json(JSON.parse(chaceData));
      }
      const { data } = await axios.get(process.env.BASE_URL_CATEGORY);
      await redis.set("categories", JSON.stringify(data));

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async readDetailCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.get(
        `${process.env.BASE_URL_CATEGORY}/${id}`
      );

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async editCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.patch(
        `${process.env.BASE_URL_CATEGORY}/${id}`,
        { ...req.body }
      );

      await redis.del("categories");

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { data } = await axios.delete(
        `${process.env.BASE_URL_CATEGORY}/${id}`
      );
      await redis.del("categories");

      res.status(200).json(data);
    } catch (err) {
      res.status(err.response.status).json(err.response.data);
    }
  }
}

module.exports = Controller;
