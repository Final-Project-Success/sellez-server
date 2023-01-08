const { Order } = require("../models");
const redis = require("../config/connectRedis");

class Controller {
  static async addOrders(req, res, next) {
    try {
      const { totalPrice, shippingCost } = req.body;

      const newOrder = await Order.create({
        totalPrice,
        UserId: req.User.id,
        shippingCost,
        status: false,
      });

      await redis.del("sellez-orders");

      res.status(201).json(newOrder);
    } catch (err) {
      next(err);
    }
  }
  static async readAllOrders(req, res, next) {
    try {
      const chaceData = await redis.get("sellez-orders");

      if (chaceData) {
        return JSON.parse(chaceData);
      }

      const orders = await Order.findAll();

      await redis.set("sellez-orders", JSON.stringify(orders));

      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  }
  static async readOneOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);

      if (!order) {
        throw {
          name: "Order Not Found",
        };
      }
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  }
  static async checkOutOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { totalPrice, shippingCost } = req.body;
      const order = await Order.findByPk(id);

      if (!order) {
        throw {
          name: "Order Not Found",
        };
      }

      await Order.update(
        {
          totalPrice,
          shippingCost,
        },
        { where: { id, status: false } }
      );

      await redis.del("sellez-orders");

      res.status(200).json({ msg: "Success to order" });
    } catch (err) {
      next(err);
    }
  }
  static async updateStatusOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);

      if (!order) {
        throw {
          name: "Order Not Found",
        };
      }

      await Order.update({ status: true }, { where: { id } });
      await redis.del("sellez-orders");

      res.status(200).json({
        msg: "Order already paid",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
