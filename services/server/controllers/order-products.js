const { OrderProduct, Product } = require("../models");

class Controller {
  static async postOrderProduct(req, res, next) {
    try {
      const { ProductId, OrderId, quantity, subTotal } = req.body;
      const newOrderProducts = await OrderProduct.create({
        ProductId,
        OrderId,
        quantity,
        subTotal,
      });

      res.status(201).json(newOrderProducts);
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
  static async editOrderproduct(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const orderProductsByProduct = await OrderProduct.findByPk(id);

      if (!orderProductsByProduct) {
        throw {
          name: "OrderProduct Not Found",
        };
      }

      const product = await Product.findByPk(orderProductsByProduct.ProductId);

      await OrderProduct.update(
        {
          quantity,
          subTotal: product.price * quantity,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json(`Order product has been updated`);
    } catch (err) {
      next;
    }
  }
  static async deleteOrderProduct(req, res, next) {
    try {
      const { id } = req.params;
      const orderProductsByProduct = await OrderProduct.findByPk(id);

      if (!orderProductsByProduct) {
        throw {
          name: "OrderProduct Not Found",
        };
      }

      await OrderProduct.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: `OrderProducts has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
