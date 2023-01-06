const { Order, OrderProduct, sequelize } = require("../models");

class Controller {
  static async addOrders(req, res, next) {
    try {
      const { name, totalPrice, shippingCost, quantity, ProductId, price } =
        req.body;

      const result = await sequelize.transaction(async (t) => {
        const newOrder = await Order.create(
          {
            name,
            totalPrice,
            UserId: req.User.id,
            shippingCost,
            status: false,
          },
          { transaction: t }
        );

        await OrderProduct.bulkCreate(
          {
            ProductId,
            OrderId: newOrder.id,
            quantity,
            subTotal: price * quantity,
            price,
          },
          { transaction: t }
        );

        return newOrder;
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
  static async readAllOrders(req, res, next) {
    try {
      const orders = await Order.findAll();
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

      res.status(200).json({
        msg: "Order already paid",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
