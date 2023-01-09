const { Order, User } = require("../models");
const redis = require("../config/connectRedis");
const axios = require("axios");
const Xendit = require("xendit-node");
const x = new Xendit({
  secretKey:
    "xnd_development_Pty6063htungzNhy6dVevIoocvaQ6ekaGg3f4QUUii61sCAuHADwwqsi2yjvNa", //! sementara ini
});

const { Invoice, Payout } = x;
const invoiceSpecificOptions = {};
const payoutSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);
const p = new Payout(payoutSpecificOptions);

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
        return res.status(200).json(JSON.parse(chaceData));
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
  static async destination(req, res, next) {
    try {
      const { data } = await axios({
        method: `GET`,
        url: `https://api.rajaongkir.com/starter/city`,
        headers: {
          key: process.env.RAJA_ONGKIR,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async cost(req, res, next) {
    try {
      // console.log("object");
      const { origin, destination, weight, courier } = req.body;
      const { data } = await axios({
        method: `POST`,
        url: `https://api.rajaongkir.com/starter/cost`,
        headers: {
          key: process.env.RAJA_ONGKIR,
        },
        data: {
          origin,
          destination,
          weight,
          courier,
        },
      });

      // let response = {
      //   originType: data.rajaongkir.origin_details.type,
      //   originName: data.rajaongkir.origin_details.city_name,
      //   destinationType: data.rajaongkir.destination_details.type,
      //   destinationName: data.rajaongkir.destination_details.city_name,
      //   courier: data.rajaongkir.results[0].name,
      //   services: data.rajaongkir.results[0].costs.map((cost) => {
      //     return cost;
      //   }),
      //   // price: data.rajaongkir.results[0].costs[0].cost[0].value,
      // };

      res.status(200).json(data.rajaongkir);
    } catch (error) {
      res.status(500).json(error);
      next(error);
    }
  }
}

module.exports = Controller;
