const { OrderProduct } = require("../models");
const redis = require("../config/connectRedis");

class Controller {
  static async getOrderProduct(req, res, next) {
    try {
      const chaceData = await redis.get("sellez-orderProducts");

      if (chaceData) {
        return res.status(200).json(JSON.parse(chaceData));
      }

      const orderProducts = await OrderProduct.findAll();

      await redis.set("sellez-orderProducts", JSON.stringify(orderProducts));

      res.status(200).json(orderProducts);
    } catch (err) {
      next(err);
    }
  }
  static async getDetailOrderProduct(req, res, next) {
    try {
      const { id } = req.params;
      const orderProductsByProduct = await OrderProduct.findByPk(id);

      if (!orderProductsByProduct) {
        throw {
          name: "OrderProduct Not Found",
        };
      }

      res.status(200).json(orderProductsByProduct);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
