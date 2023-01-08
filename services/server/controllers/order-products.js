const { OrderProduct } = require("../models");

class Controller {
  static async postOrderProduct(req, res, next) {
    try {
      const { ProductId, quantity, price } = req.body;
      const { OrderId } = req.Order;
      const newOrderProduct = await OrderProduct.create({
        ProductId,
        OrderId,
        quantity,
        price,
        subTotal: price * quantity,
      });
      
      res.status(201).json(newOrderProduct);
    } catch (err) {
      next(err);
    }
  }
  static async getOrderProduct(req, res, next) {
    try {
      const orderProducts = await OrderProduct.findAll();

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
